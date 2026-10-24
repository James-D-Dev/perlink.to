import type { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  // Static assets don't need the session
  if (event.path.startsWith('/_nuxt/') || event.path.startsWith('/models/') || event.path.startsWith('/music/')) return
  // Validates the session (and renews it once a day) via server/utils/authSession
  event.context.user = await validateUserSession(event)
})
