import { getDB } from '../../../utils/db'
import { requireSuperadmin } from '../../../utils/superadmin'
import { PAYMENT_SELECT, parseCheck, type PaymentRow } from '../../../utils/paymentReview'
import { describeCheck } from '../../../utils/cryptoPayments'
import { CRYPTO_NETWORK_BY_ID } from '#shared/crypto'

// Superadmin → Payments: waiting for review first, or everything
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const filter = getQuery(event).status === 'all' ? 'all' : 'submitted'
  const where = filter === 'all' ? '' : `WHERE p.status = 'submitted'`
  const { results } = await getDB(event)
    .prepare(`${PAYMENT_SELECT} ${where} ORDER BY COALESCE(p.submitted_at, p.created_at) DESC LIMIT 200`)
    .all<PaymentRow>()
  return {
    payments: (results ?? []).map((p) => {
      const check = parseCheck(p)
      return {
        id: p.id,
        email: p.email,
        plan: p.plan,
        period: p.period,
        method: p.method,
        amount: p.amount,
        amountUsd: p.amount_usd,
        code: p.code,
        status: p.status,
        network: p.network ? CRYPTO_NETWORK_BY_ID[p.network]?.name ?? p.network : null,
        token: p.token,
        txHash: p.tx_hash,
        check,
        checkText: p.method === 'crypto' ? describeCheck(check, p.amount_usd ?? 0) : null,
        createdAt: p.created_at,
        submittedAt: p.submitted_at,
        reviewedAt: p.reviewed_at,
        paidAt: p.paid_at,
      }
    }),
  }
})
