import { BioRepository } from '../../../repositories/bioRepository'
import { AnalyticsRepository } from '../../../repositories/analyticsRepository'
import { isBot, parseDevice, hashIP, parseReferrer, parseUTMParams, detectSourceType } from '../../../services/analytics'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  const userAgent = getRequestHeader(event, 'user-agent') || ''
  const referer = getRequestHeader(event, 'referer') || null

  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username is required'
    })
  }

  try {
    const bioRepo = new BioRepository(event)
    const bioPage = await bioRepo.findByUsername(username)

    if (!bioPage) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bio page not found'
      })
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

        // Also increment bio page view count in bio_pages table if needed
        await bioRepo.incrementViewCount(bioPage.id)
      } catch (e) {
        // Silent fail — never block the response
        console.error('Failed to track bio view:', e)
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
      success: true,
      message: 'Page view tracked successfully'
    }
  } catch (e: any) {
    throw createError({
      statusCode: 500,
      statusMessage: e?.message || 'Failed to track page view'
    })
  }
})
