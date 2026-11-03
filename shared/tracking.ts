// Analytics and ad tags an owner puts on their site (paid plans): only the
// IDs are stored, checked against each provider's format, so nothing but a
// known snippet with a plain ID ever reaches the page.

export interface SiteTracking {
  /** Facebook / Meta Pixel ID, e.g. 1234567890123456 */
  metaPixel?: string
  /** TikTok Pixel ID, e.g. CABC123DEF456GHI789J */
  tiktokPixel?: string
  /** Google Analytics 4 measurement ID, e.g. G-ABC123XYZ9 */
  ga4?: string
  /** Google Search Console HTML tag's content value */
  gsc?: string
}

export const TRACKING_FORMATS: Record<keyof SiteTracking, RegExp> = {
  metaPixel: /^\d{8,20}$/,
  tiktokPixel: /^[A-Z0-9]{12,30}$/,
  ga4: /^G-[A-Z0-9]{4,16}$/,
  gsc: /^[\w-]{20,100}$/,
}

/** Pull the ID out of what people paste (a whole snippet or meta tag, spaces, lower case) */
export function normalizeTrackingId(key: keyof SiteTracking, input: string): string {
  const text = input.trim()
  if (!text) return ''
  if (key === 'gsc') return text.match(/content=["']([^"']+)["']/)?.[1] ?? text
  if (key === 'ga4') return (text.match(/G-[A-Z0-9]+/i)?.[0] ?? text).toUpperCase()
  if (key === 'metaPixel') return text.match(/\d{8,20}/)?.[0] ?? text
  return (text.match(/[A-Z0-9]{12,30}/i)?.[0] ?? text).toUpperCase()
}

/** Only the valid IDs, or null when there are none */
export function cleanTracking(value: unknown): SiteTracking | null {
  if (!value || typeof value !== 'object') return null
  const out: SiteTracking = {}
  for (const key of Object.keys(TRACKING_FORMATS) as (keyof SiteTracking)[]) {
    const id = (value as Record<string, unknown>)[key]
    if (typeof id === 'string' && TRACKING_FORMATS[key].test(id)) out[key] = id
  }
  return Object.keys(out).length ? out : null
}
