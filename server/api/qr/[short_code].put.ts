import { QRRepository } from '../../repositories/qrRepository'
import type { UpdateQRCodeInput } from '../../types/qr'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const db = event.context.cloudflare?.env?.DB as any
    const shortCode = getRouterParam(event, 'short_code')

    if (!shortCode) {
      throw createError({ statusCode: 400, statusMessage: 'Short code is required' })
    }

    const qrRepo = new QRRepository(db)
    const existing = await qrRepo.findByShortCode(shortCode)

    if (!existing) {
      throw createError({ statusCode: 404, statusMessage: 'QR code not found' })
    }

    if (existing.userId !== (user as any).id) {
      throw createError({ statusCode: 403, statusMessage: 'Access denied' })
    }

    const body = await readBody<UpdateQRCodeInput>(event)

    if (body.destinationUrl) {
      try {
        new URL(body.destinationUrl)
      } catch {
        throw createError({ statusCode: 400, statusMessage: 'Invalid URL format' })
      }
    }

    const qrCode = await qrRepo.update(existing.id, body)

    return { success: true, data: qrCode }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to update QR code',
    })
  }
})
