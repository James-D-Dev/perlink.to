import type { H3Event } from 'h3'
import { getQuery } from 'h3'
import { getDB } from './db'
import { ProfileRepository } from '../repositories/profileRepository'

export interface SocialAccount {
  provider: 'facebook' | 'tiktok'
  /** The provider's id for the user (Facebook app-scoped id, TikTok open_id) */
  id: string
  /** Only when the provider vouches for it (Facebook returns confirmed emails only) */
  email?: string | null
  name?: string | null
  avatar?: string | null
}

/** A free username from a name or email: letters, digits and underscores */
async function freeUsername(repo: ProfileRepository, seed: string) {
  const base = seed
    .normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd')
    .toLowerCase().replace(/[^a-z0-9_]+/g, '').slice(0, 20) || 'user'
  if (!(await repo.findByUsername(base))) return base
  for (let i = 0; i < 5; i++) {
    const name = `${base}_${Math.random().toString(36).slice(2, 6)}`
    if (!(await repo.findByUsername(name))) return name
  }
  return `${base}_${crypto.randomUUID().slice(0, 8)}`
}

/**
 * Sign in with a Facebook or TikTok account: the profile it's linked to, else
 * the profile with its (confirmed) email, which it's then linked to, else a
 * new profile. Ends with a redirect, like the Google sign-in.
 */
export async function signInWithSocial(event: H3Event, account: SocialAccount) {
  const db = getDB(event)
  const repo = new ProfileRepository(event)
  const email = account.email?.trim().toLowerCase() || null

  const linked = await db
    .prepare('SELECT user_id FROM auth_accounts WHERE provider = ? AND provider_user_id = ?')
    .bind(account.provider, account.id)
    .first<{ user_id: string }>()
  let profile = linked ? await repo.findById(linked.user_id) : null
  // Linked to an account that has since been deleted: start again
  if (linked && !profile) {
    await db.prepare('DELETE FROM auth_accounts WHERE provider = ? AND provider_user_id = ?').bind(account.provider, account.id).run()
  }

  if (!profile && email) profile = await repo.findByEmail(email)
  if (!profile) {
    profile = await repo.upsert({
      id: crypto.randomUUID(),
      email,
      username: await freeUsername(repo, email?.split('@')[0] || account.name || account.provider),
      name: account.name || null,
      avatar: account.avatar || null,
    })
    console.log(`[OAuth] ${account.provider}: new profile`, { id: profile.id })
  }
  if (!linked || linked.user_id !== profile.id) {
    await db
      .prepare('INSERT OR REPLACE INTO auth_accounts (provider, provider_user_id, user_id, email) VALUES (?, ?, ?, ?)')
      .bind(account.provider, account.id, profile.id, email)
      .run()
  }

  await startUserSession(event, {
    id: profile.id,
    email: profile.email,
    username: profile.username,
    name: profile.name || account.name || null,
    avatar: profile.avatar || account.avatar || null,
  })

  const redirect = getQuery(event).redirect
  const path = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/dashboard'
  return sendRedirect(event, path, 302)
}

/** Shared failure: back to the sign-in page with a message it knows */
export function socialLoginFailed(event: H3Event, provider: string, error: unknown) {
  console.error(`[OAuth] ${provider} error:`, (error as any)?.message ?? error)
  return sendRedirect(event, `/login?error=${provider}_failed`, 302)
}
