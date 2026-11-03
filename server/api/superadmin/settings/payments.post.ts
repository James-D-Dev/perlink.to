import { z } from 'zod'
import { requireSuperadmin } from '../../../utils/superadmin'
import { setSetting } from '../../../utils/appSettings'

// Turn VietQR bank transfers for plans on or off
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const body = z.object({ bank: z.boolean() }).safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Send { bank: boolean }' })
  await setSetting(event, 'bank_payments', body.data.bank ? '1' : '0')
  return { success: true, bank: body.data.bank }
})
