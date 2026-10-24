import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/inbox'

export default defineEventHandler(async (event) => {
  const bioPage = await requireOwnedSite(event)
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Invalid request' })

  await getDB(event)
    .prepare('DELETE FROM form_submissions WHERE id = ? AND bio_page_id = ?')
    .bind(id, bioPage.id)
    .run()
  return { success: true }
})
