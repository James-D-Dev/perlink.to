import { siteForDomain } from '../utils/customDomains'

// Requests for a site's own domain arrive through the domain-router Worker,
// which adds the original hostname and a shared secret. The home page then
// renders that site; other pages send visitors to perlink.to.
const PASS_THROUGH = /^\/(_nuxt|api|images|models|music|__nuxt|_ipx|favicon|web-app-manifest|apple-touch-icon|robots\.txt|sitemap\.xml)/

export default defineEventHandler(async (event) => {
  const hostname = getRequestHeader(event, 'x-perlink-domain')
  if (!hostname) return
  const secret = useRuntimeConfig(event).domainProxySecret
  if (!secret || getRequestHeader(event, 'x-perlink-proxy') !== secret) return

  const path = event.path.split('?')[0] ?? '/'
  if (PASS_THROUGH.test(path)) return

  const site = await siteForDomain(event, hostname.toLowerCase())
  if (!site) {
    return sendRedirect(event, 'https://perlink.to/', 302)
  }
  // The site's blog lives under its perlink.to address
  if (path === '/blog' || path.startsWith('/blog/')) {
    return sendRedirect(event, `https://perlink.to/${site.username}${path}`, 302)
  }
  if (path !== '/') {
    return sendRedirect(event, `https://perlink.to${path}`, 302)
  }
  event.context.customDomain = { hostname: hostname.toLowerCase(), username: site.username }
  // Never cache a domain's page under perlink.to's URL
  setResponseHeader(event, 'Cache-Control', 'private, no-store')
})
