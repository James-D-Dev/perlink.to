import { createLemonPackCheckout, lemonEnabled } from '../../utils/lemon'
import { checkoutAffiliate } from '../../utils/affiliate'
import { weddingPassBlocked } from '../../utils/weddingPass'

// Paying for the Wedding pass by card: a one-time Lemon Squeezy checkout
// (product "Wedding Pass"). The order webhook turns it on.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (!lemonEnabled(event)) throw createError({ statusCode: 503, statusMessage: 'Card payments are not available yet' })
  if (await weddingPassBlocked(event, user.id)) {
    throw createError({ statusCode: 409, statusMessage: 'Your plan already includes everything in the Wedding pass' })
  }
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  try {
    const url = await createLemonPackCheckout(event, {
      userId: user.id,
      email: user.email,
      name: user.name,
      product: 'wedding',
      redirectUrl: `${siteUrl}/dashboard/upgrade?paid=1`,
      affiliate: await checkoutAffiliate(event, user.id),
    })
    if (!url) throw createError({ statusCode: 503, statusMessage: 'The Wedding pass is not on sale by card yet' })
    return { url }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('[lemon] wedding pass checkout failed:', error?.message)
    throw createError({ statusCode: 502, statusMessage: 'Could not open the checkout, please try again' })
  }
})

