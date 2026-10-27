import { nanoid } from 'nanoid'
import type { BioBlock, BlockName, FormFields, ProductItem, ProductsBlock } from '~/types/bio'

/** Block types a page may hold more than once; the rest are one per page */
export const REPEATABLE_BLOCKS: BlockName[] = ['links', 'text', 'image-album', 'menu', 'video', 'products']

export function isRepeatableBlock(name: string) {
  return (REPEATABLE_BLOCKS as string[]).includes(name)
}

/** Give every block an id (pages saved before blocks had ids) */
export function withBlockIds(blocks: BioBlock[]): BioBlock[] {
  return blocks.map(block => (block.id ? block : { ...block, id: nanoid(8) }))
}

/** Only allow web links (blocks javascript: and similar) */
export function safeWebUrl(url: string) {
  return /^https?:\/\//i.test(url) ? url : `https://${url.replace(/^[a-z]+:/i, '')}`
}

/** Map link for a contact block: its own link, or a Google Maps search for the address */
export function contactMapHref(data: { mapUrl?: string; address?: string }) {
  if (data.mapUrl) return safeWebUrl(data.mapUrl)
  if (data.address) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(data.address)}`
  return ''
}

export const FORM_PRESETS: Record<'booking' | 'contact', FormFields> = {
  booking: { phone: true, email: false, date: true, time: true, guests: true, message: true },
  contact: { phone: true, email: true, date: false, time: false, guests: false, message: true },
}

/** Starting data for a freshly added block */
export function emptyBlockData(name: BlockName): BioBlock['data'] {
  switch (name) {
    case 'links': return { items: [] }
    case 'social': return { links: [] }
    case 'image-album': return { images: [], layout: 'grid' }
    case 'text': return { content: '', align: 'left', style: 'plain' }
    case 'form': return { kind: 'booking', fields: { ...FORM_PRESETS.booking } }
    case 'video': return { url: '' }
    case 'blog': return { count: 3 }
    case 'testimonials': return { items: [] }
    case 'products': return { layout: 'grid', items: [], ordering: true, askAddress: true, payment: 'both' }
    default: return {} as BioBlock['data']
  }
}

export interface VideoEmbed {
  provider: 'youtube' | 'vimeo' | 'tiktok'
  src: string
  /** Width / height */
  aspect: number
}

/** Embed address for a YouTube, Vimeo or TikTok link; null if unsupported */
export function videoEmbed(url: string | undefined): VideoEmbed | null {
  if (!url) return null
  let parsed: URL
  try {
    parsed = new URL(url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`)
  } catch {
    return null
  }
  const host = parsed.hostname.replace(/^www\.|^m\./, '')
  const path = parsed.pathname

  if (host === 'youtube.com' || host === 'youtu.be' || host === 'music.youtube.com') {
    const shorts = path.match(/^\/shorts\/([\w-]{6,})/)
    const id = shorts?.[1]
      ?? (host === 'youtu.be' ? path.slice(1).split('/')[0] : undefined)
      ?? parsed.searchParams.get('v')
      ?? path.match(/^\/(?:embed|live)\/([\w-]{6,})/)?.[1]
    if (!id || !/^[\w-]{6,}$/.test(id)) return null
    // youtube-nocookie avoids tracking cookies until the visitor presses play
    return { provider: 'youtube', src: `https://www.youtube-nocookie.com/embed/${id}?rel=0`, aspect: shorts ? 9 / 16 : 16 / 9 }
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = path.match(/(\d{6,})/)?.[1]
    return id ? { provider: 'vimeo', src: `https://player.vimeo.com/video/${id}`, aspect: 16 / 9 } : null
  }
  if (host === 'tiktok.com') {
    const id = path.match(/\/video\/(\d{8,})/)?.[1]
    return id ? { provider: 'tiktok', src: `https://www.tiktok.com/embed/v2/${id}`, aspect: 9 / 16 } : null
  }
  return null
}

/** Online stores a product link can point to, for "Buy on Shopee" buttons */
const STORES: { host: RegExp; name: string; icon: string }[] = [
  { host: /(^|\.)shopee\.vn$|(^|\.)shp\.ee$|(^|\.)shopee\./, name: 'Shopee', icon: 'i-simple-icons-shopee' },
  { host: /(^|\.)tiktok\.com$|(^|\.)vt\.tiktok\.com$/, name: 'TikTok Shop', icon: 'i-simple-icons-tiktok' },
  { host: /(^|\.)lazada\./, name: 'Lazada', icon: 'i-lucide-shopping-bag' },
  { host: /(^|\.)tiki\.vn$/, name: 'Tiki', icon: 'i-lucide-shopping-bag' },
  { host: /(^|\.)amazon\./, name: 'Amazon', icon: 'i-simple-icons-amazon' },
  { host: /(^|\.)etsy\.com$/, name: 'Etsy', icon: 'i-simple-icons-etsy' },
]

/** The store a product link goes to, or null for any other website */
export function productStore(url: string | undefined) {
  if (!url) return null
  try {
    const host = new URL(url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`).hostname.replace(/^www\./, '')
    return STORES.find(s => s.host.test(host)) ?? null
  } catch {
    return null
  }
}

/** Every named product on a page with the block it belongs to (for product stands in the 3D room) */
export function pageProducts(blocks: BioBlock[] | undefined): { product: ProductItem; block: ProductsBlock }[] {
  return (blocks ?? [])
    .filter((b): b is ProductsBlock => b.name === 'products' && !b.hidden && !!b.id)
    .flatMap(block => (block.data.items ?? []).filter(item => item.name).map(product => ({ product, block })))
}

/** How a product can be paid for: the block's choice, minus transfer when the page has no bank account */
export function productPaymentOptions(payment: 'cod' | 'transfer' | 'both' | undefined, canTransfer?: boolean): ('cod' | 'transfer')[] {
  const allowed = payment ?? 'both'
  return (['cod', 'transfer'] as const).filter(m => (allowed === 'both' || m === allowed) && (m !== 'transfer' || canTransfer))
}

/** Count a visitor action (call, directions, chat, booking) for the owner's analytics */
export function trackVisitorAction(username: string, action: string, mode: string) {
  if (mode === 'preview' || mode === 'template' || !username) return
  $fetch(`/api/bio/${username}/count`, { method: 'POST', body: { linkId: action, type: 'action' } }).catch(() => {})
}
