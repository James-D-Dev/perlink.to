import { z } from 'zod'
import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'

const bodySchema = z.object({
  // remove: take the site down (closes all its open reports); restore: put it back up
  action: z.enum(['remove', 'dismiss', 'restore']),
})

// Act on a report
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const id = getRouterParam(event, 'id')
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Unknown action' })

  const db = getDB(event)
  const report = await db.prepare('SELECT bio_page_id, reason FROM reports WHERE id = ?').bind(id).first<{ bio_page_id: string; reason: string }>()
  if (!report) throw createError({ statusCode: 404, statusMessage: 'Report not found' })

  switch (body.data.action) {
    case 'remove':
      await db.batch([
        db.prepare(`UPDATE bio_pages SET is_published = 0, removed_at = datetime('now'), removed_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
          .bind(report.reason, report.bio_page_id),
        db.prepare(`UPDATE reports SET status = 'removed', resolved_at = datetime('now') WHERE bio_page_id = ? AND status = 'open'`)
          .bind(report.bio_page_id),
      ])
      break
    case 'dismiss':
      await db.prepare(`UPDATE reports SET status = 'dismissed', resolved_at = datetime('now') WHERE id = ?`).bind(id).run()
      break
    case 'restore':
      // Back to the owner: unremoved but still unpublished, they publish it again
      await db.prepare('UPDATE bio_pages SET removed_at = NULL, removed_reason = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .bind(report.bio_page_id)
        .run()
      break
  }
  return { success: true }
})
