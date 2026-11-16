import { z } from 'zod'
import { getDB } from '../../utils/db'
import { createCreemCheckout, creemCatalog, creemEnabled, creemPortalUrl, planKey, switchCreemSubscription } from '../../utils/creem'
import { PAID_PLANS, type PaidPlanId } from '#shared/plans'
import { checkoutAffiliate } from '../../utils/affiliate'

const bodySchema = z.object({
  plan: z.enum(PAID_PLANS as [string, ...string[]]),
  period: z.enum(['monthly', 'annual']),
  /** Confirmed: move the running subscription to this plan */
  switch: z.boolean().optional(),
})

// Paying by card: a Creem checkout for the plan. Someone who already has a
// running subscription isn't charged twice: another plan or period switches
// that subscription (after they confirm), and the same one opens their
// customer portal.
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  if (!creemEnabled(event)) throw createError({ statusCode: 503, statusMessage: 'Card payments are not available yet' })
  const body = bodySchema.safeParse(await readBody(event))
  if (!body.success) throw createError({ statusCode: 400, statusMessage: 'Choose a plan' })
  const plan = body.data.plan as PaidPlanId
  const period = body.data.period

  const running = await getDB(event)
    .prepare(`SELECT id, plan, period, portal_url FROM subscriptions WHERE user_id = ? AND id LIKE 'sub_%' AND status IN ('on_trial', 'active', 'past_due', 'paused') ORDER BY updated_at DESC LIMIT 1`)
    .bind(user.id)
    .first<{ id: string; plan: string; period: string; portal_url: string | null }>()
  if (running) {
    if (running.plan === plan && running.period === period) {
      // Same plan: their portal, to change card or cancel (a fresh link)
      const portalUrl = await creemPortalUrl(event, running.id).catch(() => running.portal_url)
      return { portalUrl }
    }
    if (!body.data.switch) return { needsSwitch: true, from: { plan: running.plan, period: running.period } }
    try {
      const switched = await switchCreemSubscription(event, running.id, plan, period)
      if (!switched) throw createError({ statusCode: 503, statusMessage: 'This plan is not on sale by card yet' })
      return { switched: true }
    } catch (error: any) {
      if (error?.statusCode) throw error
      console.error('[creem] switch failed:', error?.message)
      throw createError({ statusCode: 502, statusMessage: 'Could not change your plan, please try again' })
    }
  }

  const siteUrl = useRuntimeConfig(event).public.siteUrl
  try {
    const productId = (await creemCatalog(event)).byKey[planKey(plan, period)]
    if (!productId) throw createError({ statusCode: 503, statusMessage: 'This plan is not on sale by card yet' })
    const url = await createCreemCheckout(event, {
      productId,
      userId: user.id,
      email: user.email,
      successUrl: `${siteUrl}/dashboard/upgrade?paid=1`,
      metadata: { user_id: user.id, plan, period },
      affiliate: await checkoutAffiliate(event, user.id),
    })
    return { url }
  } catch (error: any) {
    if (error?.statusCode) throw error
    console.error('[creem] checkout failed:', error?.message)
    throw createError({ statusCode: 502, statusMessage: 'Could not open the checkout, please try again' })
  }
})
