import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'
import { toPostSummary, type PostRow } from '../../../../../utils/posts'

// The site's posts for the dashboard: drafts and published, newest first
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const { results } = await getDB(event)
    .prepare('SELECT * FROM posts WHERE bio_page_id = ? ORDER BY COALESCE(published_at, created_at) DESC')
    .bind(site.id)
    .all<PostRow>()
  return { posts: (results ?? []).map(toPostSummary) }
})
