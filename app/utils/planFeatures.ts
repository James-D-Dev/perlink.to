import { PLAN_LIMITS, type PlanId } from '#shared/plans'

// vue-i18n's t, which has several overloads
type Translate = (...args: any[]) => string

/** What a plan includes, as the pricing cards and the upgrade celebration list it */
export function planFeatures(plan: PlanId, t: Translate) {
  const limits = PLAN_LIMITS[plan]
  const f = (key: string, params: Record<string, unknown> = {}, n?: number) => (n === undefined ? t(`dashboard.billing.features.${key}`, params) : t(`dashboard.billing.features.${key}`, params, n))
  const list = [
    f('sites', { n: limits.sites }, limits.sites),
    f('basics'),
    f('room'),
  ]
  list.push(Number.isFinite(limits.posts) ? f('posts', { n: limits.posts }) : f('postsUnlimited'))
  if (limits.proThemes) list.push(f('proThemes'))
  if (limits.customDomain) list.push(f('customDomains', { n: limits.domains }, limits.domains))
  if (limits.removeBranding) list.push(f('removeBranding'))
  const years = Math.round(limits.analyticsDays / 365)
  list.push(years >= 2 ? f('analyticsYears', { n: years }) : years === 1 ? f('analyticsYear') : f('analytics', { n: limits.analyticsDays }))
  if (plan === 'pro') list.push(f('support'))
  return list
}
