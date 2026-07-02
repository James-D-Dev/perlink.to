import { LinkRepository } from '../../repositories/linkRepository'
import { z } from 'zod'

const bodySchema = z.object({
  linkIds: z.array(z.string()),
  tagIds: z.array(z.string())
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

  const linkRepo = new LinkRepository(event)

  try {
    // Add tags to all specified links
    for (const linkId of body.data.linkIds) {
      // Verify link belongs to user
      const link = await linkRepo.findById(linkId)
      if (!link || link.user_id !== user.id) {
        continue // Skip links that don't belong to user
      }

      // Add each tag
      for (const tag of body.data.tagIds) {
        await linkRepo.addTag(link.short_code, tag)
      }
    }

    return {
      success: true,
      message: 'Tags added successfully'
    }
  } catch (error: any) {
    throw createError({
      status: 500,
      statusText: error.message || 'Failed to add tags',
    })
  }
})
