import type { H3Event } from 'h3'
import { getDB } from './db'

/** Logged-in cookies are re-issued (a fresh 30 days) at most this often, after re-checking the account */
const RENEW_AFTER_MS = 24 * 60 * 60 * 1000

interface SessionUser {
  id: string
  email: string
  username: string | null
  name?: string | null
  avatar?: string | null
}

/** Current session version and status of a profile, or null if it no longer exists */
async function accountState(event: H3Event, userId: string) {
  const row = await getDB(event)
    .prepare('SELECT session_version, status FROM profiles WHERE id = ?')
    .bind(userId)
    .first<{ session_version: number | null; status: string | null }>()
  return row ? { version: row.session_version ?? 1, status: row.status ?? 'active' } : null
}

/**
 * End the session for this request too: clear the cookie in the response and
 * drop it from the request, so handlers that read the session later in the
 * same request (getUserSession) don't still see the user.
 */
async function endSession(event: H3Event) {
  await clearUserSession(event)
  const name = useRuntimeConfig(event).session?.name || 'nuxt-session'
  const header = event.node.req.headers.cookie
  if (header) {
    event.node.req.headers.cookie = header
      .split(';')
      .filter(part => part.trim().split('=')[0] !== name)
      .join(';')
  }
}

/** Start a login session for a user (replaces any previous session cookie) */
export async function startUserSession(event: H3Event, user: SessionUser) {
  const state = await accountState(event, user.id)
  await replaceUserSession(event, {
    user: user as any,
    sessionVersion: state?.version ?? 1,
    renewedAt: Date.now(),
  })
}

/**
 * Sliding session: once a day a logged-in request re-checks the account and
 * re-issues the cookie, so active users stay signed in while sessions of
 * deleted, banned or signed-out-everywhere accounts end. Returns the user, or
 * null when the session was ended.
 */
export async function validateUserSession(event: H3Event) {
  const session = await getUserSession(event)
  const user = session.user as SessionUser | undefined
  if (!user) return null
  const version = session.sessionVersion as number | undefined
  // Cookies from before versions existed can't be checked: sign in again
  if (typeof version !== 'number') {
    await endSession(event)
    return null
  }
  const renewedAt = (session.renewedAt as number | undefined) ?? 0
  if (Date.now() - renewedAt < RENEW_AFTER_MS) return user

  const state = await accountState(event, user.id)
  if (!state || state.status === 'banned' || state.version !== version) {
    await endSession(event)
    return null
  }
  await replaceUserSession(event, { user: user as any, sessionVersion: version, renewedAt: Date.now() })
  return user
}

/** Sign a user out on every device */
export async function revokeUserSessions(event: H3Event, userId: string) {
  await getDB(event)
    .prepare('UPDATE profiles SET session_version = COALESCE(session_version, 1) + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .bind(userId)
    .run()
}
