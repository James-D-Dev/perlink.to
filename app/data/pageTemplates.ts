import { nanoid } from 'nanoid'
import type { BioBlock, MenuSection, ThemeConfig } from '~/types/bio'
import { DEFAULT_OPENING_DAYS } from '~/types/bio'
import type { RoomConfig, RoomObject, RoomStyle } from '~/types/room'
import { DEFAULT_ROOM_ENVIRONMENT, DEFAULT_ROOM_STYLE } from '~/types/room'
import { THEME_PRESETS } from './themePresets'

// Starter pages by industry. Applying a template fills the page with sample
// content, a matching theme and a matching 3D room (used if 3D mode is on).

export interface PageTemplateContent {
  title: string
  bio: string
  blocks: BioBlock[]
  themeConfig: ThemeConfig
  room: RoomConfig
}

export interface PageTemplate {
  id: string
  name: string
  description: string
  icon: string
  /** Swatch colors for the picker card */
  preview: { bg: string; accent: string }
  build: () => PageTemplateContent
}

function theme(presetId: string): ThemeConfig {
  const preset = THEME_PRESETS.find(p => p.id === presetId) ?? THEME_PRESETS[0]!
  return structuredClone(preset.theme)
}

function room(style: Partial<RoomStyle>, objects: Omit<RoomObject, 'id' | 'scale'>[]): RoomConfig {
  return {
    version: 1,
    style: { ...DEFAULT_ROOM_STYLE, ...style },
    environment: { ...DEFAULT_ROOM_ENVIRONMENT },
    objects: objects.map(o => ({ scale: 1, ...o, id: nanoid(8) })),
  }
}

function withIndex(blocks: Omit<BioBlock, 'index' | 'hidden'>[]): BioBlock[] {
  return blocks.map((b, index) => ({ ...b, index, hidden: false }) as BioBlock)
}

function menu(sections: { name: string; items: [string, string, string?, string?][] }[]): MenuSection[] {
  return sections.map(s => ({
    id: nanoid(6),
    name: s.name,
    items: s.items.map(([name, price, description, tag]) => ({ id: nanoid(6), name, price, description, tag })),
  }))
}

function social(...providers: string[]) {
  return providers.map((provider, index) => ({ id: nanoid(6), provider, url: '', index }))
}

function links(...items: [string, string][]) {
  return items.map(([title, url], order) => ({ id: nanoid(6), title, url, icon: 'link', order, isActive: true }))
}

const COFFEE_TABLE_TOP = 0.43
const DESK_TOP = 0.76

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    id: 'personal',
    name: 'Personal portfolio',
    description: 'Introduce yourself, your work and where to find you.',
    icon: 'i-lucide-user-round',
    preview: { bg: '#FFFFFF', accent: '#7C3AED' },
    build: () => ({
      title: 'Your Name',
      bio: 'Designer & developer. I build friendly products for the web.',
      themeConfig: theme('classic-white'),
      blocks: withIndex([
        { name: 'social', data: { links: social('instagram', 'linkedin', 'github', 'email') } },
        { name: 'links', data: { items: links(['My portfolio', ''], ['Latest project', ''], ['Book a call', '']) } },
        { name: 'image-album', data: { images: [], layout: 'grid' } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#f3ede4', floorColor: '#c8a27a', floorMaterial: 'wood' }, [
        { type: 'window', position: [0.6, 1.6, -3], rotation: 0, wall: 'back' },
        { type: 'desk', position: [1.4, 0, -2.6], rotation: 0 },
        { type: 'chair', position: [1.4, 0, -1.8], rotation: 180 },
        { type: 'laptop', position: [1.25, DESK_TOP, -2.6], rotation: 0, link: { label: 'My portfolio', url: '' } },
        { type: 'desk-lamp', position: [1.9, DESK_TOP, -2.7], rotation: 0 },
        { type: 'bookshelf', position: [-1.7, 0, -2.8], rotation: 0 },
        { type: 'picture-frame', position: [-3, 1.7, -0.6], rotation: 0, wall: 'left', link: { label: 'Instagram', url: '' } },
        { type: 'picture-frame', position: [-3, 1.5, 0.5], rotation: 0, wall: 'left', color: '#e76f51' },
        { type: 'wall-clock', position: [-0.8, 2.3, -3], rotation: 0, wall: 'back' },
        { type: 'rug', position: [0, 0, 0.4], rotation: 0 },
        { type: 'plant', position: [2.5, 0, 0.6], rotation: 0 },
        { type: 'floor-lamp', position: [-2.5, 0, 1.6], rotation: 0 },
      ]),
    }),
  },
  {
    id: 'restaurant',
    name: 'Restaurant menu',
    description: 'Menu with prices, opening hours and table booking.',
    icon: 'i-lucide-utensils',
    preview: { bg: '#FDFAF6', accent: '#D97706' },
    build: () => ({
      title: 'Your Restaurant',
      bio: 'Fresh, seasonal cooking in the heart of the city.',
      themeConfig: theme('classic-ivory'),
      blocks: withIndex([
        {
          name: 'menu',
          data: {
            title: 'Menu',
            currency: '₫',
            layout: 'list',
            sections: menu([
              { name: 'Starters', items: [['Spring rolls', '65,000', 'Crispy rolls with herbs and dipping sauce', 'Popular'], ['Green papaya salad', '75,000', 'Shrimp, peanuts, lime dressing']] },
              { name: 'Mains', items: [['Grilled pork with rice', '95,000', 'Charcoal grilled, pickled vegetables'], ['Beef pho', '85,000', 'Slow-cooked broth, rice noodles', 'Chef’s pick']] },
              { name: 'Drinks', items: [['Iced milk coffee', '35,000'], ['Fresh coconut', '40,000']] },
            ]),
          },
        },
        { name: 'hours', data: { title: 'Opening hours', days: DEFAULT_OPENING_DAYS.map(d => ({ ...d, open: '10:00', close: '22:00' })), note: 'Last orders 30 minutes before closing.' } },
        { name: 'contact', data: { title: 'Find us', address: '', phone: '', bookingLabel: 'Book a table', bookingUrl: '' } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'tiktok', 'zalo') } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#7a4b3a', floorColor: '#9c6b46', floorMaterial: 'wood', trimColor: '#3b2a22' }, [
        { type: 'neon-sign', position: [0.2, 2.1, -3], rotation: 0, wall: 'back', color: '#ffb347', link: { label: 'See our menu', url: '' } },
        { type: 'string-lights', position: [0, 2.6, -3], rotation: 0, wall: 'back' },
        { type: 'wall-lamp', position: [-3, 1.8, -1.2], rotation: 0, wall: 'left' },
        { type: 'wall-lamp', position: [-3, 1.8, 1.2], rotation: 0, wall: 'left' },
        { type: 'coffee-table', position: [-1.2, 0, -1.2], rotation: 0 },
        { type: 'chair', position: [-1.2, 0, -2], rotation: 0 },
        { type: 'chair', position: [-1.2, 0, -0.4], rotation: 180 },
        { type: 'candle', position: [-1.2, COFFEE_TABLE_TOP, -1.2], rotation: 0 },
        { type: 'coffee-table', position: [1.3, 0, 0.6], rotation: 0 },
        { type: 'chair', position: [0.5, 0, 0.6], rotation: 90 },
        { type: 'chair', position: [2.1, 0, 0.6], rotation: 270 },
        { type: 'candle', position: [1.3, COFFEE_TABLE_TOP, 0.6], rotation: 0 },
        { type: 'plant', position: [2.5, 0, -2.5], rotation: 0 },
        { type: 'plant', position: [-2.5, 0, 2.4], rotation: 0 },
      ]),
    }),
  },
  {
    id: 'hotel',
    name: 'Hotel & homestay',
    description: 'Rooms with nightly prices, contact and booking.',
    icon: 'i-lucide-bed-double',
    preview: { bg: '#F5F0E8', accent: '#78716C' },
    build: () => ({
      title: 'Your Homestay',
      bio: 'A quiet place to stay, five minutes from the beach.',
      themeConfig: theme('minimal-sand'),
      blocks: withIndex([
        { name: 'image-album', data: { images: [], layout: 'carousel' } },
        {
          name: 'menu',
          data: {
            title: 'Rooms',
            currency: '₫',
            priceSuffix: ' / night',
            layout: 'cards',
            sections: menu([
              { name: '', items: [['Standard double', '650,000', 'Queen bed, garden view, breakfast included'], ['Deluxe sea view', '950,000', 'King bed, balcony, sea view', 'Best seller'], ['Family suite', '1,400,000', 'Two bedrooms, sleeps 4']] },
            ]),
          },
        },
        { name: 'contact', data: { title: 'Contact & booking', address: '', phone: '', email: '', bookingLabel: 'Book your stay', bookingUrl: '' } },
        { name: 'hours', data: { title: 'Check-in & reception', days: DEFAULT_OPENING_DAYS.map(d => ({ ...d, open: '07:00', close: '23:00' })), note: 'Check-in from 14:00, check-out before 12:00.' } },
        { name: 'social', data: { links: social('facebook', 'instagram', 'whatsapp') } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#ece4d8', floorColor: '#b89b7a', floorMaterial: 'wood' }, [
        { type: 'window', position: [1.6, 1.6, -3], rotation: 0, wall: 'back', link: { label: 'Book your stay', url: '' } },
        { type: 'bed', position: [-1.2, 0, -1.9], rotation: 0 },
        { type: 'wall-lamp', position: [-2.3, 1.3, -3], rotation: 0, wall: 'back' },
        { type: 'wall-lamp', position: [-0.1, 1.3, -3], rotation: 0, wall: 'back' },
        { type: 'picture-frame', position: [-3, 1.7, -1.4], rotation: 0, wall: 'left', color: '#2a9d8f' },
        { type: 'cabinet', position: [-2.7, 0, 1.2], rotation: 90 },
        { type: 'candle', position: [-2.7, 0.8, 1.4], rotation: 0 },
        { type: 'sofa', position: [1.6, 0, 1.4], rotation: 270 },
        { type: 'rug', position: [0.4, 0, 1], rotation: 90 },
        { type: 'plant', position: [2.5, 0, -1.6], rotation: 0 },
        { type: 'floor-lamp', position: [2.5, 0, 2.6], rotation: 0 },
      ]),
    }),
  },
  {
    id: 'cafe',
    name: 'Café & shop',
    description: 'Drinks or products, opening hours and where to find you.',
    icon: 'i-lucide-coffee',
    preview: { bg: '#FFF1F2', accent: '#F43F5E' },
    build: () => ({
      title: 'Your Café',
      bio: 'Specialty coffee, homemade cakes and good music.',
      themeConfig: theme('vibrant-coral'),
      blocks: withIndex([
        {
          name: 'menu',
          data: {
            title: 'Our menu',
            currency: '₫',
            layout: 'list',
            sections: menu([
              { name: 'Coffee', items: [['Espresso', '35,000'], ['Salted cream coffee', '45,000', 'Our signature', 'Signature'], ['Cold brew', '50,000']] },
              { name: 'Cakes', items: [['Banana bread', '40,000'], ['Cheesecake', '55,000']] },
            ]),
          },
        },
        { name: 'hours', data: { title: 'Opening hours', days: DEFAULT_OPENING_DAYS.map(d => ({ ...d, open: '07:00', close: '21:30' })), note: '' } },
        { name: 'contact', data: { title: 'Visit us', address: '', phone: '' } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'facebook') } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#dfe7d6', floorColor: '#b08968', floorMaterial: 'wood', trimColor: '#f8f4ec' }, [
        { type: 'string-lights', position: [0, 2.5, -3], rotation: 0, wall: 'back' },
        { type: 'neon-sign', position: [-3, 1.9, -0.4], rotation: 0, wall: 'left', color: '#ff6b6b', link: { label: 'Instagram', url: '' } },
        { type: 'bookshelf', position: [1.6, 0, -2.8], rotation: 0 },
        { type: 'coffee-table', position: [-1.3, 0, -1.4], rotation: 0 },
        { type: 'chair', position: [-1.3, 0, -2.2], rotation: 0 },
        { type: 'chair', position: [-0.5, 0, -1.4], rotation: 270 },
        { type: 'mug', position: [-1.15, COFFEE_TABLE_TOP, -1.35], rotation: 0 },
        { type: 'mug', position: [-1.45, COFFEE_TABLE_TOP, -1.5], rotation: 120, color: '#2a9d8f' },
        { type: 'coffee-table', position: [1, 0, 1.2], rotation: 0 },
        { type: 'chair', position: [1, 0, 2], rotation: 180 },
        { type: 'mug', position: [1, COFFEE_TABLE_TOP, 1.2], rotation: 0 },
        { type: 'plant', position: [-2.5, 0, 2.3], rotation: 0 },
        { type: 'plant', position: [2.6, 0, 0], rotation: 0 },
      ]),
    }),
  },
  {
    id: 'creator',
    name: 'Creator & artist',
    description: 'Show your work as a gallery with links to shop or commission.',
    icon: 'i-lucide-palette',
    preview: { bg: '#1E1B4B', accent: '#A855F7' },
    build: () => ({
      title: 'Your Studio',
      bio: 'Illustration, prints and commissions.',
      themeConfig: theme('gradient-aurora'),
      blocks: withIndex([
        { name: 'image-album', data: { images: [], layout: 'masonry' } },
        { name: 'links', data: { items: links(['Shop prints', ''], ['Commission me', ''], ['Behance', '']) } },
        { name: 'social', data: { links: social('instagram', 'tiktok', 'youtube', 'pinterest') } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#2b2d42', floorColor: '#4a4e69', floorMaterial: 'concrete', trimColor: '#8d99ae' }, [
        { type: 'picture-frame', position: [-1.6, 1.7, -3], rotation: 0, wall: 'back', color: '#e76f51', link: { label: 'Shop prints', url: '' } },
        { type: 'picture-frame', position: [-0.6, 1.5, -3], rotation: 0, wall: 'back', color: '#2a9d8f' },
        { type: 'picture-frame', position: [0.4, 1.8, -3], rotation: 0, wall: 'back', color: '#e9c46a' },
        { type: 'picture-frame', position: [-3, 1.6, -1.2], rotation: 0, wall: 'left', color: '#8338ec', link: { label: 'Commission me', url: '' } },
        { type: 'picture-frame', position: [-3, 1.7, 0.2], rotation: 0, wall: 'left', color: '#ff006e' },
        { type: 'neon-sign', position: [1.8, 1.9, -3], rotation: 0, wall: 'back', color: '#a855f7' },
        { type: 'string-lights', position: [-3, 2.6, 0], rotation: 0, wall: 'left', color: '#c4b5fd' },
        { type: 'sofa', position: [0.4, 0, 1.4], rotation: 180 },
        { type: 'coffee-table', position: [0.4, 0, 0.2], rotation: 0 },
        { type: 'candle', position: [0.4, COFFEE_TABLE_TOP, 0.2], rotation: 0 },
        { type: 'floor-lamp', position: [2.4, 0, -2.3], rotation: 0 },
        { type: 'plant', position: [-2.5, 0, 2.4], rotation: 0 },
        { type: 'rug', position: [0.4, 0, 0.6], rotation: 0, color: '#6d597a' },
      ]),
    }),
  },
]
