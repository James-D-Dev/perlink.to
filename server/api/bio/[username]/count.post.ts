import { BioRepository } from '../../../repositories/bioRepository'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  const body = await readBody(event)

  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username is required'
    })
  }

  if (!body.linkId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Link ID is required'
    })
  }

  // type: 'link' | 'social' (default: 'link')
  const type: 'link' | 'social' = body.type === 'social' ? 'social' : 'link'

  try {
    const bioRepo = new BioRepository(event)
    const bioPage = await bioRepo.findByUsername(username)

    if (!bioPage) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bio page not found'
      })
    }

    // Increment specific link or social click count (non-blocking)
    const incrementCount = async () => {
      try {
        if (type === 'social') {
          await bioRepo.incrementSocialClick(bioPage.id, body.linkId)
        } else {
          await bioRepo.incrementLinkClick(bioPage.id, body.linkId)
        }
      } catch (e) {
        // Silent fail — never block the response
        console.error('Failed to increment click count:', e)
      }
    }

    // Use waitUntil if available (Cloudflare Workers), otherwise await
    const cfContext = event.context.cloudflare?.context
    if (cfContext?.waitUntil) {
      cfContext.waitUntil(incrementCount())
    } else {
      await incrementCount()
    }

    return {
      success: true,
      message: 'Click counted successfully'
    }
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: e?.message || 'Failed to count click'
    })
  }
})
