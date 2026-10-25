import { getDB } from '../../utils/db'
import { getAccountPlan } from '../../utils/plan'
import { billingAccount } from '../../utils/billing'
import { PLAN_LIMITS } from '#shared/plans'

// The signed-in user's plan, what it allows, and their recent payments
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const db = getDB(event)
  const account = await getAccountPlan(event, user.id)
  const [sites, payments] = await Promise.all([
    db.prepare('SELECT COUNT(*) AS n FROM bio_pages WHERE user_id = ?').bind(user.id).first<{ n: number }>(),
    db.prepare('SELECT id, plan, period, amount, code, status, created_at, paid_at FROM payments WHERE user_id = ? ORDER BY created_at DESC LIMIT 10')
      .bind(user.id)
      .all<{ id: string; plan: string; period: string; amount: number; code: string; status: string; created_at: string; paid_at: string | null }>(),
  ])
  return {
    plan: account.plan,
    expiresAt: account.plan === 'free' ? null : account.expiresAt,
    limits: PLAN_LIMITS[account.plan],
    sites: sites?.n ?? 0,
    canTrial: !account.trialUsed && account.plan === 'free',
    checkoutEnabled: !!billingAccount(event),
    payments: (payments.results ?? []).map(p => ({
      id: p.id, plan: p.plan, period: p.period, amount: p.amount, code: p.code, status: p.status, createdAt: p.created_at, paidAt: p.paid_at,
    })),
  }
})
