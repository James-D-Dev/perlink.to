import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'

// Conversations waiting for an answer (the Support item's badge)
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const row = await getDB(event)
    .prepare("SELECT COUNT(DISTINCT user_id) AS n FROM support_messages WHERE sender = 'user' AND read_at IS NULL")
    .first<{ n: number }>()
  return { unread: row?.n ?? 0 }
})
