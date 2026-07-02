import { ProfileRepository } from "../../repositories/profileRepository";

export default defineEventHandler(async (event) => {
  const { email, password, username } = (await readBody(event)) as {
    email: string;
    password: string;
    username?: string;
  };

  if (!email || !password) {
    throw createError({
      status: 400,
      statusText: "Email and password are required"
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createError({
      status: 400,
      statusText: "Invalid email format"
    });
  }

  // Validate username if provided
  if (username) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      throw createError({
        status: 400,
        statusText: "Username must be 3-20 characters and contain only letters, numbers, and underscores"
      });
    }
  }

  const profileRepo = new ProfileRepository(event);

  try {
    // Check if email already exists
    const existingProfile = await profileRepo.findByEmail(email);
    if (existingProfile) {
      throw createError({
        status: 409,
        statusText: "Email already registered"
      });
    }

    // Check if username already exists
    if (username) {
      const existingUsername = await profileRepo.findByUsername(username);
      if (existingUsername) {
        throw createError({
          status: 409,
          statusText: "Username already taken"
        });
      }
    }

    // Create new profile
    const userId = crypto.randomUUID();
    const profile = await profileRepo.upsert({
      id: userId,
      email: email,
      username: username || email.split("@")[0],
    });

    // TODO: Hash password and store it
    // For now, we're not storing passwords (placeholder implementation)

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
        username: profile.username || null,
      },
    });

    return {
      success: true,
      user: {
        id: profile.id,
        email: profile.email,
        username: profile.username || null,
      },
    };
  } catch (error: any) {
    if (error.status) {
      throw error;
    }
    throw createError({
      status: 500,
      statusText: error.message || "Registration failed"
    });
  }
});
