import { getDB } from '../../utils/db'

// How many answers from support the user hasn't read (the chat button's badge)
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) return { unread: 0, answers: 0 }
  const row = await getDB(event)
    .prepare("SELECT SUM(CASE WHEN read_at IS NULL THEN 1 ELSE 0 END) AS unread, COUNT(*) AS answers FROM support_messages WHERE user_id = ? AND sender = 'admin'")
    .bind(user.id)
    .first<{ unread: number | null; answers: number }>()
  // answers: all of support's messages, so the chat can chime when one arrives
  return { unread: row?.unread ?? 0, answers: row?.answers ?? 0 }
})
