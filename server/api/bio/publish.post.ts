import { BioRepository } from '../../repositories/bioRepository'
import { requireThemeAllowed } from '../../utils/plan'
import { requireNotRemoved } from '../../utils/moderation'

export default defineEventHandler(async (event) => {
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const bioRepo = new BioRepository(event)
  const existing = await bioRepo.findByUserId(user.id)

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Bio page not found'
    })
  }

  await requireNotRemoved(event, existing.id)
  await requireThemeAllowed(event, user.id, (existing.draft?.themeConfig ?? existing.themeConfig) as { presetId?: string }, existing.isPublished ? existing.themeConfig as { presetId?: string } : null)
  const bioPage = await bioRepo.publish(existing.id)

  return {
    success: true,
    bioPage
  }
})
