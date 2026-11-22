import { getDB } from '../../utils/db'
import { addSupportMessage, cleanSupportBody, notifyAdminOfSupport } from '../../utils/support'

// The user writes to support; the admin hears about it on Telegram
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const body = cleanSupportBody((await readBody<{ body?: string }>(event))?.body)
  const db = getDB(event)
  // At most 30 messages an hour
  const recent = await db
    .prepare("SELECT COUNT(*) AS n FROM support_messages WHERE user_id = ? AND sender = 'user' AND created_at > datetime('now', '-1 hour')")
    .bind(user.id)
    .first<{ n: number }>()
  if ((recent?.n ?? 0) >= 30) throw createError({ statusCode: 429, statusMessage: 'Too many messages' })

  const id = await addSupportMessage(event, user.id, 'user', body)
  const profile = await db.prepare('SELECT name, email FROM profiles WHERE id = ?').bind(user.id).first<{ name: string | null; email: string | null }>()
  await notifyAdminOfSupport(event, id, { id: user.id, name: profile?.name, email: profile?.email ?? user.email }, body).catch(e => console.warn('[support] notify failed', e))
  return { ok: true, id }
})
