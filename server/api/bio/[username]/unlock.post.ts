import { z } from 'zod'
import { BioRepository } from '../../../repositories/bioRepository'
import { hashIP } from '../../../services/analytics'
import { getAccessHash, setUnlockCookie, verifyPassword } from '../../../utils/siteAccess'

// A visitor enters a private site's password; right, they get a cookie that
// keeps it open in this browser for 30 days

const MAX_TRIES = 10
const tries = new Map<string, { n: number; until: number }>()

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  const body = z.object({ password: z.string().min(1).max(200) }).safeParse(await readBody(event))
  if (!username || !body.success) throw createError({ statusCode: 400, statusMessage: 'Enter the password' })

  const site = await new BioRepository(event).findByUsername(username)
  if (!site?.isPublished) throw createError({ statusCode: 404, statusMessage: 'Site not found' })
  const accessHash = await getAccessHash(event, site.id)
  if (!accessHash) return { success: true }

  // Slow down guessing: a few wrong tries per address per 10 minutes (per isolate)
  const ip = getRequestHeader(event, 'cf-connecting-ip') || '0.0.0.0'
  const key = `${site.id}:${await hashIP(ip, site.id)}`
  const now = Date.now()
  const seen = tries.get(key)
  if (seen && seen.until > now && seen.n >= MAX_TRIES) throw createError({ statusCode: 429, statusMessage: 'Too many tries, please wait a few minutes' })

  if (!(await verifyPassword(body.data.password, accessHash))) {
    tries.set(key, { n: (seen && seen.until > now ? seen.n : 0) + 1, until: now + 10 * 60_000 })
    throw createError({ statusCode: 401, statusMessage: 'Wrong password' })
  }
  tries.delete(key)
  await setUnlockCookie(event, site.id, accessHash)
  return { success: true }
})
