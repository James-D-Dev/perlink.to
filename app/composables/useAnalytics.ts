import { CONSENT_KEY } from '#shared/analytics'

type Consent = 'granted' | 'denied'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Perlink's GA4 (see plugins/analytics.client.ts). `track` sends an event when
 * the page is one Perlink measures; nothing happens otherwise or without an ID.
 */
const pending: [string, Record<string, unknown>][] = []

export function useAnalytics() {
  // 'ask': show the banner; null: not decided yet (still loading)
  const consent = useState<Consent | 'ask' | null>('analytics-consent', () => null)
  // Is this page one of Perlink's own (not a user's site, not Superadmin)?
  const measured = useState<boolean>('analytics-measured', () => false)

  // Between a navigation and its page being on screen it isn't known yet
  // whether the new page is measured: events from its setup wait for that
  const settled = useState<boolean>('analytics-settled', () => false)

  function track(name: string, params: Record<string, unknown> = {}) {
    if (!import.meta.client) return
    if (!settled.value) {
      if (pending.length < 50) pending.push([name, params])
      return
    }
    if (!measured.value || !window.gtag) return
    window.gtag('event', name, params)
  }

  /** The page is on screen (plugins/analytics): send what waited, or drop it */
  function settle(isMeasured: boolean) {
    measured.value = isMeasured
    settled.value = true
    const waiting = pending.splice(0)
    if (isMeasured && window.gtag) for (const [name, params] of waiting) window.gtag('event', name, params)
  }
  function unsettle() {
    settled.value = false
  }

  function setConsent(value: Consent) {
    consent.value = value
    try { localStorage.setItem(CONSENT_KEY, value) } catch { /* private mode */ }
    window.gtag?.('consent', 'update', { analytics_storage: value })
    // Turning it off also clears the cookies Google Analytics already set
    if (value === 'denied') {
      for (const name of document.cookie.split(';').map(c => c.trim().split('=')[0]!)) {
        if (!name.startsWith('_ga')) continue
        for (const domain of ['', `; domain=${location.hostname}`, `; domain=.${location.hostname.replace(/^www\./, '')}`]) {
          document.cookie = `${name}=; Max-Age=0; path=/${domain}`
        }
      }
    }
  }

  /** "Cookie settings" in the footer: show the banner again */
  function reopen() {
    consent.value = 'ask'
  }

  return { consent, measured, track, settle, unsettle, setConsent, reopen }
}
