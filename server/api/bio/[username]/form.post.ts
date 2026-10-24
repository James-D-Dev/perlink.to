import { z } from 'zod'
import { BioRepository } from '../../../repositories/bioRepository'
import { hashIP } from '../../../services/analytics'
import { getDB } from '../../../utils/db'
import { emailEnabled, runInBackground } from '../../../utils/email'
import { notifyOwnerOfRequest } from '../../../utils/formNotification'

// A visitor sends a site's form (booking or contact request)

const FIELDS = ['phone', 'email', 'date', 'time', 'guests', 'message'] as const

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
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid email' })
  }
  if (!data.phone && !data.email && !data.message) {
    throw createError({ statusCode: 422, statusMessage: 'Please leave a way to reach you' })
  }

  const db = getDB(event)
  const ip = getRequestHeader(event, 'cf-connecting-ip')
    || getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    || '0.0.0.0'
  const ipHash = await hashIP(ip, bioPage.id)

  // A few requests per visitor every few minutes is plenty
  const recent = await db
    .prepare(`SELECT COUNT(*) AS n FROM form_submissions WHERE bio_page_id = ? AND ip_hash = ? AND created_at > datetime('now', ?)`)
    .bind(bioPage.id, ipHash, `-${WINDOW_MINUTES} minutes`)
    .first<{ n: number }>()
  if ((recent?.n ?? 0) >= MAX_PER_WINDOW) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests, please try again later' })
  }

  await db
    .prepare('INSERT INTO form_submissions (id, bio_page_id, block_id, data, ip_hash) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), bioPage.id, blockId, JSON.stringify(data), ipHash)
    .run()

  // Email the owner after responding (skipped until Resend is configured)
  if (emailEnabled(event)) runInBackground(event, notifyOwnerOfRequest(event, bioPage, data))

  return { success: true }
})
