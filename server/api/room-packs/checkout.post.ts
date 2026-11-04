import { z } from 'zod'
import { createLemonPackCheckout, lemonEnabled } from '../../utils/lemon'
import { ownedPacks } from '../../utils/roomPacks'
import { checkoutAffiliate } from '../../utils/affiliate'
import { ROOM_PACKS, type RoomPackId } from '#shared/roomPacks'

const bodySchema = z.object({
  pack: z.enum(ROOM_PACKS.map(p => p.id) as [string, ...string[]]),
  /** Where to come back to after paying (a path on this site) */
  back: z.string().startsWith('/').max(300).optional(),
})

// Buying a room pack: a one-time Lemon Squeezy checkout. The order webhook
// adds the pack to the account.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (!lemonEnabled(event)) throw createError({ statusCode: 503, statusMessage: 'Card payments are not available yet' })
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Choose a pack' })
  const pack = body.data.pack as RoomPackId

  if ((await ownedPacks(event, user.id)).packs.has(pack)) return { owned: true }

  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const back = body.data.back && !body.data.back.startsWith('//') ? body.data.back : '/marketplace'
  const redirect = new URL(back, siteUrl)
  redirect.searchParams.set('bought', pack)
  try {
    const url = await createLemonPackCheckout(event, {
      userId: user.id,
      email: user.email,
      name: user.name,
      pack,
      redirectUrl: redirect.toString(),
      affiliate: await checkoutAffiliate(event, user.id),
    })
    if (!url) throw createError({ statusCode: 503, statusMessage: 'This pack is not on sale yet' })
    return { url }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('[lemon] pack checkout failed:', error?.message)
    throw createError({ statusCode: 502, statusMessage: 'Could not open the checkout, please try again' })
  }
})
