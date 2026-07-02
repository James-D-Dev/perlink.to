import { LinkRepository } from '../repositories/linkRepository'
import { AnalyticsRepository } from '../repositories/analyticsRepository'
import { isBot, parseDevice, hashIP, parseReferrer, parseUTMParams, detectSourceType } from '../services/analytics'

/**
 * Middleware to handle s.perlink.to custom domain for shortlinks.
 * Directly handles shortlink redirect for s.perlink.to requests.
 * This allows: s.perlink.to/terrum → redirect to target URL
 */
export default defineEventHandler(async (event) => {
  const host = getRequestHeader(event, 'host') || ''
  const url = getRequestURL(event)
  const pathname = url.pathname

  // Only intercept requests on the shortlink subdomain
  if (host !== 's.perlink.to') return

  const slug = pathname.slice(1) // remove leading /

  // Root of s.perlink.to → redirect to main site
  if (!slug) {
    setResponseStatus(event, 301)
    setResponseHeader(event, 'Location', 'https://perlink.to')
    return ''
  }

  // Skip static assets and API routes
  if (slug.startsWith('_nuxt/') || slug.startsWith('api/') || slug.startsWith('__nuxt')) {
    return
  }

  // Handle shortlink — same logic as server/routes/s/[slug].get.ts
  const userAgent = getRequestHeader(event, 'user-agent') || ''
  const referer = getRequestHeader(event, 'referer') || null

  try {
    const linkRepo = new LinkRepository(event)
    const link = await linkRepo.findByShortCode(slug)

    if (!link || !link.content) {
      return sendRedirect(event, 'https://perlink.to', 302)
    }

    const rawContent = link.content
    const targetUrlStr = typeof rawContent === 'string'
      ? rawContent
      : (rawContent as any)?.url || (rawContent as any)?.href || null

    if (!targetUrlStr) {
      return sendRedirect(event, 'https://perlink.to', 302)
    }

    // Bot handling
    if (isBot(userAgent)) {
      const trackBotClick = async () => {
        try {
          const analyticsRepo = new AnalyticsRepository(event)
          const now = new Date().toISOString()
          const today = now.split('T')[0]
          const botName = userAgent.split('/')[0]?.toLowerCase() || 'bot'
          const botHash = `bot:${botName}:${today}`
          const isUnique = await analyticsRepo.isUniqueClick(link.id, botHash)
          if (!isUnique) return
          await analyticsRepo.createClickEvent({
            link_id: link.id,
            link_type: 'shortlink',
            timestamp: now,
            country: getRequestHeader(event, 'cf-ipcountry') || null,
            city: getRequestHeader(event, 'cf-ipcity') || null,
            device: 'Bot',
            os: 'Bot',
            browser: botName,
            referrer: parseReferrer(referer),
            referrer_full: referer,
            utm_source: null,
            utm_medium: null,
            utm_campaign: null,
            ip_hash: botHash,
            user_agent: userAgent,
            is_bot: true,
            is_unique: true,
            source_type: 'direct',
          })
        } catch (e) { /* silent */ }
      }
      const cfContext = event.context.cloudflare?.context
      if (cfContext?.waitUntil) {
        cfContext.waitUntil(trackBotClick())
      } else {
        await trackBotClick()
      }

      const meta = link.meta as Record<string, any> | null
      const title = meta?.title || 'Perlink'
      const description = meta?.description || targetUrlStr
      const image = meta?.image || ''
      const ogUrl = `https://s.perlink.to/${slug}`

      setResponseHeader(event, 'content-type', 'text/html; charset=utf-8')
      return `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${ogUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  ${image ? `<meta property="og:image" content="${image}" />` : ''}
  <meta property="og:site_name" content="Perlink" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  ${image ? `<meta name="twitter:image" content="${image}" />` : ''}
  <link rel="canonical" href="${ogUrl}" />
</head>
<body>
  <p>Redirecting to <a href="${targetUrlStr}">${title}</a></p>
</body>
</html>`
    }

    // Password protection check
    const meta = link.meta as Record<string, any> | null
    if (meta?.password?.enabled && meta.password.password) {
      return sendRedirect(event, `https://perlink.to/s/${slug}/verify`, 302)
    }

    // Track click analytics
    const trackClick = async () => {
      try {
        const analyticsRepo = new AnalyticsRepository(event)
        const now = new Date().toISOString()
        const today = now.split('T')[0]
        const country = getRequestHeader(event, 'cf-ipcountry') || null
        const city = getRequestHeader(event, 'cf-ipcity') || null
        const cfIp = getRequestHeader(event, 'cf-connecting-ip')
        const forwardedIp = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
        const ip = cfIp || forwardedIp || '0.0.0.0'
        const ipHash = await hashIP(ip, today)
        const { device, os, browser } = parseDevice(userAgent)
        const referrer = parseReferrer(referer)
        const requestUrl = url.toString()
        const utmParams = parseUTMParams(requestUrl)
        const sourceType = detectSourceType(requestUrl, referer)
        const isUnique = await analyticsRepo.isUniqueClick(link.id, ipHash)

        await analyticsRepo.createClickEvent({
          link_id: link.id,
          link_type: 'shortlink',
          timestamp: now,
          country,
          city,
          device,
          os,
          browser,
          referrer,
          referrer_full: referer,
          utm_source: utmParams.utm_source,
          utm_medium: utmParams.utm_medium,
          utm_campaign: utmParams.utm_campaign,
          ip_hash: ipHash,
          user_agent: userAgent,
          is_bot: false,
          is_unique: isUnique,
          source_type: sourceType,
        })
        await linkRepo.incrementClickCount(link.id)
      } catch (e) { /* silent */ }
    }

    const cfContext = event.context.cloudflare?.context
    if (cfContext?.waitUntil) {
      cfContext.waitUntil(trackClick())
    } else {
      await trackClick()
    }

    // Redirect
    setResponseHeader(event, 'Referrer-Policy', 'unsafe-url')
    try {
      const targetUrl = new URL(targetUrlStr)
      targetUrl.searchParams.set('utm_source', 'perlink')
      return sendRedirect(event, targetUrl.toString(), 302)
    } catch {
      return sendRedirect(event, targetUrlStr, 302)
    }
  } catch (e: any) {
    return sendRedirect(event, 'https://perlink.to', 302)
  }
})
