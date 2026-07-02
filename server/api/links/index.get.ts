import { LinkRepository } from '../../repositories/linkRepository'
import { getValidatedQuery } from 'h3'
import { z } from 'zod'

const querySchema = z.object({
  page: z.coerce.number().optional(),
  q: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
  linkType: z.enum(['all', 'custom', 'random']).optional(),
  is_public: z.union([z.boolean(), z.enum(['true', 'false']).transform((v: string) => v === 'true')]).optional(),
  tags: z.union([z.string(), z.array(z.string())]).optional(),
})

export default defineEventHandler(async (event) => {

  const query = await getValidatedQuery(event, (query) => querySchema.safeParse(query))
  
  if (!query.success) {
    throw query.error.issues;
  }
  
  const user = event.context.user

  if (!user) {
    throw createError({
      status: 401,
      statusText: 'Unauthorized',
    })
  }

  const linkRepo = new LinkRepository(event)

  const data =query.data

  const perPage = 10
  const page = Number(data.page || 0)


  try {
    const tags = data.tags 
      ? (Array.isArray(data.tags) ? data.tags : [data.tags])
      : undefined

    const { links, total } = await linkRepo.findByUserId(user.id, {
      page,
      perPage,
      search: data.q as string | undefined,
      startDate: data.start && data.start !== 'null' ? data.start as string : undefined,
      endDate: data.end && data.end !== 'null' ? data.end as string : undefined,
      linkType: data.linkType as 'all' | 'custom' | 'random' | undefined,
      isPublic: data.is_public,
      tags: tags as string[] | undefined
    })

    return {
      success: true,
      data: links,
      pagination: {
        total,
        page,
        perPage
      }
    }
  } catch (error: any) {
    throw createError({
      status: 500,
      statusText: error.message || 'Failed to fetch links',
    })
  }
})