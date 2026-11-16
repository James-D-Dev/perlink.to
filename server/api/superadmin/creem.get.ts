import { requireSuperadmin } from '../../utils/superadmin'
import { creemCatalog, creemConfig, planKey, wantedProducts } from '../../utils/creem'
import { PAID_PLANS } from '#shared/plans'

// Creem status for Superadmin → Settings: test or live, the webhook secret,
// and which of Perlink's products are on Creem (looked up fresh)
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const config = creemConfig(event)
  if (!config.apiKey) return { configured: false }
  const base = { configured: true, testMode: config.testMode, hasWebhookSecret: !!config.webhookSecret }
  try {
    const catalog = await creemCatalog(event, true)
    const siteUrl = useRuntimeConfig(event).public.siteUrl
    return {
      ...base,
      plans: PAID_PLANS.flatMap(plan => (['monthly', 'annual'] as const).map(period => ({ plan, period, productId: catalog.byKey[planKey(plan, period)] ?? null }))),
      products: wantedProducts(siteUrl).map((p) => {
        const found = catalog.products.find(c => c.external_id === p.external_id && c.status !== 'archived')
        return { key: p.external_id, name: p.name, price: p.price / 100, recurring: p.billing_type === 'recurring', productId: found?.id ?? null, livePrice: found ? found.price / 100 : null }
      }),
    }
  } catch (error: any) {
    return { ...base, error: error?.message || 'Could not reach Creem' }
  }
})
