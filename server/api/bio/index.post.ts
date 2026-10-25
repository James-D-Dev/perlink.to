import { BioRepository } from '../../repositories/bioRepository'
import { z } from 'zod'
import { isReservedName } from '../../utils/reservedNames'
import { requireRoomForSite } from '../../utils/plan'

const createBioSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_-]+$/),
  title: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  templateId: z.enum(['modern', 'minimal', 'creative', 'professional']).default('modern'),
  themeConfig: z.object({
    primaryColor: z.string().optional(),
    backgroundColor: z.string().optional(),
    fontFamily: z.string().optional()
  }).optional(),
  links: z.array(z.object({
    id: z.string(),
    title: z.string(),
    url: z.string().url(),
    icon: z.string().optional(),
    order: z.number(),
    isActive: z.boolean()
  })).optional(),
  socialLinks: z.object({
    facebook: z.string().url().optional(),
    twitter: z.string().url().optional(),
    instagram: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    youtube: z.string().url().optional(),
    tiktok: z.string().url().optional()
  }).optional()
})

export default defineEventHandler(async (event) => {
  const user = event.context.user
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const body = await readBody(event)
  const result = createBioSchema.safeParse(body)
  
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input',
      data: result.error.issues
    })
  }

  try {
    const bioRepo = new BioRepository(event)
    await requireRoomForSite(event, user.id)

    if (isReservedName(result.data.username)) {
      throw createError({ statusCode: 400, statusMessage: 'This name is reserved' })
    }

    // Check if username is available
    const isAvailable = await bioRepo.isUsernameAvailable(result.data.username)
    if (!isAvailable) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Username already taken'
      })
    }

    // Create bio page
    const bioPage = await bioRepo.create({
      userId: user.id,
      username: result.data.username,
      title: result.data.title,
      bio: result.data.bio,
      avatarUrl: result.data.avatarUrl,
      templateId: result.data.templateId,
      themeConfig: result.data.themeConfig,
      links: result.data.links,
      socialLinks: result.data.socialLinks
    })

    return {
      success: true,
      bioPage
    }
  } catch (e: any) {
    if (e.statusCode) throw e
    console.error('[POST /api/bio]', e)
    throw createError({
      statusCode: 500,
      statusMessage: e?.message ?? 'Internal server error',
    })
  }
})
