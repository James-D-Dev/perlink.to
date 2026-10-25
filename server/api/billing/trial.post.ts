import { getDB } from '../../utils/db'
import { getAccountPlan, grantPlan } from '../../utils/plan'
import { TRIAL_DAYS, TRIAL_PLAN } from '#shared/plans'

// The one free trial of a paid plan, for accounts on the free plan
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const account = await getAccountPlan(event, user.id)
  if (account.trialUsed) throw createError({ statusCode: 409, statusMessage: 'The free trial was already used' })
  if (account.plan !== 'free') throw createError({ statusCode: 409, statusMessage: 'You already have a paid plan' })
  // Claimed first, so two quick clicks can't start two trials
  const claim = await getDB(event).prepare('UPDATE profiles SET trial_used = 1 WHERE id = ? AND trial_used = 0').bind(user.id).run()
  if (!(claim.meta as { changes?: number } | undefined)?.changes) throw createError({ statusCode: 409, statusMessage: 'The free trial was already used' })
  const expiresAt = await grantPlan(event, user.id, TRIAL_PLAN, { days: TRIAL_DAYS })
  return { plan: TRIAL_PLAN, expiresAt }
})
