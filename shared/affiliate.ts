// The affiliate program, run by Creem (Affiliate Hub): it credits sales,
// pays affiliates and checks who they are. Perlink remembers the code from a
// link (?aff=CODE) and passes it to the checkout (affiliate_code). Creem's own
// links (creem.io/affiliate?code=…) are tracked by Creem itself. Keep these in
// line with the program's settings in Creem (Growth → Affiliate Hub).

/** Share of each payment an affiliate earns */
export const AFFILIATE_COMMISSION = 20
// Recurring: on the first payment and every renewal, for as long as the
// customer stays subscribed (Creem: recurring commission)
/** How long a click counts */
export const AFFILIATE_COOKIE_DAYS = 30

export const AFFILIATE_COOKIE = 'pl_aff'

/** Affiliate codes: letters, numbers, - and _ */
export const isAffiliateCode = (value: unknown): value is string =>
  typeof value === 'string' && /^[A-Za-z0-9_-]{2,40}$/.test(value)

/** A share link: the home page, or any perlink.to page, with the code */
export const affiliateLink = (code: string, path = '/') => `https://perlink.to${path}${path.includes('?') ? '&' : '?'}aff=${encodeURIComponent(code)}`
