import { QRRepository } from '../../repositories/qrRepository'

export default defineEventHandler(async (event) => {
  try {
    const { user } = await requireUserSession(event)
    const db = event.context.cloudflare?.env?.DB as any
    
    const query = getQuery(event)
    const limit = parseInt(query.limit as string) || 50
    const offset = parseInt(query.offset as string) || 0
    
    const qrRepo = new QRRepository(db)
    const result = await qrRepo.findAllByUserId((user as any).id, { limit, offset })
    
    return {
      success: true,
      data: result.codes,
      pagination: {
        total: result.total,
        limit,
        offset,
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch QR codes'
    })
  }
})
