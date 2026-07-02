import { titleValidate } from '../../services/Validate'
import { LinkRepository } from '../../repositories/linkRepository'

interface LinkUpdateBody {
  is_public: boolean
  title: string
  qr: {
    foreground: string
    background: string
    logoSize: number
  }
  password: {
    enabled: boolean
    password: string
    message: string
  }
}

export default defineEventHandler(async (event) => {
  const shortCode = getRouterParam(event, 'short_code')
  const body: LinkUpdateBody | undefined = await readBody(event)

  if (!shortCode) {
    return {
      success: false,
      message: 'Link not found'
    }
  }
  
  if (!body) {
    return {
      success: false,
      message: 'Invalid request body'
    }
  }

  const linkRepo = new LinkRepository(event)

  if (body.title) {
    const validateTitle = titleValidate(body.title)
    if (!validateTitle.success) {
      return {
        success: false,
        message: validateTitle.message
      }
    }
  }

  try {
    const currentLink = await linkRepo.findByShortCode(shortCode)
    
    if (!currentLink) {
      return {
        success: false,
        message: 'Link not found'
      }
    }

    // Cập nhật meta fields
    let updatedMeta = { ...currentLink.meta } as Record<string, any>

    if (body.title) {
      updatedMeta.title = body.title
    }

    if (body.qr) {
      updatedMeta.qr = body.qr
    }

    if (body.password) {
      updatedMeta.password = body.password
    }

    const updateData: any = {}
    
    if (body.is_public != null) {
      updateData.is_public = body.is_public
    }
    
    if (body.title || body.qr || body.password) {
      updateData.meta = updatedMeta
    }

    const data = await linkRepo.update(shortCode, updateData)

    if (!data) {
      return {
        success: false,
        message: 'Failed to update link'
      }
    }

    return {
      success: true,
      data: {
        content: data.content,
        type: data.type,
        meta: data.meta,
        is_public: data.is_public
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Failed to update link'
    }
  }
})
