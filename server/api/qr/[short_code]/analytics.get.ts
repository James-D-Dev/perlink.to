import { QRRepository } from '../../../repositories/qrRepository'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const db = event.context.cloudflare?.env?.DB as any
    const shortCode = getRouterParam(event, 'short_code')

    if (!shortCode) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Short code is required'
      })
    }

    const qrRepo = new QRRepository(db)

    const existing = await qrRepo.findByShortCode(shortCode)
    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'QR code not found'
      })
    }

    if (existing.userId !== (user as any).id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      })
    }

    const query = getQuery(event)
    const days = parseInt(query.days as string) || 30

    const stats = await qrRepo.getScanStats(existing.id, days)

    return {
      success: true,
      data: stats
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch QR code analytics'
    })
  }
})
