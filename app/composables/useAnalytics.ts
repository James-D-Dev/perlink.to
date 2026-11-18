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
export function useAnalytics() {
  // 'ask': show the banner; null: not decided yet (still loading)
  const consent = useState<Consent | 'ask' | null>('analytics-consent', () => null)
  // Is this page one of Perlink's own (not a user's site, not Superadmin)?
  const measured = useState<boolean>('analytics-measured', () => false)

  function track(name: string, params: Record<string, unknown> = {}) {
    if (!import.meta.client || !measured.value || !window.gtag) return
    window.gtag('event', name, params)
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

  return { consent, measured, track, setConsent, reopen }
}
