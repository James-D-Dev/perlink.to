import { QRRepository } from '../../repositories/qrRepository'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const db = event.context.cloudflare?.env?.DB as any
    const shortCode = getRouterParam(event, 'short_code')

    if (!shortCode) {
      throw createError({ statusCode: 400, statusMessage: 'Short code is required' })
    }

    const qrRepo = new QRRepository(db)
    const qrCode = await qrRepo.findByShortCode(shortCode)

    if (!qrCode) {
      throw createError({ statusCode: 404, statusMessage: 'QR code not found' })
    }

    if (qrCode.userId !== (user as any).id) {
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
    }

    return { success: true, data: qrCode }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch QR code',
    })
  }
})
