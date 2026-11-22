import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'
import { toSupportMessage, type SupportMessageRow } from '../../../utils/support'

// One conversation; opening it marks the user's messages as read
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const userId = getRouterParam(event, 'userId')!
  const db = getDB(event)
  await db.prepare("UPDATE support_messages SET read_at = datetime('now') WHERE user_id = ? AND sender = 'user' AND read_at IS NULL").bind(userId).run()
  const [rows, profile] = await Promise.all([
    db.prepare('SELECT * FROM (SELECT id, user_id, sender, body, created_at, read_at FROM support_messages WHERE user_id = ? ORDER BY created_at DESC LIMIT 500) ORDER BY created_at ASC').bind(userId).all<SupportMessageRow>(),
    db.prepare('SELECT id, email, name, avatar, plan, language, created_at, telegram_chat_id FROM profiles WHERE id = ?').bind(userId).first<Record<string, any>>(),
  ])
  if (!profile) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  return {
    user: { id: profile.id, email: profile.email, name: profile.name, avatar: profile.avatar, plan: profile.plan, language: profile.language, createdAt: profile.created_at, telegram: !!profile.telegram_chat_id },
    messages: (rows.results ?? []).map(toSupportMessage),
  }
})
