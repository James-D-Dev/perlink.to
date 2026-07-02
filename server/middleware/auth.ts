import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  // Get user session using nuxt-auth-utils
  const session = await getUserSession(event)
  
  // Set user in context for backward compatibility
  if (session.user) {
    event.context.user = session.user
  } else {
    event.context.user = null

  }
})
