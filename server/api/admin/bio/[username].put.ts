import { BioRepository, DRAFT_FIELDS, editableBioPage, type BioDraft, type CreateBioPageInput } from '../../../repositories/bioRepository'

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

  const body = await readBody(event)
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

  try {
    const content: BioDraft = {}
    for (const field of DRAFT_FIELDS) {
      if (body[field] !== undefined) (content as any)[field] = body[field]
    }

    // A live site keeps showing its published version: drafts are stored
    // aside until "Publish". Unpublished sites are edited directly.
    if (body.draft === true && bioPage.isPublished) {
      const base: BioDraft = bioPage.draft ?? {
        title: bioPage.title,
        bio: bioPage.bio,
        avatarUrl: bioPage.avatarUrl,
        templateId: bioPage.templateId,
        themeConfig: bioPage.themeConfig,
        blocks: bioPage.blocks,
      }
      try {
        await bioRepo.saveDraft(bioPage.id, { ...base, ...content })
        const saved = await bioRepo.findById(bioPage.id)
        return { success: true, bioPage: editableBioPage(saved!) }
      } catch (error) {
        // Before migration 0021 there's no draft column: save directly
        console.error('[PUT /api/admin/bio/:username] draft not saved, writing live', error)
      }
    }

    const updated = await bioRepo.update(bioPage.id, content as Partial<CreateBioPageInput>)
    if (bioPage.draft) await bioRepo.clearDraft(bioPage.id)

    return {
      success: true,
      bioPage: editableBioPage({ ...updated, draft: null })
    }
  } catch (error: any) {
    console.error('[PUT /api/admin/bio/:username]', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to update bio page'
    })
  }
})
