import { getDB } from '../../../../utils/db'
import { requireSuperadmin } from '../../../../utils/superadmin'
import { cryptoWallet } from '../../../../utils/billing'
import { checkCryptoPayment } from '../../../../utils/cryptoPayments'
import { approvePayment, loadPayment, notifyPayer, parseCheck, rejectPayment } from '../../../../utils/paymentReview'

// Superadmin decides on a payment: approve (puts the plan on the account),
// reject, or read a crypto transaction from the chain again
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const id = getRouterParam(event, 'id')!
  const action = getRouterParam(event, 'action')

  if (action === 'approve') {
    const result = await approvePayment(event, id)
    if (!result.ok) throw createError({ statusCode: 409, statusMessage: result.reason === 'not-found' ? 'Payment not found' : 'Already approved' })
    await notifyPayer(event, result.payment, true, result.expiresAt)
    return { ok: true, expiresAt: result.expiresAt }
  }
  if (action === 'reject') {
    if (!(await rejectPayment(event, id))) throw createError({ statusCode: 409, statusMessage: 'This payment was already decided' })
    const payment = await loadPayment(event, id)
    if (payment) await notifyPayer(event, payment, false)
    return { ok: true }
  }
  if (action === 'recheck') {
    const payment = await loadPayment(event, id)
    const wallet = cryptoWallet(event)
    if (!payment?.tx_hash || !payment.network || !wallet) throw createError({ statusCode: 400, statusMessage: 'Nothing to check' })
    const check = await checkCryptoPayment(payment.network, payment.tx_hash, wallet, payment.amount_usd ?? 0)
    await getDB(event).prepare('UPDATE payments SET check_result = ? WHERE id = ?').bind(JSON.stringify(check), id).run()
    return { ok: true, check: parseCheck({ check_result: JSON.stringify(check) }) }
  }
  throw createError({ statusCode: 404, statusMessage: 'Unknown action' })
})
