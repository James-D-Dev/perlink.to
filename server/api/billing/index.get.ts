import { getDB } from '../../utils/db'
import { getAccountPlan } from '../../utils/plan'
import { paymentMethods } from '../../utils/billing'
import { PLAN_LIMITS } from '#shared/plans'

// The signed-in user's plan, what it allows, and their recent payments
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const db = getDB(event)
  const account = await getAccountPlan(event, user.id)
  const [sites, payments, celebrate] = await Promise.all([
    db.prepare('SELECT COUNT(*) AS n FROM bio_pages WHERE user_id = ?').bind(user.id).first<{ n: number }>(),
    db.prepare('SELECT id, plan, period, amount, amount_usd, method, code, status, created_at, paid_at FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 10')
      .bind(user.id)
      .all<{ id: string; plan: string; period: string; amount: number; amount_usd: number | null; method: string; code: string; status: string; created_at: string; paid_at: string | null }>(),
    // An approved payment whose "you're upgraded" screen hasn't been shown yet
    db.prepare(`SELECT id, plan FROM payments WHERE user_id = ? AND status = 'paid' AND celebrated_at IS NULL AND paid_at > datetime('now', '-30 days') ORDER BY paid_at DESC LIMIT 1`)
      .bind(user.id)
      .first<{ id: string; plan: string }>()
      .catch(() => null),
  ])
  return {
    plan: account.plan,
    expiresAt: account.plan === 'free' ? null : account.expiresAt,
    limits: PLAN_LIMITS[account.plan],
    sites: sites?.n ?? 0,
    canTrial: !account.trialUsed && account.plan === 'free',
    checkoutEnabled: Object.values(paymentMethods(event)).some(Boolean),
    paymentMethods: paymentMethods(event),
    celebrate: celebrate ? { paymentId: celebrate.id, plan: celebrate.plan } : null,
    payments: (payments.results ?? []).map(p => ({
      id: p.id, plan: p.plan, period: p.period, amount: p.amount, amountUsd: p.amount_usd, method: p.method, code: p.code, status: p.status, createdAt: p.created_at, paidAt: p.paid_at,
    })),
  }
})
