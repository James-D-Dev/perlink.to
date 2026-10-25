import { getDB } from '../../utils/db'
import { BioRepository, editableBioPage } from '../../repositories/bioRepository'

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

    // Visits per day over the last 14 days: this week for the chart, the
    // week before to show the change
    const days = 14
    const daily: Record<string, Record<string, number>> = {}
    if (bioPages.length) {
      try {
        const since = new Date(Date.now() - (days - 1) * 86_400_000).toISOString().slice(0, 10)
        const rows = await getDB(event)
          .prepare(`SELECT link_id AS id, substr(timestamp, 1, 10) AS day, COUNT(*) AS n FROM click_events WHERE link_type = 'bio' AND is_bot = 0 AND timestamp >= ? AND link_id IN (${bioPages.map(() => '?').join(',')}) GROUP BY link_id, day`)
          .bind(since, ...bioPages.map(p => p.id))
          .all<{ id: string; day: string; n: number }>()
        for (const row of rows.results ?? []) (daily[row.id] ??= {})[row.day] = row.n
      } catch (error) {
        console.error('[GET /api/admin/bios] visits', error)
      }
    }
    const dayKeys = Array.from({ length: days }, (_, i) => new Date(Date.now() - (days - 1 - i) * 86_400_000).toISOString().slice(0, 10))

    return {
      success: true,
      // The owner sees their latest edits, draft included
      bioPages: bioPages.map((page) => {
        const counts = dayKeys.map(day => daily[page.id]?.[day] ?? 0)
        return {
          ...editableBioPage(page),
          unreadRequests: unread[page.id] ?? 0,
          visits: { days: dayKeys.slice(7), week: counts.slice(7), previousTotal: counts.slice(0, 7).reduce((a, b) => a + b, 0) },
        }
      }),
    }
  } catch (error: any) {
    console.error('[GET /api/admin/bios]', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to fetch bio pages'
    })
  }
})
