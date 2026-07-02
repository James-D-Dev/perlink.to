import { getDB } from "../../../../utils/db"

const SUPERADMIN_EMAIL = 'kimduc10a@gmail.com'

function requireSuperadmin(event: any) {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (user.email !== SUPERADMIN_EMAIL) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  return user
}

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  
  const userId = getRouterParam(event, 'id')
  if (!userId) throw createError({ statusCode: 400, statusMessage: 'User ID required' })
  
  const db = getDB(event)
  
  try {
    // Fetch user
    const userStmt = db.prepare(`
      SELECT id, email, username, name, avatar, plan, status, created_at as createdAt
      FROM profiles WHERE id = ?
    `).bind(userId)
    const user = await userStmt.first()
    
    if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })
    
    // Fetch stats
    const linksStmt = db.prepare(`SELECT COUNT(*) as count FROM links WHERE user_id = ?`).bind(userId)
    const linksResult = await linksStmt.first()
    
    const qrStmt = db.prepare(`SELECT COUNT(*) as count FROM qr_codes WHERE user_id = ?`).bind(userId)
    const qrResult = await qrStmt.first()
    
    const clicksStmt = db.prepare(`
      SELECT SUM(click_count) as total FROM links WHERE user_id = ?
    `).bind(userId)
    const clicksResult = await clicksStmt.first()
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name || user.username || null,
        avatar: user.avatar || null,
        plan: user.plan || 'free',
        status: user.status || 'active',
        createdAt: user.createdAt,
      },
      stats: {
        linksCount: linksResult?.count || 0,
        qrCount: qrResult?.count || 0,
        clicksCount: clicksResult?.total || 0,
      }
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch user: ${error.message}` })
  }
})
