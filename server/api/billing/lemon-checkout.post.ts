import { z } from 'zod'
import { getDB } from '../../utils/db'
import { createLemonCheckout, lemonEnabled, lemonPortalUrl, switchLemonSubscription } from '../../utils/lemon'
import { PAID_PLANS, type PaidPlanId } from '#shared/plans'
import { checkoutAffiliate } from '../../utils/affiliate'

const bodySchema = z.object({
  plan: z.enum(PAID_PLANS as [string, ...string[]]),
  period: z.enum(['monthly', 'annual']),
  /** Confirmed: move the running subscription to this plan */
  switch: z.boolean().optional(),
})

// Paying by card / PayPal: a Lemon Squeezy checkout for the plan. Someone who
// already has a running subscription isn't charged twice: another plan or
// period switches that subscription (after they confirm), and the same one
// opens their customer portal.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (!lemonEnabled(event)) throw createError({ statusCode: 503, statusMessage: 'Card payments are not available yet' })
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Choose a plan' })
  const plan = body.data.plan as PaidPlanId

  const running = await getDB(event)
    .prepare(`SELECT id, plan, period, portal_url FROM subscriptions WHERE user_id = ? AND status IN ('on_trial', 'active', 'past_due', 'paused') ORDER BY updated_at DESC LIMIT 1`)
    .bind(user.id)
    .first<{ id: string; plan: string; period: string; portal_url: string | null }>()
  if (running) {
    const period = body.data.period
    if (running.plan === plan && running.period === period) {
      // Same plan: their portal, to change card or cancel (a fresh link; stored ones expire)
      const portalUrl = await lemonPortalUrl(event, running.id).catch(() => running.portal_url)
      return { portalUrl }
    }
    if (!body.data.switch) return { needsSwitch: true, from: { plan: running.plan, period: running.period } }
    try {
      const switched = await switchLemonSubscription(event, running.id, plan, period)
      if (!switched) throw createError({ statusCode: 503, statusMessage: 'This plan is not on sale by card yet' })
      return { switched: true }
    } catch (error: any) {
      if (error?.statusCode) throw error
      console.error('[lemon] switch failed:', error?.message)
      throw createError({ statusCode: 502, statusMessage: 'Could not change your plan, please try again' })
    }
  }

  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const affiliate = await checkoutAffiliate(event, user.id)
  try {
    const url = await createLemonCheckout(event, {
      userId: user.id,
      email: user.email,
      name: user.name,
      plan,
      period: body.data.period,
      redirectUrl: `${siteUrl}/dashboard/upgrade?paid=1`,
      affiliate,
    })
    if (!url) throw createError({ statusCode: 503, statusMessage: 'This plan is not on sale by card yet' })
    return { url }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('[lemon] checkout failed:', error?.message)
    throw createError({ statusCode: 502, statusMessage: 'Could not open the checkout, please try again' })
  }
})
