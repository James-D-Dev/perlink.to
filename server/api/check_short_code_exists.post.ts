import { shortCodeValidate } from '../services/Validate'
import { LinkRepository } from '../repositories/linkRepository'
 

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { short_code } = body as { short_code: string }

  const validate = shortCodeValidate(short_code)
  if (!validate.success) {
    return {
      success: false,
      message: validate.message
    }
  }

  const linkRepo = new LinkRepository(event)

  try {
    const exists = await linkRepo.checkShortCodeExists(short_code)

    if (exists) {
      return {
        success: false,
        message: "Back-half is already taken"
      }
    }

    return {
      success: true,
      message: "Back-half is available"
    }
  } catch (error: any) {
    throw createError({ status: 500, statusText: error.message })
  }
})