import { BioRepository } from '../repositories/bioRepository'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { username } = body as { username: string }

  if (!username || typeof username !== 'string') {
    return {
      success: false,
      message: 'Username is required'
    }
  }

  // Validate username format (lowercase, alphanumeric, hyphen, underscore, 3-30 chars)
  const usernameRegex = /^[a-z0-9_-]{3,30}$/
  if (!usernameRegex.test(username)) {
    return {
      success: false,
      message: 'Username must be 3-30 characters, lowercase letters, numbers, hyphens, or underscores only'
    }
  }

  const bioRepo = new BioRepository(event)

  try {
    const isAvailable = await bioRepo.isUsernameAvailable(username)

    if (!isAvailable) {
      return {
        success: false,
        message: 'Username is already taken'
      }
    }

    return {
      success: true,
      message: 'Username is available'
    }
  } catch (error) {
    console.error('Error checking bio username:', error)
    return {
      success: false,
      message: 'Error checking username availability'
    }
  }
})
