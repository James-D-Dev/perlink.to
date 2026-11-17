import { getDB } from '../../utils/db'
import { creemCatalog, idOf, verifyCreemSignature, type CreemSubscription } from '../../utils/creem'
import { PLAN_ORDER, WEDDING_PASS, type BillingPeriod, type PaidPlanId, type PlanId } from '#shared/plans'
import { grantWeddingPass, revokeWeddingPass, setPaymentProduct } from '../../utils/weddingPass'
import { isRoomPackId } from '#shared/roomPacks'

// Creem calls this for checkout, subscription and refund events (see
// docs/billing.md). Each one is signed. The account's plan follows the
// subscription: on while it is paid up, until the end of the period once
// cancelled, off when refunded. Every successful charge is kept as a payment,
// so it shows in the account's history and the "you're upgraded" screen.
// Room packs and the Wedding pass are one-time orders (checkout.completed).

type Metadata = { user_id?: string; plan?: string; period?: string; pack?: string; product?: string } | null | undefined

interface Transaction { id: string; amount_paid?: number; amount?: number; status?: string; order?: string | null; subscription?: string | null }
interface Order { id: string; amount_paid?: number; amount?: number; status: string; type: 'onetime' | 'recurring'; product: string | { id: string } }
interface Sub extends CreemSubscription {
  current_period_start_date?: string | null
  last_transaction?: Transaction | null
}
interface Payload {
  id: string
  eventType: string
  object: any
}

const GRACE_DAYS = 3
const addDays = (iso: string, days: number) => new Date(Date.parse(iso) + days * 86400000).toISOString()
const later = (a: string | null, b: string) => (a && Date.parse(a) > Date.parse(b) ? a : b)
const usd = (cents: number | undefined) => (cents ?? 0) / 100

/** Creem's subscription status, in the words the app uses (shared with the old subscriptions) */
const STATUS: Record<string, string> = {
  trialing: 'on_trial',
  active: 'active',
  past_due: 'past_due',
  unpaid: 'unpaid',
  paused: 'paused',
  scheduled_cancel: 'cancelled',
  canceled: 'expired',
}

export default defineEventHandler(async (event) => {
  const raw = (await readRawBody(event, 'utf8')) ?? ''
  if (!(await verifyCreemSignature(event, raw, getRequestHeader(event, 'creem-signature')))) {
    throw createError({ statusCode: 401, statusMessage: 'Bad signature' })
  }
  const payload = JSON.parse(raw) as Payload
  const name = payload.eventType
  const db = getDB(event)
  const now = new Date().toISOString()

  /**
   * fromPlan: the plan this same subscription was on before (a switch), so a
   * downgrade through it applies; a higher plan paid some other way (e.g. by
   * bank) is kept until it runs out instead
   */
  async function setPlan(userId: string, plan: PaidPlanId, expiresAt: string, extendOnly: boolean, fromPlan?: string) {
    const profile = await db.prepare('SELECT plan, plan_expires_at FROM profiles WHERE id = ?').bind(userId)
      .first<{ plan: string | null; plan_expires_at: string | null }>()
    if (!profile) return
    // Never cut short time the account has on another plan (e.g. paid by bank)
    if (!extendOnly && profile.plan !== plan) return
    const current = (profile.plan ?? 'free') as PlanId
    const stillOn = !profile.plan_expires_at || Date.parse(profile.plan_expires_at) > Date.now()
    if (extendOnly && stillOn && current !== fromPlan && PLAN_ORDER.indexOf(current) > PLAN_ORDER.indexOf(plan)) return
    const until = extendOnly && profile.plan === plan ? later(profile.plan_expires_at, expiresAt) : expiresAt
    await db.prepare('UPDATE profiles SET plan = ?, plan_expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(plan, until, userId).run()
  }

  /** Keeps the subscription row up to date; returns its account, plan and period */
  async function saveSubscription(sub: Sub, metadata: Metadata) {
    const known = await db.prepare('SELECT user_id, plan, period FROM subscriptions WHERE id = ?').bind(sub.id)
      .first<{ user_id: string; plan: PaidPlanId; period: BillingPeriod }>()
    const meta = (sub.metadata ?? metadata) as Metadata
    const userId = known?.user_id ?? meta?.user_id
    if (!userId) return null
    // The product says which plan it is now (it changes when they switch plan)
    const fromProduct = (await creemCatalog(event).catch(() => null))?.plans[idOf(sub.product)]
    const plan = (fromProduct?.plan ?? known?.plan ?? meta?.plan) as PaidPlanId | undefined
    const period = (fromProduct?.period ?? known?.period ?? meta?.period) as BillingPeriod | undefined
    if (!plan || !period) return null
    const status = STATUS[sub.status] ?? sub.status
    const periodEnd = sub.current_period_end_date ?? null
    const endsAt = status === 'cancelled' ? periodEnd : status === 'expired' ? (sub.canceled_at ?? now) : null
    await db.prepare(`INSERT INTO subscriptions (id, user_id, plan, period, status, renews_at, ends_at, portal_url, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, NULL, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET plan = excluded.plan, period = excluded.period, status = excluded.status,
        renews_at = excluded.renews_at, ends_at = excluded.ends_at, updated_at = datetime('now')`)
      .bind(sub.id, userId, plan, period, status, status === 'cancelled' || status === 'expired' ? null : periodEnd, endsAt)
      .run()
    return { userId, plan, period, status, periodEnd, endsAt, fromPlan: known?.plan }
  }

  /** The account's plan, following the subscription's status */
  async function applyStatus(saved: NonNullable<Awaited<ReturnType<typeof saveSubscription>>>) {
    const { userId, plan, status, periodEnd, endsAt, fromPlan } = saved
    if (['on_trial', 'active', 'past_due'].includes(status) && periodEnd) {
      // Paid up: on until the period ends, with a few days' grace for the renewal charge
      await setPlan(userId, plan, addDays(periodEnd, GRACE_DAYS), true, fromPlan)
    } else if (status === 'cancelled' && endsAt) {
      // Cancelled at the end of the period: stays on until then
      await setPlan(userId, plan, endsAt, false)
    } else if (['expired', 'unpaid', 'paused'].includes(status)) {
      await setPlan(userId, plan, endsAt && Date.parse(endsAt) < Date.now() ? endsAt : now, false)
    }
  }

  // A one-time order (a room pack or the Wedding pass), or the start of a subscription
  if (name === 'checkout.completed') {
    const checkout = payload.object as { order?: Order; subscription?: Sub | null; metadata?: Metadata; product?: string | { id: string } }
    const meta = checkout.metadata
    const order = checkout.order
    if (checkout.subscription) {
      const saved = await saveSubscription(checkout.subscription, meta)
      if (saved) await applyStatus(saved)
      return { ok: true }
    }
    if (!order || order.status !== 'paid' || !meta?.user_id) return { ok: true }
    const productId = idOf(order.product) || idOf(checkout.product)
    const catalog = await creemCatalog(event).catch(() => null)
    const ref = `creem:order:${order.id}`
    if (meta.product === 'wedding' || (catalog?.weddingPass && catalog.weddingPass === productId)) {
      // The Wedding pass: a year of Starter and the Wedding pack, once per order
      const id = crypto.randomUUID()
      const added = await db.prepare(`INSERT OR IGNORE INTO payments (id, user_id, plan, period, amount, amount_usd, code, method, status, provider_ref, paid_at)
        VALUES (?, ?, ?, ?, 0, ?, ?, 'creem', 'paid', ?, datetime('now'))`)
        .bind(id, meta.user_id, WEDDING_PASS.plan, WEDDING_PASS.period, usd(order.amount_paid ?? order.amount), order.id, ref)
        .run()
      if ((added.meta as { changes?: number }).changes) {
        await setPaymentProduct(event, id, 'wedding').catch(() => {})
        await grantWeddingPass(event, meta.user_id, ref)
      }
      return { ok: true }
    }
    const pack = isRoomPackId(meta.pack) ? meta.pack : catalog?.packs[productId]
    if (isRoomPackId(pack)) {
      await db.prepare(`INSERT INTO room_packs (user_id, pack_id, source, order_ref, amount_usd) VALUES (?, ?, 'creem', ?, ?)
        ON CONFLICT(user_id, pack_id) DO NOTHING`)
        .bind(meta.user_id, pack, ref, usd(order.amount_paid ?? order.amount))
        .run()
    }
    return { ok: true }
  }

  // A charge on a subscription, first or renewal: kept as a paid payment, once
  if (name === 'subscription.paid') {
    const sub = payload.object as Sub
    const saved = await saveSubscription(sub, null)
    if (!saved) return { ok: true }
    const tran = sub.last_transaction
    if (tran?.id) {
      const prefix = `creem:sub:${sub.id}:`
      const earlier = await db.prepare('SELECT 1 FROM payments WHERE provider_ref LIKE ? LIMIT 1').bind(`${prefix}%`).first()
      // Only the first one gets the "you're upgraded" screen
      await db.prepare(`INSERT OR IGNORE INTO payments (id, user_id, plan, period, amount, amount_usd, code, method, status, provider_ref, paid_at, celebrated_at)
        VALUES (?, ?, ?, ?, 0, ?, ?, 'creem', 'paid', ?, datetime('now'), ?)`)
        .bind(crypto.randomUUID(), saved.userId, saved.plan, saved.period, usd(tran.amount_paid ?? tran.amount), tran.id, `${prefix}${tran.id}`, earlier ? now : null)
        .run()
    }
    await applyStatus(saved)
    return { ok: true }
  }

  if (name.startsWith('subscription.')) {
    const saved = await saveSubscription(payload.object as Sub, null)
    if (saved) await applyStatus(saved)
    return { ok: true }
  }

  // Refunded (see the Refund Policy): a plan charge sends the account back
  // to free; a pack or the Wedding pass is taken back
  if (name === 'refund.created') {
    const refund = payload.object as { transaction?: Transaction; subscription?: Sub | null; checkout?: { metadata?: Metadata } | null; order?: { id: string } | null }
    const tran = refund.transaction
    const subscriptionId = tran?.subscription || refund.subscription?.id
    if (subscriptionId && tran?.id) {
      const row = await db.prepare('SELECT user_id, plan FROM subscriptions WHERE id = ?').bind(subscriptionId).first<{ user_id: string; plan: PaidPlanId }>()
      await db.prepare(`UPDATE payments SET status = 'refunded' WHERE provider_ref = ?`).bind(`creem:sub:${subscriptionId}:${tran.id}`).run()
      if (row) await setPlan(row.user_id, row.plan, now, false)
      return { ok: true }
    }
    const orderId = tran?.order || refund.order?.id
    if (!orderId) return { ok: true }
    const ref = `creem:order:${orderId}`
    const pass = await db.prepare('SELECT user_id FROM payments WHERE provider_ref = ?').bind(ref).first<{ user_id: string }>()
    if (pass) {
      await db.prepare(`UPDATE payments SET status = 'refunded' WHERE provider_ref = ?`).bind(ref).run()
      await revokeWeddingPass(event, pass.user_id, ref)
    }
    await db.prepare('DELETE FROM room_packs WHERE order_ref = ?').bind(ref).run()
    return { ok: true }
  }

  return { ok: true }
})
