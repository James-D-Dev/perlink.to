// Premium 3D item packs for the room, sold once (Creem, one-time
// product) and kept forever. Max includes every pack. Items are drawn in
// code like the rest of the catalog (app/utils/room/premiumModels.ts); the
// server only needs to know which item types belong to which pack.

export type RoomPackId = 'valentine' | 'birthday' | 'tet' | 'wedding' | 'galaxy' | 'proposal' | 'showroom'

export interface RoomPack {
  id: RoomPackId
  /** Price in US dollars, one time */
  priceUsd: number
  /** Item types (catalog `type`) in the pack */
  items: string[]
  /** Card colours on the 3D room packs page: from, via, to */
  colors: [string, string, string]
}

export const ROOM_PACKS: RoomPack[] = [
  {
    id: 'proposal',
    priceUsd: 15,
    items: ['vip-ring-box', 'vip-marry-me', 'vip-rose-heart', 'vip-petal-aisle', 'vip-grand-piano', 'vip-fireworks'],
    colors: ['#7f1d1d', '#be123c', '#f59e0b'],
  },
  {
    id: 'showroom',
    priceUsd: 19,
    items: ['vip-display-podium', 'vip-glass-cabinet', 'vip-neon-open', 'vip-ad-screen', 'vip-checkout-counter', 'vip-sale-banner'],
    colors: ['#0f172a', '#334155', '#e11d48'],
  },
  {
    id: 'valentine',
    priceUsd: 5,
    items: ['vip-rose-bouquet', 'vip-heart-balloons', 'vip-rose-arch', 'vip-candle-heart', 'vip-neon-heart', 'vip-love-bear'],
    colors: ['#fb7185', '#ec4899', '#c026d3'],
  },
  {
    id: 'wedding',
    priceUsd: 6,
    items: ['vip-wedding-arch', 'vip-wedding-cake', 'vip-champagne-tower', 'vip-love-marquee', 'vip-candle-lanterns', 'vip-sparkler-fountain'],
    colors: ['#b8925a', '#d79aa6', '#8c7a6e'],
  },
  {
    id: 'birthday',
    priceUsd: 5,
    items: ['vip-birthday-cake', 'vip-balloon-bunch', 'vip-gift-tower', 'vip-disco-ball', 'vip-confetti-popper', 'vip-birthday-bunting'],
    colors: ['#38bdf8', '#8b5cf6', '#ec4899'],
  },
  {
    id: 'galaxy',
    priceUsd: 7,
    items: ['vip-floating-planet', 'vip-jellyfish-lamp', 'vip-star-projector', 'vip-moon-lamp', 'vip-snow-globe', 'vip-nebula-painting'],
    colors: ['#1e1b4b', '#6d28d9', '#c026d3'],
  },
  {
    id: 'tet',
    priceUsd: 5,
    items: ['vip-peach-blossom', 'vip-apricot-blossom', 'vip-kumquat-tree', 'vip-red-lanterns', 'vip-firecrackers', 'vip-five-fruit-tray'],
    colors: ['#dc2626', '#ef4444', '#fbbf24'],
  },
]

export const ROOM_PACK_BY_ID = Object.fromEntries(ROOM_PACKS.map(p => [p.id, p])) as Record<RoomPackId, RoomPack>

/** Item type → the pack it comes in */
export const PACK_OF_ITEM: Record<string, RoomPackId> = Object.fromEntries(
  ROOM_PACKS.flatMap(pack => pack.items.map(type => [type, pack.id])),
)

export const isRoomPackId = (value: unknown): value is RoomPackId => typeof value === 'string' && value in ROOM_PACK_BY_ID

/** Plans that include every pack */
export const PLANS_WITH_ALL_PACKS = new Set(['max'])

/** The packs a room uses (from its objects' types) */
export function packsInRoom(objects: { type: string }[] | undefined): RoomPackId[] {
  const packs = new Set<RoomPackId>()
  for (const object of objects ?? []) {
    const pack = PACK_OF_ITEM[object.type]
    if (pack) packs.add(pack)
  }
  return [...packs]
}
