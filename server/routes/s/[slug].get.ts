import { LinkRepository } from '../../repositories/linkRepository'
import { AnalyticsRepository } from '../../repositories/analyticsRepository'
import { isBot, parseDevice, hashIP, parseReferrer, parseUTMParams, detectSourceType } from '../../services/analytics'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const userAgent = getRequestHeader(event, 'user-agent') || ''
  const referer = getRequestHeader(event, 'referer') || null

  if (!slug) {
    return sendRedirect(event, '/', 302)
  }

  try {
    const linkRepo = new LinkRepository(event)
    const link = await linkRepo.findByShortCode(slug)

    if (!link || !link.content) {
      // Redirect to homepage if link not found
      return sendRedirect(event, '/', 302)
    }

    // Resolve target URL from content (may be string or object)
    const rawContent = link.content
    const targetUrlStr = typeof rawContent === 'string'
      ? rawContent
      : (rawContent as any)?.url || (rawContent as any)?.href || null

    if (!targetUrlStr) {
      return sendRedirect(event, '/', 302)
    }

    // For bots: track as bot click (deduplicated per bot per day), then return OG meta HTML
    if (isBot(userAgent)) {
      // Track bot click (non-blocking, 1 per bot type per link per day)
      const trackBotClick = async () => {
        try {
          const analyticsRepo = new AnalyticsRepository(event)
          const now = new Date().toISOString()
          const today = now.split('T')[0]
          const botName = userAgent.split('/')[0]?.toLowerCase() || 'bot'
          const botHash = `bot:${botName}:${today}`

          // Only record if this bot hasn't crawled this link today
          const isUnique = await analyticsRepo.isUniqueClick(link.id, botHash)
          if (!isUnique) return

          const referrer = parseReferrer(referer)
          await analyticsRepo.createClickEvent({
            link_id: link.id,
            link_type: 'shortlink',
            timestamp: now,
            country: getRequestHeader(event, 'cf-ipcountry') || null,
            city: getRequestHeader(event, 'cf-ipcity') || null,
            device: 'Bot',
            os: 'Bot',
            browser: botName,
            referrer,
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
        } catch (e) {
          // Silent fail
        }
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
      const url = `https://s.perlink.to/${slug}`

      setResponseHeader(event, 'content-type', 'text/html; charset=utf-8')
      return `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  ${image ? `<meta property="og:image" content="${image}" />` : ''}
  <meta property="og:site_name" content="Perlink" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  ${image ? `<meta name="twitter:image" content="${image}" />` : ''}
  <link rel="canonical" href="${url}" />
</head>
<body>
  <p>Redirecting to <a href="${targetUrlStr}">${title}</a></p>
</body>
</html>`
    }

    // Check if link is password protected
    const meta = link.meta as Record<string, any> | null
    if (meta?.password?.enabled && meta.password.password) {
      return sendRedirect(event, `/s/${slug}/verify`, 302)
    }

    // Track click analytics (non-blocking)
    const trackClick = async () => {
      try {
        const analyticsRepo = new AnalyticsRepository(event)
        const now = new Date().toISOString()
        const today = now.split('T')[0]

        // Get geo from Cloudflare request headers
        const country = getRequestHeader(event, 'cf-ipcountry') || null
        const city = getRequestHeader(event, 'cf-ipcity') || null

        // Get client IP
        const cfIp = getRequestHeader(event, 'cf-connecting-ip')
        const forwardedIp = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim()
        const ip = cfIp || forwardedIp || '0.0.0.0'

        const ipHash = await hashIP(ip, today)
        const { device, os, browser } = parseDevice(userAgent)
        const referrer = parseReferrer(referer)
        const requestUrl = getRequestURL(event).toString()
        const utmParams = parseUTMParams(requestUrl)
        const sourceType = detectSourceType(requestUrl, referer)

        // Check uniqueness
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

        // Also increment legacy click_count
        await linkRepo.incrementClickCount(link.id)
      } catch (e) {
        // Silent fail — never block redirect
      }
    }

    // Use waitUntil if available (Cloudflare Workers), otherwise await
    const cfContext = event.context.cloudflare?.context
    if (cfContext?.waitUntil) {
      cfContext.waitUntil(trackClick())
    } else {
      await trackClick()
    }

    // Redirect to target URL
    setResponseHeader(event, 'Referrer-Policy', 'unsafe-url')
    try {
      const targetUrl = new URL(targetUrlStr)
      targetUrl.searchParams.set('utm_source', 'perlink')
      return sendRedirect(event, targetUrl.toString(), 302)
    } catch {
      return sendRedirect(event, targetUrlStr, 302)
    }
  } catch (e: any) {
    setResponseHeader(event, 'content-type', 'application/json')
    return JSON.stringify({
      error: true,
      message: e?.message || 'Unknown error',
      stack: e?.stack?.split('\n').slice(0, 5),
      slug,
    })
  }
})
