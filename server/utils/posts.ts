import type { H3Event } from 'h3'
import { getDB } from './db'
import { getAccountPlan } from './plan'
import { PLAN_LIMITS, showsBranding } from '#shared/plans'
import { parsePostDoc, renderPostHtml } from '#shared/postContent'

// Blog posts: shared by the owner's API (dashboard) and the public one

export interface PostRow {
  id: string
  bio_page_id: string
  slug: string
  title: string
  excerpt: string | null
  cover_url: string | null
  content: string
  status: 'draft' | 'published'
  reading_minutes: number
  published_at: string | null
  created_at: string
  updated_at: string
}

/** For lists: everything but the body */
export const toPostSummary = (row: PostRow) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  coverUrl: row.cover_url,
  status: row.status,
  readingMinutes: row.reading_minutes,
  publishedAt: row.published_at,
  updatedAt: row.updated_at,
})

/** For the editor: with the document */
export const toPostForEditor = (row: PostRow) => ({ ...toPostSummary(row), content: parsePostDoc(row.content) })

/** For readers: with the body as safe HTML */
export const toPostForReader = (row: PostRow) => ({ ...toPostSummary(row), html: renderPostHtml(parsePostDoc(row.content)) })

/** What the blog pages need of the site: name, picture, look, language, badge */
export async function blogSite(event: H3Event, site: { userId: string; username: string; title?: string | null; avatarUrl?: string | null; themeConfig?: unknown }) {
  const plan = await getAccountPlan(event, site.userId).catch(() => null)
  return {
    username: site.username,
    title: site.title || site.username,
    avatarUrl: site.avatarUrl || null,
    themeConfig: site.themeConfig ?? {},
    showBranding: showsBranding(plan?.plan),
  }
}

/** A slug no other post of the site has: "my-post", then "my-post-2"... */
export async function uniqueSlug(event: H3Event, siteId: string, base: string, exceptId?: string) {
  const db = getDB(event)
  for (let n = 1; n < 100; n++) {
    const slug = n === 1 ? base : `${base}-${n}`
    const taken = await db.prepare('SELECT id FROM posts WHERE bio_page_id = ? AND slug = ? AND id != ?').bind(siteId, slug, exceptId ?? '').first()
    if (!taken) return slug
  }
  return `${base}-${crypto.randomUUID().slice(0, 6)}`
}

/** Publishing one more post: stays within the account's plan (published posts across its sites) */
export async function requirePostRoom(event: H3Event, userId: string) {
  const { plan } = await getAccountPlan(event, userId)
  const limit = PLAN_LIMITS[plan].posts
  if (!Number.isFinite(limit)) return
  const row = await getDB(event)
    .prepare(`SELECT COUNT(*) AS n FROM posts p JOIN bio_pages b ON b.id = p.bio_page_id WHERE b.user_id = ? AND p.status = 'published'`)
    .bind(userId)
    .first<{ n: number }>()
  if ((row?.n ?? 0) >= limit) {
    throw createError({ statusCode: 402, statusMessage: `Your plan publishes up to ${limit} posts`, data: { code: 'PLAN_REQUIRED', feature: 'posts', plan: plan === 'free' ? 'starter' : 'plus' } })
  }
}
