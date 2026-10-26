<template>
  <!-- The capture scene renders out of sight at 540x960 (1080x1920 pixels); it
       lives outside the dialog so it keeps going while the dialog is hidden -->
  <Teleport to="body">
    <div v-if="open" ref="sceneBox" class="pointer-events-none fixed -left-[10000px] top-0 h-[960px] w-[540px]" aria-hidden="true" />
  </Teleport>

  <UModal :open="open && phase !== 'recording'" :title="t('room.tour.title')" :ui="{ content: 'sm:max-w-2xl' }" @update:open="onDialogOpen">
    <template #body>

      <div class="grid gap-6 sm:grid-cols-[240px_minmax(0,1fr)]">
        <!-- Phone-shaped preview of the video -->
        <!-- On phones it shrinks with the screen height so the controls stay in view -->
        <div class="relative mx-auto w-[min(220px,calc((100dvh-420px)*0.5625))] min-w-[150px] sm:w-[240px]">
          <div class="relative aspect-[9/16] overflow-hidden rounded-[28px] bg-black shadow-xl ring-4 ring-black">
            <video v-if="videoUrl" :src="videoUrl" class="size-full object-cover" controls autoplay loop playsinline />
            <canvas v-else ref="frameCanvas" :width="WIDTH" :height="HEIGHT" class="size-full" />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-5">
          <template v-if="!videoUrl">
            <UInput v-model="caption" maxlength="40" size="lg" class="w-full" :placeholder="t('room.tour.caption')" :aria-label="t('room.tour.caption')" />

            <p v-if="watermark" class="flex items-start gap-2 rounded-lg bg-elevated px-3 py-2 text-xs text-muted">
              <UIcon name="i-lucide-crown" class="mt-0.5 size-3.5 shrink-0 text-amber-500" />
              <span>{{ t('room.tour.watermark') }} <NuxtLink to="/dashboard/upgrade" class="font-medium text-highlighted underline">{{ t('room.tour.removeWatermark') }}</NuxtLink></span>
            </p>
            <p v-if="!supported" class="text-sm text-red-500">{{ t('room.tour.unsupported') }}</p>

            <!-- Options as icons, then record -->
            <div class="mt-auto space-y-3">
              <div class="flex items-center gap-1.5">
                <UTooltip :text="timeOfDay === 'day' ? t('room.tour.day') : t('room.tour.night')">
                  <UButton
                    :icon="timeOfDay === 'day' ? 'i-lucide-sun' : 'i-lucide-moon'"
                    color="neutral"
                    variant="soft"
                    size="lg"
                    :aria-label="timeOfDay === 'day' ? t('room.tour.day') : t('room.tour.night')"
                   
                    @click="timeOfDay = timeOfDay === 'day' ? 'night' : 'day'"
                  />
                </UTooltip>
                <UTooltip :text="t('room.tour.length')">
                  <UButton
                    icon="i-lucide-timer"
                    :label="`${duration}s`"
                    color="neutral"
                    variant="soft"
                    size="lg"
                    class="tabular-nums"
                    :aria-label="`${t('room.tour.length')}: ${duration}s`"
                   
                    @click="cycleDuration"
                  />
                </UTooltip>
                <UTooltip v-if="track" :text="withMusic ? `${track.title} · ${track.artist}` : t('room.tour.music')">
                  <UButton
                    :icon="withMusic ? 'i-lucide-music' : 'i-lucide-volume-x'"
                    color="neutral"
                    :variant="withMusic ? 'soft' : 'ghost'"
                    size="lg"
                    :class="!withMusic && 'opacity-60'"
                    :aria-label="t('room.tour.music')"
                    :aria-pressed="withMusic"
                   
                    @click="withMusic = !withMusic"
                  />
                </UTooltip>
              </div>

              <UButton
                size="xl"
                icon="i-lucide-clapperboard"
                :disabled="!supported"
                :label="t('room.tour.record')"
                block
                @click="record"
              />
            </div>
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

  <!-- While recording: the dialog steps aside, the editor hides its controls
       (see RoomStudio), and the frame being recorded shows with a status bar -->
  <Teleport to="body">
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0" leave-active-class="transition duration-200 ease-in" leave-to-class="opacity-0">
      <div v-if="phase === 'recording'" class="glass-backdrop fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 p-4">
        <div class="glass-sheet flex w-full max-w-sm items-center gap-3 rounded-full py-2 pl-4 pr-2 text-[#1c1a17] dark:text-white">
          <span class="relative flex size-3 shrink-0">
            <span v-if="!preparing" class="absolute inset-0 animate-ping rounded-full bg-red-500/70" />
            <span class="relative size-3 rounded-full" :class="preparing ? 'bg-black/25' : 'bg-red-500'" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold">{{ preparing ? t('room.tour.preparing') : t('room.tour.recordingNow') }}</p>
            <div class="mt-1 h-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
              <div class="h-full rounded-full bg-red-500" :style="{ width: `${Math.round(progress * 100)}%` }" />
            </div>
          </div>
          <span class="shrink-0 text-sm font-semibold tabular-nums text-black/60 dark:text-white/70">{{ clock(progress * duration) }} / {{ clock(duration) }}</span>
          <UButton color="neutral" variant="soft" size="sm" :label="t('room.tour.cancel')" @click="cancelRecording" />
        </div>

        <!-- The frame being recorded -->
        <div class="relative aspect-[9/16] h-[min(78dvh,760px)] max-w-full overflow-hidden rounded-[28px] bg-black shadow-2xl ring-1 ring-white/10">
          <div ref="liveBox" class="size-full [&>canvas]:size-full" />
          <div v-if="preparing" class="absolute inset-0 flex items-center justify-center bg-black/40">
            <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-white" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
/** true while recording, so the editor can hide its controls and pause its own scene */
const emit = defineEmits<{ recording: [active: boolean] }>()

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
// setup: choosing options; recording: dialog hidden, recording; done: the video
const phase = ref<'setup' | 'recording' | 'done'>('setup')
const preparing = ref(false)
const progress = ref(0)
const liveBox = ref<HTMLElement | null>(null)
const videoBlob = ref<Blob | null>(null)
const videoUrl = ref('')

const track = computed(() => (props.room.music?.trackId ? MUSIC_BY_ID[props.room.music.trackId] : undefined))
// Free plans carry a small Perlink mark
const watermark = computed(() => !billing.value?.limits.removeBranding)
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
let previewFrame = 0
/** Video frames are drawn here; shown in the recording view while recording */
let recordCanvas: HTMLCanvasElement | null = null

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

function onDialogOpen(value: boolean) {
  if (!value) open.value = false
}

function startScene() {
  if (!sceneBox.value || scene) return
  scene = new RoomScene(sceneBox.value, { editable: false, capture: true })
  scene.setRoom(props.room)
  applyTime()
  // The preview in the dialog runs at 30 fps, and not at all while recording
  let last = 0
  const loop = (now: number) => {
    previewFrame = requestAnimationFrame(loop)
    if (phase.value !== 'setup' || now - last < 1000 / FPS - 2 || !frameCanvas.value) return
    last = now
    drawFrame(frameCanvas.value, 0)
  }
  previewFrame = requestAnimationFrame(loop)
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
function drawFrame(target: HTMLCanvasElement, p: number) {
  const ctx = target.getContext('2d')
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
 * Records in real time. To keep it smooth the editor's own scene pauses and
 * the dialog's preview stops; each frame is pushed to the video right after
 * it's drawn (at 30 fps). Music is decoded up front and played by the audio
 * engine, so a busy moment on the page can't make it skip.
 */
async function record() {
  if (!scene || phase.value !== 'setup') return
  // Created inside the click, so the browser lets it play
  const audioContext = withMusic.value && track.value ? new AudioContext() : null
  cancelled = false
  progress.value = 0
  preparing.value = true
  phase.value = 'recording'
  emit('recording', true)

  recordCanvas ??= Object.assign(document.createElement('canvas'), { width: WIDTH, height: HEIGHT })
  await nextTick()
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
  emit('recording', false)
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

function copyPostText() {
  navigator.clipboard.writeText(postText.value)
  toast.add({ title: t('room.tour.copied') })
}

function reset() {
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
  videoUrl.value = ''
  videoBlob.value = null
  progress.value = 0
  phase.value = 'setup'
}
watch(open, (isOpen) => {
  if (!isOpen) reset()
})
</script>
