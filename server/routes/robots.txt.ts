// Crawl the public site and published pages; keep app areas out of search.
// /login stays crawlable so search engines can read its noindex and drop it
export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /dashboard',
    'Disallow: /superadmin',
    'Disallow: /api/',
    '',
    'Sitemap: https://perlink.to/sitemap.xml',
    '',
  ].join('\n')
})
