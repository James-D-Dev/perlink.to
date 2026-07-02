import { BioRepository } from '../../../../repositories/bioRepository'

export default defineEventHandler(async (event) => {
  // Check auth
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  const username = getRouterParam(event, 'username')
  
  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username required'
    })
  }

  const bioRepo = new BioRepository(event)
  
  // Find bio by username
  const bioPage = await bioRepo.findByUsername(username)
  
  if (!bioPage) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Bio page not found'
    })
  }
  
  // Check ownership
  if (bioPage.userId !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }

  try {
    // Publish bio
    const updated = await bioRepo.publish(bioPage.id)

    return {
      success: true,
      bioPage: updated
    }
  } catch (error: any) {
    console.error('[POST /api/admin/bio/:username/publish]', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to publish bio page'
    })
  }
})
