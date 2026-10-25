import { z } from 'zod'
import { BioRepository } from '../../../../repositories/bioRepository'
import { isReservedName } from '../../../../utils/reservedNames'

// Changes a site's perlink.to address. Analytics, domains and pictures are tied
// to the site's id, so they follow it; the old address simply stops working.
const schema = z.object({
  username: z.string().trim().toLowerCase().min(3).max(30).regex(/^[a-z0-9_-]+$/),
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const current = getRouterParam(event, 'username')
  const parsed = schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Use 3–30 lowercase letters, numbers, hyphens or underscores' })
  const next = parsed.data.username

  const bioRepo = new BioRepository(event)
  const bioPage = current ? await bioRepo.findByUsername(current) : null
  if (!bioPage) throw createError({ statusCode: 404, statusMessage: 'Bio page not found' })
  if (bioPage.userId !== user.id) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  if (next !== bioPage.username) {
    if (isReservedName(next)) throw createError({ statusCode: 400, statusMessage: 'This name is reserved' })
    if (!(await bioRepo.isUsernameAvailable(next))) throw createError({ statusCode: 409, statusMessage: 'This address is already taken' })
  }
  await bioRepo.rename(bioPage.id, next)
  return { success: true, username: next }
})
