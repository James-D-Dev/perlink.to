// Domain router for sites' own domains (Cloudflare for SaaS).
//
// Requests for a customer domain (e.g. www.myshop.com) reach this Worker
// through the "*/*" route on the perlink.to zone. It forwards them to
// perlink.to with the original hostname and a shared secret, and the app
// renders that domain's site. perlink.to's own traffic passes straight
// through. Setup: docs/custom-domains.md

interface Env {
  /** Same value as NUXT_DOMAIN_PROXY_SECRET on the Pages project */
  DOMAIN_PROXY_SECRET: string
  /** Where the app lives, default https://perlink.to */
  APP_ORIGIN?: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const host = url.hostname.toLowerCase()

    // Our own hostnames are served by Pages as usual
    if (host === 'perlink.to' || host.endsWith('.perlink.to') || host.endsWith('.pages.dev')) {
      return fetch(request)
    }

    const origin = env.APP_ORIGIN || 'https://perlink.to'
    const target = new URL(url.pathname + url.search, origin)
    const headers = new Headers(request.headers)
    headers.set('x-perlink-domain', host)
    headers.set('x-perlink-proxy', env.DOMAIN_PROXY_SECRET)
    headers.delete('host')

    // Redirects (to perlink.to pages, or when the domain isn't active) go to the visitor as they are
    return fetch(target.toString(), {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
      redirect: 'manual',
    })
  },
}
