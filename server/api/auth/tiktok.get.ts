// Sign in with TikTok. nuxt-auth-utils reads NUXT_OAUTH_TIKTOK_CLIENT_KEY and
// NUXT_OAUTH_TIKTOK_CLIENT_SECRET. TikTok gives no email, so the account is
// known by its open_id only.
export default defineOAuthTikTokEventHandler({
  config: {
    scope: ['user.info.basic'],
    // Sandbox (PKCE) only when the app's TikTok keys are sandbox keys
    sandbox: process.env.NUXT_OAUTH_TIKTOK_SANDBOX === '1',
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
})
