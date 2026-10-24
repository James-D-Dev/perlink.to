import { BioRepository } from '../../../repositories/bioRepository'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')

  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username is required'
    })
  }

  const bioRepo = new BioRepository(event)
  const bioPage = await bioRepo.findByUsername(username)

  if (!bioPage) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Bio page not found'
    })
  }

  return {
    links: bioPage.linkAnalytics.links,
    social: bioPage.linkAnalytics.social,
    actions: bioPage.linkAnalytics.actions ?? {}
  }
})
