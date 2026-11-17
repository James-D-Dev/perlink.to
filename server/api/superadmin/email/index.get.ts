import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'

// Superadmin → Emails: Inbox (mail to support@perlink.to) or Sent (all that
// Perlink sends), newest first; a search over address and subject, and
// optionally one account's mail
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const query = getQuery(event)
  const box = query.box === 'out' ? 'out' : 'in'
  const search = typeof query.q === 'string' ? query.q.trim().slice(0, 100) : ''
  const userId = typeof query.userId === 'string' ? query.userId : ''
  const page = Math.max(1, Number(query.page) || 1)
  const perPage = 50

  const where = ['direction = ?']
  const params: unknown[] = [box]
  if (search) {
    where.push('(from_email LIKE ? OR from_name LIKE ? OR to_email LIKE ? OR subject LIKE ?)')
    const like = `%${search.replace(/[%_]/g, '')}%`
    params.push(like, like, like, like)
  }
  if (userId) {
    where.push('user_id = ?')
    params.push(userId)
  }
  const db = getDB(event)
  const [rows, unread] = await Promise.all([
    db.prepare(`SELECT id, direction, kind, from_email, from_name, to_email, subject, substr(coalesce(text, ''), 1, 200) AS snippet,
        user_id, status, error, attachments IS NOT NULL AS has_attachments, read_at, created_at
      FROM mail_messages WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .bind(...params, perPage + 1, (page - 1) * perPage)
      .all<Record<string, any>>(),
    db.prepare(`SELECT COUNT(*) AS n FROM mail_messages WHERE direction = 'in' AND read_at IS NULL`).first<{ n: number }>(),
  ])
  const results = rows.results ?? []
  return {
    unread: unread?.n ?? 0,
    hasMore: results.length > perPage,
    emails: results.slice(0, perPage).map(r => ({
      id: r.id,
      direction: r.direction,
      kind: r.kind,
      from: r.from_email,
      fromName: r.from_name,
      to: r.to_email,
      subject: r.subject,
      snippet: String(r.snippet || '').replace(/\s+/g, ' ').trim(),
      userId: r.user_id,
      status: r.status,
      error: r.error,
      hasAttachments: !!r.has_attachments,
      read: !!r.read_at,
      createdAt: r.created_at,
    })),
  }
})
