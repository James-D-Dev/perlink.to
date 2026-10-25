import { BioRepository, type CreateBioPageInput } from '../../../../repositories/bioRepository'
import { requireThemeAllowed } from '../../../../utils/plan'
import { requireNotRemoved } from '../../../../utils/moderation'

export default defineEventHandler(async (event) => {
  // Check auth
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  const username = getRouterParam(event, 'username')
  
  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username required'
    })
  }

  const bioRepo = new BioRepository(event)
  
  // Find bio by username
  const bioPage = await bioRepo.findByUsername(username)
  
  if (!bioPage) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Bio page not found'
    })
  }
  
  // Check ownership
  if (bioPage.userId !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden'
    })
  }

  await requireNotRemoved(event, bioPage.id)
  // What goes live is the draft's theme, or the current one
  await requireThemeAllowed(event, user.id, (bioPage.draft?.themeConfig ?? bioPage.themeConfig) as { presetId?: string }, bioPage.isPublished ? bioPage.themeConfig as { presetId?: string } : null)

  try {
    // Publishing applies any saved draft to the live site
    if (bioPage.draft) {
      await bioRepo.update(bioPage.id, bioPage.draft as Partial<CreateBioPageInput>)
      await bioRepo.clearDraft(bioPage.id)
    }
    const updated = await bioRepo.publish(bioPage.id)

    return {
      success: true,
      bioPage: updated
    }
  } catch (error: any) {
    console.error('[POST /api/admin/bio/:username/publish]', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to publish bio page'
    })
  }
})
