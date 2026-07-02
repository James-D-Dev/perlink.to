import { BioRepository } from '../../repositories/bioRepository'

export default defineEventHandler(async (event) => {
  // Check auth
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const bioRepo = new BioRepository(event)
  
  try {
    // Get all bio pages for this user
    const bioPages = await bioRepo.findAllByUserId(user.id)

    return {
      success: true,
      bioPages
    }
  } catch (error: any) {
    console.error('[GET /api/admin/bios]', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to fetch bio pages'
    })
  }
})
