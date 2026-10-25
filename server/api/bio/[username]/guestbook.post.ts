import { z } from 'zod'
import { BioRepository } from '../../../repositories/bioRepository'
import { hashIP } from '../../../services/analytics'
import { getDB } from '../../../utils/db'
import { runInBackground } from '../../../utils/email'
import { notifyOwnerTelegram } from '../../../utils/telegram'
import { GUEST_GIFTS, GUESTBOOK_LIMITS, GUEST_GIFT_EMOJI } from '#shared/guestbook'

const bodySchema = z.object({
  name: z.string().trim().min(1).max(GUESTBOOK_LIMITS.name),
  message: z.string().trim().min(1).max(GUESTBOOK_LIMITS.message),
  gift: z.enum(GUEST_GIFTS),
  // Honeypot: hidden from people, bots fill it in
  website: z.string().optional(),
})

const MAX_PER_WINDOW = 3
const WINDOW_MINUTES = 10

// A visitor signs a site's guestbook and leaves a gift in its 3D room
export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  const parsed = bodySchema.safeParse(await readBody(event))
  if (!username || !parsed.success) throw createError({ statusCode: 400, statusMessage: 'Write your name and a message' })
  const { name, message, gift, website } = parsed.data

  const bioPage = await new BioRepository(event).findByUsername(username)
  if (!bioPage?.isPublished) throw createError({ statusCode: 404, statusMessage: 'Site not found' })
  if ((bioPage.themeConfig as { room?: { guestbook?: boolean } })?.room?.guestbook === false) {
    throw createError({ statusCode: 403, statusMessage: 'The guestbook is closed' })
  }
  const entry = { id: crypto.randomUUID(), name, message, gift, createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19) }
  // Bots get a convincing answer and nothing is saved
  if (website) return { entry }

  const db = getDB(event)
  const ip = getRequestHeader(event, 'cf-connecting-ip') || getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'
  const ipHash = await hashIP(ip, `guestbook:${bioPage.id}`)
  const recent = await db
    .prepare(`SELECT COUNT(*) AS n FROM guestbook_entries WHERE bio_page_id = ? AND ip_hash = ? AND created_at > datetime('now', ?)`)
    .bind(bioPage.id, ipHash, `-${WINDOW_MINUTES} minutes`)
    .first<{ n: number }>()
  if ((recent?.n ?? 0) >= MAX_PER_WINDOW) throw createError({ statusCode: 429, statusMessage: 'Too many messages, please try again later' })

  await db
    .prepare('INSERT INTO guestbook_entries (id, bio_page_id, name, message, gift, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(entry.id, bioPage.id, name, message, gift, ipHash, entry.createdAt)
    .run()

  runInBackground(event, new BioRepository(event).incrementAction(bioPage.id, 'guestbook'))
  runInBackground(event, notifyOwnerTelegram(event, bioPage, { kind: 'guestbook', name, message, gift: GUEST_GIFT_EMOJI[gift] }))
  return { entry }
})
