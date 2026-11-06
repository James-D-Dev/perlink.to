import { z } from 'zod'
import { getDB } from '../../../../utils/db'
import { requireOwnedSite } from '../../../../utils/ownedSite'

const bodySchema = z.object({ ids: z.array(z.string().min(1).max(64)).min(1).max(2000) })

// Takes guests off the list
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Bad request' })
  const db = getDB(event)
  const statements = body.data.ids.map(id => db.prepare('DELETE FROM site_guests WHERE id = ? AND bio_page_id = ?').bind(id, site.id))
  for (let i = 0; i < statements.length; i += 50) await db.batch(statements.slice(i, i + 50))
  return { ok: true }
})
