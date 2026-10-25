import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'

// Every guestbook entry of the owner's site, hidden ones too
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const rows = await getDB(event)
    .prepare('SELECT id, name, message, gift, hidden, created_at FROM guestbook_entries WHERE bio_page_id = ? ORDER BY created_at DESC LIMIT 500')
    .bind(site.id)
    .all<{ id: string; name: string; message: string; gift: string; hidden: number; created_at: string }>()
  return {
    entries: (rows.results ?? []).map(r => ({ id: r.id, name: r.name, message: r.message, gift: r.gift, hidden: !!r.hidden, createdAt: r.created_at })),
  }
})
