import { getDB } from '../../../utils/db'
import { getAccountPlan } from '../../../utils/plan'

// Is the payment through yet? The checkout asks every few seconds
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const id = getRouterParam(event, 'id')
  const payment = await getDB(event)
    .prepare('SELECT status, plan FROM payments WHERE id = ? AND user_id = ?')
    .bind(id, user.id)
    .first<{ status: string; plan: string }>()
  if (!payment) throw createError({ statusCode: 404, statusMessage: 'Payment not found' })
  if (payment.status !== 'paid') return { status: payment.status }
  const account = await getAccountPlan(event, user.id)
  return { status: payment.status, plan: account.plan, expiresAt: account.expiresAt }
})
