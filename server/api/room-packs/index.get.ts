import { ownedPacks } from '../../utils/roomPacks'
import { creemEnabled } from '../../utils/creem'
import { ROOM_PACKS } from '#shared/roomPacks'

// The 3D room packs page: every room pack, its price, and whether the signed-in
// account already has it (bought, or on Max)
export default defineEventHandler(async (event) => {
  const user = event.context.user
  const owned = user ? await ownedPacks(event, user.id) : { all: false, packs: new Set<string>() }
  return {
    signedIn: !!user,
    allIncluded: owned.all,
    canBuy: creemEnabled(event),
    packs: ROOM_PACKS.map(pack => ({ id: pack.id, priceUsd: pack.priceUsd, items: pack.items, owned: owned.packs.has(pack.id) })),
  }
})
