import type { H3Event } from 'h3'
import { PAID_PLANS, type BillingPeriod, type PaidPlanId } from '#shared/plans'

// Lemon Squeezy sells the plans as subscriptions (card, PayPal, Apple Pay),
// as Merchant of Record. Its products are named after the plans ("Starter",
// "Plus", "Pro") with a monthly and a yearly variant; those are found through
// the API, so only the API key and the webhook secret need setting up.

const API = 'https://api.lemonsqueezy.com/v1'

export function lemonConfig(event: H3Event) {
  const config = useRuntimeConfig(event).lemon
  return {
    apiKey: String(config.apiKey || ''),
    webhookSecret: String(config.webhookSecret || ''),
    storeId: String(config.storeId || ''),
  }
}

export const lemonEnabled = (event: H3Event) => !!lemonConfig(event).apiKey

interface JsonApiItem<A> { id: string; type: string; attributes: A; relationships?: Record<string, { data?: { id: string; type: string } | null }> }

async function lemonApi<T>(event: H3Event, path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    method: init.method ?? 'GET',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${lemonConfig(event).apiKey}`,
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    signal: AbortSignal.timeout(15000),
  })
  const data = await response.json().catch(() => null) as T & { errors?: { detail?: string }[] }
  if (!response.ok) throw new Error(data?.errors?.[0]?.detail || `Lemon Squeezy ${response.status}`)
  return data
}

type VariantKey = `${PaidPlanId}:${BillingPeriod}`
interface Catalog { storeId: string; variants: Partial<Record<VariantKey, string>>; plans: Record<string, { plan: PaidPlanId; period: BillingPeriod }> }

// Looked up once per worker; a new deploy (or a cold start) looks again
let catalog: { at: number; value: Catalog } | null = null

export async function lemonCatalog(event: H3Event): Promise<Catalog> {
  if (catalog && Date.now() - catalog.at < 10 * 60 * 1000) return catalog.value
  let storeId = lemonConfig(event).storeId
  if (!storeId) {
    const stores = await lemonApi<{ data: JsonApiItem<{ name: string }>[] }>(event, '/stores')
    storeId = stores.data[0]?.id ?? ''
  }
  const products = await lemonApi<{ data: JsonApiItem<{ name: string; status: string }>[] }>(event, `/products?filter[store_id]=${storeId}&page[size]=100`)
  const planOfProduct = new Map<string, PaidPlanId>()
  for (const product of products.data) {
    const name = product.attributes.name.toLowerCase()
    const plan = PAID_PLANS.find(id => new RegExp(`\\b${id}\\b`).test(name))
    if (plan) planOfProduct.set(product.id, plan)
  }
  const variants = await lemonApi<{ data: JsonApiItem<{ product_id: number; interval: string | null; status: string }>[] }>(event, `/variants?page[size]=100`)
  const value: Catalog = { storeId, variants: {}, plans: {} }
  for (const variant of variants.data) {
    const plan = planOfProduct.get(String(variant.attributes.product_id))
    const period: BillingPeriod | null = variant.attributes.interval === 'month' ? 'monthly' : variant.attributes.interval === 'year' ? 'annual' : null
    if (!plan || !period || variant.attributes.status === 'draft') continue
    value.variants[`${plan}:${period}`] = variant.id
    value.plans[variant.id] = { plan, period }
  }
  catalog = { at: Date.now(), value }
  return value
}

/** A hosted checkout for this plan, tagged with the account so the webhook can find it */
export async function createLemonCheckout(event: H3Event, input: { userId: string; email: string; name?: string | null; plan: PaidPlanId; period: BillingPeriod; redirectUrl: string }) {
  const { storeId, variants } = await lemonCatalog(event)
  const variantId = variants[`${input.plan}:${input.period}`]
  if (!variantId) return null
  const res = await lemonApi<{ data: JsonApiItem<{ url: string }> }>(event, '/checkouts', {
    method: 'POST',
    body: {
      data: {
        type: 'checkouts',
        attributes: {
          checkout_data: {
            email: input.email,
            name: input.name || undefined,
            custom: { user_id: input.userId, plan: input.plan, period: input.period },
          },
          product_options: { redirect_url: input.redirectUrl, enabled_variants: [Number(variantId)] },
          checkout_options: { embed: false },
        },
        relationships: {
          store: { data: { type: 'stores', id: storeId } },
          variant: { data: { type: 'variants', id: variantId } },
        },
      },
    },
  })
  return res.data.attributes.url
}

/** Webhooks are signed: hex HMAC-SHA256 of the raw body with the signing secret */
export async function verifyLemonSignature(event: H3Event, rawBody: string, signature: string | undefined) {
  const secret = lemonConfig(event).webhookSecret
  if (!secret || !signature) return false
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody)))
  const expected = [...mac].map(b => b.toString(16).padStart(2, '0')).join('')
  if (expected.length !== signature.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  return diff === 0
}
