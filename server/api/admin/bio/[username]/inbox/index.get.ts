import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/inbox'

// Requests sent through the site's forms, newest first
export default defineEventHandler(async (event) => {
  const bioPage = await requireOwnedSite(event)
  const rows = await getDB(event)
    .prepare('SELECT id, block_id, data, read_at, created_at FROM form_submissions WHERE bio_page_id = ? ORDER BY created_at DESC LIMIT 200')
    .bind(bioPage.id)
    .all<{ id: string; block_id: string | null; data: string; read_at: string | null; created_at: string }>()

  const submissions = (rows.results ?? []).map((row) => {
    let data: Record<string, string> = {}
    try {
      data = JSON.parse(row.data)
    } catch {}
    return { id: row.id, blockId: row.block_id, data, read: !!row.read_at, createdAt: row.created_at }
  })
  return { success: true, submissions, unread: submissions.filter(s => !s.read).length }
})
