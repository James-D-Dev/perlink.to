import { getDB } from '../../../../utils/db'
import { BioRepository } from '../../../../repositories/bioRepository'
import { blogSite, toPostSummary, type PostRow } from '../../../../utils/posts'
import { autoExcerpt, parsePostDoc, postText } from '#shared/postContent'

// A live site's published posts, newest first (?limit= for the "latest posts" block)
export default defineEventHandler(async (event) => {
  const site = await new BioRepository(event).findByUsername(getRouterParam(event, 'username') ?? '')
  if (!site || !site.isPublished) throw createError({ statusCode: 404, statusMessage: 'Site not found' })
  const limit = Math.min(Math.max(Number(getQuery(event).limit) || 50, 1), 100)
  const { results } = await getDB(event)
    .prepare(`SELECT * FROM posts WHERE bio_page_id = ? AND status = 'published' ORDER BY published_at DESC LIMIT ?`)
    .bind(site.id, limit)
    .all<PostRow>()
  return {
    site: await blogSite(event, site),
    posts: (results ?? []).map(row => ({
      ...toPostSummary(row),
      excerpt: row.excerpt || autoExcerpt(postText(parsePostDoc(row.content))),
    })),
  }
})
