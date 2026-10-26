import { z } from 'zod'
import { getDB } from '../../../../utils/db'
import { cryptoWallet } from '../../../../utils/billing'
import { checkCryptoPayment } from '../../../../utils/cryptoPayments'
import { loadPayment, notifyPaymentSubmitted, parseCheck } from '../../../../utils/paymentReview'
import { CRYPTO_NETWORK_BY_ID, isTxHash } from '#shared/crypto'

const bodySchema = z.object({
  network: z.string().optional(),
  token: z.enum(['USDT', 'USDC']).optional(),
  txHash: z.string().trim().optional(),
})

// "I've paid": the payment waits for review and the superadmin is told on
// Telegram. A crypto payment gives its transaction, which is read back from
// the chain for the reviewer.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const id = getRouterParam(event, 'id')!
  const payment = await loadPayment(event, id)
  if (!payment || payment.user_id !== user.id) throw createError({ statusCode: 404, statusMessage: 'Payment not found' })
  if (payment.status === 'paid') return { status: 'paid' }
  if (payment.status === 'expired') throw createError({ statusCode: 409, statusMessage: 'This payment has expired. Start again.' })
  const body = bodySchema.safeParse(await readBody(event).catch(() => ({})))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Check the details' })
  const db = getDB(event)

  if (payment.method === 'crypto') {
    const { network, token, txHash } = body.data
    const wallet = cryptoWallet(event)
    if (!wallet) throw createError({ statusCode: 503, statusMessage: 'Crypto payments are not available' })
    if (!network || !CRYPTO_NETWORK_BY_ID[network]) throw createError({ statusCode: 400, statusMessage: 'Choose the network you sent on' })
    if (!token || !CRYPTO_NETWORK_BY_ID[network]!.tokens[token]) throw createError({ statusCode: 400, statusMessage: 'Choose the token you sent' })
    const hash = (txHash ?? '').toLowerCase()
    if (!isTxHash(hash)) throw createError({ statusCode: 400, statusMessage: 'Paste the transaction hash (0x… 66 characters)' })
    const used = await db.prepare('SELECT id FROM payments WHERE tx_hash = ? AND id != ?').bind(hash, id).first()
    if (used) throw createError({ statusCode: 409, statusMessage: 'This transaction was already used for another payment' })
    if (payment.status === 'submitted' && payment.tx_hash === hash) return { status: 'submitted', check: parseCheck(payment) }

    const check = await checkCryptoPayment(network, hash, wallet, payment.amount_usd ?? 0)
    await db
      .prepare(`UPDATE payments SET status = 'submitted', network = ?, token = ?, tx_hash = ?, check_result = ?, submitted_at = datetime('now') WHERE id = ?`)
      .bind(network, token, hash, JSON.stringify(check), id)
      .run()
  } else {
    if (payment.status === 'submitted') return { status: 'submitted' }
    await db.prepare(`UPDATE payments SET status = 'submitted', submitted_at = datetime('now') WHERE id = ?`).bind(id).run()
  }

  const updated = (await loadPayment(event, id))!
  await notifyPaymentSubmitted(event, updated)
  return { status: 'submitted', check: parseCheck(updated) }
})
