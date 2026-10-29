// Sign in with Facebook. nuxt-auth-utils reads NUXT_OAUTH_FACEBOOK_CLIENT_ID
// and NUXT_OAUTH_FACEBOOK_CLIENT_SECRET. Facebook only returns an email the
// user has confirmed, and not every account has one. withOAuthState adds the
// CSRF state the handler doesn't.
export default withOAuthState('facebook', defineOAuthFacebookEventHandler({
  config: {
    scope: ['email', 'public_profile'],
    fields: ['id', 'name', 'email', 'picture.type(large)'],
  },
  async onSuccess(event, { user: raw }) {
    try {
      // The Graph API answers with Content-Type text/javascript, so the
      // handler's $fetch hands back the JSON as a string
      const user = typeof raw === 'string' ? JSON.parse(raw) : raw
      return await signInWithSocial(event, {
        provider: 'facebook',
        id: user?.id,
        email: user?.email,
        name: user?.name,
        avatar: user?.picture?.data?.is_silhouette ? null : user?.picture?.data?.url,
      })
    } catch (error) {
      return socialLoginFailed(event, 'facebook', error)
    }
  },
  onError(event, error) {
    return socialLoginFailed(event, 'facebook', error)
  },
}))
