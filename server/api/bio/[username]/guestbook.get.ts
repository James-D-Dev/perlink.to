import { BioRepository } from '../../../repositories/bioRepository'
import { getDB } from '../../../utils/db'
import { GUESTBOOK_LIMITS, type GuestbookEntry } from '#shared/guestbook'

// The newest visible guestbook entries of a published site, for its 3D room
export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  const bioPage = username ? await new BioRepository(event).findByUsername(username) : null
  if (!bioPage?.isPublished) throw createError({ statusCode: 404, statusMessage: 'Site not found' })
  if ((bioPage.themeConfig as { room?: { guestbook?: boolean } })?.room?.guestbook === false) return { enabled: false, entries: [] }

  const db = getDB(event)
  const [rows, count] = await Promise.all([
    db.prepare('SELECT id, name, message, gift, created_at FROM guestbook_entries WHERE bio_page_id = ? AND hidden = 0 ORDER BY created_at DESC LIMIT ?')
      .bind(bioPage.id, GUESTBOOK_LIMITS.shown)
      .all<{ id: string; name: string; message: string; gift: GuestbookEntry['gift']; created_at: string }>(),
    db.prepare('SELECT COUNT(*) AS n FROM guestbook_entries WHERE bio_page_id = ? AND hidden = 0').bind(bioPage.id).first<{ n: number }>(),
  ])
  setResponseHeader(event, 'Cache-Control', 'no-store')
  return {
    enabled: true,
    total: count?.n ?? 0,
    entries: (rows.results ?? []).map(r => ({ id: r.id, name: r.name, message: r.message, gift: r.gift, createdAt: r.created_at })),
  }
})
