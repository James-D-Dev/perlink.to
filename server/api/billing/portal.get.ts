import { getDB } from '../../utils/db'
import { creemEnabled, creemPortalUrl } from '../../utils/creem'

// "Manage subscription": a fresh link to the signed-in user's Creem customer
// portal (change card, cancel), opened straight from the dashboard
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) return sendRedirect(event, '/login?redirect=/dashboard/upgrade', 302)
  if (!creemEnabled(event)) throw createError({ statusCode: 503, statusMessage: 'Card payments are not available yet' })
  const sub = await getDB(event)
    .prepare(`SELECT id FROM subscriptions WHERE user_id = ? AND id LIKE 'sub_%' ORDER BY updated_at DESC LIMIT 1`)
    .bind(user.id)
    .first<{ id: string }>()
  if (!sub) return sendRedirect(event, '/dashboard/upgrade', 302)
  const url = await creemPortalUrl(event, sub.id).catch((error: any) => {
    console.error('[creem] portal failed:', error?.message)
    return null
  })
  if (!url) throw createError({ statusCode: 502, statusMessage: 'Could not open your subscription settings, please try again or email support@perlink.to' })
  return sendRedirect(event, url, 302)
})
