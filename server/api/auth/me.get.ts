import { ProfileRepository } from '../../repositories/profileRepository'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)

  if (!session.user) {
    throw createError({
      status: 401,
      statusText: 'Not authenticated'
    })
  }

  const user = session.user

  // Fetch full profile data
  const profileRepo = new ProfileRepository(event)
  
  try {
    const profile = await profileRepo.findById(user.id)

    if (!profile) {
      throw createError({
        status: 404,
        statusText: 'Profile not found'
      })
    }

    return {
      success: true,
      data: {
        id: profile.id,
        email: profile.email,
        username: profile.username,
        tags: profile.tags,
        created_at: profile.created_at
      }
    }
  } catch (error: any) {
    throw createError({
      status: 500,
      statusText: error.message || 'Failed to fetch user'
    })
  }
})
