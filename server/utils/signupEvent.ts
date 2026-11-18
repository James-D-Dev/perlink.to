import type { H3Event } from 'h3'
import { SIGNUP_COOKIE } from '#shared/analytics'

/**
 * A new account was just created: leave a short-lived cookie so the next
 * page sends GA4's sign_up event (plugins/analytics.client.ts), with how
 * they signed up. Readable by the page on purpose; holds no personal data.
 */
export function markSignup(event: H3Event, method: string) {
  setCookie(event, SIGNUP_COOKIE, method, { maxAge: 600, path: '/', sameSite: 'lax', secure: true, httpOnly: false })
}
