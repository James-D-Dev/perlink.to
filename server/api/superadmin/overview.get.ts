import { getDB } from "../../utils/db"
import { requireSuperadmin } from "../../utils/superadmin"

const DAYS = 30

// Build a zero-filled [{ date, value }] series for the last N days
function fillSeries(rows: { day: string; count: number }[], days: number) {
  const counts = new Map(rows.map(r => [r.day, r.count]))
  const series: { date: string; value: number }[] = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i))
    const key = d.toISOString().slice(0, 10)
    series.push({ date: key, value: counts.get(key) || 0 })
  }
  return series
}

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const db = getDB(event)
  const since = `-${DAYS - 1} days`

  try {
    const [
      users,
      bios,
      links,
      qrCodes,
      signups,
      clicks,
      plans,
      recentUsers,
      topLinks,
      topBios,
      revenue,
      revenueDays,
      attention,
      recentPayments,
    ] = await db.batch([
      db.prepare(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'banned' THEN 1 ELSE 0 END) as banned,
          SUM(CASE WHEN date(created_at) >= date('now', '-6 days') THEN 1 ELSE 0 END) as newThisWeek,
          SUM(CASE WHEN COALESCE(plan, 'free') != 'free' THEN 1 ELSE 0 END) as paid
        FROM profiles
      `),
      db.prepare(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN is_published = 1 THEN 1 ELSE 0 END) as published,
          COALESCE(SUM(view_count), 0) as views
        FROM bio_pages
      `),
      db.prepare(`SELECT COUNT(*) as total, COALESCE(SUM(click_count), 0) as clicks FROM links`),
      db.prepare(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
          COALESCE(SUM(scan_count), 0) as scans
        FROM qr_codes
      `),
      db.prepare(`
        SELECT date(created_at) as day, COUNT(*) as count
        FROM profiles
        WHERE date(created_at) >= date('now', ?)
        GROUP BY day
      `).bind(since),
      db.prepare(`
        SELECT date(timestamp) as day, COUNT(*) as count
        FROM click_events
        WHERE is_bot = 0 AND date(timestamp) >= date('now', ?)
        GROUP BY day
      `).bind(since),
      db.prepare(`
        SELECT COALESCE(plan, 'free') as plan, COUNT(*) as count
        FROM profiles
        GROUP BY COALESCE(plan, 'free')
      `),
      db.prepare(`
        SELECT id, email, name, username, avatar, plan, status, created_at as createdAt
        FROM profiles
        ORDER BY created_at DESC
        LIMIT 7
      `),
      db.prepare(`
        SELECT l.id, l.short_code as shortCode, l.title, l.click_count as clickCount, p.email as ownerEmail
        FROM links l
        LEFT JOIN profiles p ON p.id = l.user_id
        ORDER BY l.click_count DESC
        LIMIT 5
      `),
      db.prepare(`
        SELECT b.id, b.username, b.title, b.avatar_url as avatarUrl, b.view_count as viewCount, p.email as ownerEmail
        FROM bio_pages b
        LEFT JOIN profiles p ON p.id = b.user_id
        ORDER BY b.view_count DESC
        LIMIT 5
      `),
      // Money in: paid plans and passes (card, crypto, bank) and room packs.
      // Card and crypto are in USD; a bank transfer only has its VND price.
      db.prepare(`
        WITH sales AS (
          SELECT paid_at AS at, amount_usd AS usd, CASE WHEN amount_usd IS NULL THEN amount ELSE 0 END AS vnd
          FROM payments WHERE status = 'paid' AND paid_at IS NOT NULL
          UNION ALL
          SELECT created_at, amount_usd, 0 FROM room_packs WHERE amount_usd > 0
        )
        SELECT
          COALESCE(SUM(usd), 0) AS usdAll,
          COALESCE(SUM(vnd), 0) AS vndAll,
          COALESCE(SUM(CASE WHEN date(at) >= date('now', ?) THEN usd END), 0) AS usd30,
          COALESCE(SUM(CASE WHEN date(at) >= date('now', ?) THEN vnd END), 0) AS vnd30,
          SUM(CASE WHEN date(at) >= date('now', ?) THEN 1 ELSE 0 END) AS orders30,
          (SELECT COUNT(*) FROM subscriptions WHERE status IN ('active', 'on_trial', 'trialing')) AS activeSubs
        FROM sales
      `).bind(since, since, since),
      db.prepare(`
        SELECT date(at) AS day, ROUND(SUM(usd), 2) AS count FROM (
          SELECT paid_at AS at, amount_usd AS usd FROM payments WHERE status = 'paid' AND amount_usd > 0
          UNION ALL
          SELECT created_at, amount_usd FROM room_packs WHERE amount_usd > 0
        )
        WHERE date(at) >= date('now', ?)
        GROUP BY day
      `).bind(since),
      // Waiting on the admin
      db.prepare(`
        SELECT
          (SELECT COUNT(*) FROM payments WHERE status = 'submitted') AS payments,
          (SELECT COUNT(*) FROM reports WHERE status = 'open') AS reports,
          (SELECT COUNT(*) FROM mail_messages WHERE direction = 'in' AND read_at IS NULL) AS mail,
          (SELECT COUNT(*) FROM mail_messages WHERE direction = 'out' AND status = 'failed' AND created_at >= datetime('now', '-7 days')) AS mailFailed
      `),
      db.prepare(`
        SELECT * FROM (
          SELECT p.id, p.plan, p.period, p.method, p.amount, p.amount_usd AS amountUsd, p.paid_at AS paidAt,
            pr.email, pr.name, pp.product
          FROM payments p
          LEFT JOIN profiles pr ON pr.id = p.user_id
          LEFT JOIN payment_products pp ON pp.payment_id = p.id
          WHERE p.status = 'paid' AND p.paid_at IS NOT NULL
          UNION ALL
          SELECT 'pack:' || r.user_id || ':' || r.pack_id, NULL, NULL, r.source, 0, r.amount_usd, r.created_at,
            pr.email, pr.name, 'pack:' || r.pack_id
          FROM room_packs r
          LEFT JOIN profiles pr ON pr.id = r.user_id
          WHERE r.amount_usd > 0
        )
        ORDER BY paidAt DESC
        LIMIT 5
      `),
    ])

    const first = (r: any) => (r.results?.[0] || {}) as Record<string, number>

    const u = first(users)
    const b = first(bios)
    const l = first(links)
    const q = first(qrCodes)

    return {
      totals: {
        users: u.total || 0,
        usersNewThisWeek: u.newThisWeek || 0,
        usersBanned: u.banned || 0,
        usersPaid: u.paid || 0,
        bioPages: b.total || 0,
        bioPublished: b.published || 0,
        bioViews: b.views || 0,
        links: l.total || 0,
        linkClicks: l.clicks || 0,
        qrCodes: q.total || 0,
        qrActive: q.active || 0,
        qrScans: q.scans || 0,
      },
      signups: fillSeries((signups?.results || []) as any, DAYS),
      clicks: fillSeries((clicks?.results || []) as any, DAYS),
      plans: (plans?.results || []) as { plan: string; count: number }[],
      recentUsers: ((recentUsers?.results || []) as any[]).map(r => ({
        id: r.id,
        email: r.email,
        name: r.name || r.username || null,
        avatar: r.avatar || null,
        plan: r.plan || 'free',
        status: r.status || 'active',
        createdAt: r.createdAt,
      })),
      topLinks: (topLinks?.results || []) as any[],
      topBios: (topBios?.results || []) as any[],
      revenue: (() => {
        const r = first(revenue)
        return {
          usdAll: r.usdAll || 0,
          vndAll: r.vndAll || 0,
          usd30: r.usd30 || 0,
          vnd30: r.vnd30 || 0,
          orders30: r.orders30 || 0,
          activeSubs: r.activeSubs || 0,
        }
      })(),
      revenueSeries: fillSeries((revenueDays?.results || []) as any, DAYS),
      attention: (() => {
        const a = first(attention)
        return { payments: a.payments || 0, reports: a.reports || 0, mail: a.mail || 0, mailFailed: a.mailFailed || 0 }
      })(),
      recentPayments: (recentPayments?.results || []) as any[],
    }
  } catch (error: any) {
    console.error('Failed to fetch overview:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch overview: ${error.message}`,
    })
  }
})
