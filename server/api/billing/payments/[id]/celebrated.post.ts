import { getDB } from '../../../../utils/db'

// The payer has seen the "you're upgraded" screen for this payment
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  await getDB(event)
    .prepare(`UPDATE payments SET celebrated_at = datetime('now') WHERE id = ? AND user_id = ? AND celebrated_at IS NULL`)
    .bind(getRouterParam(event, 'id'), user.id)
    .run()
  return { ok: true }
})
