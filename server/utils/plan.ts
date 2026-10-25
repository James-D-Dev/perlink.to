import type { H3Event } from 'h3'
import { getDB } from './db'
import { PERIOD_MONTHS, PLAN_LIMITS, PRO_THEME_IDS, effectivePlan, minPlanFor, type BillingPeriod, type PaidPlanId, type PlanFeature, type PlanId } from '#shared/plans'

export interface AccountPlan {
  plan: PlanId
  /** The plan stored on the account, even when it has ended */
  storedPlan: string
  expiresAt: string | null
  trialUsed: boolean
}

/** A user's plan as it counts right now */
export async function getAccountPlan(event: H3Event, userId: string): Promise<AccountPlan> {
  const row = await getDB(event)
    .prepare('SELECT plan, plan_expires_at, trial_used FROM profiles WHERE id = ?')
    .bind(userId)
    .first<{ plan: string | null; plan_expires_at: string | null; trial_used: number | null }>()
  return {
    plan: effectivePlan(row?.plan, row?.plan_expires_at),
    storedPlan: row?.plan || 'free',
    expiresAt: row?.plan_expires_at ?? null,
    trialUsed: !!row?.trial_used,
  }
}

/**
 * Stops a request the plan doesn't cover, with a 402 the app turns into an
 * upgrade prompt ({ code: 'PLAN_REQUIRED', feature, plan: cheapest plan that has it })
 */
export function planRequired(feature: PlanFeature, sites = 0): never {
  throw createError({
    statusCode: 402,
    statusMessage: 'Upgrade required',
    data: { code: 'PLAN_REQUIRED', feature, plan: minPlanFor(feature, sites) },
  })
}

export async function requirePlanFeature(event: H3Event, userId: string, feature: Exclude<PlanFeature, 'sites'>) {
  const { plan } = await getAccountPlan(event, userId)
  if (!PLAN_LIMITS[plan][feature]) planRequired(feature)
  return plan
}

/** Before creating a site: is there room for one more? */
export async function requireRoomForSite(event: H3Event, userId: string) {
  const { plan } = await getAccountPlan(event, userId)
  const count = await getDB(event).prepare('SELECT COUNT(*) AS n FROM bio_pages WHERE user_id = ?').bind(userId).first<{ n: number }>()
  const n = count?.n ?? 0
  if (n >= PLAN_LIMITS[plan].sites) planRequired('sites', n + 1)
}

/**
 * Puts a paid plan on the account. Buying the plan you already have adds the
 * time to what's left; any other plan starts from today.
 */
export async function grantPlan(event: H3Event, userId: string, plan: PaidPlanId, duration: { period: BillingPeriod } | { days: number }) {
  const current = await getAccountPlan(event, userId)
  const now = Date.now()
  const start = current.plan === plan && current.expiresAt && Date.parse(current.expiresAt) > now ? new Date(current.expiresAt) : new Date(now)
  const end = new Date(start)
  if ('period' in duration) end.setMonth(end.getMonth() + PERIOD_MONTHS[duration.period])
  else end.setDate(end.getDate() + duration.days)
  const expiresAt = end.toISOString()
  await getDB(event)
    .prepare('UPDATE profiles SET plan = ?, plan_expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(plan, expiresAt, userId)
    .run()
  return expiresAt
}

type Themed = { presetId?: string } | null | undefined

/**
 * Before publishing: a Pro theme needs a plan that includes Pro themes. A
 * site that is already live with that Pro theme keeps it (Pro themes were
 * free at launch), so only switching to a Pro theme asks for a plan.
 */
export async function requireThemeAllowed(event: H3Event, userId: string, next: Themed, live?: Themed) {
  const presetId = next?.presetId
  if (!presetId || !PRO_THEME_IDS.has(presetId) || live?.presetId === presetId) return
  await requirePlanFeature(event, userId, 'proThemes')
}
