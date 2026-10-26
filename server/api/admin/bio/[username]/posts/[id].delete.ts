import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'

export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  await getDB(event).prepare('DELETE FROM posts WHERE id = ? AND bio_page_id = ?').bind(getRouterParam(event, 'id'), site.id).run()
  return { success: true }
})
