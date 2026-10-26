import { getDB } from '../../utils/db'
import { effectivePlan } from '#shared/plans'
import { toAppLanguage } from '#shared/language'

// The signed-in user's account summary for the settings page
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const db = getDB(event)
  const profile = await db
    .prepare('SELECT id, email, name, avatar, plan, plan_expires_at, created_at, language FROM profiles WHERE id = ?')
    .bind(user.id)
    .first<{ id: string; email: string | null; name: string | null; avatar: string | null; plan: string | null; plan_expires_at: string | null; created_at: string; language: string | null }>()
  if (!profile) throw createError({ statusCode: 404, statusMessage: 'Profile not found' })
  const sites = await db.prepare('SELECT COUNT(*) AS n FROM bio_pages WHERE user_id = ?').bind(user.id).first<{ n: number }>()
  return {
    success: true,
    account: {
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar,
      plan: effectivePlan(profile.plan, profile.plan_expires_at),
      createdAt: profile.created_at,
      language: toAppLanguage(profile.language),
      sites: sites?.n ?? 0,
    },
  }
})
