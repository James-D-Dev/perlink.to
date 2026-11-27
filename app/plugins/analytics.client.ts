import type { RouteLocationNormalized } from 'vue-router'
import { CONSENT_KEY, SIGNUP_COOKIE } from '#shared/analytics'

// Perlink's own Google Analytics 4 with Consent Mode v2. The measurement ID
// comes from NUXT_PUBLIC_GA_MEASUREMENT_ID; without it nothing loads.
//
// - Only Perlink's pages: not people's sites (perlink.to/<name>, custom
//   domains), short links, QR redirects or Superadmin (shared/analytics).
// - In the EEA, UK and Switzerland, analytics cookies wait for a yes in the
//   banner (components/AnalyticsConsent); without it GA only gets cookieless
//   pings. Elsewhere they're on, and "Cookie settings" in the footer turns
//   them off. Ad storage is always denied: Perlink doesn't advertise with it.
// - Events: page_view, sign_up, purchase (here), begin_checkout and
//   publish_site (useAnalytics().track at those places).

const EXCLUDED = /^(username|s-|qr-|superadmin|pack-cover|plan-cover|design-system)/

export default defineNuxtPlugin((nuxtApp) => {
  const id = String(useRuntimeConfig().public.gaMeasurementId || '')
  const { consent, track, settle, unsettle } = useAnalytics()
  const customDomain = useState<{ hostname: string } | null>('custom-domain')
  if (!id) return

  window.dataLayer = window.dataLayer || []
  // gtag must push the arguments object itself
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer!.push(arguments) }

  const ads = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' }
  window.gtag('consent', 'default', { ...ads, analytics_storage: 'denied', wait_for_update: 1500 })

  let stored: string | null = null
  try { stored = localStorage.getItem(CONSENT_KEY) } catch { /* private mode */ }
  if (stored === 'granted' || stored === 'denied') {
    consent.value = stored
    window.gtag('consent', 'update', { analytics_storage: stored })
  } else {
    $fetch<{ consentRequired: boolean }>('/api/geo')
      .catch(() => ({ consentRequired: true }))
      .then(({ consentRequired }) => {
        if (consent.value) return
        if (consentRequired) consent.value = 'ask'
        else {
          consent.value = 'granted'
          window.gtag!('consent', 'update', { analytics_storage: 'granted' })
        }
      })
  }

  window.gtag('js', new Date())
  window.gtag('config', id, { send_page_view: false })

  const ownHost = () => /(^|\.)perlink\.to$/.test(location.hostname) && !location.hostname.startsWith('s.') || location.hostname === 'localhost'
  const isMeasured = (route: RouteLocationNormalized) =>
    ownHost() && !customDomain.value && !EXCLUDED.test(String(route.name ?? ''))

  let loaded = false
  function load() {
    if (loaded) return
    loaded = true
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
    document.head.appendChild(script)
  }

  function onPage(route: RouteLocationNormalized) {
    const yes = isMeasured(route)
    if (!yes) return settle(false)
    load()
    window.gtag!('event', 'page_view', { page_location: location.href, page_path: route.fullPath, page_title: document.title })
    // The page's own events (sent while it was being set up) after its view
    settle(true)

    // A new account (cookie set by the server when it was created)
    const signup = useCookie<string | null>(SIGNUP_COOKIE)
    if (signup.value) {
      track('sign_up', { method: signup.value })
      signup.value = null
    }
    // Back from a Creem checkout
    if (route.query.paid === '1') track('purchase', { item_category: 'plan' })
    if (typeof route.query.bought === 'string') track('purchase', { item_category: 'room_pack', item_name: route.query.bought })
  }

  const router = useRouter()
  // A new page: its events wait until it's on screen (and known measured)
  router.beforeEach((to, from) => {
    if (to.path !== from.path) unsettle()
  })
  // A page that stays on screen for a new address (the create flow's steps)
  // never "finishes": settle it anyway
  const settled = useState<boolean>('analytics-settled', () => false)
  router.afterEach((to) => {
    setTimeout(() => {
      if (settled.value) return
      const yes = isMeasured(to)
      if (yes) load()
      settle(yes)
    }, 1500)
  })
  // After the page is on screen, so the title is the new page's
  nuxtApp.hook('page:finish', () => onPage(router.currentRoute.value))
})
