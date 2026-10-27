import { requireSuperadmin } from '../../utils/superadmin'
import { lemonApi, lemonCatalog, lemonConfig } from '../../utils/lemon'
import { onSale, PAID_PLANS } from '#shared/plans'

// Lemon Squeezy status for Superadmin → Settings: the store, and which
// product variant each plan sells through (looked up fresh)
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  const config = lemonConfig(event)
  if (!config.apiKey) return { configured: false }
  try {
    const found = await lemonCatalog(event, true)
    const store = await lemonApi<{ data: { attributes: { name: string; domain: string; test_mode?: boolean } } }>(event, `/stores/${found.storeId}`)
    const products = await lemonApi<{ data: { id: string; attributes: { name: string; status: string } }[] }>(event, `/products?filter[store_id]=${found.storeId}&page[size]=100`)
    const variants = await lemonApi<{ data: { id: string; attributes: { product_id: number; name: string; price: number; interval: string | null; status: string } }[] }>(event, '/variants?page[size]=100')
    const productIds = new Set(products.data.map(p => p.id))
    return {
      configured: true,
      hasWebhookSecret: !!config.webhookSecret,
      store: { id: found.storeId, name: store.data.attributes.name, domain: store.data.attributes.domain },
      plans: PAID_PLANS.filter(onSale).flatMap(plan => (['monthly', 'annual'] as const).map(period => ({ plan, period, variantId: found.variants[`${plan}:${period}`] ?? null }))),
      products: products.data.map(p => ({
        id: p.id,
        name: p.attributes.name,
        status: p.attributes.status,
        variants: variants.data
          .filter(v => productIds.has(String(v.attributes.product_id)) && String(v.attributes.product_id) === p.id)
          .map(v => ({ id: v.id, name: v.attributes.name, price: v.attributes.price / 100, interval: v.attributes.interval, status: v.attributes.status })),
      })),
    }
  } catch (error: any) {
    return { configured: true, hasWebhookSecret: !!config.webhookSecret, error: error?.message || 'Could not reach Lemon Squeezy' }
  }
})
