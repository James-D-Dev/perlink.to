// Premium 3D item packs for the room, sold once (Lemon Squeezy, one-time
// product) and kept forever. Max includes every pack. Items are drawn in
// code like the rest of the catalog (app/utils/room/premiumModels.ts); the
// server only needs to know which item types belong to which pack.

export type RoomPackId = 'valentine'

export interface RoomPack {
  id: RoomPackId
  /** Price in US dollars, one time */
  priceUsd: number
  /** Item types (catalog `type`) in the pack */
  items: string[]
  /** Card colours on the marketplace */
  gradient: string
  /** The Lemon Squeezy product's name contains this (case-insensitive) */
  lemonMatch: string
}

export const ROOM_PACKS: RoomPack[] = [
  {
    id: 'valentine',
    priceUsd: 4,
    items: ['vip-rose-bouquet', 'vip-heart-balloons', 'vip-rose-arch', 'vip-candle-heart', 'vip-neon-heart', 'vip-love-bear'],
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-600',
    lemonMatch: 'valentine',
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
