import { z } from 'zod'
import { getDB } from '../../../../utils/db'
import { requireOwnedSite } from '../../../../utils/ownedSite'
import { cleanGuestName, guestKey } from '../../../../utils/guests'

const bodySchema = z.object({
  id: z.string().min(1).max(64),
  name: z.string().min(1).max(200).optional(),
  side: z.enum(['groom', 'bride']).nullable().optional(),
})

// Renames a guest or moves them to the other family's side
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Bad request' })
  const db = getDB(event)
  if (body.data.name !== undefined) {
    const name = cleanGuestName(body.data.name)
    if (!name) throw createError({ statusCode: 400, statusMessage: 'Name is required' })
    await db.prepare('UPDATE site_guests SET name = ?, name_key = ? WHERE id = ? AND bio_page_id = ?')
      .bind(name, guestKey(name), body.data.id, site.id).run()
      .catch(() => { throw createError({ statusCode: 409, statusMessage: 'This guest is already on the list' }) })
  }
  if (body.data.side !== undefined) {
    await db.prepare('UPDATE site_guests SET side = ? WHERE id = ? AND bio_page_id = ?').bind(body.data.side, body.data.id, site.id).run()
  }
  return { ok: true }
})
