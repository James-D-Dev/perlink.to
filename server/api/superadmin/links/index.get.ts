import { getDB } from "../../../utils/db"
import { requireSuperadmin } from "../../../utils/superadmin"

function parseTargetUrl(content: string | null): string | null {
  if (!content) return null
  try {
    const parsed = JSON.parse(content)
    if (typeof parsed === 'string') return parsed
    return parsed?.url || parsed?.href || null
  } catch {
    // Content stored as a plain URL string
    return content
  }
}

function hasPassword(meta: string | null): boolean {
  if (!meta) return false
  try {
    const parsed = JSON.parse(meta)
    return !!(parsed?.password?.enabled && parsed.password.password)
  } catch {
    return false
  }
}

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const db = getDB(event)

  try {
    // Fetch all short links with owner info
    const result = await db.prepare(`
      SELECT
        l.id,
        l.user_id as userId,
        l.short_code as shortCode,
        l.content,
        l.title,
        l.meta,
        l.click_count as clickCount,
        l.created_at as createdAt,
        l.updated_at as updatedAt,
        p.email as ownerEmail,
        COALESCE(p.name, p.username) as ownerName
      FROM links l
      LEFT JOIN profiles p ON p.id = l.user_id
      ORDER BY l.created_at DESC
    `).all()

    const links = (result.results || []).map((l: any) => ({
      id: l.id,
      userId: l.userId,
      shortCode: l.shortCode,
      targetUrl: parseTargetUrl(l.content),
      title: l.title || null,
      hasPassword: hasPassword(l.meta),
      clickCount: l.clickCount || 0,
      createdAt: l.createdAt,
      updatedAt: l.updatedAt,
      owner: {
        email: l.ownerEmail || null,
        name: l.ownerName || null,
      },
    }))

    return {
      links,
      stats: {
        total: links.length,
        totalClicks: links.reduce((sum, l) => sum + l.clickCount, 0),
        protected: links.filter(l => l.hasPassword).length,
        owners: new Set(links.map(l => l.userId)).size,
      },
    }
  } catch (error: any) {
    console.error('Failed to fetch links:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch links: ${error.message}`,
    })
  }
})
