// Google One Tap Sign-in - Verify ID Token
// https://developers.google.com/identity/gsi/web/reference/js-reference

import { jwtVerify, createRemoteJWKSet } from 'jose'

const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs'

export default defineEventHandler(async (event) => {
  const { credential } = await readBody(event) as { credential: string }
  
  if (!credential) {
    throw createError({
      status: 400,
      statusText: 'Missing credential'
    })
  }

  // Get Google Client ID from env
  const clientId = process.env.NUXT_OAUTH_GOOGLE_CLIENT_ID
  if (!clientId) {
    throw createError({
      status: 500,
      statusText: 'Google Client ID not configured'
    })
  }

  try {
    // Fetch Google's public keys
    const JWKS = createRemoteJWKSet(new URL(GOOGLE_JWKS_URL))
    
    // Verify the JWT
    const { payload } = await jwtVerify(credential, JWKS, {
      issuer: ['https://accounts.google.com', 'accounts.google.com'],
      audience: clientId
    })
    
    // Type assertion for Google payload fields
    const googlePayload = payload as {
      email?: string
      email_verified?: boolean
      name?: string
      picture?: string
    }
    
    if (!googlePayload.email) {
      throw createError({
        status: 400,
        statusText: 'Invalid token or missing email'
      })
    }

    // Check if email is verified
    if (!googlePayload.email_verified) {
      throw createError({
        status: 403,
        statusText: 'Email not verified'
      })
    }

    console.log('[One Tap] Verified:', { email: googlePayload.email, name: googlePayload.name })

    // Get or create profile
    const { ProfileRepository } = await import('../../repositories/profileRepository')
    const profileRepo = new ProfileRepository(event)
    
    let profile = await profileRepo.findByEmail(googlePayload.email)
    
    if (!profile) {
      // Create new profile
      const userId = crypto.randomUUID()
      const email: string = googlePayload.email || 'user@example.com'
      const suggestedUsername = email.split('@')[0].toLowerCase()
      
      const existingUsername = await profileRepo.findByUsername(suggestedUsername)
      const finalUsername = existingUsername 
        ? `${suggestedUsername}_${Math.random().toString(36).substring(2, 6)}`
        : suggestedUsername

      profile = await profileRepo.upsert({
        id: userId,
        email: googlePayload.email,
        username: finalUsername,
        name: googlePayload.name,
        avatar: googlePayload.picture,
      })
      
      console.log('[One Tap] Created profile:', { id: profile.id })
    } else {
      // Update avatar/name if changed
      if (!profile.avatar && googlePayload.picture) {
        await profileRepo.upsert({
          id: profile.id,
          email: profile.email,
          username: profile.username,
          name: googlePayload.name || profile.name,
          avatar: googlePayload.picture,
        })
      }
      console.log('[One Tap] Existing profile:', { id: profile.id })
    }

    // Set session
    await startUserSession(event, {
      id: profile.id,
      email: (profile.email || googlePayload.email)!,
      username: profile.username,
      name: profile.name || googlePayload.name || null,
      avatar: profile.avatar || googlePayload.picture || null,
    })

    return { success: true, redirect: '/dashboard' }
    
  } catch (error: any) {
    console.error('[One Tap] Error:', error.message)
    throw createError({
      status: 401,
      statusText: 'Authentication failed'
    })
  }
})
