import { LinkRepository } from '../../repositories/linkRepository'
import { z } from 'zod'

const bodySchema = z.object({
  shortCode: z.string()
})

export default defineEventHandler(async (event) => {
  const body = await readValidatedBody(event, (body) => bodySchema.safeParse(body))
  
  if (!body.success) {
    throw createError({
      status: 400,
      statusText: 'Invalid request'
    })
  }

  const linkRepo = new LinkRepository(event)
  
  try {
    // Track the click - increment click count
    const link = await linkRepo.findByShortCode(body.data.shortCode)
    
    if (!link) {
      return { success: false, message: 'Link not found' }
    }

    // Only track if link is public and active
    if (!link.is_public || !link.is_active) {
      return { success: false, message: 'Link is not accessible' }
    }

    // Increment click count
    await linkRepo.incrementClickCount(link.id)
    
    return { success: true }
  } catch (error: any) {
    return { 
      success: false, 
      message: error.message || 'Failed to track click' 
    }
  }
})
