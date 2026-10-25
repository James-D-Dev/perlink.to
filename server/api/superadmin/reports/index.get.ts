import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'

// Reports to review, newest first, with the site's current state
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const status = getQuery(event).status === 'all' ? null : 'open'
  const rows = await getDB(event)
    .prepare(`SELECT r.id, r.username, r.reason, r.details, r.reporter_email, r.status, r.created_at, r.resolved_at,
        b.id AS site_id, b.username AS current_username, b.title, b.is_published, b.removed_at, p.email AS owner_email,
        (SELECT COUNT(*) FROM reports x WHERE x.bio_page_id = r.bio_page_id) AS site_reports
      FROM reports r
      JOIN bio_pages b ON b.id = r.bio_page_id
      LEFT JOIN profiles p ON p.id = b.user_id
      ${status ? 'WHERE r.status = ?' : ''}
      ORDER BY r.created_at DESC LIMIT 200`)
    .bind(...(status ? [status] : []))
    .all<Record<string, any>>()
  return {
    reports: (rows.results ?? []).map(r => ({
      id: r.id,
      reason: r.reason,
      details: r.details,
      reporterEmail: r.reporter_email,
      status: r.status,
      createdAt: r.created_at,
      resolvedAt: r.resolved_at,
      siteReports: r.site_reports,
      site: {
        id: r.site_id,
        username: r.current_username,
        reportedAs: r.username,
        title: r.title,
        published: r.is_published === 1,
        removed: !!r.removed_at,
        ownerEmail: r.owner_email,
      },
    })),
  }
})
