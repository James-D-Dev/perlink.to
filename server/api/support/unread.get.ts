import { getDB } from '../../utils/db'

// How many answers from support the user hasn't read (the chat button's badge)
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) return { unread: 0 }
  const row = await getDB(event)
    .prepare("SELECT COUNT(*) AS n FROM support_messages WHERE user_id = ? AND sender = 'admin' AND read_at IS NULL")
    .bind(user.id)
    .first<{ n: number }>()
  return { unread: row?.n ?? 0 }
})
