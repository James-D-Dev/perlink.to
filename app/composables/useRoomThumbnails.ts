import { loadRoomThumbnails } from '~/utils/room/thumbnails'

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
