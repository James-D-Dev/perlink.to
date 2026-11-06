import { z } from 'zod'
import { BioRepository } from '../../../repositories/bioRepository'
import { isBot } from '../../../services/analytics'
import { getDB } from '../../../utils/db'
import { MAX_GUESTS, cleanGuestName, guestKey, notifyGuestOpened } from '../../../utils/guests'

const bodySchema = z.object({
  name: z.string().min(1).max(200),
  /** They opened the letter's envelope, not just the page */
  letter: z.boolean().optional(),
})

// A guest opened their own invitation link (perlink.to/site?to=Name): count
// it on that guest, adding them if they aren't on the list yet, so the owner
// sees who has opened it. The owner looking at their own links doesn't count.
export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  const body = bodySchema.safeParse(await readBody(event).catch(() => null))
  if (!username || !body.success) throw createError({ statusCode: 400, statusMessage: 'Bad request' })
  if (isBot(getRequestHeader(event, 'user-agent') || '')) return { ok: true }
  const name = cleanGuestName(body.data.name)
  if (!name) return { ok: true }

  const site = await new BioRepository(event).findByUsername(username)
  if (!site || !site.isPublished) return { ok: true }
  if (event.context.user?.id === site.userId) return { ok: true }

  const db = getDB(event)
  const key = guestKey(name)
  const letter = !!body.data.letter
  const work = async () => {
    try {
      const existing = await db.prepare('SELECT id, first_open_at FROM site_guests WHERE bio_page_id = ? AND name_key = ?').bind(site.id, key)
        .first<{ id: string; first_open_at: string | null }>()
      if (existing) {
        // The letter opening is part of the same visit: it doesn't count again
        await db.prepare(`UPDATE site_guests SET
            opens = opens + ?, last_open_at = datetime('now'), first_open_at = COALESCE(first_open_at, datetime('now')),
            letter_opened_at = CASE WHEN ? THEN COALESCE(letter_opened_at, datetime('now')) ELSE letter_opened_at END
          WHERE id = ?`).bind(letter ? 0 : 1, letter ? 1 : 0, existing.id).run()
        if (!existing.first_open_at) await notifyGuestOpened(event, site, name)
        return
      }
      const count = await db.prepare('SELECT COUNT(*) AS n FROM site_guests WHERE bio_page_id = ?').bind(site.id).first<{ n: number }>()
      if ((count?.n ?? 0) >= MAX_GUESTS) return
      await db.prepare(`INSERT OR IGNORE INTO site_guests (id, bio_page_id, name, name_key, listed, opens, first_open_at, last_open_at, letter_opened_at)
        VALUES (?, ?, ?, ?, 0, 1, datetime('now'), datetime('now'), CASE WHEN ? THEN datetime('now') END)`)
        .bind(crypto.randomUUID(), site.id, name, key, letter ? 1 : 0).run()
      await notifyGuestOpened(event, site, name)
    } catch (error) {
      // A database without the guests table yet: nothing to count
      console.error('[guests] open not recorded', error)
    }
  }
  const waitUntil = event.context.cloudflare?.context?.waitUntil?.bind(event.context.cloudflare.context)
  if (waitUntil) waitUntil(work())
  else await work()
  return { ok: true }
})
