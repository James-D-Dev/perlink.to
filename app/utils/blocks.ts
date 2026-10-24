import { nanoid } from 'nanoid'
import type { BioBlock, BlockName, FormFields } from '~/types/bio'

/** Block types a page may hold more than once; the rest are one per page */
export const REPEATABLE_BLOCKS: BlockName[] = ['links', 'text', 'image-album', 'menu']

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
    default: return {} as BioBlock['data']
  }
}
