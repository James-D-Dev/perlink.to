import { isReservedName } from '../utils/reservedNames'
import { BioRepository } from '../repositories/bioRepository'
import { LinkRepository } from '../repositories/linkRepository'

const whiteListedRoutes = [
  'about', 'contact', 'login', 'confirm', 'cookie-notice',
  'privacy', 'terms', 'admin', 'dashboard', 'superadmin', 'api', 'tasks', '404'
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { slug, domain } = body as { slug: string; domain?: string }

  if (!slug || typeof slug !== 'string') {
    return {
      success: false,
      message: 'Slug is required'
    }
  }

  const trimmedSlug = slug.trim().toLowerCase()

  if (!trimmedSlug) {
    return {
      success: false,
      message: 'Slug cannot be empty'
    }
  }

  // Check reserved routes
  if (whiteListedRoutes.includes(trimmedSlug) || isReservedName(trimmedSlug)) {
    return {
      success: false,
      message: 'This name is reserved'
    }
  }

  // Validate format (3-30 chars, alphanumeric, hyphen, underscore)
  // Using bio_pages format (3-30 chars) which is more permissive than links (10-30)
  const slugRegex = /^[a-z0-9_-]{3,30}$/
  if (!slugRegex.test(trimmedSlug)) {
    return {
      success: false,
      message: 'Link name must be 3-30 characters, lowercase letters, numbers, hyphens, or underscores only'
    }
  }

  const bioRepo = new BioRepository(event)
  const linkRepo = new LinkRepository(event)

  try {
    let taken = false

    if (domain === 's.perlink.to') {
      taken = await linkRepo.checkShortCodeExists(trimmedSlug)
    } else {
      // perlink.to or no domain — check bio table only
      taken = await bioRepo.findByUsername(trimmedSlug).then(r => !!r)
    }

    if (taken) {
      return {
        success: false,
        message: 'This link name is already taken'
      }
    }

    return {
      success: true,
      message: 'Link name is available'
    }
  } catch (error) {
    console.error('Error checking slug availability:', error)
    return {
      success: false,
      message: 'Error checking availability'
    }
  }
})
