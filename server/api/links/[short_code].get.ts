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
      const data = await linkRepo.findByShortCode(shortCode)

      if (!data) {
        return {
          success: false,
          message: 'Link not found'
        }
      }

      return {
        success: true,
        data: {
          id: data.id,
          content: data.content,
          type: data.type,
          meta: data.meta,
          is_public: data.is_public,
          tags: data.tags,
          created_at: data.created_at,
          updated_at: data.updated_at,
          click_count: data.click_count,
          short_code: data.short_code,
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Failed to fetch link'
      }
    }
  })