import { LinkRepository } from '../../../repositories/linkRepository'

export default defineEventHandler(async (event) => {
  const shortCode = getRouterParam(event, 'short_code')
  const body = await readBody(event)

  if (!shortCode) {
    return { success: false, message: 'Short code is required' }
  }

  if (!body?.password) {
    return { success: false, message: 'Password is required' }
  }

  const linkRepo = new LinkRepository(event)

  try {
    const link = await linkRepo.findByShortCode(shortCode)

    if (!link) {
      return { success: false, message: 'Link not found' }
    }

    const meta = link.meta as Record<string, any> | null
    if (!meta?.password?.enabled) {
      return { success: true, url: link.content }
    }

    if (body.password !== meta.password.password) {
      return { success: false, message: 'Incorrect password' }
    }

    // Track click on successful verification
    try {
      await linkRepo.incrementClickCount(link.id)
    } catch (e) {
      // Silent fail
    }

    return { success: true, url: link.content }
  } catch (error: any) {
    return { success: false, message: error.message || 'Verification failed' }
  }
})
