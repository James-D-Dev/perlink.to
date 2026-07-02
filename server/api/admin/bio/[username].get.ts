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

  const bioRepo = new BioRepository(event)
  const bioPage = await bioRepo.findByUsername(username)

  // Check if bio exists and belongs to current user
  if (!bioPage) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Bio page not found'
    })
  }

  if (bioPage.userId !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }

  return {
    success: true,
    bioPage
  }
})
