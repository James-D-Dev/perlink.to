<template>
  <!-- The capture scene renders out of sight at 540x960 (1080x1920 pixels),
       only while recording -->
  <Teleport to="body">
    <div v-if="open && phase === 'recording'" ref="sceneBox" class="pointer-events-none fixed -left-[10000px] top-0 h-[960px] w-[540px]" aria-hidden="true" />
  </Teleport>

  <!-- Full-screen studio over the paused editor: set up, record, share. It
       closes only through Back, which returns to the site editor -->
  <Teleport to="body">
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0" leave-active-class="transition duration-200 ease-in" leave-to-class="opacity-0">
      <div
        v-if="open"
        class="fixed inset-0 z-[150] flex flex-col bg-neutral-950/80 text-white backdrop-blur-2xl"
        role="dialog"
        aria-modal="true"
        :aria-label="t('room.tour.title')"
      >
        <!-- Top: title, or the recording status -->
        <header class="flex h-16 shrink-0 items-center justify-center px-4">
          <div v-if="phase === 'recording'" class="flex w-full max-w-sm items-center gap-3 rounded-full bg-white/10 py-2 pl-4 pr-2 ring-1 ring-white/10">
            <span class="relative flex size-3 shrink-0">
              <span v-if="!preparing" class="absolute inset-0 animate-ping rounded-full bg-red-500/70" />
              <span class="relative size-3 rounded-full" :class="preparing ? 'bg-white/30' : 'bg-red-500'" />
            </span>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold">{{ preparing ? t('room.tour.preparing') : t('room.tour.recordingNow') }}</p>
              <div class="mt-1 h-1 overflow-hidden rounded-full bg-white/15">
                <div class="h-full rounded-full bg-red-500" :style="{ width: `${Math.round(progress * 100)}%` }" />
              </div>
            </div>
            <span class="shrink-0 text-sm font-semibold tabular-nums text-white/70">{{ clock(progress * duration) }} / {{ clock(duration) }}</span>
          </div>
          <h2 v-else class="text-[17px] font-semibold tracking-tight">{{ phase === 'done' ? t('room.tour.ready') : t('room.tour.title') }}</h2>
        </header>

        <div class="flex min-h-0 flex-1 flex-col items-center gap-5 overflow-y-auto px-4 pb-4 sm:flex-row sm:justify-center sm:gap-10 sm:px-8">
          <!-- The video frame: a still of the editor's view while setting up,
               the live frame while recording, the finished video after -->
          <div class="relative aspect-[9/16] h-[min(62dvh,720px)] shrink-0 overflow-hidden rounded-[30px] bg-black shadow-2xl ring-1 ring-white/10 sm:h-[min(78dvh,760px)]">
            <video v-if="phase === 'done' && videoUrl" :src="videoUrl" class="size-full object-cover" controls autoplay loop playsinline />
            <div v-show="phase === 'recording'" ref="liveBox" class="size-full [&>canvas]:size-full" />
            <canvas v-show="phase === 'setup'" ref="frameCanvas" :width="WIDTH" :height="HEIGHT" class="size-full" />
            <div v-if="(phase === 'setup' && !stillReady) || preparing" class="absolute inset-0 flex items-center justify-center bg-black/40">
              <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-white" />
            </div>
          </div>

          <!-- Controls -->
          <div class="flex w-full max-w-sm flex-col gap-4">
            <template v-if="phase === 'setup'">
              <UInput v-model="caption" maxlength="40" size="xl" class="w-full" :placeholder="t('room.tour.caption')" :aria-label="t('room.tour.caption')" />
              <div class="flex items-center gap-2">
                <UTooltip :text="timeOfDay === 'day' ? t('room.tour.day') : t('room.tour.night')">
                  <UButton :icon="timeOfDay === 'day' ? 'i-lucide-sun' : 'i-lucide-moon'" color="neutral" variant="soft" size="lg" :aria-label="timeOfDay === 'day' ? t('room.tour.day') : t('room.tour.night')" @click="timeOfDay = timeOfDay === 'day' ? 'night' : 'day'" />
                </UTooltip>
                <UTooltip :text="t('room.tour.length')">
                  <UButton icon="i-lucide-timer" :label="`${duration}s`" color="neutral" variant="soft" size="lg" class="tabular-nums" :aria-label="`${t('room.tour.length')}: ${duration}s`" @click="cycleDuration" />
                </UTooltip>
                <!-- How the camera moves -->
                <UDropdownMenu :items="styleItems" :content="{ align: 'start' }" :ui="{ content: 'z-[160]' }">
                  <UButton :icon="STYLE_ICONS[tourStyle]" :label="t(`room.tour.styles.${tourStyle}`)" trailing-icon="i-lucide-chevron-down" color="neutral" variant="soft" size="lg" :aria-label="`${t('room.tour.style')}: ${t(`room.tour.styles.${tourStyle}`)}`" />
                </UDropdownMenu>
                <UTooltip v-if="track" :text="withMusic ? `${track.title} · ${track.artist}` : t('room.tour.music')">
                  <UButton :icon="withMusic ? 'i-lucide-music' : 'i-lucide-volume-x'" color="neutral" :variant="withMusic ? 'soft' : 'ghost'" size="lg" :class="!withMusic && 'opacity-60'" :aria-label="t('room.tour.music')" :aria-pressed="withMusic" @click="withMusic = !withMusic" />
                </UTooltip>
              </div>
              <!-- The "remove it" offer, only while paid plans can remove it -->
              <p v-if="watermark && !BRANDING_FOR_ALL" class="flex items-start gap-2 text-xs text-white/60">
                <UIcon name="i-lucide-crown" class="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                <span>{{ t('room.tour.watermark') }} <NuxtLink to="/dashboard/upgrade" class="font-medium text-white underline">{{ t('room.tour.removeWatermark') }}</NuxtLink></span>
              </p>
              <p v-if="!supported" class="text-sm text-red-400">{{ t('room.tour.unsupported') }}</p>
              <div class="mt-2 flex gap-2">
                <UButton size="xl" color="neutral" variant="soft" icon="i-lucide-arrow-left" :label="t('room.tour.back')" @click="close" />
                <UButton size="xl" icon="i-lucide-clapperboard" class="flex-1 justify-center" :disabled="!supported || !stillReady" :label="t('room.tour.record')" @click="record" />
              </div>
            </template>

            <template v-else-if="phase === 'recording'">
              <UButton size="xl" color="neutral" variant="soft" icon="i-lucide-square" class="justify-center" :label="t('room.tour.cancel')" @click="cancelRecording" />
            </template>

            <!-- Done: back to the options, share (the post text and link go
                 with it), download -->
            <template v-else>
              <p class="text-sm text-white/70">{{ t('room.tour.readyText') }}</p>
              <div class="flex gap-2">
                <UButton size="xl" color="neutral" variant="soft" icon="i-lucide-arrow-left" :label="t('room.tour.back')" @click="reset" />
                <UButton v-if="canShare" size="xl" icon="i-lucide-share" class="flex-1 justify-center" :label="t('room.tour.share')" @click="share" />
                <UButton
                  size="xl"
                  icon="i-lucide-download"
                  :color="canShare ? 'neutral' : 'primary'"
                  :variant="canShare ? 'soft' : 'solid'"
                  :class="!canShare && 'flex-1 justify-center'"
                  :label="canShare ? undefined : t('room.tour.download')"
                  :aria-label="t('room.tour.download')"
                  @click="download"
                />
              </div>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { RoomConfig } from '~/types/room'
import { RoomScene, TOUR_STYLES, type TourStyle } from '~/utils/room/RoomScene'
import { getDaylight, type DaylightState } from '~/utils/room/daylight'
import { MUSIC_BY_ID } from '~/data/roomMusic'
import { BRANDING_FOR_ALL, showsBranding } from '#shared/plans'

// Records a vertical "room tour" video (1080x1920) for TikTok, Reels and
// Shorts: the camera sweeps through the room, with the site's name, its
// perlink.to address and the room's music. Made in the browser; nothing is
// uploaded.
const props = defineProps<{
  room: RoomConfig
  username: string
  siteName: string
  /** A picture of the editor's current view in a light (the preview) */
  still: (light: DaylightState) => Promise<Blob | null>
}>()
/** Open: the editor pauses and hides behind the studio; closing goes back */
const open = defineModel<boolean>('open', { default: false })

const { t } = useI18n()
const { info: billing, ensure: ensureBilling } = useBilling()

const WIDTH = 1080
const HEIGHT = 1920
const FPS = 30

const sceneBox = ref<HTMLElement | null>(null)
const frameCanvas = ref<HTMLCanvasElement | null>(null)
const caption = ref('')
const timeOfDay = ref<'day' | 'night'>('day')
const duration = ref(12)
const tourStyle = ref<TourStyle>('sweep')
const STYLE_ICONS: Record<TourStyle, string> = {
  sweep: 'i-lucide-move-horizontal',
  orbit: 'i-lucide-rotate-3d',
  dive: 'i-lucide-plane-landing',
  crane: 'i-lucide-move-diagonal',
}
const styleItems = computed(() => TOUR_STYLES.map(style => ({
  label: t(`room.tour.styles.${style}`),
  icon: STYLE_ICONS[style],
  type: 'checkbox' as const,
  checked: tourStyle.value === style,
  onUpdateChecked: () => (tourStyle.value = style),
})))
const withMusic = ref(true)
// setup: choosing options; recording: dialog hidden, recording; done: the video
const phase = ref<'setup' | 'recording' | 'done'>('setup')
const preparing = ref(false)
const progress = ref(0)
const stillReady = ref(false)
const liveBox = ref<HTMLElement | null>(null)
const videoBlob = ref<Blob | null>(null)
const videoUrl = ref('')

const track = computed(() => (props.room.music?.trackId ? MUSIC_BY_ID[props.room.music.trackId] : undefined))
// Free plans carry a small Perlink mark
const watermark = computed(() => showsBranding(billing.value?.plan))
const link = computed(() => `perlink.to/${props.username}`)
const postText = computed(() => t('room.tour.postText', { link: link.value }))

const DURATIONS = [8, 12, 15]
function cycleDuration() {
  duration.value = DURATIONS[(DURATIONS.indexOf(duration.value) + 1) % DURATIONS.length]!
}

/** The best format this browser records: MP4 where possible (TikTok, iPhone), else WebM */
const mimeType = import.meta.client
  ? ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm'].find(type => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) ?? ''
  : ''
const supported = !!mimeType
const extension = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm'
const canShare = ref(false)

let scene: RoomScene | null = null
/** Video frames are drawn here; shown in the frame while recording */
let recordCanvas: HTMLCanvasElement | null = null
let stillImage: HTMLImageElement | null = null

watch(open, (isOpen) => {
  if (isOpen) {
    caption.value ||= props.siteName
    ensureBilling()
    loadStill()
  } else {
    stopScene()
    reset()
  }
}, { immediate: true })
onBeforeUnmount(stopScene)

function close() {
  open.value = false
}

// ---------- Preview: a still of the editor's view, no second 3D scene ----------

async function loadStill() {
  stillReady.value = false
  const blob = await props.still(videoLight()).catch(() => null)
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const img = new Image()
  img.onload = () => {
    stillImage = img
    stillReady.value = true
    drawPreview()
    URL.revokeObjectURL(url)
  }
  img.src = url
}

/** The still cropped to fill a 9:16 frame, with the titles over it */
function drawPreview() {
  const canvas = frameCanvas.value
  const ctx = canvas?.getContext('2d')
  if (!ctx || !stillImage) return
  const scale = Math.max(WIDTH / stillImage.width, HEIGHT / stillImage.height)
  const w = stillImage.width * scale
  const h = stillImage.height * scale
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.drawImage(stillImage, (WIDTH - w) / 2, (HEIGHT - h) / 2, w, h)
  drawTitles(ctx, 0)
}
watch(timeOfDay, loadStill)
watch(caption, drawPreview)

// ---------- Recording scene: made when recording starts, gone after ----------

function startScene() {
  if (!sceneBox.value || scene) return
  scene = new RoomScene(sceneBox.value, { editable: false, capture: true })
  scene.setRoom(props.room)
  applyTime()
}

function stopScene() {
  scene?.dispose()
  scene = null
}

/** The light the video is recorded in; the preview uses the same */
function videoLight() {
  return getDaylight({ ...props.room.environment, mode: timeOfDay.value })
}

function applyTime() {
  scene?.setDaylightOverride(videoLight())
}
watch(timeOfDay, applyTime)

// ---------- Drawing ----------

/** One video frame: the room at this point of the tour, with the titles over it */
function drawFrame(target: HTMLCanvasElement, p: number) {
  const ctx = target.getContext('2d')
  if (!scene || !ctx) return
  ctx.drawImage(scene.renderTour(p, tourStyle.value), 0, 0, WIDTH, HEIGHT)
  drawTitles(ctx, p)
}

/** Name, link, watermark and the closing card */
function drawTitles(ctx: CanvasRenderingContext2D, p: number) {
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

let cancelled = false
let musicOffset = 0

/** Seconds into a track where the sound starts (within its first 3 s) */
function firstSound(buffer: AudioBuffer) {
  const data = buffer.getChannelData(0)
  const end = Math.min(data.length, buffer.sampleRate * 3)
  for (let i = 0; i < end; i++) {
    if (Math.abs(data[i]!) > 0.01) return Math.max(0, i / buffer.sampleRate - 0.02)
  }
  return 0
}

const clock = (seconds: number) => `0:${String(Math.min(Math.floor(seconds), 59)).padStart(2, '0')}`

function cancelRecording() {
  cancelled = true
}

/**
 * Records in real time. To keep it smooth the editor's own scene stays
 * paused and a scene of its own is made just for this; each frame is pushed to the video right after
 * it's drawn (at 30 fps). Music is decoded up front and played by the audio
 * engine, so a busy moment on the page can't make it skip.
 */
async function record() {
  if (phase.value !== 'setup') return
  // Created inside the click, so the browser lets it play
  const audioContext = withMusic.value && track.value ? new AudioContext() : null
  cancelled = false
  progress.value = 0
  preparing.value = true
  phase.value = 'recording'

  recordCanvas ??= Object.assign(document.createElement('canvas'), { width: WIDTH, height: HEIGHT })
  await nextTick()
  startScene()
  liveBox.value?.replaceChildren(recordCanvas)
  drawFrame(recordCanvas, 0)

  // Models finish loading (up to 6 s) while the music decodes
  const loaded = (async () => {
    const until = performance.now() + 6000
    while (scene?.loading && performance.now() < until) await new Promise(r => setTimeout(r, 150))
  })()
  const music = audioContext && track.value
    ? fetch(track.value.src).then(r => r.arrayBuffer()).then(b => audioContext.decodeAudioData(b)).catch(() => null)
    : Promise.resolve(null)
  const [, buffer] = await Promise.all([loaded, music])
  if (cancelled || !scene) return finish(audioContext, null)

  // Video: a frame is added each time one is drawn
  let stream = recordCanvas.captureStream(0)
  const videoTrack = stream.getVideoTracks()[0] as (MediaStreamTrack & { requestFrame?: () => void }) | undefined
  if (!videoTrack?.requestFrame) stream = recordCanvas.captureStream(FPS)
  const total = duration.value

  // Music, with a fade over the last second scheduled ahead
  let source: AudioBufferSourceNode | null = null
  if (audioContext && buffer) {
    await audioContext.resume()
    const destination = audioContext.createMediaStreamDestination()
    const gain = audioContext.createGain()
    const volume = props.room.music?.volume ?? 0.6
    source = audioContext.createBufferSource()
    source.buffer = buffer
    source.loop = true
    // Skip a quiet intro so the video has sound from the first second
    musicOffset = firstSound(buffer)
    source.loopStart = musicOffset
    source.connect(gain).connect(destination)
    destination.stream.getAudioTracks().forEach(t => stream.addTrack(t))
    const at = audioContext.currentTime
    gain.gain.setValueAtTime(volume, at)
    gain.gain.setValueAtTime(volume, at + total - 1)
    gain.gain.linearRampToValueAtTime(0, at + total)
  }

  const chunks: Blob[] = []
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000, audioBitsPerSecond: 160_000 })
  recorder.ondataavailable = event => event.data.size && chunks.push(event.data)
  const stopped = new Promise<void>(resolve => (recorder.onstop = () => resolve()))

  preparing.value = false
  recorder.start(1000)
  source?.start(0, musicOffset)
  const startedAt = performance.now()
  await new Promise<void>((resolve) => {
    let last = 0
    const tick = (now: number) => {
      if (cancelled) return resolve()
      const p = Math.min((now - startedAt) / (total * 1000), 1)
      if (now - last >= 1000 / FPS - 2 || p >= 1) {
        last = now
        drawFrame(recordCanvas!, p)
        videoTrack?.requestFrame?.()
        progress.value = p
      }
      if (p < 1) requestAnimationFrame(tick)
      else resolve()
    }
    requestAnimationFrame(tick)
  })
  // Hold the last frame a moment so it isn't cut
  if (!cancelled) await new Promise(r => setTimeout(r, 150))
  recorder.stop()
  await stopped
  stream.getTracks().forEach(t => t.stop())
  finish(audioContext, cancelled ? null : new Blob(chunks, { type: mimeType.split(';')[0] }))
}

function finish(audioContext: AudioContext | null, blob: Blob | null) {
  audioContext?.close().catch(() => {})
  preparing.value = false
  // The recording scene's work is done; free it
  stopScene()
  if (!blob) {
    phase.value = 'setup'
    progress.value = 0
    return
  }
  videoBlob.value = blob
  videoUrl.value = URL.createObjectURL(blob)
  canShare.value = !!navigator.canShare?.({ files: [videoFile()] })
  phase.value = 'done'
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


function reset() {
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
  videoUrl.value = ''
  videoBlob.value = null
  progress.value = 0
  phase.value = 'setup'
  nextTick(drawPreview)
}
</script>
