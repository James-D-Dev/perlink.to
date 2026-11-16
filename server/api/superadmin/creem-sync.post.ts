import { requireSuperadmin } from '../../utils/superadmin'
import { creemEnabled, syncCreemProducts } from '../../utils/creem'

// Superadmin → Settings → "Create missing products": puts every plan, room
// pack and the Wedding pass on Creem (test or live, by the API key)
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  if (!creemEnabled(event)) throw createError({ statusCode: 503, statusMessage: 'Set NUXT_CREEM_API_KEY first' })
  try {
    return { created: await syncCreemProducts(event) }
  } catch (error: any) {
    throw createError({ statusCode: 502, statusMessage: error?.message || 'Could not reach Creem' })
  }
})
