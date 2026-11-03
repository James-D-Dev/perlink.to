import type { H3Event } from 'h3'
import { getDB } from './db'
import { getAccountPlan } from './plan'
import { PLAN_LIMITS } from '#shared/plans'

// Private sites (paid plans): a password, or a time the site opens at.
// The password is kept as a PBKDF2 hash in bio_pages.access_hash, never in
// the theme (which visitors receive). Unlocking sets a cookie signed with
// that hash, so changing the password locks everyone out again.

const ITERATIONS = 20_000
const enc = new TextEncoder()
const b64 = (bytes: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(bytes)))
const unb64 = (text: string) => Uint8Array.from(atob(text), c => c.charCodeAt(0))

async function pbkdf2(password: string, salt: Uint8Array, iterations: number) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, key, 256)
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  return `pbkdf2$${ITERATIONS}$${b64(salt)}$${b64(await pbkdf2(password, salt, ITERATIONS))}`
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, iterations, salt, hash] = stored.split('$')
  if (scheme !== 'pbkdf2' || !iterations || !salt || !hash) return false
  const actual = new Uint8Array(await pbkdf2(password, unb64(salt), Number(iterations)))
  const expected = unb64(hash)
  if (actual.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < actual.length; i++) diff |= actual[i]! ^ expected[i]!
  return diff === 0
}

export async function getAccessHash(event: H3Event, siteId: string): Promise<string | null> {
  try {
    const row = await getDB(event).prepare('SELECT access_hash FROM bio_pages WHERE id = ?').bind(siteId).first<{ access_hash: string | null }>()
    return row?.access_hash || null
  } catch {
    // Column missing before migration 0037
    return null
  }
}

const cookieName = (siteId: string) => `pl_unlock_${siteId.replace(/[^a-z0-9]/gi, '').slice(0, 12)}`

async function unlockToken(siteId: string, accessHash: string) {
  const key = await crypto.subtle.importKey('raw', enc.encode(accessHash), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return b64(await crypto.subtle.sign('HMAC', key, enc.encode(siteId))).replace(/[^a-z0-9]/gi, '')
}

export async function setUnlockCookie(event: H3Event, siteId: string, accessHash: string) {
  setCookie(event, cookieName(siteId), await unlockToken(siteId, accessHash), {
    httpOnly: true,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

async function isUnlocked(event: H3Event, siteId: string, accessHash: string) {
  const cookie = getCookie(event, cookieName(siteId))
  return !!cookie && cookie === await unlockToken(siteId, accessHash)
}

export type SiteGate = { kind: 'password' } | { kind: 'schedule'; opensAt: string }

/**
 * What stands between a visitor and the site right now, or null when it's
 * open. A password is kept even after the owner's plan ends, so a private
 * page never turns public on its own; only setting one needs the plan.
 */
export async function siteGate(event: H3Event, site: { id: string; userId: string; themeConfig?: unknown }): Promise<SiteGate | null> {
  // An opening time counts while the plan has it (a site opening early hides nothing)
  const opensAt = (site.themeConfig as { opensAt?: unknown } | undefined)?.opensAt
  if (typeof opensAt === 'string' && Date.parse(opensAt) > Date.now()) {
    const { plan } = await getAccountPlan(event, site.userId)
    if (PLAN_LIMITS[plan].protect) return { kind: 'schedule', opensAt }
  }
  const accessHash = await getAccessHash(event, site.id)
  if (accessHash && !(await isUnlocked(event, site.id, accessHash))) return { kind: 'password' }
  return null
}

/** For a site's other public endpoints (blog, guestbook): nothing while it's closed */
export async function requireSiteOpen(event: H3Event, site: { id: string; userId: string; themeConfig?: unknown }) {
  if (await siteGate(event, site)) throw createError({ statusCode: 403, statusMessage: 'This site is private' })
}

/** The bits of a closed site its gate screen shows: name, photo, colours, language */
export function gatedBioPage(page: { username: string; title: string | null; avatarUrl: string | null; templateId: string; themeConfig: any }, gate: SiteGate) {
  const theme = page.themeConfig ?? {}
  return {
    username: page.username,
    title: page.title,
    bio: null,
    avatarUrl: page.avatarUrl,
    templateId: page.templateId,
    themeConfig: { colors: theme.colors, background: theme.background, language: theme.language },
    blocks: [],
    gate,
  }
}
