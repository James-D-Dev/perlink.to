// Sign in with TikTok. nuxt-auth-utils reads NUXT_OAUTH_TIKTOK_CLIENT_KEY and
// NUXT_OAUTH_TIKTOK_CLIENT_SECRET. TikTok gives no email, so the account is
// known by its open_id only. The handler sends no CSRF state, so the first
// step (off to TikTok) is ours, with one (withOAuthState).
import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'

const SCOPE = ['user.info.basic']

export default withOAuthState('tiktok', defineOAuthTikTokEventHandler({
  config: {
    scope: [...SCOPE],
  },
  async onSuccess(event, { user }) {
    try {
      return await signInWithSocial(event, {
        provider: 'tiktok',
        id: String(user.open_id),
        name: user.display_name,
        avatar: user.avatar_large_url || user.avatar_url,
      })
    } catch (error) {
      return socialLoginFailed(event, 'tiktok', error)
    }
  },
  onError(event, error) {
    return socialLoginFailed(event, 'tiktok', error)
  },
}), (event: H3Event, state: string) => {
  const { clientKey, sandbox } = useRuntimeConfig(event).oauth?.tiktok ?? {}
  if (!clientKey) {
    console.error('[OAuth] tiktok error: NUXT_OAUTH_TIKTOK_CLIENT_KEY is not set')
    return '/login?error=tiktok_failed'
  }
  const self = getRequestURL(event)
  const url = new URL('https://www.tiktok.com/v2/auth/authorize/')
  url.search = new URLSearchParams({
    response_type: 'code',
    client_key: clientKey,
    redirect_uri: `${self.protocol}//${self.host}${self.pathname}`,
    scope: SCOPE.join(','),
    state,
    // Sandbox apps need PKCE; the handler checks the same fixed verifier
    ...sandbox ? { code_challenge: createHash('sha256').update('verify').digest('hex'), code_challenge_method: 'S256' } : {},
  }).toString()
  return url.toString()
})
