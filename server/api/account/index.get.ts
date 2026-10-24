import { getDB } from '../../utils/db'

// The signed-in user's account summary for the settings page
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const db = getDB(event)
  const profile = await db
    .prepare('SELECT id, email, name, avatar, plan, created_at FROM profiles WHERE id = ?')
    .bind(user.id)
    .first<{ id: string; email: string | null; name: string | null; avatar: string | null; plan: string | null; created_at: string }>()
  if (!profile) throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
  const sites = await db.prepare('SELECT COUNT(*) AS n FROM bio_pages WHERE user_id = ?').bind(user.id).first<{ n: number }>()
  return {
    success: true,
    account: {
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar,
      plan: profile.plan || 'free',
      createdAt: profile.created_at,
      sites: sites?.n ?? 0,
    },
  }
})
