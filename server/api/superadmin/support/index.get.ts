import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'

// Conversations with support, most recent first, with unread counts
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const rows = await getDB(event)
    .prepare(`SELECT s.user_id, p.email, p.name, p.avatar,
        MAX(s.created_at) AS last_at,
        SUM(CASE WHEN s.sender = 'user' AND s.read_at IS NULL THEN 1 ELSE 0 END) AS unread,
        COUNT(*) AS total,
        (SELECT body FROM support_messages x WHERE x.user_id = s.user_id ORDER BY x.created_at DESC LIMIT 1) AS last_body,
        (SELECT sender FROM support_messages x WHERE x.user_id = s.user_id ORDER BY x.created_at DESC LIMIT 1) AS last_sender
      FROM support_messages s
      LEFT JOIN profiles p ON p.id = s.user_id
      GROUP BY s.user_id
      ORDER BY last_at DESC
      LIMIT 300`)
    .all<Record<string, any>>()
  const threads = (rows.results ?? []).map(r => ({
    userId: r.user_id,
    email: r.email,
    name: r.name,
    avatar: r.avatar,
    lastAt: r.last_at,
    lastBody: r.last_body,
    lastSender: r.last_sender,
    unread: r.unread ?? 0,
    total: r.total ?? 0,
  }))
  return { threads, unread: threads.reduce((sum, t) => sum + (t.unread ? 1 : 0), 0) }
})
