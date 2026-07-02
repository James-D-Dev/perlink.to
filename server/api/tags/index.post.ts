import { LinkRepository } from '../../repositories/linkRepository'
import { tagValidate } from '../../services/Validate'
import { z } from 'zod'

const bodySchema = z.object({
  links: z.array(z.string()), // link IDs
  text: z.string()
})

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({
      status: 401,
      statusText: 'Unauthorized',
    })
  }

  const body = await readValidatedBody(event, (body) => bodySchema.safeParse(body))

  if (!body.success) {
    throw createError({
      status: 400,
      statusText: 'Invalid request body',
    })
  }

  // Validate tag text
  const validation = tagValidate(body.data.text)
  if (!validation.success) {
    throw createError({
      status: 400,
      statusText: validation.message,
    })
  }

  const linkRepo = new LinkRepository(event)
  const tag = body.data.text.trim()

  try {
    // Add tag to all specified links
    for (const linkId of body.data.links) {
      // Verify link belongs to user
      const link = await linkRepo.findById(linkId)
      if (!link || link.user_id !== user.id) {
        continue // Skip links that don't belong to user
      }

      await linkRepo.addTag(link.short_code, tag)
    }

    return {
      success: true,
      data: { id: tag }
    }
  } catch (error: any) {
    throw createError({
      status: 500,
      statusText: error.message || 'Failed to create tag',
    })
  }
})
