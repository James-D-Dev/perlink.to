import { BioRepository } from '../../repositories/bioRepository'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const bioRepo = new BioRepository(event)
  const existing = await bioRepo.findByUserId(user.id)

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Bio page not found'
    })
  }

  const bioPage = await bioRepo.publish(existing.id)

  return {
    success: true,
    bioPage
  }
})
