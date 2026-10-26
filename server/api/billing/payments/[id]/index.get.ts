import { getDB } from '../../../../utils/db'
import { getAccountPlan } from '../../../../utils/plan'
import { cryptoWallet } from '../../../../utils/billing'
import { checkCryptoPayment } from '../../../../utils/cryptoPayments'
import { loadPayment, notifyPaymentSubmitted, parseCheck } from '../../../../utils/paymentReview'

// Is the payment through yet? The checkout asks every few seconds and on
// "Refresh". A crypto payment waiting for review is read from the chain again
// (at most every 20 s); once it shows as paid in full, the reviewer is told.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const id = getRouterParam(event, 'id')!
  const payment = await loadPayment(event, id)
  if (!payment || payment.user_id !== user.id) throw createError({ statusCode: 404, statusMessage: 'Payment not found' })

  if (payment.status === 'paid') {
    const account = await getAccountPlan(event, user.id)
    return { status: 'paid', plan: account.plan, expiresAt: account.expiresAt }
  }

  let check = parseCheck(payment)
  const wallet = cryptoWallet(event)
  const stale = !check || Date.now() - Date.parse(check.checkedAt) > 20_000
  if (payment.status === 'submitted' && payment.method === 'crypto' && payment.network && payment.tx_hash && wallet && stale && check?.verdict !== 'ok') {
    const next = await checkCryptoPayment(payment.network, payment.tx_hash, wallet, payment.amount_usd ?? 0)
    await getDB(event).prepare('UPDATE payments SET check_result = ? WHERE id = ?').bind(JSON.stringify(next), id).run()
    if (next.verdict === 'ok') await notifyPaymentSubmitted(event, (await loadPayment(event, id))!)
    check = next
  }
  return { status: payment.status, check }
})
