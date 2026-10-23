import { getQuery } from 'h3'

// Note: nuxt-auth-utils automatically loads NUXT_OAUTH_GOOGLE_CLIENT_ID/SECRET from env

export default defineOAuthGoogleEventHandler({
  config: {
    scope: ['profile', 'email', 'openid'],
    // Optional: restrict to specific hosted domains
    // hostedDomain: 'yourcompany.com'
     authorizationParams: {
      prompt: 'select_account'
    }
  },
  async onSuccess(event, { user }) {
    try {
      // Validate Google user data
      if (!user.email) {
        console.error('[OAuth] Google user has no email')
        throw createError({
          status: 400,
          statusText: 'Email is required from Google account'
        })
      }

      // Check if email is verified by Google
      if (!user.email_verified) {
        console.error('[OAuth] Google email not verified:', user.email)
        throw createError({
          status: 403,
          statusText: 'Please verify your Google account email first'
        })
      }

      console.log('[OAuth] Google login success:', { email: user.email, name: user.name })

      // Get or create profile
      const { ProfileRepository } = await import('../../repositories/profileRepository')
      const profileRepo = new ProfileRepository(event)
      
      // Find or create user profile
      let profile = await profileRepo.findByEmail(user.email)
      
      if (!profile) {
        // Create new profile for first-time user
        const userId = crypto.randomUUID()
        const suggestedUsername = user.email.split('@')[0].toLowerCase()
        
        // Check if username exists, append random suffix if needed
        const existingUsername = await profileRepo.findByUsername(suggestedUsername)
        const finalUsername = existingUsername 
          ? `${suggestedUsername}_${Math.random().toString(36).substring(2, 6)}`
          : suggestedUsername

        profile = await profileRepo.upsert({
          id: userId,
          email: user.email,
          username: finalUsername,
          name: user.name,
          // Store additional Google info if needed
          avatar: user.picture,
        })
        
        console.log('[OAuth] Created new profile:', { id: profile.id, email: profile.email })
      } else {
        console.log('[OAuth] Existing profile found:', { id: profile.id, email: profile.email })
        // Update avatar if not set
        if (!profile.avatar && user.picture) {
          await profileRepo.upsert({
            id: profile.id,
            email: profile.email,
            username: profile.username,
            avatar: user.picture,
          })
          console.log('[OAuth] Updated avatar for existing profile')
        }
      }

      // Validate email exists before setting session
      if (!profile.email) {
        throw createError({
          status: 500,
          statusText: 'Profile email is missing after creation'
        })
      }

      // Set user session with secure cookie
      await setUserSession(event, {
        user: {
          id: profile.id,
          email: profile.email,
          username: profile.username || null,
          name: profile.name || user.name || null,
          avatar: user.picture || profile.avatar || null,
        } as any,
        // Session expires in 7 days
        maxAge: 60 * 60 * 24 * 7
      })

      // Get redirect path from query or default to dashboard
      const redirectPath = getQuery(event).redirect || '/dashboard'
      
      console.log('[OAuth] Redirecting to:', redirectPath)
      
      // Redirect to dashboard
      await sendRedirect(event, redirectPath as string, 302)
      
    } catch (error: any) {
      console.error('[OAuth] Success handler error:', error)
      
      // Determine appropriate error message
      const errorMessage = error.statusText || 'authentication_failed'
      await sendRedirect(event, `/login?error=${encodeURIComponent(errorMessage)}`, 302)
    }
  },
  
  async onError(event, error: any) {
    console.error('[OAuth] Google OAuth error:', {
      message: error?.message,
      status: error?.status,
      statusCode: error?.statusCode
    })
    
    // Always safe redirect (hide error details in production)
    await sendRedirect(event, '/login?error=oauth_failed', 302)
  }
})
