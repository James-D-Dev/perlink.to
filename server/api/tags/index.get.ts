import { LinkRepository } from '../../repositories/linkRepository'

export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({
      status: 401,
      statusText: 'Unauthorized',
    })
  }

  const linkRepo = new LinkRepository(event)

  try {
    // Get all links for user and extract unique tags
    const { links } = await linkRepo.findByUserId(user.id, {
      page: 0,
      perPage: 10000 // Get all links
    })

    // Extract unique tags from all links
    const tagSet = new Set<string>()
    links.forEach(link => {
      if (link.tags && Array.isArray(link.tags)) {
        link.tags.forEach(tag => tagSet.add(tag))
      }
    })

    return {
      success: true,
      data: Array.from(tagSet)
    }
  } catch (error: any) {
    throw createError({
      status: 500,
      statusText: error.message || 'Failed to fetch tags',
    })
  }
})
