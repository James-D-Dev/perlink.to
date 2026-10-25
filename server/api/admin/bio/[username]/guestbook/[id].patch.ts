import { z } from 'zod'
import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'

// Hide or show a guestbook entry in the room
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const body = z.object({ hidden: z.boolean() }).safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Invalid request' })
  await getDB(event)
    .prepare('UPDATE guestbook_entries SET hidden = ? WHERE id = ? AND bio_page_id = ?')
    .bind(body.data.hidden ? 1 : 0, getRouterParam(event, 'id'), site.id)
    .run()
  return { success: true }
})
