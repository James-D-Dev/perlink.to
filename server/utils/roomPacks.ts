import type { H3Event } from 'h3'
import { getDB } from './db'
import { getAccountPlan } from './plan'
import { PLANS_WITH_ALL_PACKS, ROOM_PACKS, packsInRoom, type RoomPackId } from '#shared/roomPacks'

/** The packs an account can use: every pack on Max, else the ones it bought */
export async function ownedPacks(event: H3Event, userId: string): Promise<{ all: boolean; packs: Set<RoomPackId> }> {
  const { plan } = await getAccountPlan(event, userId)
  if (PLANS_WITH_ALL_PACKS.has(plan)) return { all: true, packs: new Set(ROOM_PACKS.map(p => p.id)) }
  const rows = await getDB(event).prepare('SELECT pack_id FROM room_packs WHERE user_id = ?').bind(userId)
    .all<{ pack_id: RoomPackId }>()
    .catch(() => ({ results: [] as { pack_id: RoomPackId }[] }))
  return { all: false, packs: new Set((rows.results ?? []).map(r => r.pack_id)) }
}

type Roomed = { room?: { objects?: { type: string }[] } } | null | undefined

/**
 * Before a room goes live: premium items need their pack. Items already
 * live stay (e.g. after Max ends, the room keeps what was published), so
 * only adding a pack's items asks for it. 402 PACK_REQUIRED lists the packs.
 */
export async function requireRoomPacksAllowed(event: H3Event, userId: string, next: Roomed, live?: Roomed) {
  const wanted = packsInRoom(next?.room?.objects)
  if (!wanted.length) return
  const liveAlready = new Set(packsInRoom(live?.room?.objects))
  const needed = wanted.filter(p => !liveAlready.has(p))
  if (!needed.length) return
  const { packs } = await ownedPacks(event, userId)
  const missing = needed.filter(p => !packs.has(p))
  if (!missing.length) return
  throw createError({
    statusCode: 402,
    statusMessage: 'This room uses premium items',
    data: { code: 'PACK_REQUIRED', packs: missing },
  })
}
