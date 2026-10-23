import { getDB } from "../../../utils/db"
import { requireSuperadmin } from "../../../utils/superadmin"

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const db = getDB(event)

  try {
    // Fetch all users with content counts
    const result = await db.prepare(`
      SELECT
        p.id,
        p.email,
        p.username,
        p.name,
        p.avatar,
        p.plan,
        p.status,
        p.created_at as createdAt,
        (SELECT COUNT(*) FROM bio_pages b WHERE b.user_id = p.id) as bioCount,
        (SELECT COUNT(*) FROM links l WHERE l.user_id = p.id) as linkCount,
        (SELECT COUNT(*) FROM qr_codes q WHERE q.user_id = p.id) as qrCount
      FROM profiles p
      ORDER BY p.created_at DESC
    `).all()

    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    const users = ((result.results || []) as any[]).map(u => ({
      id: u.id,
      email: u.email,
      username: u.username || null,
      name: u.name || u.username || null,
      avatar: u.avatar || null,
      plan: u.plan || 'free',
      status: u.status || 'active',
      createdAt: u.createdAt,
      bioCount: u.bioCount || 0,
      linkCount: u.linkCount || 0,
      qrCount: u.qrCount || 0,
    }))

    return {
      users,
      stats: {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        banned: users.filter(u => u.status === 'banned').length,
        paid: users.filter(u => u.plan !== 'free').length,
        newThisWeek: users.filter(u => u.createdAt && new Date(u.createdAt).getTime() >= weekAgo).length,
      },
    }
  } catch (error: any) {
    console.error('Failed to fetch users:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch users: ${error.message}`,
    })
  }
})
