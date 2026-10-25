import { getDB } from '../../utils/db'
import { grantPlan } from '../../utils/plan'
import { PAYMENT_CODE_RE } from '../../utils/billing'
import type { BillingPeriod, PaidPlanId } from '#shared/plans'

interface SepayTransaction {
  id: number
  transferType: 'in' | 'out'
  transferAmount: number
  content?: string | null
  code?: string | null
  description?: string | null
}

// SePay calls this for every transfer into the billing account. A transfer
// whose note has a pending payment's code and at least its amount pays it and
// puts the plan on the account. Anything else is acknowledged and ignored, so
// SePay doesn't keep resending it.
export default defineEventHandler(async (event) => {
  const key = useRuntimeConfig(event).billing?.sepayApiKey
  if (!key) throw createError({ statusCode: 503, statusMessage: 'Billing is not set up' })
  if (getRequestHeader(event, 'authorization') !== `Apikey ${key}`) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const tx = await readBody<SepayTransaction>(event)
  if (!tx?.id || tx.transferType !== 'in') return { success: true }

  // Banks may change case or drop spaces, so look for the code anywhere
  const text = `${tx.code ?? ''} ${tx.content ?? ''} ${tx.description ?? ''}`.toUpperCase().replace(/\s+/g, ' ')
  const codes = [...new Set(text.match(PAYMENT_CODE_RE) ?? [])]
  if (!codes.length) return { success: true }

  const db = getDB(event)
  for (const code of codes) {
    const payment = await db
      .prepare('SELECT id, user_id, plan, period, amount, status FROM payments WHERE code = ?')
      .bind(code)
      .first<{ id: string; user_id: string; plan: PaidPlanId; period: BillingPeriod; amount: number; status: string }>()
    if (!payment) continue
    if (payment.status === 'paid') return { success: true }
    if (Number(tx.transferAmount) < payment.amount) {
      console.warn(`[billing] ${code}: received ${tx.transferAmount}, expected ${payment.amount}`)
      return { success: true }
    }
    // Only the first delivery of this transaction gets through
    const marked = await db
      .prepare(`UPDATE payments SET status = 'paid', paid_at = datetime('now'), provider_ref = ? WHERE id = ? AND status = 'pending'`)
      .bind(`sepay:${tx.id}`, payment.id)
      .run()
      .catch(() => null)
    if (!(marked?.meta as { changes?: number } | undefined)?.changes) return { success: true }
    await grantPlan(event, payment.user_id, payment.plan, { period: payment.period })
    return { success: true }
  }
  return { success: true }
})
