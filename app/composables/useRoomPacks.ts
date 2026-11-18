import type { RoomPackId } from '#shared/roomPacks'

export interface RoomPackState {
  signedIn: boolean
  /** On Max: every pack */
  allIncluded: boolean
  canBuy: boolean
  packs: { id: RoomPackId; priceUsd: number; items: string[]; owned: boolean }[]
}

/** Room packs the signed-in account has, shared across the app */
export function useRoomPacks() {
  const state = useState<RoomPackState | null>('room-packs', () => null)
  const buying = useState<RoomPackId | null>('room-packs-buying', () => null)

  async function refresh() {
    try {
      state.value = await $fetch<RoomPackState>('/api/room-packs')
    } catch {}
    return state.value
  }
  const ensure = () => state.value ?? refresh()

  const owns = (pack: string) => !!state.value?.packs.find(p => p.id === pack)?.owned

  /** Opens Creem's checkout for a pack; comes back to `back` (this page by default) */
  async function buy(pack: RoomPackId, back?: string) {
    buying.value = pack
    try {
      const res = await $fetch<{ url?: string; owned?: boolean }>('/api/room-packs/checkout', {
        method: 'POST',
        body: { pack, back: back ?? (useRoute().fullPath.split('?')[0]) },
      })
      if (res.url) {
        useAnalytics().track('begin_checkout', { item_category: 'room_pack', item_name: pack })
        window.location.href = res.url
      }
      else if (res.owned) await refresh()
    } catch (error: any) {
      if (error?.statusCode === 401 || error?.status === 401) {
        rememberPostLoginRedirect('/3d-room-packs')
        await navigateTo('/login')
        return
      }
      useToast().add({ title: useNuxtApp().$i18n.t('room.packs.checkoutFailed'), description: error?.data?.statusMessage, color: 'error' })
    } finally {
      buying.value = null
    }
  }

  return { state, buying, refresh, ensure, owns, buy }
}

/** A room that needs packs to publish (from a 402 PACK_REQUIRED); BillingPackDialog shows it */
export function usePackPrompt() {
  const packs = useState<RoomPackId[] | null>('pack-prompt', () => null)
  return { packs, open: (value: RoomPackId[]) => { packs.value = value }, close: () => { packs.value = null } }
}
