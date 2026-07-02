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
  
  const body = await readBody(event)
  const { plan } = body
  
  if (!plan || !['free', 'pro', 'enterprise'].includes(plan)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid plan' })
  }
  
  const db = getDB(event)
  
  try {
    const stmt = db.prepare(`
      UPDATE profiles SET plan = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).bind(plan, userId)
    
    const result = await stmt.run()
    
    if (!result.success) throw createError({ statusCode: 500, statusMessage: 'Failed to update plan' })
    
    return { success: true, plan }
  } catch (error: any) {
    throw createError({ statusCode: 500, statusMessage: `Failed to update plan: ${error.message}` })
  }
})
