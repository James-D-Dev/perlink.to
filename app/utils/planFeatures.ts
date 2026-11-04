import { BRANDING_FOR_ALL, CUSTOM_DOMAINS_LIVE, PLAN_LIMITS, type PlanId } from '#shared/plans'

// vue-i18n's t, which has several overloads
type Translate = (...args: any[]) => string

/** What a plan includes, as the pricing cards and the upgrade celebration list it */
export function planFeatures(plan: PlanId, t: Translate) {
  const limits = PLAN_LIMITS[plan]
  const f = (key: string, params: Record<string, unknown> = {}, n?: number) => (n === undefined ? t(`dashboard.billing.features.${key}`, params) : t(`dashboard.billing.features.${key}`, params, n))
  // Max: what Plus has, room for many sites, every 3D pack and priority support
  if (plan === 'max') {
    return [
      f('everythingPlus'),
      f('sites', { n: limits.sites }, limits.sites),
      ...(CUSTOM_DOMAINS_LIVE ? [f('customDomains', { n: limits.domains }, limits.domains)] : []),
      f('allPacks'),
      f('support'),
    ]
  }
  const list = [
    f('sites', { n: limits.sites }, limits.sites),
    f('basics'),
    f('room'),
  ]
  list.push(Number.isFinite(limits.posts) ? f('posts', { n: limits.posts }) : f('postsUnlimited'))
  if (limits.proThemes) list.push(f('proThemes'))
  if (limits.tracking) list.push(f('tracking'))
  if (limits.protect) list.push(f('protect'))
  if (limits.orders) list.push(f('orders'))
  if (limits.cleanVideo) list.push(f('cleanVideo'))
  // Only what works today: domains are listed once they can be connected
  if (limits.customDomain && CUSTOM_DOMAINS_LIVE) list.push(f('customDomains', { n: limits.domains }, limits.domains))
  if (limits.removeBranding && !BRANDING_FOR_ALL) list.push(f('removeBranding'))
  const years = Math.round(limits.analyticsDays / 365)
  list.push(years >= 2 ? f('analyticsYears', { n: years }) : years === 1 ? f('analyticsYear') : f('analytics', { n: limits.analyticsDays }))
  return list
}
