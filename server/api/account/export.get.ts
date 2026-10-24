import { getDB } from '../../utils/db'

// Everything we store about the signed-in user, as one JSON download
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const db = getDB(event)
  const parse = (value: unknown) => {
    if (typeof value !== 'string') return value
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  }

  const profile = await db.prepare('SELECT id, email, username, name, avatar, plan, country, created_at FROM profiles WHERE id = ?').bind(user.id).first()
  const sites = (await db.prepare('SELECT * FROM bio_pages WHERE user_id = ?').bind(user.id).all<any>()).results ?? []
  const siteIds = sites.map(s => s.id)

  let requests: any[] = []
  if (siteIds.length) {
    try {
      requests = (await db
        .prepare(`SELECT bio_page_id, data, read_at, created_at FROM form_submissions WHERE bio_page_id IN (${siteIds.map(() => '?').join(',')}) ORDER BY created_at`)
        .bind(...siteIds)
        .all<any>()).results ?? []
    } catch {}
  }
  const links = (await db.prepare('SELECT short_code, content, type, meta, created_at FROM links WHERE user_id = ?').bind(user.id).all<any>()).results ?? []

  setResponseHeaders(event, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Disposition': `attachment; filename="perlink-export-${new Date().toISOString().slice(0, 10)}.json"`,
  })
  return {
    exportedAt: new Date().toISOString(),
    profile,
    sites: sites.map(site => ({
      username: site.username,
      title: site.title,
      bio: site.bio,
      avatarUrl: site.avatar_url,
      published: !!site.is_published,
      themeConfig: parse(site.theme_config),
      blocks: parse(site.blocks),
      draft: parse(site.draft),
      createdAt: site.created_at,
      updatedAt: site.updated_at,
      formRequests: requests.filter(r => r.bio_page_id === site.id).map(r => ({ ...parse(r.data), read: !!r.read_at, sentAt: r.created_at })),
    })),
    shortLinks: links.map(link => ({ ...link, meta: parse(link.meta) })),
  }
})
