import { getDB } from "../../../../utils/db"
import { requireSuperadmin } from "../../../../utils/superadmin"

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const qrId = getRouterParam(event, 'id')
  if (!qrId) throw createError({ statusCode: 400, statusMessage: 'QR code ID required' })

  const db = getDB(event)

  try {
    // Toggle active status
    const result = await db.prepare(`
      UPDATE qr_codes
      SET is_active = CASE WHEN is_active = 1 THEN 0 ELSE 1 END,
          updated_at = ?
      WHERE id = ?
    `).bind(new Date().toISOString(), qrId).run()

    if (!result.meta?.rows_written) throw createError({ statusCode: 404, statusMessage: 'QR code not found' })

    const row = await db.prepare(`SELECT is_active FROM qr_codes WHERE id = ?`).bind(qrId).first<{ is_active: number }>()

    return { success: true, isActive: row?.is_active === 1 }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: `Failed to toggle QR code: ${error.message}` })
  }
})
