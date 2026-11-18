import { getDB } from "../../../../utils/db"
import { requireSuperadmin } from "../../../../utils/superadmin"

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const userId = getRouterParam(event, 'id')
  if (!userId) throw createError({ statusCode: 400, statusMessage: 'User ID required' })

  const db = getDB(event)

  try {
    const user = await db.prepare(`
      SELECT id, email, username, name, avatar, plan, status, country, language, plan_expires_at as planExpiresAt,
             created_at as createdAt, updated_at as updatedAt
      FROM profiles WHERE id = ?
    `).bind(userId).first<any>()

    if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })

    const [bioPages, links, qrCodes, purchases, providers] = await db.batch([
      db.prepare(`
        SELECT id, username, title, avatar_url as avatarUrl, thumbnail_url as thumbnailUrl, is_published as isPublished,
               view_count as viewCount, removed_at as removedAt, updated_at as updatedAt
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
      // Plans, passes and room packs they bought
      db.prepare(`
        SELECT * FROM (
          SELECT p.id, p.plan, p.period, p.method, p.status, p.amount, p.amount_usd AS amountUsd,
            COALESCE(p.paid_at, p.created_at) AS at, pp.product
          FROM payments p LEFT JOIN payment_products pp ON pp.payment_id = p.id
          WHERE p.user_id = ?
          UNION ALL
          SELECT 'pack:' || pack_id, NULL, NULL, source, 'paid', 0, amount_usd, created_at, 'pack:' || pack_id
          FROM room_packs WHERE user_id = ?
        ) ORDER BY at DESC
      `).bind(userId, userId),
      db.prepare(`SELECT provider FROM auth_accounts WHERE user_id = ?`).bind(userId),
    ])
    const purchaseRows = (purchases?.results || []) as any[]
    const providerList = [...new Set(((providers?.results || []) as { provider: string }[]).map(r => r.provider))]

    const bioRows = ((bioPages?.results || []) as any[]).map(b => ({ ...b, isPublished: b.isPublished === 1, removed: !!b.removedAt }))
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
        language: user.language || null,
        planExpiresAt: user.planExpiresAt || null,
        // Google sign-ins aren't in auth_accounts: an email account with no other provider is Google
        providers: providerList.length ? providerList : (user.email ? ['google'] : []),
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
        spentUsd: purchaseRows.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amountUsd || 0), 0),
      },
      purchases: purchaseRows,
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
