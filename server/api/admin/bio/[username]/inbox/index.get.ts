import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'

// Requests sent through the site's forms, newest first
export default defineEventHandler(async (event) => {
  const bioPage = await requireOwnedSite(event)
  type Row = { id: string; block_id: string | null; data: string; read_at: string | null; created_at: string; status?: string | null }
  const db = getDB(event)
  const rows = await db
    .prepare('SELECT id, block_id, data, read_at, created_at, status FROM form_submissions WHERE bio_page_id = ? ORDER BY created_at DESC LIMIT 200')
    .bind(bioPage.id)
    .all<Row>()
    // Before migration 0037: no status column
    .catch(() => db
      .prepare('SELECT id, block_id, data, read_at, created_at FROM form_submissions WHERE bio_page_id = ? ORDER BY created_at DESC LIMIT 200')
      .bind(bioPage.id)
      .all<Row>())

  const submissions = (rows.results ?? []).map((row) => {
    let data: Record<string, string> = {}
    try {
      data = JSON.parse(row.data)
    } catch {}
    // Orders have a status (older ones count as new)
    const status = data.kind === 'order' ? (row.status || 'new') : null
    return { id: row.id, blockId: row.block_id, data, read: !!row.read_at, createdAt: row.created_at, status }
  })
  return { success: true, submissions, unread: submissions.filter(s => !s.read).length }
})
