import { QRRepository } from '../../../repositories/qrRepository'

export default defineEventHandler(async (event) => {
  try {
    const db = event.context.cloudflare?.env?.DB as any
    const code = getRouterParam(event, 'code')
    
    if (!code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'QR code is required'
      })
    }

    const qrRepo = new QRRepository(db)
    
    // Find QR code by short code
    const qrCode = await qrRepo.findByShortCode(code)
    
    if (!qrCode) {
      throw createError({
        statusCode: 404,
        statusMessage: 'QR code not found'
      })
    }

    // Check if active
    if (!qrCode.isActive) {
      throw createError({
        statusCode: 403,
        statusMessage: 'This QR code is inactive'
      })
    }

    // Check expiration
    if (qrCode.expiresAt && new Date(qrCode.expiresAt) < new Date()) {
      throw createError({
        statusCode: 403,
        statusMessage: 'This QR code has expired'
      })
    }

    // Get client info for analytics
    const headers = getRequestHeaders(event)
    const ip = headers['cf-connecting-ip'] || headers['x-forwarded-for'] || 'unknown'
    const userAgent = headers['user-agent'] || 'unknown'
    const referer = headers['referer'] || null

    // Parse device type from user agent
    const deviceType = parseDeviceType(userAgent)

    // Record scan (fire and forget - don't wait)
    void qrRepo.recordScan(qrCode.id, {
      ip: ip as string,
      userAgent,
      deviceType,
      referer
    })

    return {
      success: true,
      data: {
        id: qrCode.id,
        destinationUrl: qrCode.destinationUrl,
        name: qrCode.name,
        title: qrCode.title
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to process QR code scan'
    })
  }
})

function parseDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase()
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    return 'mobile'
  }
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'tablet'
  }
  if (ua.includes('bot') || ua.includes('crawler') || ua.includes('spider')) {
    return 'bot'
  }
  
  return 'desktop'
}
