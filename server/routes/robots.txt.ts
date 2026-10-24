// Crawl the public site and published pages; keep app areas out of search
export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /dashboard',
    'Disallow: /superadmin',
    'Disallow: /api/',
    'Disallow: /login',
    '',
    'Sitemap: https://perlink.to/sitemap.xml',
    '',
  ].join('\n')
})
