import { BioRepository } from '../../repositories/bioRepository'
import { z } from 'zod'

const urlSchema = z.string().refine(
  (val) => !val || /^https?:\/\/.+/.test(val),
  { message: 'Invalid URL format' }
).or(z.string().min(1)); // Also allow any non-empty string

const updateBioSchema = z.object({
  title: z.string().max(100).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: urlSchema.optional(),
  templateId: z.enum(['modern', 'minimal', 'creative', 'professional']).optional(),
  blocks: z.array(z.any()).optional(),
  themeConfig: z.object({
    colors: z.object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      third: z.string().optional()
    }).optional(),
    background: z.object({
      type: z.enum(['solid', 'gradient', 'image', 'video', 'effect']).optional(),
      color: z.string().optional(),
      gradient: z.object({
        angle: z.number().optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        via: z.string().optional()
      }).optional(),
      imageUrl: z.string().optional(),
      imageOverlay: z.string().optional(),
      videoUrl: z.string().optional(),
      effectId: z.string().optional()
    }).optional(),
    card: z.object({
      style: z.enum(['filled', 'outline', 'ghost', 'soft']).optional(),
      cornerRadius: z.number().optional(),
      transparency: z.number().min(0).max(1).optional(),
      shadow: z.enum(['none', 'sm', 'md', 'lg']).optional(),
      backdropBlur: z.enum(['none', 'sm', 'md', 'lg', 'xl']).optional(),
      outlineColor: z.string().optional(),
      textColor: z.string().optional(),
      animationAppear: z.string().optional(),
      animationHover: z.string().optional(),
      animationDuration: z.enum(['faster', 'fast', 'normal', 'slow', 'slower']).optional()
    }).optional(),
    button: z.object({
      style: z.enum(['filled', 'outline', 'ghost', 'soft']).optional(),
      cornerRadius: z.number().optional(),
      shadow: z.enum(['none', 'sm', 'md', 'lg']).optional(),
      textColor: z.string().optional(),
      animationAppear: z.string().optional(),
      animationHover: z.string().optional(),
      animationDuration: z.enum(['faster', 'fast', 'normal', 'slow', 'slower']).optional()
    }).optional(),
    header: z.object({
      alignment: z.enum(['left', 'center', 'right']).optional(),
      spacing: z.enum(['compact', 'normal', 'spacious']).optional(),
      layout: z.enum(['centered', 'left', 'cover', 'banner-circle', 'banner-square', 'image-overlay']).optional(),
      bannerUrl: z.string().optional()
    }).optional(),
    avatar: z.object({
      shape: z.enum(['circle', 'square', 'rounded']).optional(),
      size: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
      border: z.boolean().optional(),
      borderColor: z.string().optional(),
      animationAppear: z.string().optional(),
      animationHover: z.string().optional(),
      animationDuration: z.enum(['faster', 'fast', 'normal', 'slow', 'slower']).optional()
    }).optional(),
    link: z.object({
      layout: z.enum(['vertical', 'horizontal-left', 'horizontal-right']).optional()
    }).optional(),
    typography: z.object({
      nameFont: z.string().optional(),
      headingFont: z.string().optional(),
      paragraphFont: z.string().optional(),
      nameSize: z.enum(['sm', 'md', 'lg', 'xl']).optional(),
      paragraphSize: z.enum(['xs', 'sm', 'md']).optional()
    }).optional()
  }).optional(),
  links: z.array(z.object({
    id: z.string(),
    title: z.string(),
    subtitle: z.string().optional(),
    url: urlSchema,
    icon: z.string().optional(),
    imageUrl: z.string().optional(),
    order: z.number(),
    isActive: z.boolean()
  })).optional(),
  socialLinks: z.object({
    facebook: urlSchema.optional(),
    twitter: urlSchema.optional(),
    instagram: urlSchema.optional(),
    linkedin: urlSchema.optional(),
    youtube: urlSchema.optional(),
    tiktok: urlSchema.optional()
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
  const result = updateBioSchema.safeParse(body)
  
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input',
      data: result.error.issues
    })
  }

  try {
    const bioRepo = new BioRepository(event)
    const existing = await bioRepo.findByUserId(user.id)

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Bio page not found'
      })
    }

    // Update bio page
    const bioPage = await bioRepo.update(existing.id, result.data)

    return {
      success: true,
      bioPage
    }
  } catch (e: any) {
    console.error('[PUT /api/bio]', e)
    if (e.statusCode) throw e
    throw createError({
      statusCode: 500,
      statusMessage: e?.message ?? 'Internal server error',
    })
  }
})
