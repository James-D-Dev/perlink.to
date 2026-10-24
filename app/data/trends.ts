// Trending looks on Perlink: 3D worlds (real renders of the lands) and 2D
// site styles (live template previews). Shared by the landing page and /trends.

export type TrendKind = '3d' | 'site'

export interface Trend {
  id: string
  kind: TrendKind
  title: string
  description: string
  /** Who it suits */
  tags: string[]
  /** Render of a 3D world, under /public */
  image?: string
  /** Template id from PAGE_TEMPLATES, for a live 2D preview */
  template?: string
}

export const TRENDS: Trend[] = [
  {
    id: 'city-nights',
    kind: '3d',
    title: 'City nights',
    description: 'A downtown block with traffic, street lamps and windows that light up after dark.',
    tags: ['Cafés', 'Studios', 'Night owls'],
    image: '/images/landing/city-night.jpg',
  },
  {
    id: 'sakura-garden',
    kind: '3d',
    title: 'Sakura garden',
    description: 'Cherry blossoms, falling petals, butterflies and a quiet pond.',
    tags: ['Portfolios', 'Florists', 'Weddings'],
    image: '/images/landing/sakura.jpg',
  },
  {
    id: 'restaurant-menu',
    kind: 'site',
    title: 'Menu-first restaurant',
    description: 'Your menu, opening hours and a booking button on one clean page.',
    tags: ['Restaurants', 'Food stalls'],
    template: 'restaurant',
  },
  {
    id: 'sky-island',
    kind: '3d',
    title: 'Sky island',
    description: 'A floating meadow above the clouds, with flowers and butterflies.',
    tags: ['Creators', 'Kids brands'],
    image: '/images/landing/island.jpg',
  },
  {
    id: 'creator-hub',
    kind: 'site',
    title: 'Creator hub',
    description: 'Latest videos, socials and your best links, styled like your channel.',
    tags: ['Creators', 'Streamers'],
    template: 'creator',
  },
  {
    id: 'winter-cabin',
    kind: '3d',
    title: 'Winter cabin',
    description: 'Snowfall, snowy pines and a snowman with a Santa hat.',
    tags: ['Seasonal', 'Gift shops'],
    image: '/images/landing/winter.jpg',
  },
  {
    id: 'homestay',
    kind: 'site',
    title: 'Boutique homestay',
    description: 'Rooms and prices, a photo carousel and a clear way to book.',
    tags: ['Hotels', 'Homestays'],
    template: 'hotel',
  },
  {
    id: 'red-planet',
    kind: '3d',
    title: 'Red planet',
    description: 'Cratered Mars terrain floating in space with planets all around.',
    tags: ['Gamers', 'Tech'],
    image: '/images/landing/mars.jpg',
  },
  {
    id: 'personal-portfolio',
    kind: 'site',
    title: 'Quiet portfolio',
    description: 'A calm, typographic page for your work, links and contact.',
    tags: ['Designers', 'Developers'],
    template: 'personal',
  },
]
