import { z } from 'zod'
import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/inbox'

// Mark a request as read or unread
export default defineEventHandler(async (event) => {
  const bioPage = await requireOwnedSite(event)
  const id = getRouterParam(event, 'id')
  const body = z.object({ read: z.boolean() }).safeParse(await readBody(event))
  if (!id || !body.success) throw createError({ statusCode: 400, statusMessage: 'Invalid request' })

  await getDB(event)
    .prepare(`UPDATE form_submissions SET read_at = CASE WHEN ? THEN datetime('now') ELSE NULL END WHERE id = ? AND bio_page_id = ?`)
    .bind(body.data.read ? 1 : 0, id, bioPage.id)
    .run()
  return { success: true }
})
