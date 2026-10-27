import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'

// Superadmin → Emails: what was sent (newest first), optionally to one account
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const userId = getQuery(event).userId
  const rows = await getDB(event)
    .prepare(`SELECT id, to_email, user_id, subject, body, status, error, created_at FROM admin_emails
      ${typeof userId === 'string' ? 'WHERE user_id = ?' : ''} ORDER BY created_at DESC LIMIT 100`)
    .bind(...(typeof userId === 'string' ? [userId] : []))
    .all<{ id: string; to_email: string; user_id: string | null; subject: string; body: string; status: string; error: string | null; created_at: string }>()
  return {
    emails: (rows.results ?? []).map(r => ({ id: r.id, to: r.to_email, userId: r.user_id, subject: r.subject, body: r.body, status: r.status, error: r.error, createdAt: r.created_at })),
  }
})
