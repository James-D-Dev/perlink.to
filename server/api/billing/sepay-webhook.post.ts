import { getDB } from '../../utils/db'
import { PAYMENT_CODE_RE } from '../../utils/billing'
import { approvePayment, notifyPayer } from '../../utils/paymentReview'

interface SepayTransaction {
  id: number
  transferType: 'in' | 'out'
  transferAmount: number
  content?: string | null
  code?: string | null
  description?: string | null
}

// SePay calls this for every transfer into the billing account. A transfer
// whose note has an unpaid payment's code (waiting, sent for review, or even
// rejected) and at least its amount approves it, like the superadmin would:
// the plan goes on the account and the payer hears about it. Anything else is acknowledged and ignored, so
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
      .prepare('SELECT id, amount, status FROM payments WHERE code = ?')
      .bind(code)
      .first<{ id: string; amount: number; status: string }>()
    if (!payment) continue
    if (payment.status === 'paid') return { success: true }
    if (Number(tx.transferAmount) < payment.amount) {
      console.warn(`[billing] ${code}: received ${tx.transferAmount}, expected ${payment.amount}`)
      return { success: true }
    }
    // Only the first delivery of this transaction gets through
    const result = await approvePayment(event, payment.id, `sepay:${tx.id}`).catch(() => null)
    if (result?.ok) await notifyPayer(event, result.payment, true, result.expiresAt).catch(() => {})
    return { success: true }
  }
  return { success: true }
})
