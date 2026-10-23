import { loadRoomStyleThumbnails, loadRoomThumbnails } from '~/utils/room/thumbnails'
import { ROOM_STYLE_PRESETS } from '~/data/roomPresets'

/** Reactive map of catalog type -> rendered thumbnail data URL (client only) */
export function useRoomThumbnails() {
  const thumbnails = reactive<Record<string, string>>({})

  onMounted(() => {
    loadRoomThumbnails((type, url) => {
      thumbnails[type] = url
    }).catch((error) => {
      console.error('Failed to render room thumbnails:', error)
    })
  })

  return thumbnails
}

/** Reactive map of room style preset name -> rendered preview (client only) */
export function useRoomStyleThumbnails() {
  const thumbnails = reactive<Record<string, string>>({})
  onMounted(() => {
    loadRoomStyleThumbnails(ROOM_STYLE_PRESETS, (name, url) => {
      thumbnails[name] = url
    }).catch((error) => {
      console.error('Failed to render room style previews:', error)
    })
  })
  return thumbnails
}
