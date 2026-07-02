import { LinkRepository } from '../../repositories/linkRepository'

export default defineEventHandler(async (event) => {
  const shortCode = getRouterParam(event, 'short_code')

  if (!shortCode) {
    return {
      success: false,
      message: 'Short code is required'
    }
  }

  const linkRepo = new LinkRepository(event)
  
  try {
    const result = await linkRepo.delete(shortCode)

    if (!result) {
      return {
        success: false,
        message: 'Failed to delete link'
      }
    }

    return {
      success: true,
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to delete link'
    }
  }
})