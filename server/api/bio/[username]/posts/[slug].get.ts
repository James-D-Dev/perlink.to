import { getDB } from '../../../../utils/db'
import { BioRepository } from '../../../../repositories/bioRepository'
import { blogSite, toPostForReader, type PostRow } from '../../../../utils/posts'
import { autoExcerpt, parsePostDoc, postText } from '#shared/postContent'

// One published post, with its body as safe HTML, and the posts either side
export default defineEventHandler(async (event) => {
  const site = await new BioRepository(event).findByUsername(getRouterParam(event, 'username') ?? '')
  if (!site || !site.isPublished) throw createError({ statusCode: 404, statusMessage: 'Site not found' })
  const db = getDB(event)
  const row = await db
    .prepare(`SELECT * FROM posts WHERE bio_page_id = ? AND slug = ? AND status = 'published'`)
    .bind(site.id, getRouterParam(event, 'slug'))
    .first<PostRow>()
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  const [newer, older] = await Promise.all([
    db.prepare(`SELECT slug, title FROM posts WHERE bio_page_id = ? AND status = 'published' AND published_at > ? ORDER BY published_at ASC LIMIT 1`).bind(site.id, row.published_at).first<{ slug: string; title: string }>(),
    db.prepare(`SELECT slug, title FROM posts WHERE bio_page_id = ? AND status = 'published' AND published_at < ? ORDER BY published_at DESC LIMIT 1`).bind(site.id, row.published_at).first<{ slug: string; title: string }>(),
  ])
  return {
    site: await blogSite(event, site),
    post: { ...toPostForReader(row), excerpt: row.excerpt || autoExcerpt(postText(parsePostDoc(row.content))) },
    newer,
    older,
  }
})
