import { BioRepository } from '../../../repositories/bioRepository'

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

  const body = await readBody(event)
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
    // Update bio
    const updated = await bioRepo.update(bioPage.id, {
      title: body.title,
      bio: body.bio,
      avatarUrl: body.avatarUrl,
      templateId: body.templateId,
      themeConfig: body.themeConfig,
      blocks: body.blocks,
    })

    return {
      success: true,
      bioPage: updated
    }
  } catch (error: any) {
    console.error('[PUT /api/admin/bio/:username]', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to update bio page'
    })
  }
})
