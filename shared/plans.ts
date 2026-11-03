// Plans, what each one unlocks and what it costs. Shared by the app (pricing,
// upgrade prompts) and the server (checks before creating, publishing,
// connecting a domain), so the two never disagree.

export type PlanId = 'free' | 'starter' | 'plus' | 'max'
export type PaidPlanId = Exclude<PlanId, 'free'>
export type BillingPeriod = 'monthly' | 'annual'

export const PLAN_ORDER: PlanId[] = ['free', 'starter', 'plus', 'max']
export const PAID_PLANS: PaidPlanId[] = ['starter', 'plus', 'max']

export interface PlanLimits {
  /** How many sites the account can have */
  sites: number
  customDomain: boolean
  /** How many custom domains the account can connect, across its sites
   * (each one costs a Cloudflare for SaaS hostname) */
  domains: number
  /** Publish a site that uses a Pro theme */
  proThemes: boolean
  /** No "Made with Perlink" badge at the bottom of the page */
  removeBranding: boolean
  /** How far back analytics go (what the pricing promises) */
  analyticsDays: number
  /** Published blog posts per account (Infinity: no limit) */
  posts: number
  /** Facebook / TikTok pixels, Google Analytics and Search Console on the site */
  tracking: boolean
  /** A password on the site, or a time it opens at */
  protect: boolean
  /** Order statuses (new, confirmed, shipped…) in the inbox */
  orders: boolean
  /** Room videos without the Perlink watermark */
  cleanVideo: boolean
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  free: { sites: 1, customDomain: false, domains: 0, proThemes: false, removeBranding: false, analyticsDays: 30, posts: 50, tracking: false, protect: false, orders: false, cleanVideo: false },
  starter: { sites: 3, customDomain: false, domains: 0, proThemes: true, removeBranding: false, analyticsDays: 90, posts: 100, tracking: true, protect: true, orders: true, cleanVideo: true },
  plus: { sites: 10, customDomain: true, domains: 3, proThemes: true, removeBranding: true, analyticsDays: 365, posts: Infinity, tracking: true, protect: true, orders: true, cleanVideo: true },
  // Max: room for agencies and chains (not listed on the pricing page), plus
  // priority support and setup help (planFeatures)
  max: { sites: 50, customDomain: true, domains: 20, proThemes: true, removeBranding: true, analyticsDays: 1095, posts: Infinity, tracking: true, protect: true, orders: true, cleanVideo: true },
}

/**
 * Every site shows the "Made with Perlink" badge (and room videos the
 * watermark), whatever the plan, until buying plans and paying work end to
 * end. Set to false to let Plus remove it again (removeBranding).
 */
export const BRANDING_FOR_ALL = true

/**
 * Whether custom domains can be connected yet (docs/custom-domains.md). Until
 * then the plans list them as coming soon instead of promising them.
 */
export const CUSTOM_DOMAINS_LIVE = true

/** Whether a site on this plan shows the Perlink badge */
export const showsBranding = (plan: PlanId | null | undefined) => BRANDING_FOR_ALL || !plan || !PLAN_LIMITS[plan].removeBranding

/** Prices in VND, in line with the USD ones (about 25,000đ a dollar); a year costs ten months */
export const PLAN_PRICES: Record<PaidPlanId, Record<BillingPeriod, number>> = {
  starter: { monthly: 150_000, annual: 1_500_000 },
  plus: { monthly: 500_000, annual: 5_000_000 },
  max: { monthly: 2_500_000, annual: 25_000_000 },
}

/**
 * Prices shown in USD to English-speaking visitors: $2-5 a month below
 * Linktree (Starter $8, Pro $15, Premium $35 in 2026); a year is ten months.
 * Display only for now: payment is a Vietnamese bank transfer in VND
 * (PLAN_PRICES) until an international payment method is added.
 */
export const PLAN_PRICES_USD: Record<PaidPlanId, Record<BillingPeriod, number>> = {
  starter: { monthly: 6, annual: 60 },
  plus: { monthly: 20, annual: 200 },
  max: { monthly: 100, annual: 1000 },
}

/** Whole dollars as "$6", anything else with cents */
export const formatUsd = (amount: number) => `$${Number.isInteger(amount) ? amount : amount.toFixed(2)}`

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

export type PlanFeature = 'sites' | 'customDomain' | 'proThemes' | 'removeBranding' | 'tracking' | 'protect' | 'orders' | 'cleanVideo'

export function isPlanId(value: unknown): value is PlanId {
  return typeof value === 'string' && (PLAN_ORDER as string[]).includes(value)
}

/** The cheapest plan that has a feature (or room for this many sites) */
export function minPlanFor(feature: PlanFeature, sites = 0): PlanId {
  return PLAN_ORDER.find(id => feature === 'sites' ? PLAN_LIMITS[id].sites >= sites : PLAN_LIMITS[id][feature]) ?? 'plus'
}

/** The plan that counts right now: a paid plan past its end date is free again */
export function effectivePlan(plan: string | null | undefined, expiresAt: string | null | undefined, now = Date.now()): PlanId {
  // Pro was retired; anyone still on it keeps Plus until their period ends
  if (plan === 'pro') plan = 'plus'
  if (!isPlanId(plan)) return 'free'
  if (plan !== 'free' && expiresAt && Date.parse(expiresAt) <= now) return 'free'
  return plan
}

export const formatVnd = (amount: number) => `${amount.toLocaleString('vi-VN')}đ`
