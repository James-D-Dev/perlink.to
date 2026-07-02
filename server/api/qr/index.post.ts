import { QRRepository } from '../../repositories/qrRepository'
import type { CreateQRCodeInput } from '../../types/qr'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const db = event.context.cloudflare.env.DB
    
    const body = await readBody<CreateQRCodeInput>(event)
    
    // Validate required fields
    if (!body.destinationUrl) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Destination URL is required'
      })
    }
    
    // Validate URL format
    try {
      new URL(body.destinationUrl)
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid URL format'
      })
    }
    
    const qrRepo = new QRRepository(db)
    const qrCode = await qrRepo.create(user.id, body)
    
    return {
      success: true,
      data: qrCode
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to create QR code'
    })
  }
})
