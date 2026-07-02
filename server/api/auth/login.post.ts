import { ProfileRepository } from "../../repositories/profileRepository";

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event) as {
    email: string;
    password: string;
  };

  if (!email || !password) {
    throw createError({
      status: 400,
      statusText: "Email and password are required"
    });
  }

  // TODO: Implement proper password hashing and verification
  // For now, this is a placeholder that accepts any password
  
  const profileRepo = new ProfileRepository(event)
  
  try {
    let profile = await profileRepo.findByEmail(email)
    
    // Auto-create profile if doesn't exist (for development)
    if (!profile) {
      const userId = crypto.randomUUID()
      profile = await profileRepo.upsert({
        id: userId,
        email: email,
        username: email.split('@')[0]
      })
    }

    // Validate email exists
    if (!profile.email) {
      throw createError({
        status: 400,
        statusText: "Profile email is missing"
      });
    }

    // Set user session using nuxt-auth-utils
    await setUserSession(event, {
      user: {
        id: profile.id,
        email: profile.email,
        username: profile.username || null
      }
    })

    return {
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        username: profile.username || null
      }
    }
  } catch (error: any) {
    throw createError({
      status: 500,
      statusText: error.message || "Login failed"
    });
  }
});
