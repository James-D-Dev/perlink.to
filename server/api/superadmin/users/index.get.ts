import { getDB } from "../../../utils/db"

const SUPERADMIN_EMAIL = 'kimduc10a@gmail.com'

function requireSuperadmin(event: any) {
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  
  if (user.email !== SUPERADMIN_EMAIL) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden - Superadmin access required',
    })
  }
  
  return user
}

export default defineEventHandler(async (event) => {
  // Verify superadmin access
  requireSuperadmin(event)
  
  const db = getDB(event)
  
  try {
    // Fetch all users from profiles table
    const stmt = db.prepare(`
      SELECT 
        id,
        email,
        username,
        name,
        avatar,
        plan,
        status,
        created_at as createdAt,
        updated_at as updatedAt
      FROM profiles
      ORDER BY created_at DESC
    `)
    
    const result = await stmt.all()
    const users = result.results || []
    
    // Calculate stats
    const total = users.length
    const active = users.filter((u: any) => u.status === 'active').length
    const pending = users.filter((u: any) => u.status === 'pending').length
    const banned = users.filter((u: any) => u.status === 'banned').length
    
    // Format users for frontend
    const formattedUsers = users.map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name || u.username || null,
      avatar: u.avatar || null,
      plan: u.plan || 'free',
      status: u.status || 'active',
      createdAt: u.createdAt,
    }))
    
    return {
      users: formattedUsers,
      stats: {
        total,
        active,
        pending,
        banned,
      },
      pagination: {
        start: 1,
        end: total,
        total,
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
