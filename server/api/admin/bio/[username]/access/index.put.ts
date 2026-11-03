import { z } from 'zod'
import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'
import { requirePlanFeature } from '../../../../../utils/plan'
import { hashPassword } from '../../../../../utils/siteAccess'

// Set or remove the site's password. It applies right away (not with the
// next publish); removing one never needs a plan.
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const body = z.object({ password: z.string().trim().min(4).max(100).nullable() }).safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Use at least 4 characters' })

  if (body.data.password) await requirePlanFeature(event, site.userId, 'protect')
  const hash = body.data.password ? await hashPassword(body.data.password) : null
  await getDB(event).prepare('UPDATE bio_pages SET access_hash = ? WHERE id = ?').bind(hash, site.id).run()
  return { success: true, hasPassword: !!hash }
})
