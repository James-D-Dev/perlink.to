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
    // Toggle ban status
    const stmt = db.prepare(`
      UPDATE profiles 
      SET status = CASE WHEN status = 'banned' THEN 'active' ELSE 'banned' END,
          updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `).bind(userId)
    
    const result = await stmt.run()
    
    if (!result.success) throw createError({ statusCode: 500, statusMessage: 'Failed to toggle ban' })
    
    return { success: true }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: `Failed to toggle ban: ${error.message}` })
  }
})
