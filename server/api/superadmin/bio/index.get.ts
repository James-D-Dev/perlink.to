import { getDB } from "../../../utils/db"
import { requireSuperadmin } from "../../../utils/superadmin"

export default defineEventHandler(async (event) => {
  requireSuperadmin(event)

  const db = getDB(event)

  try {
    // Fetch all bio pages with owner info (skip heavy JSON columns)
    const result = await db.prepare(`
      SELECT
        b.id,
        b.user_id as userId,
        b.username,
        b.title,
        b.avatar_url as avatarUrl,
        b.template_id as templateId,
        b.is_published as isPublished,
        b.view_count as viewCount,
        b.created_at as createdAt,
        b.updated_at as updatedAt,
        p.email as ownerEmail,
        COALESCE(p.name, p.username) as ownerName,
        p.avatar as ownerAvatar,
        p.plan as ownerPlan
      FROM bio_pages b
      LEFT JOIN profiles p ON p.id = b.user_id
      ORDER BY b.updated_at DESC
    `).all()

    const bioPages = (result.results || []).map((b: any) => ({
      id: b.id,
      userId: b.userId,
      username: b.username,
      title: b.title || null,
      avatarUrl: b.avatarUrl || null,
      templateId: b.templateId,
      isPublished: b.isPublished === 1,
      viewCount: b.viewCount || 0,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      owner: {
        email: b.ownerEmail || null,
        name: b.ownerName || null,
        avatar: b.ownerAvatar || null,
        plan: b.ownerPlan || 'free',
      },
    }))

    const total = bioPages.length
    const published = bioPages.filter(b => b.isPublished).length

    return {
      bioPages,
      stats: {
        total,
        published,
        draft: total - published,
        totalViews: bioPages.reduce((sum, b) => sum + b.viewCount, 0),
      },
    }
  } catch (error: any) {
    console.error('Failed to fetch bio pages:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch bio pages: ${error.message}`,
    })
  }
})
