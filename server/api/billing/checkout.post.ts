import { z } from 'zod'
import { getDB } from '../../utils/db'
import { cryptoWallet, newPaymentCode, paymentMethods, transferDetails } from '../../utils/billing'
import { PAID_PLANS, PLAN_PRICES, PLAN_PRICES_USD, onSale, type PaidPlanId } from '#shared/plans'
import { CRYPTO_NETWORKS } from '#shared/crypto'

const bodySchema = z.object({
  plan: z.enum(PAID_PLANS as [string, ...string[]]),
  period: z.enum(['monthly', 'annual']),
  method: z.enum(['bank', 'crypto']).default('bank'),
})

// Start buying a plan: a pending payment and how to pay it, by bank transfer
// (VietQR, in VND) or in USDT / USDC to the crypto wallet (in USD). Asking
// again for the same plan and way of paying reuses the open payment, so a
// scanned QR stays valid.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Choose a plan' })
  const { plan, period, method } = body.data
  if (!onSale(plan as PaidPlanId)) throw createError({ statusCode: 403, statusMessage: 'This plan is coming soon' })
  if (!paymentMethods(event)[method]) throw createError({ statusCode: 503, statusMessage: 'This way of paying is not available yet' })
  const amount = PLAN_PRICES[plan as PaidPlanId][period]
  const amountUsd = PLAN_PRICES_USD[plan as PaidPlanId][period]

  const db = getDB(event)
  let payment = await db
    .prepare(`SELECT id, code, amount, status FROM payments
      WHERE user_id = ? AND plan = ? AND period = ? AND amount = ? AND method = ? AND status IN ('pending', 'submitted') AND created_at > datetime('now', '-2 days')
      ORDER BY created_at DESC LIMIT 1`)
    .bind(user.id, plan, period, amount, method)
    .first<{ id: string; code: string; amount: number; status: string }>()
  if (!payment) {
    payment = { id: crypto.randomUUID(), code: newPaymentCode(), amount, status: 'pending' }
    await db.prepare('INSERT INTO payments (id, user_id, plan, period, amount, code, method, amount_usd) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(payment.id, user.id, plan, period, amount, payment.code, method, amountUsd)
      .run()
  }
  const crypto_ = method === 'crypto'
    ? {
        address: cryptoWallet(event)!,
        amountUsd,
        networks: CRYPTO_NETWORKS.map(n => ({ id: n.id, name: n.name, tokens: Object.keys(n.tokens) })),
      }
    : null
  return {
    id: payment.id,
    plan,
    period,
    method,
    status: payment.status,
    code: payment.code,
    transfer: method === 'bank' ? transferDetails(event, payment) : null,
    crypto: crypto_,
  }
})
