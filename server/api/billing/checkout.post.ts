import { z } from 'zod'
import { getDB } from '../../utils/db'
import { billingAccount, newPaymentCode, transferDetails } from '../../utils/billing'
import { PAID_PLANS, PLAN_PRICES } from '#shared/plans'

const bodySchema = z.object({
  plan: z.enum(PAID_PLANS as [string, ...string[]]),
  period: z.enum(['monthly', 'annual']),
})

// Start buying a plan: a pending payment and the bank transfer that pays it.
// Asking again for the same plan reuses the open payment, so a scanned QR
// stays valid.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (!billingAccount(event)) throw createError({ statusCode: 503, statusMessage: 'Online payment is not available yet' })
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Choose a plan' })
  const { plan, period } = body.data
  const amount = PLAN_PRICES[plan as keyof typeof PLAN_PRICES][period]

  const db = getDB(event)
  let payment = await db
    .prepare(`SELECT id, code, amount FROM payments
      WHERE user_id = ? AND plan = ? AND period = ? AND amount = ? AND status = 'pending' AND created_at > datetime('now', '-2 days')
      ORDER BY created_at DESC LIMIT 1`)
    .bind(user.id, plan, period, amount)
    .first<{ id: string; code: string; amount: number }>()
  if (!payment) {
    payment = { id: crypto.randomUUID(), code: newPaymentCode(), amount }
    await db.prepare('INSERT INTO payments (id, user_id, plan, period, amount, code) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(payment.id, user.id, plan, period, amount, payment.code)
      .run()
  }
  return { id: payment.id, plan, period, status: 'pending', transfer: transferDetails(event, payment) }
})
