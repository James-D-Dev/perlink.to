import { z } from 'zod'
import { getDB } from '../../utils/db'
import { isAffiliateCode } from '#shared/affiliate'

// Save (or clear) the account's Lemon Squeezy affiliate code. Its sites'
// "Made with Perlink" badges then carry it.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const body = z.object({ code: z.string().trim().max(40).nullable() }).safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Invalid code' })
  // People paste their whole link: keep just the code
  const raw = body.data.code ?? ''
  const code = raw.match(/[?&]aff=([A-Za-z0-9_-]+)/)?.[1] ?? raw
  if (code && !isAffiliateCode(code)) throw createError({ statusCode: 400, statusMessage: 'Use the code from your affiliate link (letters, numbers, - and _)' })
  await getDB(event).prepare('UPDATE profiles SET affiliate_code = ? WHERE id = ?').bind(code || null, user.id).run()
  return { success: true, code: code || null }
})
