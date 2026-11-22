import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'
import { addSupportMessage, cleanSupportBody, notifyUserOfReply } from '../../../utils/support'

// The admin answers; the user sees it in the dashboard chat (and on Telegram, if connected)
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const userId = getRouterParam(event, 'userId')!
  const body = cleanSupportBody((await readBody<{ body?: string }>(event))?.body)
  const exists = await getDB(event).prepare('SELECT 1 FROM profiles WHERE id = ?').bind(userId).first()
  if (!exists) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  const id = await addSupportMessage(event, userId, 'admin', body)
  await getDB(event).prepare("UPDATE support_messages SET read_at = datetime('now') WHERE user_id = ? AND sender = 'user' AND read_at IS NULL").bind(userId).run()
  await notifyUserOfReply(event, userId, body).catch(e => console.warn('[support] notify user failed', e))
  return { ok: true, id }
})
