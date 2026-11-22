import { getDB } from '../../utils/db'
import { toSupportMessage, type SupportMessageRow } from '../../utils/support'

// The signed-in user's conversation with support. `read=1` (the chat is open)
// marks support's answers as read.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const db = getDB(event)
  if (getQuery(event).read === '1') {
    await db.prepare("UPDATE support_messages SET read_at = datetime('now') WHERE user_id = ? AND sender = 'admin' AND read_at IS NULL").bind(user.id).run()
  }
  const rows = await db
    .prepare('SELECT * FROM (SELECT id, user_id, sender, body, created_at, read_at FROM support_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 200) ORDER BY created_at ASC')
    .bind(user.id)
    .all<SupportMessageRow>()
  const messages = (rows.results ?? []).map(toSupportMessage)
  return { messages, unread: messages.filter(m => m.sender === 'admin' && !m.read).length }
})
