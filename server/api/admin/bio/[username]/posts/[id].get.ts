import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'
import { toPostForEditor, type PostRow } from '../../../../../utils/posts'

export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const row = await getDB(event).prepare('SELECT * FROM posts WHERE id = ? AND bio_page_id = ?').bind(getRouterParam(event, 'id'), site.id).first<PostRow>()
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  return { post: toPostForEditor(row) }
})
