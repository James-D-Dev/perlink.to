<template>
  <UModal v-model:open="open" :title="t('room.tour.title')" :description="t('room.tour.description')" :ui="{ content: 'sm:max-w-3xl' }">
    <template #body>
      <!-- The scene renders here, out of sight, at 540x960 (1080x1920 pixels) -->
      <div ref="sceneBox" class="pointer-events-none fixed -left-[10000px] top-0 h-[960px] w-[540px]" aria-hidden="true" />

      <div class="grid gap-6 sm:grid-cols-[240px_minmax(0,1fr)]">
        <!-- Phone-shaped preview of the video -->
        <div class="relative mx-auto w-[220px] sm:w-[240px]">
          <div class="relative aspect-[9/16] overflow-hidden rounded-[28px] bg-black shadow-xl ring-4 ring-black">
            <video v-if="videoUrl" :src="videoUrl" class="size-full object-cover" controls autoplay loop playsinline />
            <canvas v-else ref="frameCanvas" :width="WIDTH" :height="HEIGHT" class="size-full" />
            <div v-if="!videoUrl && (preparing || recording)" class="absolute inset-x-3 bottom-3 rounded-full bg-black/60 p-1 backdrop-blur">
              <div class="h-1.5 rounded-full bg-white/90 transition-[width] duration-200" :style="{ width: `${Math.round((recording ? progress : 0) * 100)}%` }" />
            </div>
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-5">
          <template v-if="!videoUrl">
            <UFormField :label="t('room.tour.caption')">
              <UInput v-model="caption" maxlength="40" class="w-full" :disabled="recording" />
            </UFormField>

            <UFormField :label="t('room.tour.time')">
              <div class="grid grid-cols-2 gap-2">
                <UButton
                  v-for="option in timeOptions"
                  :key="option.value"
                  :icon="option.icon"
                  :label="option.label"
                  :color="timeOfDay === option.value ? 'primary' : 'neutral'"
                  :variant="timeOfDay === option.value ? 'solid' : 'outline'"
                  :disabled="recording"
                  block
                  @click="timeOfDay = option.value"
                />
              </div>
            </UFormField>

            <UFormField :label="t('room.tour.length')">
              <div class="grid grid-cols-3 gap-2">
                <UButton
                  v-for="seconds in [8, 12, 15]"
                  :key="seconds"
                  :label="`${seconds}s`"
                  :color="duration === seconds ? 'primary' : 'neutral'"
                  :variant="duration === seconds ? 'solid' : 'outline'"
                  :disabled="recording"
                  block
                  @click="duration = seconds"
                />
              </div>
            </UFormField>

            <label v-if="track" class="flex cursor-pointer items-center justify-between gap-3 text-sm">
              <span>
                <span class="block font-medium text-highlighted">{{ t('room.tour.music') }}</span>
                <span class="block text-xs text-muted">{{ track.title }} · {{ track.artist }}</span>
              </span>
              <USwitch v-model="withMusic" :disabled="recording" />
            </label>

            <p v-if="watermark" class="flex items-start gap-2 rounded-lg bg-elevated px-3 py-2 text-xs text-muted">
              <UIcon name="i-lucide-crown" class="mt-0.5 size-3.5 shrink-0 text-amber-500" />
              <span>{{ t('room.tour.watermark') }} <NuxtLink to="/dashboard/upgrade" class="font-medium text-highlighted underline">{{ t('room.tour.removeWatermark') }}</NuxtLink></span>
            </p>
            <p v-if="!supported" class="text-sm text-red-500">{{ t('room.tour.unsupported') }}</p>

            <UButton
              size="lg"
              icon="i-lucide-clapperboard"
              :loading="preparing || recording"
              :disabled="!supported"
              :label="recording ? t('room.tour.recording', { n: Math.max(1, Math.ceil((1 - progress) * duration)) }) : preparing ? t('room.tour.preparing') : t('room.tour.record')"
              block
              @click="record"
            />
          </template>

          <!-- Done -->
          <template v-else>
            <div>
              <p class="font-medium text-highlighted">{{ t('room.tour.ready') }}</p>
              <p class="mt-1 text-sm text-muted">{{ t('room.tour.readyText') }}</p>
            </div>
            <div class="flex flex-col gap-2">
              <UButton v-if="canShare" size="lg" icon="i-lucide-share" :label="t('room.tour.share')" block @click="share" />
              <UButton size="lg" :color="canShare ? 'neutral' : 'primary'" :variant="canShare ? 'outline' : 'solid'" icon="i-lucide-download" :label="t('room.tour.download')" block @click="download" />
            </div>
            <UFormField :label="t('room.tour.postCaption')">
              <div class="flex gap-2">
                <UTextarea :model-value="postText" readonly :rows="3" class="min-w-0 flex-1" />
                <UButton icon="i-lucide-copy" color="neutral" variant="outline" :aria-label="t('room.tour.copy')" @click="copyPostText" />
              </div>
            </UFormField>
            <UButton color="neutral" variant="ghost" icon="i-lucide-rotate-ccw" :label="t('room.tour.again')" @click="reset" />
          </template>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { RoomConfig } from '~/types/room'
import { RoomScene } from '~/utils/room/RoomScene'
import { getDaylight } from '~/utils/room/daylight'
import { MUSIC_BY_ID } from '~/data/roomMusic'

// Records a vertical "room tour" video (1080x1920) for TikTok, Reels and
// Shorts: the camera sweeps through the room, with the site's name, its
// perlink.to address and the room's music. Made in the browser; nothing is
// uploaded.
const props = defineProps<{
  room: RoomConfig
  username: string
  siteName: string
}>()
const open = defineModel<boolean>('open', { default: false })

const { t } = useI18n()
const toast = useToast()
const { info: billing, ensure: ensureBilling } = useBilling()

const WIDTH = 1080
const HEIGHT = 1920
const FPS = 30

const sceneBox = ref<HTMLElement | null>(null)
const frameCanvas = ref<HTMLCanvasElement | null>(null)
const caption = ref('')
const timeOfDay = ref<'day' | 'night'>('day')
const duration = ref(12)
const withMusic = ref(true)
const preparing = ref(false)
const recording = ref(false)
const progress = ref(0)
const videoBlob = ref<Blob | null>(null)
const videoUrl = ref('')

const track = computed(() => (props.room.music?.trackId ? MUSIC_BY_ID[props.room.music.trackId] : undefined))
// Free plans carry a small Perlink mark
const watermark = computed(() => !billing.value?.limits.removeBranding)
const link = computed(() => `perlink.to/${props.username}`)
const postText = computed(() => t('room.tour.postText', { link: link.value }))

const timeOptions = computed(() => [
  { value: 'day' as const, label: t('room.tour.day'), icon: 'i-lucide-sun' },
  { value: 'night' as const, label: t('room.tour.night'), icon: 'i-lucide-moon' },
])

/** The best format this browser records: MP4 where possible (TikTok, iPhone), else WebM */
const mimeType = import.meta.client
  ? ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm'].find(type => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) ?? ''
  : ''
const supported = !!mimeType
const extension = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm'
const canShare = ref(false)

let scene: RoomScene | null = null
let previewFrame = 0

watch(open, (isOpen) => {
  if (isOpen) {
    caption.value ||= props.siteName
    ensureBilling()
    nextTick(startScene)
  } else {
    stopScene()
  }
})
onBeforeUnmount(stopScene)

function startScene() {
  if (!sceneBox.value || scene) return
  scene = new RoomScene(sceneBox.value, { editable: false, capture: true })
  scene.setRoom(props.room)
  applyTime()
  const loop = () => {
    previewFrame = requestAnimationFrame(loop)
    if (!recording.value && !videoUrl.value) drawFrame(0)
  }
  loop()
}

function stopScene() {
  cancelAnimationFrame(previewFrame)
  scene?.dispose()
  scene = null
}

function applyTime() {
  scene?.setDaylightOverride(getDaylight({ ...props.room.environment, mode: timeOfDay.value }))
}
watch(timeOfDay, applyTime)

// ---------- Drawing ----------

/** One video frame: the room at this point of the tour, with the titles over it */
function drawFrame(p: number) {
  const ctx = frameCanvas.value?.getContext('2d')
  if (!scene || !ctx) return
  ctx.drawImage(scene.renderTour(p), 0, 0, WIDTH, HEIGHT)

  // Top shade so the text reads on any sky
  const shade = ctx.createLinearGradient(0, 0, 0, 520)
  shade.addColorStop(0, 'rgba(0,0,0,0.45)')
  shade.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, WIDTH, 520)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 24
  ctx.font = '700 76px Inter, system-ui, sans-serif'
  ctx.fillText(fit(ctx, caption.value || props.siteName, WIDTH - 140), WIDTH / 2, 230)
  ctx.shadowBlur = 0
  pill(ctx, link.value, WIDTH / 2, 330, 40)

  if (watermark.value) {
    ctx.font = '600 30px Inter, system-ui, sans-serif'
    ctx.textAlign = 'right'
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.fillText(t('room.tour.madeWith'), WIDTH - 48, 84)
  }

  // Closing card over the last second and a half
  const end = duration.value ? Math.max(0, Math.min(1, (p * duration.value - (duration.value - 1.5)) / 0.6)) : 0
  if (end > 0) {
    ctx.fillStyle = `rgba(12,11,10,${0.55 * end})`
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.globalAlpha = end
    ctx.textAlign = 'center'
    ctx.fillStyle = '#ffffff'
    ctx.font = '600 58px Inter, system-ui, sans-serif'
    ctx.fillText(t('room.tour.visit'), WIDTH / 2, HEIGHT / 2 - 70)
    pill(ctx, link.value, WIDTH / 2, HEIGHT / 2 + 40, 52)
    ctx.globalAlpha = 1
  }
}

function fit(ctx: CanvasRenderingContext2D, text: string, max: number) {
  if (ctx.measureText(text).width <= max) return text
  let cut = text
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > max) cut = cut.slice(0, -1)
  return `${cut}…`
}

/** White rounded label with dark text */
function pill(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number) {
  ctx.font = `600 ${size}px Inter, system-ui, sans-serif`
  const w = ctx.measureText(text).width + size * 1.4
  const h = size * 1.9
  ctx.fillStyle = 'rgba(255,255,255,0.94)'
  ctx.beginPath()
  ctx.roundRect(x - w / 2, y - h / 2, w, h, h / 2)
  ctx.fill()
  ctx.fillStyle = '#0c0b0a'
  ctx.textAlign = 'center'
  ctx.fillText(text, x, y + 2)
}

// ---------- Recording ----------

async function record() {
  if (!scene || !frameCanvas.value || recording.value) return
  preparing.value = true
  // Give models a moment to finish loading, up to 6 seconds
  const waitUntil = performance.now() + 6000
  while (scene?.loading && performance.now() < waitUntil) await new Promise(r => setTimeout(r, 200))
  if (!scene) return
  preparing.value = false

  const stream = frameCanvas.value.captureStream(FPS)
  let audio: HTMLAudioElement | null = null
  let audioContext: AudioContext | null = null
  let gain: GainNode | null = null
  if (withMusic.value && track.value) {
    try {
      audio = new Audio(track.value.src)
      audio.crossOrigin = 'anonymous'
      audioContext = new AudioContext()
      const destination = audioContext.createMediaStreamDestination()
      gain = audioContext.createGain()
      gain.gain.value = props.room.music?.volume ?? 0.6
      audioContext.createMediaElementSource(audio).connect(gain).connect(destination)
      destination.stream.getAudioTracks().forEach(track => stream.addTrack(track))
      await audio.play()
    } catch {
      // Recorded without music if the browser won't play it
      audio = null
    }
  }

  const chunks: Blob[] = []
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 10_000_000 })
  recorder.ondataavailable = event => event.data.size && chunks.push(event.data)
  const stopped = new Promise<void>(resolve => (recorder.onstop = () => resolve()))

  recording.value = true
  progress.value = 0
  recorder.start(250)
  const startedAt = performance.now()
  const total = duration.value * 1000
  await new Promise<void>((resolve) => {
    const tick = () => {
      const p = Math.min((performance.now() - startedAt) / total, 1)
      progress.value = p
      drawFrame(p)
      // Fade the music out over the last second
      if (gain && audioContext && p > 1 - 1000 / total) gain.gain.value = (props.room.music?.volume ?? 0.6) * Math.max(0, (1 - p) * total / 1000)
      if (p < 1) requestAnimationFrame(tick)
      else resolve()
    }
    requestAnimationFrame(tick)
  })
  // Hold the last frame a moment so it isn't cut
  await new Promise(r => setTimeout(r, 200))
  recorder.stop()
  await stopped
  audio?.pause()
  await audioContext?.close()
  stream.getTracks().forEach(track => track.stop())
  recording.value = false

  videoBlob.value = new Blob(chunks, { type: mimeType.split(';')[0] })
  videoUrl.value = URL.createObjectURL(videoBlob.value)
  canShare.value = !!navigator.canShare?.({ files: [videoFile()] })
}

function videoFile() {
  return new File([videoBlob.value!], `perlink-${props.username}.${extension}`, { type: videoBlob.value!.type })
}

function download() {
  const a = document.createElement('a')
  a.href = videoUrl.value
  a.download = `perlink-${props.username}.${extension}`
  a.click()
}

async function share() {
  try {
    await navigator.share({ files: [videoFile()], text: postText.value })
  } catch {
    // Closed the share sheet
  }
}

function copyPostText() {
  navigator.clipboard.writeText(postText.value)
  toast.add({ title: t('room.tour.copied') })
}

function reset() {
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
  videoUrl.value = ''
  videoBlob.value = null
  progress.value = 0
}
watch(open, (isOpen) => {
  if (!isOpen) reset()
})
</script>
