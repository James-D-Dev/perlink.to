import { getDB } from '../../utils/db'
import { requireSuperadmin, SUPERADMIN_EMAIL } from '../../utils/superadmin'

// Superadmin → Dashboard: how far people get after signing up, for those who
// signed up in the last 30 / 90 days or ever (the admin account left out),
// and who is stuck before their site is made or published.
//
// Steps: signed up → made a site → published it → 10+ views → paid
// (a paid plan now, or any paid payment or room pack).

const VIEWS_GOAL = 10

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const asked = String(getQuery(event).days || '30')
  const days = asked === 'all' ? null : Math.min(Math.max(Number(asked) || 30, 1), 365)
  const since = days ? `AND date(p.created_at) >= date('now', '-${days - 1} days')` : ''
  const db = getDB(event)

  const cohort = `
    WITH cohort AS (
      SELECT p.id, p.email, p.name, p.avatar, p.created_at, COALESCE(p.plan, 'free') AS plan
      FROM profiles p
      WHERE p.email IS NOT ? ${since}
    ),
    sites AS (
      SELECT user_id, COUNT(*) AS made, MAX(is_published) AS published, MAX(view_count) AS views,
        MIN(created_at) AS first_site_at
      FROM bio_pages GROUP BY user_id
    ),
    paid AS (
      SELECT user_id FROM payments WHERE status = 'paid'
      UNION SELECT user_id FROM room_packs WHERE amount_usd > 0
    )`

  const [steps, noSite, notPublished] = await db.batch([
    db.prepare(`${cohort}
      SELECT
        COUNT(*) AS signedUp,
        SUM(CASE WHEN s.made > 0 THEN 1 ELSE 0 END) AS madeSite,
        SUM(CASE WHEN s.published = 1 THEN 1 ELSE 0 END) AS published,
        SUM(CASE WHEN s.published = 1 AND s.views >= ${VIEWS_GOAL} THEN 1 ELSE 0 END) AS gotViews,
        SUM(CASE WHEN c.plan != 'free' OR c.id IN (SELECT user_id FROM paid) THEN 1 ELSE 0 END) AS paid
      FROM cohort c LEFT JOIN sites s ON s.user_id = c.id
    `).bind(SUPERADMIN_EMAIL),
    db.prepare(`${cohort}
      SELECT c.id, c.email, c.name, c.avatar, c.created_at AS at
      FROM cohort c LEFT JOIN sites s ON s.user_id = c.id
      WHERE s.made IS NULL
      ORDER BY c.created_at DESC LIMIT 8
    `).bind(SUPERADMIN_EMAIL),
    db.prepare(`${cohort}
      SELECT c.id, c.email, c.name, c.avatar, s.first_site_at AS at
      FROM cohort c JOIN sites s ON s.user_id = c.id
      WHERE s.published = 0
      ORDER BY s.first_site_at DESC LIMIT 8
    `).bind(SUPERADMIN_EMAIL),
  ])

  const n = (steps?.results?.[0] ?? {}) as Record<string, number>
  return {
    days,
    viewsGoal: VIEWS_GOAL,
    steps: [
      { key: 'signedUp', count: n.signedUp || 0 },
      { key: 'madeSite', count: n.madeSite || 0 },
      { key: 'published', count: n.published || 0 },
      { key: 'gotViews', count: n.gotViews || 0 },
      { key: 'paid', count: n.paid || 0 },
    ],
    stuck: {
      noSite: (noSite?.results ?? []) as { id: string; email: string; name: string | null; avatar: string | null; at: string }[],
      notPublished: (notPublished?.results ?? []) as { id: string; email: string; name: string | null; avatar: string | null; at: string }[],
    },
  }
})
