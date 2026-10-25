import type { H3Event } from 'h3'

export const SUPERADMIN_EMAIL = 'kimduc10a@gmail.com'

export function requireSuperadmin(event: H3Event) {
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

export function isSuperadmin(event: H3Event): boolean {
  const user = event.context.user
  return user?.email === SUPERADMIN_EMAIL
}
