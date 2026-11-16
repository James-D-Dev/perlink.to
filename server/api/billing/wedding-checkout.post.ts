import { createCreemCheckout, creemCatalog, creemEnabled } from '../../utils/creem'
import { checkoutAffiliate } from '../../utils/affiliate'
import { weddingPassBlocked } from '../../utils/weddingPass'

// Paying for the Wedding pass by card: a one-time Creem checkout (product
// "wedding-pass"). The checkout webhook turns it on.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (!creemEnabled(event)) throw createError({ statusCode: 503, statusMessage: 'Card payments are not available yet' })
  if (await weddingPassBlocked(event, user.id)) {
    throw createError({ statusCode: 409, statusMessage: 'Your plan already includes everything in the Wedding pass' })
  }
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  try {
    const productId = (await creemCatalog(event)).weddingPass
    if (!productId) throw createError({ statusCode: 503, statusMessage: 'The Wedding pass is not on sale by card yet' })
    const url = await createCreemCheckout(event, {
      productId,
      userId: user.id,
      email: user.email,
      successUrl: `${siteUrl}/dashboard/upgrade?paid=1`,
      metadata: { user_id: user.id, product: 'wedding' },
      affiliate: await checkoutAffiliate(event, user.id),
    })
    return { url }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('[creem] wedding pass checkout failed:', error?.message)
    throw createError({ statusCode: 502, statusMessage: 'Could not open the checkout, please try again' })
  }
})
