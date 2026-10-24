import { getDB } from '../../utils/db'
import { BioRepository } from '../../repositories/bioRepository'

export default defineEventHandler(async (event) => {
  // Check auth
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const bioRepo = new BioRepository(event)
  
  try {
    // Get all bio pages for this user
    const bioPages = await bioRepo.findAllByUserId(user.id)

    // Unread form requests per site (the table may not exist before its migration)
    const unread: Record<string, number> = {}
    if (bioPages.length) {
      try {
        const rows = await getDB(event)
          .prepare(`SELECT bio_page_id AS id, COUNT(*) AS n FROM form_submissions WHERE read_at IS NULL AND bio_page_id IN (${bioPages.map(() => '?').join(',')}) GROUP BY bio_page_id`)
          .bind(...bioPages.map(p => p.id))
          .all<{ id: string; n: number }>()
        for (const row of rows.results ?? []) unread[row.id] = row.n
      } catch (error) {
        console.error('[GET /api/admin/bios] unread counts', error)
      }
    }

    return {
      success: true,
      bioPages: bioPages.map(page => ({ ...page, unreadRequests: unread[page.id] ?? 0 }))
    }
  } catch (error: any) {
    console.error('[GET /api/admin/bios]', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to fetch bio pages'
    })
  }
})
