import { getDB } from '../utils/db'

const SITE = 'https://perlink.to'

/** Public marketing pages, then every published site */
const STATIC_PAGES = ['/', '/vi', '/trends', '/pricing', '/terms', '/privacy']

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!)

export default defineEventHandler(async (event) => {
  let sites: { username: string; updated_at: string | null }[] = []
  try {
    const result = await getDB(event)
      .prepare('SELECT username, updated_at FROM bio_pages WHERE is_published = 1 ORDER BY updated_at DESC LIMIT 5000')
      .all<{ username: string; updated_at: string | null }>()
    sites = result.results ?? []
  } catch (error) {
    console.error('[sitemap] Failed to load published sites', error)
  }

  const urls = [
    ...STATIC_PAGES.map(path => `<url><loc>${SITE}${path}</loc></url>`),
    ...sites.map((site) => {
      const lastmod = site.updated_at ? `<lastmod>${new Date(site.updated_at).toISOString()}</lastmod>` : ''
      return `<url><loc>${SITE}/${escapeXml(encodeURIComponent(site.username))}</loc>${lastmod}</url>`
    }),
  ]

  setResponseHeaders(event, {
    'Content-Type': 'application/xml; charset=utf-8',
    'Cache-Control': 'public, max-age=3600',
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>\n`
})
