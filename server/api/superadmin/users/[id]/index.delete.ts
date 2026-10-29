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
    const stmt = db.prepare(`DELETE FROM profiles WHERE id = ?`).bind(userId)
    const result = await stmt.run()
    
    if (!result.success) throw createError({ statusCode: 500, statusMessage: 'Failed to delete user' })
    await db.prepare('DELETE FROM auth_accounts WHERE user_id = ?').bind(userId).run()
    
    return { success: true }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: `Failed to delete user: ${error.message}` })
  }
})
