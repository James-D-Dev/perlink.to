import { z } from 'zod'
import { createCreemCheckout, creemCatalog, creemEnabled, packKey } from '../../utils/creem'
import { ownedPacks } from '../../utils/roomPacks'
import { checkoutAffiliate } from '../../utils/affiliate'
import { ROOM_PACKS, type RoomPackId } from '#shared/roomPacks'

const bodySchema = z.object({
  pack: z.enum(ROOM_PACKS.map(p => p.id) as [string, ...string[]]),
  /** Where to come back to after paying (a path on this site) */
  back: z.string().startsWith('/').max(300).optional(),
})

// Buying a room pack: a one-time Creem checkout. The checkout webhook adds
// the pack to the account.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (!creemEnabled(event)) throw createError({ statusCode: 503, statusMessage: 'Card payments are not available yet' })
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Choose a pack' })
  const pack = body.data.pack as RoomPackId

  if ((await ownedPacks(event, user.id)).packs.has(pack)) return { owned: true }

  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const back = body.data.back && !body.data.back.startsWith('//') ? body.data.back : '/marketplace'
  const redirect = new URL(back, siteUrl)
  redirect.searchParams.set('bought', pack)
  try {
    const productId = (await creemCatalog(event)).byKey[packKey(pack)]
    if (!productId) throw createError({ statusCode: 503, statusMessage: 'This pack is not on sale yet' })
    const url = await createCreemCheckout(event, {
      productId,
      userId: user.id,
      email: user.email,
      successUrl: redirect.toString(),
      metadata: { user_id: user.id, pack },
      affiliate: await checkoutAffiliate(event, user.id),
    })
    return { url }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('[creem] pack checkout failed:', error?.message)
    throw createError({ statusCode: 502, statusMessage: 'Could not open the checkout, please try again' })
  }
})
