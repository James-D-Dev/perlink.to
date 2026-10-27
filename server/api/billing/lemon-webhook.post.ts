import { getDB } from '../../utils/db'
import { lemonCatalog, verifyLemonSignature } from '../../utils/lemon'
import { PERIOD_MONTHS, type BillingPeriod, type PaidPlanId } from '#shared/plans'

// Lemon Squeezy calls this for subscription events (see docs/billing.md for
// the list to tick). Each one is signed; the account's plan follows the
// subscription: on while it is paid up, until the end of the period once
// cancelled, off when refunded. Every successful charge is kept as a payment,
// so it shows in the account's history and the "you're upgraded" screen.

interface SubscriptionAttributes {
  variant_id: number
  status: string
  renews_at: string | null
  ends_at: string | null
  urls?: { customer_portal?: string | null }
}
interface InvoiceAttributes {
  subscription_id: number
  /** initial | renewal | updated */
  billing_reason?: string
  status: string
  total_usd: number
  refunded?: boolean
}
interface Payload {
  meta: { event_name: string; custom_data?: { user_id?: string; plan?: string; period?: string } }
  data: { id: string; type: string; attributes: SubscriptionAttributes & InvoiceAttributes }
}

const GRACE_DAYS = 3
const addDays = (iso: string, days: number) => new Date(Date.parse(iso) + days * 86400000).toISOString()
const later = (a: string | null, b: string) => (a && Date.parse(a) > Date.parse(b) ? a : b)

export default defineEventHandler(async (event) => {
  const raw = (await readRawBody(event, 'utf8')) ?? ''
  if (!(await verifyLemonSignature(event, raw, getRequestHeader(event, 'x-signature')))) {
    throw createError({ statusCode: 401, statusMessage: 'Bad signature' })
  }
  const payload = JSON.parse(raw) as Payload
  const name = payload.meta.event_name
  const db = getDB(event)
  const now = new Date().toISOString()

  /** The account a subscription belongs to: from the checkout tag, or from an earlier event */
  async function ownerOf(subscriptionId: string) {
    const known = await db.prepare('SELECT user_id, plan, period FROM subscriptions WHERE id = ?').bind(subscriptionId)
      .first<{ user_id: string; plan: PaidPlanId; period: BillingPeriod }>()
    if (known) return known
    const custom = payload.meta.custom_data
    return custom?.user_id ? { user_id: custom.user_id, plan: custom.plan as PaidPlanId, period: custom.period as BillingPeriod } : null
  }

  async function setPlan(userId: string, plan: PaidPlanId, expiresAt: string, extendOnly: boolean) {
    const profile = await db.prepare('SELECT plan, plan_expires_at FROM profiles WHERE id = ?').bind(userId)
      .first<{ plan: string | null; plan_expires_at: string | null }>()
    if (!profile) return
    // Never cut short time the account has on another plan (e.g. paid by bank)
    if (!extendOnly && profile.plan !== plan) return
    const until = extendOnly && profile.plan === plan ? later(profile.plan_expires_at, expiresAt) : expiresAt
    await db.prepare('UPDATE profiles SET plan = ?, plan_expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(plan, until, userId).run()
  }

  if (payload.data.type === 'subscriptions') {
    const sub = payload.data.attributes
    const id = payload.data.id
    const owner = await ownerOf(id)
    if (!owner?.user_id) return { ok: true }
    // The variant says which plan it is now (it changes when they switch plan)
    const fromVariant = (await lemonCatalog(event).catch(() => null))?.plans[String(sub.variant_id)]
    const plan = fromVariant?.plan ?? owner.plan
    const period = fromVariant?.period ?? owner.period
    await db.prepare(`INSERT INTO subscriptions (id, user_id, plan, period, status, renews_at, ends_at, portal_url, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(id) DO UPDATE SET plan = excluded.plan, period = excluded.period, status = excluded.status,
        renews_at = excluded.renews_at, ends_at = excluded.ends_at, portal_url = COALESCE(excluded.portal_url, portal_url), updated_at = datetime('now')`)
      .bind(id, owner.user_id, plan, period, sub.status, sub.renews_at, sub.ends_at, sub.urls?.customer_portal ?? null)
      .run()

    if (['on_trial', 'active', 'past_due'].includes(sub.status) && sub.renews_at) {
      // Paid up: on until the next renewal, with a few days' grace for the charge
      await setPlan(owner.user_id, plan, addDays(sub.renews_at, GRACE_DAYS), true)
    } else if (sub.status === 'cancelled' && sub.ends_at) {
      // Cancelled: stays on until the end of what was paid for
      await setPlan(owner.user_id, plan, sub.ends_at, false)
    } else if (['expired', 'unpaid', 'paused'].includes(sub.status)) {
      await setPlan(owner.user_id, plan, sub.ends_at && Date.parse(sub.ends_at) < Date.now() ? sub.ends_at : now, false)
    }
    return { ok: true }
  }

  if (payload.data.type === 'subscription-invoices') {
    const invoice = payload.data.attributes
    const subscriptionId = String(invoice.subscription_id)
    const owner = await ownerOf(subscriptionId)
    if (!owner?.user_id) return { ok: true }
    const ref = `lemon:invoice:${payload.data.id}`

    if (name === 'subscription_payment_success') {
      // A charge (first or renewal): kept as a paid payment; once only. Only
      // the first one gets the "you're upgraded" screen
      const renewal = invoice.billing_reason && invoice.billing_reason !== 'initial'
      await db.prepare(`INSERT OR IGNORE INTO payments (id, user_id, plan, period, amount, amount_usd, code, method, status, provider_ref, paid_at, celebrated_at)
        VALUES (?, ?, ?, ?, 0, ?, ?, 'lemon', 'paid', ?, datetime('now'), ?)`)
        .bind(crypto.randomUUID(), owner.user_id, owner.plan, owner.period, (invoice.total_usd ?? 0) / 100, `LS${payload.data.id}`, ref, renewal ? now : null)
        .run()
      // The plan is on for a period from now, in case the subscription event comes later
      const end = new Date()
      end.setMonth(end.getMonth() + PERIOD_MONTHS[owner.period])
      await setPlan(owner.user_id, owner.plan, addDays(end.toISOString(), GRACE_DAYS), true)
    } else if (name === 'subscription_payment_refunded') {
      // Refunded (see the Refund Policy): the account goes back to free
      await db.prepare(`UPDATE payments SET status = 'refunded' WHERE provider_ref = ?`).bind(ref).run()
      await setPlan(owner.user_id, owner.plan, now, false)
    }
    return { ok: true }
  }

  return { ok: true }
})
