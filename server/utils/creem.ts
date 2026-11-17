import type { H3Event } from 'h3'
import { isSuperadmin } from './superadmin'
import { PAID_PLANS, PLAN_PRICES_USD, WEDDING_PASS, type BillingPeriod, type PaidPlanId } from '#shared/plans'
import { ROOM_PACKS, type RoomPackId } from '#shared/roomPacks'

// Creem sells online (card, Apple Pay, Google Pay) as Merchant of Record:
// the plans as subscriptions, the room packs and the Wedding pass once. Each
// product carries our own key (external_id, e.g. "plan-starter-monthly"), so
// the site finds it without storing ids; Superadmin → Settings creates the
// missing ones. A test key (creem_test_…) talks to Creem's test API.

export function creemConfig(event: H3Event) {
  const config = useRuntimeConfig(event).creem ?? {}
  const apiKey = String(config.apiKey || '')
  return {
    apiKey,
    webhookSecret: String(config.webhookSecret || ''),
    testMode: apiKey.startsWith('creem_test_'),
  }
}

/**
 * Card payments are on. With a test key only the superadmin sees them:
 * anyone else could pay with a test card and get a plan for free.
 */
export function creemEnabled(event: H3Event) {
  const { apiKey, testMode } = creemConfig(event)
  return !!apiKey && (!testMode || isSuperadmin(event))
}

export class CreemError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

export async function creemApi<T>(event: H3Event, path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const { apiKey, testMode } = creemConfig(event)
  const response = await fetch(`${testMode ? 'https://test-api.creem.io' : 'https://api.creem.io'}${path}`, {
    method: init.method ?? 'GET',
    headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: init.body ? JSON.stringify(init.body) : undefined,
    signal: AbortSignal.timeout(15000),
  })
  const data = await response.json().catch(() => null) as any
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message || data?.error
    throw new CreemError(message || `Creem ${response.status}`, response.status)
  }
  return data as T
}

/** Our key for each product on Creem */
export const planKey = (plan: PaidPlanId, period: BillingPeriod) => `plan-${plan}-${period}`
export const packKey = (pack: RoomPackId) => `pack-${pack}`
export const WEDDING_PASS_KEY = 'wedding-pass'

export interface CreemProduct {
  id: string
  name: string
  price: number
  currency: string
  billing_type: 'recurring' | 'onetime'
  billing_period?: string
  status: string
  external_id?: string | null
}

interface Catalog {
  /** external_id → product id */
  byKey: Record<string, string>
  /** product id → plan, for recurring products */
  plans: Record<string, { plan: PaidPlanId; period: BillingPeriod }>
  /** product id → room pack */
  packs: Record<string, RoomPackId>
  weddingPass?: string
  products: CreemProduct[]
}

export async function listCreemProducts(event: H3Event) {
  const all: CreemProduct[] = []
  for (let page = 1; page <= 10; page++) {
    const res = await creemApi<{ items: CreemProduct[]; pagination?: { next_page?: number | null; total_pages?: number } }>(event, `/v1/products/search?page_number=${page}&page_size=100`)
    all.push(...(res.items ?? []))
    const totalPages = res.pagination?.total_pages ?? 1
    if (!res.items?.length || page >= totalPages) break
  }
  return all
}

// Looked up once per worker for a few minutes, per API key (a test → live
// switch looks again). A catalog missing some of Perlink's products (right
// after a switch, before "Create missing products") is kept only briefly.
let catalog: { at: number; key: string; complete: boolean; value: Catalog } | null = null

export async function creemCatalog(event: H3Event, fresh = false): Promise<Catalog> {
  const key = creemConfig(event).apiKey
  const ttl = catalog?.complete ? 10 * 60 * 1000 : 30 * 1000
  if (!fresh && catalog && catalog.key === key && Date.now() - catalog.at < ttl) return catalog.value
  const products = await listCreemProducts(event)
  const value: Catalog = { byKey: {}, plans: {}, packs: {}, products }
  for (const product of products) {
    const key = product.external_id
    if (!key || product.status === 'archived') continue
    value.byKey[key] = product.id
    for (const plan of PAID_PLANS) {
      for (const period of ['monthly', 'annual'] as const) {
        if (key === planKey(plan, period)) value.plans[product.id] = { plan, period }
      }
    }
    const pack = ROOM_PACKS.find(p => key === packKey(p.id))
    if (pack) value.packs[product.id] = pack.id
    if (key === WEDDING_PASS_KEY) value.weddingPass = product.id
  }
  const complete = wantedProducts(useRuntimeConfig(event).public.siteUrl).every(p => value.byKey[p.external_id])
  catalog = { at: Date.now(), key, complete, value }
  return value
}

/** What Perlink sells on Creem, with the prices in shared/plans and shared/roomPacks */
export function wantedProducts(siteUrl: string) {
  const cover = (name: string) => `${siteUrl}/billing-covers/${name}.jpg`
  const PLAN_TEXT: Record<PaidPlanId, string> = {
    starter: 'Perlink Starter: up to 3 sites, Pro themes, Facebook / TikTok pixels and Google Analytics, a password or opening time on your site, order statuses, clean room videos and which guests opened your invitation.',
    plus: 'Perlink Plus: up to 10 sites, your own domain (3 included), everything in Starter, a year of analytics and unlimited blog posts.',
    max: 'Perlink Max: up to 50 sites and 20 custom domains, every 3D room pack, three years of analytics and priority support. For agencies and chains.',
  }
  const PACK_TEXT: Record<RoomPackId, string> = {
    valentine: 'Six animated 3D items for your Perlink room: a rose arch, rose bouquet, heart balloons, candle heart, beating neon heart and a teddy bear.',
    wedding: 'Six animated 3D items for your Perlink room: a wedding arch with veils, turning cake, pouring champagne tower, LOVE lights, lanterns and sparklers.',
    birthday: 'Six animated 3D items for your Perlink room: a birthday cake with candles, balloons, a popping gift tower, disco light show, confetti cannons and bunting.',
    galaxy: 'Six animated 3D items for your Perlink room: a floating planet with moons, jellyfish lamp, star projector, moon lamp, snow globe and nebula painting.',
    tet: 'Six animated 3D items for your Perlink room: peach and apricot blossom trees with wish cards, a kumquat tree, red lanterns, firecrackers and fruit tray.',
    proposal: 'Six animated 3D items for your Perlink room: an opening ring box, MARRY ME lights, a 99-rose heart, petal aisle, self-playing piano and fireworks.',
    showroom: 'Six animated 3D items that turn your Perlink room into your own shop: a glass cabinet and promo screen showing your real products, a neon sign and sale banner with your own words, a turning product podium and a till.',
  }
  const cap = (s: string) => s[0]!.toUpperCase() + s.slice(1)
  const list: { external_id: string; name: string; description: string; price: number; billing_type: 'recurring' | 'onetime'; billing_period?: string; image_url: string }[] = []
  for (const plan of PAID_PLANS) {
    for (const period of ['monthly', 'annual'] as const) {
      list.push({
        external_id: planKey(plan, period),
        name: `Perlink ${cap(plan)} (${period === 'monthly' ? 'monthly' : 'yearly'})`,
        description: PLAN_TEXT[plan],
        price: PLAN_PRICES_USD[plan][period] * 100,
        billing_type: 'recurring',
        billing_period: period === 'monthly' ? 'every-month' : 'every-year',
        image_url: cover(`plan-${plan}`),
      })
    }
  }
  for (const pack of ROOM_PACKS) {
    list.push({
      external_id: packKey(pack.id),
      name: `${cap(pack.id)} Room Pack`,
      description: PACK_TEXT[pack.id],
      price: pack.priceUsd * 100,
      billing_type: 'onetime',
      image_url: cover(pack.id),
    })
  }
  list.push({
    external_id: WEDDING_PASS_KEY,
    name: 'Wedding Pass',
    description: 'Everything for your wedding invitation site, paid once: a year of Perlink Starter and the Wedding 3D room pack to keep. Nothing renews.',
    price: WEDDING_PASS.priceUsd * 100,
    billing_type: 'onetime',
    image_url: cover('wedding-pass'),
  })
  return list
}

/** Creates the products Creem doesn't have yet; returns the keys it created */
export async function syncCreemProducts(event: H3Event) {
  const siteUrl = useRuntimeConfig(event).public.siteUrl
  const existing = new Set((await listCreemProducts(event)).filter(p => p.status !== 'archived').map(p => p.external_id).filter(Boolean))
  const created: string[] = []
  for (const product of wantedProducts(siteUrl)) {
    if (existing.has(product.external_id)) continue
    await creemApi(event, '/v1/products', {
      method: 'POST',
      body: { ...product, currency: 'USD', tax_mode: 'inclusive', tax_category: 'saas', default_success_url: `${siteUrl}/dashboard/upgrade?paid=1` },
    })
    created.push(product.external_id)
  }
  catalog = null
  return created
}

interface CheckoutInput {
  productId: string
  userId: string
  email?: string | null
  successUrl: string
  /** Kept on the checkout, its order and its subscription; the webhook reads it */
  metadata: Record<string, string>
  affiliate?: string | null
}

/** A hosted checkout page. An affiliate code Creem doesn't know is dropped rather than failing the sale */
export async function createCreemCheckout(event: H3Event, input: CheckoutInput): Promise<string> {
  const body = {
    product_id: input.productId,
    request_id: `${input.userId}:${Date.now()}`,
    success_url: input.successUrl,
    metadata: input.metadata,
    ...(input.email ? { customer: { email: input.email } } : {}),
  }
  try {
    const res = await creemApi<{ checkout_url: string }>(event, '/v1/checkouts', {
      method: 'POST',
      body: input.affiliate ? { ...body, affiliate_code: input.affiliate } : body,
    })
    return res.checkout_url
  } catch (error) {
    if (input.affiliate && error instanceof CreemError && error.status === 400) {
      const res = await creemApi<{ checkout_url: string }>(event, '/v1/checkouts', { method: 'POST', body })
      return res.checkout_url
    }
    throw error
  }
}

export interface CreemSubscription {
  id: string
  status: string
  product: string | { id: string }
  customer: string | { id: string }
  current_period_end_date?: string | null
  canceled_at?: string | null
  metadata?: Record<string, string> | null
}

export const idOf = (value: string | { id: string } | null | undefined) => (typeof value === 'string' ? value : value?.id ?? '')

/** The customer portal (change card, cancel), for the customer behind a subscription */
export async function creemPortalUrl(event: H3Event, subscriptionId: string) {
  const sub = await creemApi<CreemSubscription>(event, `/v1/subscriptions?subscription_id=${encodeURIComponent(subscriptionId)}`)
  const customerId = idOf(sub.customer)
  if (!customerId) return null
  const res = await creemApi<{ customer_portal_link: string }>(event, '/v1/customers/billing', { method: 'POST', body: { customer_id: customerId } })
  return res.customer_portal_link
}

/**
 * Move a running subscription to another plan or period. Creem charges the
 * prorated difference now; the subscription webhook then switches the plan.
 */
export async function switchCreemSubscription(event: H3Event, subscriptionId: string, plan: PaidPlanId, period: BillingPeriod) {
  const { byKey } = await creemCatalog(event)
  const productId = byKey[planKey(plan, period)]
  if (!productId) return false
  await creemApi(event, `/v1/subscriptions/${encodeURIComponent(subscriptionId)}/upgrade`, {
    method: 'POST',
    body: { product_id: productId, update_behavior: 'proration-charge-immediately' },
  })
  return true
}

/** Webhooks are signed: hex HMAC-SHA256 of the raw body with the webhook secret (creem-signature) */
export async function verifyCreemSignature(event: H3Event, rawBody: string, signature: string | undefined) {
  const secret = creemConfig(event).webhookSecret
  if (!secret || !signature) return false
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(rawBody)))
  const expected = [...mac].map(b => b.toString(16).padStart(2, '0')).join('')
  if (expected.length !== signature.length) return false
  let diff = 0
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
  return diff === 0
}
