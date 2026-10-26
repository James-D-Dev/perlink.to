import type { BioBlock, ThemeConfig } from '~/types/bio'
import { DEFAULT_OPENING_DAYS } from '~/types/bio'
import type { RoomConfig } from '~/types/room'
import { MORE_PAGE_TEMPLATES } from './pageTemplatesMore'
import { COFFEE_TABLE_TOP, DESK_TOP, SAMPLE_ADDRESS, SAMPLE_PHONE, album, links, look, menu, photo, room, social, withIndex } from './templateKit'

// Starter pages by industry. Applying a template fills the page with sample
// content, a matching theme and a matching 3D room (used if 3D mode is on).

export interface PageTemplateContent {
  title: string
  bio: string
  /** Sample photo, used only when the page has no avatar yet */
  avatarUrl?: string
  blocks: BioBlock[]
  themeConfig: ThemeConfig
  room: RoomConfig
}

export type TemplateCategory = 'gifts' | 'blog' | 'personal' | 'food' | 'beauty' | 'health' | 'shop' | 'education' | 'hospitality' | 'business' | 'creative' | 'events' | 'community'

export const TEMPLATE_CATEGORIES: { id: TemplateCategory; label: string; icon: string }[] = [
  { id: 'gifts', label: 'Gifts', icon: 'i-lucide-gift' },
  { id: 'blog', label: 'Blog', icon: 'i-lucide-newspaper' },
  { id: 'personal', label: 'Personal', icon: 'i-lucide-user-round' },
  { id: 'food', label: 'Food & drink', icon: 'i-lucide-utensils' },
  { id: 'beauty', label: 'Beauty', icon: 'i-lucide-sparkles' },
  { id: 'health', label: 'Health & fitness', icon: 'i-lucide-heart-pulse' },
  { id: 'shop', label: 'Shops', icon: 'i-lucide-shopping-bag' },
  { id: 'education', label: 'Education', icon: 'i-lucide-graduation-cap' },
  { id: 'hospitality', label: 'Hotel & travel', icon: 'i-lucide-bed-double' },
  { id: 'business', label: 'Business', icon: 'i-lucide-briefcase' },
  { id: 'creative', label: 'Creative', icon: 'i-lucide-palette' },
  { id: 'events', label: 'Events', icon: 'i-lucide-party-popper' },
  { id: 'community', label: 'Community', icon: 'i-lucide-hand-heart' },
]

export interface PageTemplate {
  id: string
  name: string
  category: TemplateCategory
  description: string
  icon: string
  /** Swatch colors for the picker card */
  preview: { bg: string; accent: string }
  build: () => PageTemplateContent
}


const BASE_TEMPLATES: PageTemplate[] = [
  {
    id: 'personal',
    name: 'Personal portfolio',
    category: 'personal',
    description: 'Introduce yourself, your work and where to find you.',
    icon: 'i-lucide-user-round',
    preview: { bg: '#F7F5F2', accent: '#1C1A17' },
    build: () => ({
      title: 'Your Name',
      bio: 'Designer & developer. I build friendly products for the web.',
      avatarUrl: photo('personal-avatar'),
      themeConfig: look({
        bg: '#F7F5F2', text: '#1C1A17', accent: '#1C1A17', onAccent: '#FFFFFF',
        surface: '#FFFFFF', border: '#E8E4DF', radius: 10,
        nameFont: 'Inter Tight, sans-serif', nameWeight: '500', nameSize: '1.875rem', tracking: '-0.03em',
        header: 'centered', link: 'centered', social: 'outline', titleAlign: 'left',
      }),
      blocks: withIndex([
        { name: 'social', data: { links: social('instagram', 'linkedin', 'github', 'email') } },
        { name: 'links', data: { items: links(['Portfolio', ''], ['Latest project', ''], ['Book a call', '']) } },
        { name: 'text', data: { title: 'About', content: 'I design and build calm, useful software. Eight years across startups and studios, now independent and open to new projects.', align: 'left', style: 'plain' } },
        { name: 'image-album', data: { title: 'Selected work', images: album('personal-work-1', 'personal-work-2', 'personal-work-3', 'personal-work-4'), layout: 'grid' } },
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
    category: 'food',
    description: 'Menu with prices, opening hours and table booking.',
    icon: 'i-lucide-utensils',
    preview: { bg: '#F4EEE6', accent: '#9A3B1C' },
    build: () => ({
      title: 'Your Restaurant',
      bio: 'Fresh, seasonal cooking in the heart of the city.',
      avatarUrl: photo('restaurant-avatar'),
      themeConfig: look({
        bg: '#F4EEE6', text: '#2B1D14', accent: '#9A3B1C', onAccent: '#FFF7EF',
        surface: '#FFFBF6', border: '#E6D9C8', radius: 8,
        nameFont: 'Playfair Display, serif', nameWeight: '500', nameSize: '2.25rem',
        header: 'banner-circle', banner: photo('restaurant-cover'), link: 'centered', social: 'soft',
      }),
      blocks: withIndex([
        { name: 'text', data: { title: 'Our story', content: 'Family recipes, market produce and a charcoal grill. We cook what is in season and change the menu every month.', align: 'center', style: 'plain' } },
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
        { name: 'contact', data: { title: 'Find us', address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE, bookingLabel: 'Book a table', bookingUrl: '' } },
        { name: 'form', data: { title: 'Book a table', description: 'We’ll confirm by phone within the hour.', kind: 'booking', fields: { phone: true, email: false, date: true, time: true, guests: true, message: true } } },
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
    category: 'hospitality',
    description: 'Rooms with nightly prices, contact and booking.',
    icon: 'i-lucide-bed-double',
    preview: { bg: '#F3F1EC', accent: '#1F4E5F' },
    build: () => ({
      title: 'Your Homestay',
      bio: 'A quiet place to stay, five minutes from the beach.',
      avatarUrl: photo('hotel-avatar'),
      themeConfig: look({
        bg: '#F3F1EC', text: '#1F2A2E', accent: '#1F4E5F', onAccent: '#FFFFFF',
        surface: '#FFFFFF', radius: 10, shadow: 'sm',
        nameFont: 'Cormorant Garamond, serif', nameWeight: '500', nameSize: '2.25rem',
        header: 'banner-square', banner: photo('hotel-cover'), avatar: 'rounded', link: 'centered', social: 'outline',
      }),
      blocks: withIndex([
        { name: 'image-album', data: { images: album('hotel-room-1', 'hotel-room-2', 'hotel-room-3'), layout: 'carousel' } },
        { name: 'text', data: { title: 'The house', content: 'Six rooms around a garden courtyard, with breakfast on the terrace and bikes to borrow.', align: 'center', style: 'plain' } },
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
        { name: 'contact', data: { title: 'Contact & booking', address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE, email: '', bookingLabel: 'Book your stay', bookingUrl: '' } },
        { name: 'form', data: { title: 'Ask about your dates', kind: 'booking', fields: { phone: true, email: true, date: true, time: false, guests: true, message: true }, submitLabel: 'Check availability' } },
        { name: 'hours', data: { title: 'Reception', days: DEFAULT_OPENING_DAYS.map(d => ({ ...d, open: '07:00', close: '23:00' })), note: 'Check-in from 14:00, check-out before 12:00.' } },
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
    category: 'food',
    description: 'Drinks or products, opening hours and where to find you.',
    icon: 'i-lucide-coffee',
    preview: { bg: '#EDF0E8', accent: '#3F6B4B' },
    build: () => ({
      title: 'Your Café',
      bio: 'Specialty coffee, homemade cakes and good music.',
      avatarUrl: photo('cafe-avatar'),
      themeConfig: look({
        bg: '#EDF0E8', text: '#223326', accent: '#3F6B4B', onAccent: '#FFFFFF',
        surface: '#F9FAF6', border: '#D9E0D1', radius: 12,
        nameFont: 'Poppins, sans-serif', nameWeight: '600', nameSize: '1.875rem', tracking: '-0.03em',
        header: 'left', link: 'centered', social: 'filled', titleAlign: 'left',
      }),
      blocks: withIndex([
        { name: 'social', data: { links: social('instagram', 'tiktok', 'facebook') } },
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
        { name: 'image-album', data: { title: 'Inside the café', images: album('cafe-1', 'cafe-2', 'cafe-3', 'cafe-4'), layout: 'grid' } },
        { name: 'hours', data: { title: 'Opening hours', days: DEFAULT_OPENING_DAYS.map(d => ({ ...d, open: '07:00', close: '21:30' })), note: '' } },
        { name: 'contact', data: { title: 'Visit us', address: SAMPLE_ADDRESS, phone: SAMPLE_PHONE } },
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
    category: 'creative',
    description: 'Show your work as a gallery with links to shop or commission.',
    icon: 'i-lucide-palette',
    preview: { bg: '#111015', accent: '#CDB4FF' },
    build: () => ({
      title: 'Your Studio',
      bio: 'Illustration, prints and commissions.',
      avatarUrl: photo('creator-avatar'),
      themeConfig: look({
        bg: '#111015', text: '#F3EFE8', accent: '#CDB4FF', onAccent: '#17122B',
        surface: '#1B1A21', border: '#2C2A33', radius: 10,
        nameFont: 'Inter Tight, sans-serif', nameWeight: '400', nameSize: '2.25rem', tracking: '-0.03em',
        header: 'banner-circle', banner: photo('creator-cover'), link: 'centered', social: 'plain',
      }),
      blocks: withIndex([
        { name: 'image-album', data: { title: 'Recent work', images: album('creator-art-1', 'creator-art-2', 'creator-art-3', 'creator-art-4'), layout: 'masonry' } },
        { name: 'links', data: { title: 'Shop & commissions', items: links(['Shop prints', ''], ['Commission me', ''], ['Behance', '']) } },
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
  {
    id: 'link-in-bio',
    name: 'Link in bio',
    category: 'personal',
    description: 'A clean, dark page with your socials and top links.',
    icon: 'i-lucide-link',
    preview: { bg: '#0C0B0A', accent: '#F5F3F1' },
    build: () => ({
      title: 'Your Name',
      bio: 'Creator · sharing what I make and love.',
      avatarUrl: photo('link-avatar'),
      themeConfig: look({
        bg: '#0C0B0A', text: '#F5F3F1', accent: '#F5F3F1', onAccent: '#0C0B0A',
        surface: '#1A1917', radius: 12,
        nameFont: 'Inter Tight, sans-serif', nameWeight: '500', nameSize: '1.5rem', tracking: '-0.02em',
        header: 'centered', link: 'centered', social: 'plain', gap: 'compact',
      }),
      blocks: withIndex([
        { name: 'social', data: { links: social('instagram', 'tiktok', 'youtube', 'threads') } },
        { name: 'links', data: { items: links(['Latest video', ''], ['My newsletter', ''], ['Shop my picks', ''], ['Work with me', '']) } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#1f1f24', floorColor: '#3a3a42', floorMaterial: 'concrete', trimColor: '#55555f' }, [
        { type: 'neon-sign', position: [0.6, 1.9, -3], rotation: 0, wall: 'back', color: '#8b5cf6', link: { label: 'Latest video', url: '' } },
        { type: 'string-lights', position: [-3, 2.5, 0], rotation: 0, wall: 'left', color: '#c4b5fd' },
        { type: 'desk', position: [1.4, 0, -2.6], rotation: 0, color: '#2f2f36' },
        { type: 'chair', position: [1.4, 0, -1.8], rotation: 180 },
        { type: 'laptop', position: [1.25, DESK_TOP, -2.6], rotation: 0 },
        { type: 'desk-lamp', position: [1.9, DESK_TOP, -2.7], rotation: 0, color: '#8b5cf6' },
        { type: 'sofa', position: [-1.6, 0, 0.6], rotation: 90, color: '#3d3d46' },
        { type: 'plant', position: [2.5, 0, 0.8], rotation: 0 },
        { type: 'rug', position: [0, 0, 0.4], rotation: 0, color: '#4c4c58' },
      ]),
    }),
  },
  {
    id: 'services',
    name: 'Freelancer & services',
    category: 'business',
    description: 'Services with prices, booking and opening hours.',
    icon: 'i-lucide-briefcase',
    preview: { bg: '#FFFFFF', accent: '#18181B' },
    build: () => ({
      title: 'Your Studio',
      bio: 'Photography, design and video for small businesses.',
      avatarUrl: photo('services-avatar'),
      themeConfig: look({
        bg: '#FFFFFF', text: '#18181B', accent: '#18181B', onAccent: '#FFFFFF',
        surface: '#F4F4F5', radius: 10,
        nameFont: 'Inter Tight, sans-serif', nameWeight: '600', nameSize: '1.875rem', tracking: '-0.03em',
        header: 'left', avatar: 'rounded', link: 'centered', social: 'outline', titleAlign: 'left',
      }),
      blocks: withIndex([
        { name: 'text', data: { title: 'What I do', content: 'I help small businesses look their best online: brand photos, simple identities and short videos for social media.', align: 'left', style: 'plain' } },
        {
          name: 'menu',
          data: {
            title: 'Services',
            currency: '$',
            layout: 'cards',
            sections: menu([
              { name: '', items: [['Brand photo shoot', '250', 'Half day, 30 edited photos', 'Popular'], ['Logo & identity', '600', 'Logo, colors, typography'], ['Short promo video', '450', '30–60 second edit']] },
            ]),
          },
        },
        { name: 'contact', data: { title: 'Book a call', email: 'hello@yourstudio.com', phone: SAMPLE_PHONE, bookingLabel: 'Book a free call', bookingUrl: '' } },
        { name: 'form', data: { title: 'Tell me about your project', kind: 'contact', fields: { phone: true, email: true, date: false, time: false, guests: false, message: true }, submitLabel: 'Send message' } },
        { name: 'hours', data: { title: 'Availability', days: DEFAULT_OPENING_DAYS.map(d => ({ ...d, open: '09:00', close: '18:00', closed: d.day === 0 || d.day === 6 })), note: 'Replies within one business day.' } },
        { name: 'social', data: { links: social('linkedin', 'instagram', 'website') } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#e7e5e4', floorColor: '#a8a29e', floorMaterial: 'tile', trimColor: '#f5f5f4' }, [
        { type: 'window', position: [0.8, 1.6, -3], rotation: 0, wall: 'back' },
        { type: 'desk', position: [0.8, 0, -2.6], rotation: 0 },
        { type: 'chair', position: [0.8, 0, -1.8], rotation: 180 },
        { type: 'laptop', position: [0.65, DESK_TOP, -2.6], rotation: 0, link: { label: 'Book a free call', url: '' } },
        { type: 'bookshelf', position: [-1.8, 0, -2.8], rotation: 0 },
        { type: 'picture-frame', position: [-3, 1.7, -0.4], rotation: 0, wall: 'left', color: '#0f172a' },
        { type: 'wall-clock', position: [2.2, 2.2, -3], rotation: 0, wall: 'back' },
        { type: 'sofa', position: [1.6, 0, 1.6], rotation: 270, color: '#64748b' },
        { type: 'coffee-table', position: [0.4, 0, 1.6], rotation: 0 },
        { type: 'mug', position: [0.4, COFFEE_TABLE_TOP, 1.6], rotation: 0 },
        { type: 'plant', position: [-2.5, 0, 2.4], rotation: 0 },
        { type: 'floor-lamp', position: [-2.5, 0, 0.8], rotation: 0 },
      ]),
    }),
  },
  {
    id: 'event',
    name: 'Wedding & event',
    category: 'events',
    description: 'Schedule, venue, RSVP and photo gallery for your big day.',
    icon: 'i-lucide-heart',
    preview: { bg: '#FBF4F0', accent: '#8C4A62' },
    build: () => ({
      title: 'Anna & Mark',
      bio: 'We’re getting married! Saturday, 12 June 2027.',
      avatarUrl: photo('event-avatar'),
      themeConfig: look({
        bg: '#FBF4F0', text: '#3A2530', accent: '#8C4A62', onAccent: '#FFFFFF',
        surface: '#FFFFFF', border: '#F0DCD6', radius: 10,
        nameFont: 'Cormorant Garamond, serif', nameWeight: '500', nameSize: '2.25rem',
        header: 'banner-circle', banner: photo('event-cover'), link: 'centered', social: 'soft', gap: 'relaxed',
      }),
      blocks: withIndex([
        { name: 'text', data: { title: 'Join us', content: 'We would love to celebrate with you. Dinner, dancing and a garden full of flowers. Please let us know if you can come by 1 May.', align: 'center', style: 'plain' } },
        {
          name: 'menu',
          data: {
            title: 'Schedule',
            currency: '',
            layout: 'list',
            sections: menu([
              { name: 'The day', items: [['Ceremony', '15:00', 'Garden terrace'], ['Cocktails', '16:30'], ['Dinner & party', '18:00', 'Grand ballroom']] },
            ]),
          },
        },
        { name: 'contact', data: { title: 'Venue', address: 'Rose Garden Hotel, 8 Lake Road', bookingLabel: 'RSVP', bookingUrl: '' } },
        { name: 'image-album', data: { title: 'Us', images: album('event-1', 'event-2', 'event-3', 'event-4'), layout: 'grid' } },
      ] as Omit<BioBlock, 'index' | 'hidden'>[]),
      room: room({ wallColor: '#fde2e4', floorColor: '#e8c4a0', floorMaterial: 'wood', trimColor: '#ffffff' }, [
        { type: 'string-lights', position: [0, 2.6, -3], rotation: 0, wall: 'back', color: '#ffe8a3' },
        { type: 'string-lights', position: [-3, 2.6, 0], rotation: 0, wall: 'left', color: '#ffe8a3' },
        { type: 'picture-frame', position: [0, 1.6, -3], rotation: 0, wall: 'back', color: '#f97316', link: { label: 'RSVP', url: '' } },
        { type: 'coffee-table', position: [0, 0, -0.6], rotation: 0, color: '#fff7ed' },
        { type: 'candle', position: [-0.15, COFFEE_TABLE_TOP, -0.6], rotation: 0 },
        { type: 'candle', position: [0.15, COFFEE_TABLE_TOP, -0.55], rotation: 0 },
        { type: 'chair', position: [-0.8, 0, -0.6], rotation: 90, color: '#f5f5f2' },
        { type: 'chair', position: [0.8, 0, -0.6], rotation: 270, color: '#f5f5f2' },
        { type: 'plant', position: [-2.5, 0, -2.5], rotation: 0, color: '#6a994e' },
        { type: 'plant', position: [2.5, 0, -2.5], rotation: 0, color: '#6a994e' },
        { type: 'rug', position: [0, 0, 0.6], rotation: 0, color: '#f4acb7' },
      ]),
    }),
  },
]

export const PAGE_TEMPLATES: PageTemplate[] = [...BASE_TEMPLATES, ...MORE_PAGE_TEMPLATES]
