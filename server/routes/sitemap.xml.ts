import { PAGE_TEMPLATES } from '../../app/data/pageTemplates'
import { USE_CASE_PAIRS } from '../../app/data/useCases'
import { getDB } from '../utils/db'

const SITE = 'https://perlink.to'

/** Public marketing pages, then every published site and its blog posts */
const STATIC_PAGES = ['/', '/vi', '/templates', '/vi/templates', '/linktree-alternative', '/vi/thay-the-linktree', '/3d-portfolio', '/vi/portfolio-3d', ...USE_CASE_PAIRS.flat(), '/trends', '/pricing', '/terms', '/privacy', '/refund', '/cookie-notice']

/** Pages with an address per language, linked to each other (hreflang) */
const LANG_PAIRS: [string, string][] = [['/', '/vi'], ['/templates', '/vi/templates'], ['/linktree-alternative', '/vi/thay-the-linktree'], ['/3d-portfolio', '/vi/portfolio-3d'], ...USE_CASE_PAIRS]
function languages(path: string) {
  const pair = LANG_PAIRS.find(p => p.includes(path))
  if (!pair) return ''
  const [en, vi] = pair
  return `<xhtml:link rel="alternate" hreflang="en" href="${SITE}${en}"/><xhtml:link rel="alternate" hreflang="vi" href="${SITE}${vi}"/><xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${en}"/>`
}

/** Every template's preview page */
const TEMPLATE_IDS = PAGE_TEMPLATES.map(t => t.id)

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!)

export default defineEventHandler(async (event) => {
  let sites: { username: string; updated_at: string | null }[] = []
  let posts: { username: string; slug: string; updated_at: string | null }[] = []
  try {
    const result = await getDB(event)
      .prepare('SELECT username, updated_at FROM bio_pages WHERE is_published = 1 ORDER BY updated_at DESC LIMIT 5000')
      .all<{ username: string; updated_at: string | null }>()
    sites = result.results ?? []
    const postRows = await getDB(event)
      .prepare(`SELECT b.username, p.slug, p.updated_at FROM posts p JOIN bio_pages b ON b.id = p.bio_page_id
        WHERE p.status = 'published' AND b.is_published = 1 ORDER BY p.published_at DESC LIMIT 5000`)
      .all<{ username: string; slug: string; updated_at: string | null }>()
    posts = postRows.results ?? []
  } catch (error) {
    console.error('[sitemap] Failed to load published sites', error)
  }
  const lastmod = (value: string | null) => (value ? `<lastmod>${new Date(value).toISOString()}</lastmod>` : '')

  const urls = [
    ...STATIC_PAGES.map(path => `<url><loc>${SITE}${path}</loc>${languages(path)}</url>`),
    ...TEMPLATE_IDS.map(id => `<url><loc>${SITE}/templates/${escapeXml(encodeURIComponent(id))}</loc></url>`),
    ...sites.map(site => `<url><loc>${SITE}/${escapeXml(encodeURIComponent(site.username))}</loc>${lastmod(site.updated_at)}</url>`),
    ...[...new Set(posts.map(p => p.username))].map(username => `<url><loc>${SITE}/${escapeXml(encodeURIComponent(username))}/blog</loc></url>`),
    ...posts.map(post => `<url><loc>${SITE}/${escapeXml(encodeURIComponent(post.username))}/blog/${escapeXml(encodeURIComponent(post.slug))}</loc>${lastmod(post.updated_at)}</url>`),
  ]

  setResponseHeaders(event, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join('')}</urlset>\n`
})
