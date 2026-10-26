import { getDB } from '../../../utils/db'
import { BioRepository } from '../../../repositories/bioRepository'
import type { PostRow } from '../../../utils/posts'
import { autoExcerpt, parsePostDoc, postText, renderPostHtml } from '#shared/postContent'

const xml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// The body goes in CDATA; a "]]>" inside it would end that early
const cdata = (value: string) => `<![CDATA[${value.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`

// RSS for a site's blog: perlink.to/<site>/blog/rss.xml (newest 30 posts)
export default defineEventHandler(async (event) => {
  const site = await new BioRepository(event).findByUsername(getRouterParam(event, 'username') ?? '')
  if (!site || !site.isPublished) throw createError({ statusCode: 404, statusMessage: 'Not found' })
  const { results } = await getDB(event)
    .prepare(`SELECT * FROM posts WHERE bio_page_id = ? AND status = 'published' ORDER BY published_at DESC LIMIT 30`)
    .bind(site.id)
    .all<PostRow>()
  const base = `https://perlink.to/${site.username}/blog`
  const items = (results ?? []).map((post) => {
    const doc = parsePostDoc(post.content)
    const link = `${base}/${encodeURIComponent(post.slug)}`
    return `<item>
<title>${xml(post.title)}</title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<pubDate>${new Date(post.published_at ?? post.created_at).toUTCString()}</pubDate>
<description>${xml(post.excerpt || autoExcerpt(postText(doc)))}</description>
<content:encoded>${cdata(renderPostHtml(doc))}</content:encoded>
</item>`
  })
  setResponseHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, max-age=600')
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>${xml(site.title || site.username)}</title>
<link>${base}</link>
<description>${xml(site.bio || site.title || site.username)}</description>
${items.join('\n')}
</channel>
</rss>`
})
