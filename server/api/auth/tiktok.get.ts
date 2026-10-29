// Sign in with TikTok. TikTok gives no email, so the account is known by its
// open_id only. The handler sends no CSRF state, so the first step (off to
// TikTok) is ours, with one (withOAuthState).
//
// Keys: NUXT_OAUTH_TIKTOK_CLIENT_KEY / _CLIENT_SECRET. With
// NUXT_OAUTH_TIKTOK_SANDBOX=true the sandbox app's keys are used instead
// (NUXT_OAUTH_TIKTOK_SANDBOX_CLIENT_KEY / _SANDBOX_CLIENT_SECRET): TikTok's
// app review wants the demo recorded in the sandbox.
import { createHash } from 'node:crypto'
import type { H3Event } from 'h3'

const SCOPE = ['user.info.basic']

function tiktokKeys(event: H3Event) {
  const config = useRuntimeConfig(event).oauth?.tiktok ?? {}
  // The env var arrives as a string on some hosts
  const sandbox = String(config.sandbox) === 'true'
  return {
    sandbox,
    clientKey: (sandbox ? config.sandboxClientKey : config.clientKey) as string | undefined,
    clientSecret: (sandbox ? config.sandboxClientSecret : config.clientSecret) as string | undefined,
  }
}

export default withOAuthState('tiktok', (event: H3Event) => {
  const keys = tiktokKeys(event)
  return defineOAuthTikTokEventHandler({
    config: { scope: [...SCOPE], ...keys },
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
  })(event)
}, (event, state) => {
  const { clientKey, sandbox } = tiktokKeys(event)
  if (!clientKey) {
    console.error(`[OAuth] tiktok error: no ${sandbox ? 'sandbox ' : ''}client key set`)
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
