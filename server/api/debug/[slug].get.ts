import { LinkRepository } from '../../repositories/linkRepository'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    return { error: 'no slug' }
  }

  try {
    const linkRepo = new LinkRepository(event)
    const link = await linkRepo.findByShortCode(slug)

    if (!link) {
      return { error: 'link not found', slug }
    }

    const rawContent = link.content
    const contentType = typeof rawContent
    const targetUrlStr = typeof rawContent === 'string'
      ? rawContent
      : (rawContent as any)?.url || (rawContent as any)?.href || null

    return {
      slug,
      link_id: link.id,
      content_raw: rawContent,
      content_type: contentType,
      target_url: targetUrlStr,
      meta_keys: link.meta ? Object.keys(link.meta as any) : null,
      has_password: !!(link.meta as any)?.password?.enabled,
    }
  } catch (e: any) {
    return { error: e.message, stack: e.stack }
  }
})
