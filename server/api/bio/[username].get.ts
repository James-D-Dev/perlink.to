import { BioRepository } from '../../repositories/bioRepository'
import { AnalyticsRepository } from '../../repositories/analyticsRepository'
import { isBot, parseDevice, hashIP, parseReferrer, parseUTMParams, detectSourceType } from '../../services/analytics'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  const userAgent = getRequestHeader(event, 'user-agent') || ''
  const referer = getRequestHeader(event, 'referer') || null
  
  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username required'
    })
  }

  const bioRepo = new BioRepository(event)
  const bioPage = await bioRepo.findByUsername(username)

  if (!bioPage || !bioPage.isPublished) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Bio page not found'
    })
  }

  // For bots: track as bot view (deduplicated per bot per day), then return data
  if (isBot(userAgent)) {
    // Track bot view (non-blocking, 1 per bot type per bio page per day)
    const trackBotView = async () => {
      try {
        const analyticsRepo = new AnalyticsRepository(event)
        const now = new Date().toISOString()
        const today = now.split('T')[0]
        const botName = userAgent.split('/')[0]?.toLowerCase() || 'bot'
        const botHash = `bot:${botName}:${today}`

        // Only record if this bot hasn't visited this bio page today
        const isUnique = await analyticsRepo.isUniqueClick(bioPage.id, botHash)
        if (!isUnique) return

        const referrer = parseReferrer(referer)
        await analyticsRepo.createClickEvent({
          link_id: bioPage.id,
          link_type: 'bio',
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
      cfContext.waitUntil(trackBotView())
    } else {
      await trackBotView()
    }

    return {
      bioPage
    }
  }

  // Track page view analytics (non-blocking)
  const trackView = async () => {
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
      const isUnique = await analyticsRepo.isUniqueClick(bioPage.id, ipHash)

      await analyticsRepo.createClickEvent({
        link_id: bioPage.id,
        link_type: 'bio',
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

      // Also increment legacy view count
      await bioRepo.incrementViewCount(bioPage.id)
    } catch (e) {
      // Silent fail — never block the response
    }
  }

  // Use waitUntil if available (Cloudflare Workers), otherwise await
  const cfContext = event.context.cloudflare?.context
  if (cfContext?.waitUntil) {
    cfContext.waitUntil(trackView())
  } else {
    await trackView()
  }

  return {
    bioPage
  }
})
