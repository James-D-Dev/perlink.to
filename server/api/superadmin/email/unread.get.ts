import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'

// Unread mail to support@perlink.to, for the badge on Superadmin → Emails
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const row = await getDB(event)
    .prepare(`SELECT COUNT(*) AS n FROM mail_messages WHERE direction = 'in' AND read_at IS NULL`)
    .first<{ n: number }>()
    .catch(() => null)
  return { unread: row?.n ?? 0 }
})
