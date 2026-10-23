import { getDB } from "../../../../utils/db"
import { requireSuperadmin } from "../../../../utils/superadmin"

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const linkId = getRouterParam(event, 'id')
  if (!linkId) throw createError({ statusCode: 400, statusMessage: 'Link ID required' })

  const db = getDB(event)

  try {
    const result = await db.prepare(`DELETE FROM links WHERE id = ?`).bind(linkId).run()

    if (!result.meta?.rows_written) throw createError({ statusCode: 404, statusMessage: 'Link not found' })

    return { success: true }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: `Failed to delete link: ${error.message}` })
  }
})
