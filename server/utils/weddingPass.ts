import type { H3Event } from 'h3'
import { getDB } from './db'
import { getAccountPlan, grantPlan } from './plan'
import { creemCatalog, creemEnabled } from './creem'
import { PLAN_ORDER, WEDDING_PASS, type Product } from '#shared/plans'

// The Wedding pass (shared/plans WEDDING_PASS): paid once, a year of Starter
// and the Wedding room pack, which stays after the year is up.

/** Someone on a bigger plan already has all of it but the pack */
export async function weddingPassBlocked(event: H3Event, userId: string) {
  const { plan } = await getAccountPlan(event, userId)
  return PLAN_ORDER.indexOf(plan) > PLAN_ORDER.indexOf(WEDDING_PASS.plan)
}

/** Turns the pass on: the year of Starter (added to a running Starter) and the pack. ref ties the pack to the payment */
export async function grantWeddingPass(event: H3Event, userId: string, ref: string) {
  const expiresAt = await grantPlan(event, userId, WEDDING_PASS.plan, { period: WEDDING_PASS.period })
  await getDB(event)
    .prepare(`INSERT INTO room_packs (user_id, pack_id, source, order_ref) VALUES (?, ?, 'wedding-pass', ?)
      ON CONFLICT(user_id, pack_id) DO NOTHING`)
    .bind(userId, WEDDING_PASS.pack, ref)
    .run()
  return expiresAt
}

/** A refunded pass: the pack goes, and Starter ends if it came from the pass */
export async function revokeWeddingPass(event: H3Event, userId: string, ref: string) {
  const db = getDB(event)
  await db.prepare('DELETE FROM room_packs WHERE user_id = ? AND order_ref = ?').bind(userId, ref).run()
  await db.prepare(`UPDATE profiles SET plan_expires_at = datetime('now'), updated_at = CURRENT_TIMESTAMP WHERE id = ? AND plan = ?`)
    .bind(userId, WEDDING_PASS.plan).run()
}

/** Whether the pass can be bought by card right now (the "wedding-pass" product on Creem) */
export async function weddingPassByCard(event: H3Event) {
  if (!creemEnabled(event)) return false
  return !!(await creemCatalog(event).catch(() => null))?.weddingPass
}

/** Marks a payment as the Wedding pass (payment_products) */
export async function setPaymentProduct(event: H3Event, paymentId: string, product: Product) {
  try {
    await getDB(event).prepare('INSERT OR IGNORE INTO payment_products (payment_id, product) VALUES (?, ?)').bind(paymentId, product).run()
  } catch (error) {
    console.error('[billing] payment_products missing', error)
    throw createError({ statusCode: 503, statusMessage: 'The Wedding pass is not available yet' })
  }
}

/** What each payment bought besides its plan; none on a database without the table */
export async function paymentProducts(event: H3Event, ids: string[]) {
  const products = new Map<string, Product>()
  if (!ids.length) return products
  const rows = await getDB(event)
    .prepare(`SELECT payment_id, product FROM payment_products WHERE payment_id IN (${ids.map(() => '?').join(',')})`)
    .bind(...ids)
    .all<{ payment_id: string; product: Product }>()
    .then(r => r.results ?? [])
    .catch(() => [])
  for (const row of rows) products.set(row.payment_id, row.product)
  return products
}
