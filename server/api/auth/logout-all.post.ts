// Sign out on every device: bumps the account's session version, which ends
// all other sessions at their next check (within a day), and clears this one now
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  await revokeUserSessions(event, user.id)
  await clearUserSession(event)
  return { success: true }
})
