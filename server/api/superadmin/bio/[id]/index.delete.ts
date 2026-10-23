import { getDB } from "../../../../utils/db"
import { requireSuperadmin } from "../../../../utils/superadmin"

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const bioId = getRouterParam(event, 'id')
  if (!bioId) throw createError({ statusCode: 400, statusMessage: 'Bio ID required' })

  const db = getDB(event)

  try {
    const result = await db.prepare(`DELETE FROM bio_pages WHERE id = ?`).bind(bioId).run()

    if (!result.meta?.rows_written) throw createError({ statusCode: 404, statusMessage: 'Bio page not found' })

    return { success: true }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: `Failed to delete bio page: ${error.message}` })
  }
})
