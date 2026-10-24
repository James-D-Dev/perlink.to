import type { H3Event } from 'h3'
import { BioRepository } from '../repositories/bioRepository'

/** The signed-in owner's site, or a 401/403/404 error */
export async function requireOwnedSite(event: H3Event) {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const username = getRouterParam(event, 'username')
  const bioPage = username ? await new BioRepository(event).findByUsername(username) : null
  if (!bioPage) throw createError({ statusCode: 404, statusMessage: 'Site not found' })
  if (bioPage.userId !== user.id) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  return bioPage
}
