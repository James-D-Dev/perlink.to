import { getDB } from "../../../../utils/db"
import { requireSuperadmin } from "../../../../utils/superadmin"

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const bioId = getRouterParam(event, 'id')
  if (!bioId) throw createError({ statusCode: 400, statusMessage: 'Bio ID required' })

  const db = getDB(event)

  try {
    // Toggle publish status
    const result = await db.prepare(`
      UPDATE bio_pages
      SET is_published = CASE WHEN is_published = 1 THEN 0 ELSE 1 END,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(bioId).run()

    if (!result.meta?.rows_written) throw createError({ statusCode: 404, statusMessage: 'Bio page not found' })

    const row = await db.prepare(`SELECT is_published FROM bio_pages WHERE id = ?`).bind(bioId).first<{ is_published: number }>()

    return { success: true, isPublished: row?.is_published === 1 }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: `Failed to toggle publish: ${error.message}` })
  }
})
