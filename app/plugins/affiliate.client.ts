import { AFFILIATE_COOKIE, AFFILIATE_COOKIE_DAYS, isAffiliateCode } from '#shared/affiliate'

// Remembers who sent a visitor, for the affiliate program (shared/affiliate):
// an affiliate link (?aff=CODE), or a "Made with Perlink" badge on a site
// whose owner is an affiliate (?utm_source=site&utm_campaign=<site>). The
// latest one counts. The checkout reads the cookie.
export default defineNuxtPlugin(() => {
  const remember = (code: string) => {
    document.cookie = `${AFFILIATE_COOKIE}=${encodeURIComponent(code)}; Max-Age=${AFFILIATE_COOKIE_DAYS * 86400}; Path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`
  }

  async function check(query: Record<string, unknown>) {
    const aff = Array.isArray(query.aff) ? query.aff[0] : query.aff
    if (isAffiliateCode(aff)) return remember(aff)
    const site = query.utm_source === 'site' && typeof query.utm_campaign === 'string' ? query.utm_campaign : ''
    if (!/^[\w-]{1,60}$/.test(site)) return
    try {
      const { code } = await $fetch<{ code: string | null }>(`/api/affiliate/site/${encodeURIComponent(site)}`)
      if (isAffiliateCode(code)) remember(code)
    } catch {
      // Not an affiliate's site
    }
  }

  const router = useRouter()
  check(router.currentRoute.value.query)
  router.afterEach(to => check(to.query))
})
