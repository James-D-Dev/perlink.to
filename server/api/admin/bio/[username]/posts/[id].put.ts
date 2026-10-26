import { z } from 'zod'
import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'
import { requirePostRoom, toPostForEditor, uniqueSlug, type PostRow } from '../../../../../utils/posts'
import { autoExcerpt, parsePostDoc, postText, readingMinutes, slugify } from '#shared/postContent'

const bodySchema = z.object({
  title: z.string().max(200).optional(),
  excerpt: z.string().max(300).nullable().optional(),
  coverUrl: z.string().url().max(1000).nullable().optional(),
  content: z.unknown().optional(),
  slug: z.string().max(80).optional(),
  status: z.enum(['draft', 'published']).optional(),
})

// Save a post (autosave and Publish / Unpublish). Publishing counts toward
// the plan's post limit; the first publish sets the date.
export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const db = getDB(event)
  const id = getRouterParam(event, 'id')!
  const row = await db.prepare('SELECT * FROM posts WHERE id = ? AND bio_page_id = ?').bind(id, site.id).first<PostRow>()
  if (!row) throw createError({ statusCode: 404, statusMessage: 'Post not found' })
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Check the post details' })
  const input = body.data

  const title = input.title !== undefined ? input.title.trim() : row.title
  const doc = input.content !== undefined ? parsePostDoc(input.content) : parsePostDoc(row.content)
  const content = JSON.stringify(doc)
  if (content.length > 500_000) throw createError({ statusCode: 413, statusMessage: 'This post is too long' })
  const text = postText(doc)
  const excerpt = input.excerpt !== undefined ? (input.excerpt?.trim() || null) : row.excerpt
  const coverUrl = input.coverUrl !== undefined ? input.coverUrl : row.cover_url
  const status = input.status ?? row.status

  // The address: what the owner typed, or from the title while it's a draft
  let slug = row.slug
  if (input.slug !== undefined && input.slug.trim()) slug = await uniqueSlug(event, site.id, slugify(input.slug), id)
  else if (status === 'draft' && row.status === 'draft' && title && row.slug.startsWith('draft-')) slug = await uniqueSlug(event, site.id, slugify(title), id)

  if (status === 'published' && row.status !== 'published') {
    if (!title) throw createError({ statusCode: 400, statusMessage: 'Give the post a title before publishing' })
    await requirePostRoom(event, site.userId)
    if (row.slug.startsWith('draft-') && input.slug === undefined) slug = await uniqueSlug(event, site.id, slugify(title), id)
  }
  const publishedAt = status === 'published' ? (row.published_at ?? new Date().toISOString()) : row.published_at

  await db
    .prepare(`UPDATE posts SET title = ?, excerpt = ?, cover_url = ?, content = ?, slug = ?, status = ?, reading_minutes = ?, published_at = ?, updated_at = datetime('now') WHERE id = ?`)
    .bind(title, excerpt, coverUrl, content, slug, status, readingMinutes(text), publishedAt, id)
    .run()
  const saved = (await db.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first<PostRow>())!
  return { post: { ...toPostForEditor(saved), autoExcerpt: autoExcerpt(text) } }
})
