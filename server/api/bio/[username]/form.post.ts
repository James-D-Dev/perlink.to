import { z } from 'zod'
import { BioRepository } from '../../../repositories/bioRepository'
import { hashIP } from '../../../services/analytics'
import { getDB } from '../../../utils/db'
import { emailEnabled, runInBackground } from '../../../utils/email'
import { notifyOwnerOfRequest } from '../../../utils/formNotification'
import { notifyOwnerTelegram } from '../../../utils/telegram'

// A visitor sends a site's form (a booking, a room for some nights, a
// contact request, a reply to an invitation, or an email for the newsletter)

const FIELDS = ['phone', 'email', 'date', 'time', 'guests', 'message'] as const
const DATE = /^\d{4}-\d{2}-\d{2}$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** The names a visitor can pick as a service: the page's price lists and products */
function serviceNames(blocks: any[]) {
  const names = new Set<string>()
  for (const block of blocks) {
    if (block.hidden) continue
    if (block.name === 'menu') {
      for (const section of block.data?.sections ?? []) for (const item of section.items ?? []) if (item.name?.trim()) names.add(item.name.trim().toLowerCase())
    } else if (block.name === 'products') {
      for (const item of block.data?.items ?? []) if (item.name?.trim()) names.add(item.name.trim().toLowerCase())
    }
  }
  return names
}

const bodySchema = z.object({
  blockId: z.string().min(1).max(40),
  values: z.record(z.string(), z.string().max(2000)),
  // Honeypot: hidden from people, bots fill it in
  website: z.string().optional(),
})

const MAX_PER_WINDOW = 5
const WINDOW_MINUTES = 10

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  const parsed = bodySchema.safeParse(await readBody(event))
  if (!username || !parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
  }
  const { blockId, values, website } = parsed.data

  // Pretend success for bots so they don't retry
  if (website) return { success: true }

  const bioPage = await new BioRepository(event).findByUsername(username)
  if (!bioPage || !bioPage.isPublished) {
    throw createError({ statusCode: 404, statusMessage: 'Site not found' })
  }
  const block = (bioPage.blocks as any[]).find(b => b.id === blockId && b.name === 'form' && !b.hidden)
  if (!block) {
    throw createError({ statusCode: 404, statusMessage: 'Form not found' })
  }

  const db = getDB(event)
  const ip = getRequestHeader(event, 'cf-connecting-ip')
    || getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    || '0.0.0.0'
  const ipHash = await hashIP(ip, bioPage.id)

  // A few requests per visitor every few minutes is plenty
  async function checkRate() {
    const recent = await db
      .prepare(`SELECT COUNT(*) AS n FROM form_submissions WHERE bio_page_id = ? AND ip_hash = ? AND created_at > datetime('now', ?)`)
      .bind(bioPage!.id, ipHash, `-${WINDOW_MINUTES} minutes`)
      .first<{ n: number }>()
    if ((recent?.n ?? 0) >= MAX_PER_WINDOW) {
      throw createError({ statusCode: 429, statusMessage: 'Too many requests, please try again later' })
    }
  }

  // A newsletter sign-up: just a valid email, once per address
  if (block.data?.kind === 'subscribe') {
    const email = values.email?.trim().toLowerCase().slice(0, 120)
    if (!email || !EMAIL.test(email)) {
      throw createError({ statusCode: 422, statusMessage: 'Invalid email' })
    }
    await checkRate()
    const already = await db
      .prepare(`SELECT 1 AS found FROM form_submissions WHERE bio_page_id = ? AND json_extract(data, '$.kind') = 'subscribe' AND json_extract(data, '$.email') = ? LIMIT 1`)
      .bind(bioPage.id, email)
      .first<{ found: number }>()
    if (already) return { success: true }
    const data = { kind: 'subscribe', name: '', email }
    await db
      .prepare('INSERT INTO form_submissions (id, bio_page_id, block_id, data, ip_hash) VALUES (?, ?, ?, ?, ?)')
      .bind(crypto.randomUUID(), bioPage.id, blockId, JSON.stringify(data), ipHash)
      .run()
    runInBackground(event, new BioRepository(event).incrementAction(bioPage.id, 'form'))
    // A one-line Telegram note; no email per subscriber, that would be noise
    runInBackground(event, notifyOwnerTelegram(event, bioPage, data))
    return { success: true }
  }

  // Keep only the fields this form asks for
  const enabled = block.data?.fields ?? {}
  const data: Record<string, string> = {}
  const name = values.name?.trim().slice(0, 120)
  if (!name) throw createError({ statusCode: 422, statusMessage: 'Name is required' })
  data.name = name
  for (const field of FIELDS) {
    const value = values[field]?.trim()
    if (enabled[field] && value) data[field] = value.slice(0, field === 'message' ? 2000 : 200)
  }
  if (data.email && !EMAIL.test(data.email)) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid email' })
  }
  if (data.date && !DATE.test(data.date)) delete data.date

  // A service from the page's own price list (anything, briefly, without one)
  const service = values.service?.trim()
  if (enabled.service && service) {
    const known = serviceNames(bioPage.blocks as any[])
    if (known.size && !known.has(service.toLowerCase())) {
      throw createError({ statusCode: 422, statusMessage: 'Please pick a service from the list' })
    }
    data.service = service.slice(0, 120)
  }

  // A stay: check-out after check-in
  const checkout = values.checkout?.trim()
  if (enabled.checkout && checkout && data.date) {
    if (!DATE.test(checkout) || checkout <= data.date) {
      throw createError({ statusCode: 422, statusMessage: 'Check-out must be after check-in' })
    }
    data.checkout = checkout
  }
  if (block.data?.kind === 'rsvp') {
    // A reply to an invitation: coming or not is all it needs
    const attending = values.attending
    if (attending !== 'yes' && attending !== 'no') {
      throw createError({ statusCode: 422, statusMessage: 'Please say whether you are coming' })
    }
    data.kind = 'rsvp'
    data.attending = attending
    if (attending === 'no') delete data.guests
  } else {
    if (!data.phone && !data.email && !data.message) {
      throw createError({ statusCode: 422, statusMessage: 'Please leave a way to reach you' })
    }
    // booking, stay or contact, for the inbox
    data.kind = ['booking', 'stay', 'contact'].includes(block.data?.kind) ? block.data.kind : 'booking'
  }

  await checkRate()

  await db
    .prepare('INSERT INTO form_submissions (id, bio_page_id, block_id, data, ip_hash) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), bioPage.id, blockId, JSON.stringify(data), ipHash)
    .run()

  // Count it among visitor actions in analytics
  runInBackground(event, new BioRepository(event).incrementAction(bioPage.id, 'form'))

  // Email the owner after responding (skipped until email sending is set up)
  if (emailEnabled(event)) runInBackground(event, notifyOwnerOfRequest(event, bioPage, data))
  runInBackground(event, notifyOwnerTelegram(event, bioPage, data))

  return { success: true }
})
