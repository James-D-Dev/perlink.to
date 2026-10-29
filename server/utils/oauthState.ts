import type { EventHandler, H3Event } from 'h3'
import { deleteCookie, getCookie, getQuery, getRequestURL, setCookie } from 'h3'

/**
 * CSRF protection for sign-in providers whose nuxt-auth-utils handler sends
 * no `state` (Facebook, TikTok): without it a link could finish someone else's
 * sign-in in a visitor's browser and log them in to the wrong account.
 *
 * On the way out a random state goes into a short-lived cookie and the
 * provider's URL; on the way back the provider must return the same value.
 * `start` builds the provider's URL for handlers that don't pass `state`
 * through themselves; otherwise the request is sent back to itself with
 * ?state=, which the handler forwards (Facebook).
 */
export function withOAuthState(
  provider: 'facebook' | 'tiktok',
  handler: EventHandler,
  start?: (event: H3Event, state: string) => string,
) {
  const cookie = `oauth_state_${provider}`
  return defineEventHandler(async (event) => {
    const query = getQuery(event)
    const expected = getCookie(event, cookie)

    // Back from the provider
    if (query.code || query.error) {
      deleteCookie(event, cookie, { path: '/api/auth' })
      if (query.error) return socialLoginFailed(event, provider, new Error(String(query.error_description || query.error)))
      if (!expected || query.state !== expected) return socialLoginFailed(event, provider, new Error('state mismatch'))
      return handler(event)
    }

    // Our own hop with the state in place: the handler takes it to the provider
    if (!start && expected && query.state === expected) return handler(event)

    const state = crypto.randomUUID().replace(/-/g, '')
    setCookie(event, cookie, state, {
      httpOnly: true,
      secure: !import.meta.dev,
      // Lax: the cookie comes back on the provider's top-level redirect
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: 60 * 10,
    })
    const self = getRequestURL(event)
    self.searchParams.set('state', state)
    return sendRedirect(event, start ? start(event, state) : `${self.pathname}${self.search}`, 302)
  })
}
