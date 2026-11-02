<template>
  <!-- A spinning record, top left (sharing sits top right): the page's music
       starts with the visitor's first tap anywhere (browsers allow sound
       only after one), and this pauses or plays it -->
  <button
    ref="button"
    type="button"
    class="fixed left-4 top-[calc(1rem+env(safe-area-inset-top))] z-50 flex size-11 items-center justify-center rounded-full bg-white/85 text-[#1c1a17] shadow-[inset_0_1px_0_rgb(255_255_255/0.85),0_10px_30px_-8px_rgb(0_0_0/0.3)] ring-1 ring-black/10 backdrop-blur"
    :aria-label="playing ? t('musicPause') : t('musicPlay')"
    :aria-pressed="playing"
    @click.stop="toggle"
  >
    <UIcon :name="playing ? 'i-lucide-disc-3' : 'i-lucide-music'" class="size-5" :class="playing && 'animate-spin [animation-duration:3s]'" />
  </button>
</template>

<script setup lang="ts">
import { MUSIC_BY_ID } from '~/data/roomMusic'

const props = defineProps<{ trackId: string }>()

const { t } = useSiteI18n()
const playing = ref(false)
const button = ref<HTMLButtonElement>()
let audio: HTMLAudioElement | null = null
// Once the visitor pauses, a later tap on the page doesn't start it again
let pausedByVisitor = false

function ensureAudio() {
  const track = MUSIC_BY_ID[props.trackId]
  if (!track) return null
  if (!audio) {
    audio = new Audio(track.src)
    audio.loop = true
    audio.volume = 0.5
    audio.onplay = () => (playing.value = true)
    audio.onpause = () => (playing.value = false)
  }
  return audio
}

function play() {
  ensureAudio()?.play().catch(() => {})
}

function toggle() {
  if (playing.value) {
    pausedByVisitor = true
    audio?.pause()
  } else {
    pausedByVisitor = false
    play()
  }
}

function onFirstTap(event: PointerEvent) {
  document.removeEventListener('pointerdown', onFirstTap, true)
  // A first tap on the record itself is handled by toggle()
  if (button.value?.contains(event.target as Node)) return
  if (!pausedByVisitor && !playing.value) play()
}

onMounted(() => document.addEventListener('pointerdown', onFirstTap, true))
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onFirstTap, true)
  audio?.pause()
  audio = null
})
</script>
