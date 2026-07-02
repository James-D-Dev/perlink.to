import { BioRepository } from '../../repositories/bioRepository'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  try {
    const bioRepo = new BioRepository(event)
    const bioPage = await bioRepo.findByUserId(user.id)

    return {
      bioPage,
      exists: !!bioPage
    }
  } catch (e: any) {
    console.error('[GET /api/bio]', e)
    throw createError({
      statusCode: 500,
      statusMessage: e?.message ?? 'Internal server error',
    })
  }
})
