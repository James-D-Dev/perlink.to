// Plans, what each one unlocks and what it costs. Shared by the app (pricing,
// upgrade prompts) and the server (checks before creating, publishing,
// connecting a domain), so the two never disagree.

export type PlanId = 'free' | 'starter' | 'plus' | 'pro'
export type PaidPlanId = Exclude<PlanId, 'free'>
export type BillingPeriod = 'monthly' | 'annual'

export const PLAN_ORDER: PlanId[] = ['free', 'starter', 'plus', 'pro']
export const PAID_PLANS: PaidPlanId[] = ['starter', 'plus', 'pro']

export interface PlanLimits {
  /** How many sites the account can have */
  sites: number
  customDomain: boolean
  /** Publish a site that uses a Pro theme */
  proThemes: boolean
  /** No "Made with Perlink" badge at the bottom of the page */
  removeBranding: boolean
  /** How far back analytics go */
  analyticsDays: number
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: { sites: 1, customDomain: false, proThemes: false, removeBranding: false, analyticsDays: 30 },
  starter: { sites: 3, customDomain: false, proThemes: true, removeBranding: false, analyticsDays: 90 },
  plus: { sites: 10, customDomain: true, proThemes: true, removeBranding: true, analyticsDays: 365 },
  pro: { sites: 1000, customDomain: true, proThemes: true, removeBranding: true, analyticsDays: 3650 },
}

/**
 * Every site shows the "Made with Perlink" badge (and room videos the
 * watermark), whatever the plan, until buying plans and paying work end to
 * end. Set to false to let Plus and Pro remove it again (removeBranding).
 */
export const BRANDING_FOR_ALL = true

/** Whether a site on this plan shows the Perlink badge */
export const showsBranding = (plan: PlanId | null | undefined) => BRANDING_FOR_ALL || !plan || !PLAN_LIMITS[plan].removeBranding

/** Prices in VND; a year costs ten months */
export const PLAN_PRICES: Record<PaidPlanId, Record<BillingPeriod, number>> = {
  starter: { monthly: 49_000, annual: 490_000 },
  plus: { monthly: 99_000, annual: 990_000 },
  pro: { monthly: 249_000, annual: 2_490_000 },
}

export const PERIOD_MONTHS: Record<BillingPeriod, number> = { monthly: 1, annual: 12 }

/** New accounts can try this plan once, for free */
export const TRIAL_PLAN: PaidPlanId = 'plus'
export const TRIAL_DAYS = 7

/** Themes that need a paid plan to publish (labelled "Pro" in the picker) */
export const PRO_THEME_IDS = new Set([
  'aurora-glass', 'frost', 'midnight-glass', 'sakura-glass',
  'gold-noir', 'marble', 'emerald', 'royal', 'rose-gold',
  'brutal-pink', 'y2k', 'vaporwave', 'terminal',
  'latte', 'sunset-mesh', 'meadow', 'cotton-candy', 'cyber', 'lixi', 'party',
])

export type PlanFeature = 'sites' | 'customDomain' | 'proThemes' | 'removeBranding'

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === 'string' && (PLAN_ORDER as string[]).includes(value)
}

/** The cheapest plan that has a feature (or room for this many sites) */
export function minPlanFor(feature: PlanFeature, sites = 0): PlanId {
  return PLAN_ORDER.find(id => feature === 'sites' ? PLAN_LIMITS[id].sites >= sites : PLAN_LIMITS[id][feature]) ?? 'pro'
}

/** The plan that counts right now: a paid plan past its end date is free again */
export function effectivePlan(plan: string | null | undefined, expiresAt: string | null | undefined, now = Date.now()): PlanId {
  if (!isPlanId(plan)) return 'free'
  if (plan !== 'free' && expiresAt && Date.parse(expiresAt) <= now) return 'free'
  return plan
}

export const formatVnd = (amount: number) => `${amount.toLocaleString('vi-VN')}đ`
