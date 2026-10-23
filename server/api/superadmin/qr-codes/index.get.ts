import { getDB } from "../../../utils/db"
import { requireSuperadmin } from "../../../utils/superadmin"

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const db = getDB(event)

  try {
    // Fetch all QR codes with owner info (skip style config)
    const result = await db.prepare(`
      SELECT
        q.id,
        q.user_id as userId,
        q.short_code as shortCode,
        q.name,
        q.title,
        q.destination_url as destinationUrl,
        q.scan_count as scanCount,
        q.is_active as isActive,
        q.expires_at as expiresAt,
        q.created_at as createdAt,
        q.updated_at as updatedAt,
        p.email as ownerEmail,
        COALESCE(p.name, p.username) as ownerName
      FROM qr_codes q
      LEFT JOIN profiles p ON p.id = q.user_id
      ORDER BY q.created_at DESC
    `).all()

    const now = Date.now()

    const qrCodes = (result.results || []).map((q: any) => {
      const isExpired = !!q.expiresAt && new Date(q.expiresAt).getTime() < now
      const isActive = q.isActive === 1
      return {
        id: q.id,
        userId: q.userId,
        shortCode: q.shortCode,
        name: q.name || q.title || null,
        destinationUrl: q.destinationUrl,
        scanCount: q.scanCount || 0,
        isActive,
        expiresAt: q.expiresAt || null,
        status: isExpired ? 'expired' : isActive ? 'active' : 'inactive',
        createdAt: q.createdAt,
        updatedAt: q.updatedAt,
        owner: {
          email: q.ownerEmail || null,
          name: q.ownerName || null,
        },
      }
    })

    return {
      qrCodes,
      stats: {
        total: qrCodes.length,
        active: qrCodes.filter(q => q.status === 'active').length,
        inactive: qrCodes.filter(q => q.status !== 'active').length,
        totalScans: qrCodes.reduce((sum, q) => sum + q.scanCount, 0),
      },
    }
  } catch (error: any) {
    console.error('Failed to fetch QR codes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch QR codes: ${error.message}`,
    })
  }
})
