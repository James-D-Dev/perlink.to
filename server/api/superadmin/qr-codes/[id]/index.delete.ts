import { getDB } from "../../../../utils/db"
import { requireSuperadmin } from "../../../../utils/superadmin"

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const qrId = getRouterParam(event, 'id')
  if (!qrId) throw createError({ statusCode: 400, statusMessage: 'QR code ID required' })

  const db = getDB(event)

  try {
    const result = await db.prepare(`DELETE FROM qr_codes WHERE id = ?`).bind(qrId).run()

    if (!result.meta?.rows_written) throw createError({ statusCode: 404, statusMessage: 'QR code not found' })

    return { success: true }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: `Failed to delete QR code: ${error.message}` })
  }
})
