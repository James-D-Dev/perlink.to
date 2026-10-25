import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'

// Delete a guestbook entry
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  await getDB(event)
    .prepare('DELETE FROM guestbook_entries WHERE id = ? AND bio_page_id = ?')
    .bind(getRouterParam(event, 'id'), site.id)
    .run()
  return { success: true }
})
