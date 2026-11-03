import type { H3Event } from 'h3'
import { getDB } from './db'
import { AFFILIATE_COOKIE, isAffiliateCode } from '#shared/affiliate'

/** The affiliate code in this browser's cookie (shared/affiliate), if any */
export function cookieAffiliate(event: H3Event) {
  const code = getCookie(event, AFFILIATE_COOKIE)
  return isAffiliateCode(code) ? code : null
}

/**
 * Who gets the sale: the latest affiliate link this browser followed, or the
 * one that brought the account in. Never the buyer's own code.
 */
export async function checkoutAffiliate(event: H3Event, userId: string) {
  try {
    const me = await getDB(event)
      .prepare('SELECT affiliate_code, referred_by FROM profiles WHERE id = ?')
      .bind(userId)
      .first<{ affiliate_code: string | null; referred_by: string | null }>()
    const code = cookieAffiliate(event) ?? (isAffiliateCode(me?.referred_by) ? me!.referred_by : null)
    return code && code.toLowerCase() !== me?.affiliate_code?.toLowerCase() ? code : null
  } catch {
    // Before migration 0038
    return cookieAffiliate(event)
  }
}

/** A new account remembers the affiliate that brought it (first day only, once) */
export async function rememberReferral(event: H3Event, userId: string) {
  const code = cookieAffiliate(event)
  if (!code) return
  try {
    await getDB(event)
      .prepare(`UPDATE profiles SET referred_by = ? WHERE id = ? AND referred_by IS NULL AND created_at > datetime('now', '-1 day') AND (affiliate_code IS NULL OR lower(affiliate_code) != lower(?))`)
      .bind(code, userId, code)
      .run()
  } catch {
    // Before migration 0038
  }
}
