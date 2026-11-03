// The affiliate program, run by Lemon Squeezy: it tracks sales, pays
// affiliates and handles their tax. Perlink remembers the code from a link
// (?aff=CODE) and passes it to the checkout. Keep these in line with the
// program's settings in Lemon Squeezy (Affiliates → Settings).

/** Share of each payment an affiliate earns */
export const AFFILIATE_COMMISSION = 30
/** For how many months of a subscription */
export const AFFILIATE_MONTHS = 12
/** How long a click counts */
export const AFFILIATE_COOKIE_DAYS = 30

export const AFFILIATE_COOKIE = 'pl_aff'

/** The store's slug in Lemon Squeezy's tracking script (Settings → Affiliates) */
export const LEMON_AFFILIATE_STORE = 'perlink-to'

/** Lemon Squeezy affiliate codes: letters, numbers, - and _ */
export const isAffiliateCode = (value: unknown): value is string =>
  typeof value === 'string' && /^[A-Za-z0-9_-]{2,40}$/.test(value)

/** A share link: the home page, or any perlink.to page, with the code */
export const affiliateLink = (code: string, path = '/') => `https://perlink.to${path}${path.includes('?') ? '&' : '?'}aff=${encodeURIComponent(code)}`
