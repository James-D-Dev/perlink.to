import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'
import { uniqueSlug } from '../../../../../utils/posts'

// A new, empty draft; the editor opens it
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const id = crypto.randomUUID()
  const slug = await uniqueSlug(event, site.id, `draft-${id.slice(0, 6)}`)
  await getDB(event).prepare('INSERT INTO posts (id, bio_page_id, slug) VALUES (?, ?, ?)').bind(id, site.id, slug).run()
  return { id }
})
