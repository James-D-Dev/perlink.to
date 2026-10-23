import { getDB } from "../../../../utils/db"
import { requireSuperadmin } from "../../../../utils/superadmin"

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const userId = getRouterParam(event, 'id')
  if (!userId) throw createError({ statusCode: 400, statusMessage: 'User ID required' })

  const db = getDB(event)

  try {
    const user = await db.prepare(`
      SELECT id, email, username, name, avatar, plan, status, country, created_at as createdAt, updated_at as updatedAt
      FROM profiles WHERE id = ?
    `).bind(userId).first<any>()

    if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

    const [bioPages, links, qrCodes] = await db.batch([
      db.prepare(`
        SELECT id, username, title, avatar_url as avatarUrl, is_published as isPublished,
               view_count as viewCount, updated_at as updatedAt
        FROM bio_pages WHERE user_id = ? ORDER BY updated_at DESC
      `).bind(userId),
      db.prepare(`
        SELECT id, short_code as shortCode, title, content, click_count as clickCount, created_at as createdAt
        FROM links WHERE user_id = ? ORDER BY created_at DESC
      `).bind(userId),
      db.prepare(`
        SELECT id, short_code as shortCode, name, title, destination_url as destinationUrl,
               scan_count as scanCount, is_active as isActive, created_at as createdAt
        FROM qr_codes WHERE user_id = ? ORDER BY created_at DESC
      `).bind(userId),
    ])

    const bioRows = ((bioPages?.results || []) as any[]).map(b => ({ ...b, isPublished: b.isPublished === 1 }))
    const linkRows = ((links?.results || []) as any[]).map(({ content, ...l }) => ({ ...l, targetUrl: parseTargetUrl(content) }))
    const qrRows = ((qrCodes?.results || []) as any[]).map(({ title, ...q }) => ({ ...q, name: q.name || title || null, isActive: q.isActive === 1 }))

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username || null,
        name: user.name || user.username || null,
        avatar: user.avatar || null,
        plan: user.plan || 'free',
        status: user.status || 'active',
        country: user.country || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      stats: {
        bioCount: bioRows.length,
        bioViews: bioRows.reduce((sum, b) => sum + (b.viewCount || 0), 0),
        linksCount: linkRows.length,
        clicksCount: linkRows.reduce((sum, l) => sum + (l.clickCount || 0), 0),
        qrCount: qrRows.length,
        scansCount: qrRows.reduce((sum, q) => sum + (q.scanCount || 0), 0),
      },
      bioPages: bioRows,
      links: linkRows,
      qrCodes: qrRows,
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch user: ${error.message}` })
  }
})

function parseTargetUrl(content: string | null): string | null {
  if (!content) return null
  try {
    const parsed = JSON.parse(content)
    if (typeof parsed === 'string') return parsed
    return parsed?.url || parsed?.href || null
  } catch {
    return content
  }
}
