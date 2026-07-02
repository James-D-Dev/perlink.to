export default defineEventHandler((event) => {
  const url = event.path ?? ''

  if (url.startsWith('/_nuxt/') || url.startsWith('/api/')) {
    return
  }

  setResponseHeaders(event, {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'CDN-Cache-Control': 'no-store',
    'Cloudflare-CDN-Cache-Control': 'no-store',
    'Surrogate-Control': 'no-store',
  })
})
