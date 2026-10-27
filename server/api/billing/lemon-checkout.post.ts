import { z } from 'zod'
import { getDB } from '../../utils/db'
import { createLemonCheckout, lemonEnabled } from '../../utils/lemon'
import { PAID_PLANS, onSale, type PaidPlanId } from '#shared/plans'

const bodySchema = z.object({
  plan: z.enum(PAID_PLANS as [string, ...string[]]),
  period: z.enum(['monthly', 'annual']),
})

// Paying by card / PayPal: a Lemon Squeezy checkout for the plan. Someone who
// already has a running subscription gets their customer portal instead, to
// switch plan there rather than being charged twice.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (!lemonEnabled(event)) throw createError({ statusCode: 503, statusMessage: 'Card payments are not available yet' })
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Choose a plan' })
  const plan = body.data.plan as PaidPlanId
  if (!onSale(plan)) throw createError({ statusCode: 403, statusMessage: 'This plan is coming soon' })

  const running = await getDB(event)
    .prepare(`SELECT portal_url FROM subscriptions WHERE user_id = ? AND status IN ('on_trial', 'active', 'past_due', 'paused') ORDER BY updated_at DESC LIMIT 1`)
    .bind(user.id)
    .first<{ portal_url: string | null }>()
  if (running?.portal_url) return { portalUrl: running.portal_url }

  const siteUrl = useRuntimeConfig(event).public.siteUrl
  try {
    const url = await createLemonCheckout(event, {
      userId: user.id,
      email: user.email,
      name: user.name,
      plan,
      period: body.data.period,
      redirectUrl: `${siteUrl}/dashboard/upgrade?paid=1`,
    })
    if (!url) throw createError({ statusCode: 503, statusMessage: 'This plan is not on sale by card yet' })
    return { url }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('[lemon] checkout failed:', error?.message)
    throw createError({ statusCode: 502, statusMessage: 'Could not open the checkout, please try again' })
  }
})
