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

  // Only the owner may delete a link
  const user = event.context.user
  const link = await linkRepo.findByShortCode(shortCode)
  if (!link) {
    return { success: false, message: 'Link not found' }
  }
  if (!user || link.user_id !== user.id) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

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