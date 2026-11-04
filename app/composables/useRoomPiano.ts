import { MUSIC_BY_ID } from '~/data/roomMusic'
import { pianoState } from '~/utils/room/modelKit'

/**
 * A piano (or any item with `music`) clicked in a room plays its track once;
 * clicking again stops it. While it plays, the room's own music pauses and
 * the piano's keys move (pianoState).
 */
export function useRoomPiano(hooks: { pauseOther?: () => boolean; resumeOther?: () => void } = {}) {
  const playing = ref<string | null>(null)
  let audio: HTMLAudioElement | null = null
  let resumeAfter = false

  function stop() {
    audio?.pause()
    audio = null
    playing.value = null
    pianoState.playing = false
    if (resumeAfter) hooks.resumeOther?.()
    resumeAfter = false
  }

  function toggle(trackId: string) {
    if (playing.value) {
      stop()
      return
    }
    const track = MUSIC_BY_ID[trackId]
    if (!track) return
    resumeAfter = hooks.pauseOther?.() ?? false
    audio = new Audio(track.src)
    audio.volume = 0.8
    audio.addEventListener('ended', stop, { once: true })
    audio.addEventListener('error', stop, { once: true })
    playing.value = trackId
    pianoState.playing = true
    audio.play().catch(stop)
  }

  onBeforeUnmount(stop)
  return { playing, toggle, stop }
}
