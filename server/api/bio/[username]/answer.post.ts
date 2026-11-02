import { z } from 'zod'
import { BioRepository } from '../../../repositories/bioRepository'
import { hashIP } from '../../../services/analytics'
import { getDB } from '../../../utils/db'
import { runInBackground } from '../../../utils/email'
import { notifyOwnerTelegram } from '../../../utils/telegram'

// A visitor said yes to a site's question ("Will you be my Valentine?"):
// it goes to the owner's inbox and Telegram

const bodySchema = z.object({
  blockId: z.string().min(1).max(40),
})

const MAX_PER_WINDOW = 3
const WINDOW_MINUTES = 10

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  const parsed = bodySchema.safeParse(await readBody(event))
  if (!username || !parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
  }
  const { blockId } = parsed.data

  const bioPage = await new BioRepository(event).findByUsername(username)
  if (!bioPage || !bioPage.isPublished) {
    throw createError({ statusCode: 404, statusMessage: 'Site not found' })
  }
  const block = (bioPage.blocks as any[]).find(b => b.id === blockId && b.name === 'question' && !b.hidden)
  if (!block) {
    throw createError({ statusCode: 404, statusMessage: 'Question not found' })
  }

  const db = getDB(event)
  const ip = getRequestHeader(event, 'cf-connecting-ip')
    || getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
    || '0.0.0.0'
  const ipHash = await hashIP(ip, bioPage.id)

  // The same visitor saying yes again in a few minutes isn't news
  const recent = await db
    .prepare(`SELECT COUNT(*) AS n FROM form_submissions WHERE bio_page_id = ? AND ip_hash = ? AND created_at > datetime('now', ?)`)
    .bind(bioPage.id, ipHash, `-${WINDOW_MINUTES} minutes`)
    .first<{ n: number }>()
  if ((recent?.n ?? 0) >= MAX_PER_WINDOW) {
    throw createError({ statusCode: 429, statusMessage: 'Too many requests, please try again later' })
  }

  const data: Record<string, string> = {
    kind: 'answer',
    name: '',
    question: String(block.data?.question ?? '').slice(0, 300),
    answer: 'yes',
  }
  await db
    .prepare('INSERT INTO form_submissions (id, bio_page_id, block_id, data, ip_hash) VALUES (?, ?, ?, ?, ?)')
    .bind(crypto.randomUUID(), bioPage.id, blockId, JSON.stringify(data), ipHash)
    .run()

  // Counted among visitor actions, like a form
  runInBackground(event, new BioRepository(event).incrementAction(bioPage.id, 'form'))
  runInBackground(event, notifyOwnerTelegram(event, bioPage, data))

  return { success: true }
})
