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
              <p class="text-sm font-semibold">{{ stage === 'loading' ? t('room.tour.preparing') : stage === 'drawing' ? t('room.tour.drawing') : t('room.tour.recordingNow') }}</p>
              <div class="mt-1 h-1 overflow-hidden rounded-full bg-white/15">
                <div class="h-full rounded-full" :class="stage === 'recording' ? 'bg-red-500' : 'bg-white/70'" :style="{ width: `${Math.round(progress * 100)}%` }" />
              </div>
            </div>
            <span class="shrink-0 text-sm font-semibold tabular-nums text-white/70">{{ stage === 'drawing' ? `${Math.round(progress * 100)}%` : `${clock(progress * duration)} / ${clock(duration)}` }}</span>
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
            <div v-if="phase === 'setup' && !stillReady" class="absolute inset-0 flex items-center justify-center bg-black/40">
              <UIcon name="i-lucide-loader-circle" class="size-8 animate-spin text-white" />
            </div>
            <!-- While the video is made its frames come one by one, stuttering:
                 frosted over, with how far it has got -->
            <div v-if="phase === 'recording'" class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 px-8 text-center backdrop-blur-2xl">
              <UIcon name="i-lucide-loader-circle" class="size-9 animate-spin text-white/90" />
              <p v-if="stage !== 'loading'" class="text-3xl font-semibold tabular-nums">{{ Math.round(progress * 100) }}%</p>
              <p class="text-sm text-white/65">{{ t('room.tour.makingHint') }}</p>
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
              <!-- The "remove it" offer: paid plans record without it -->
              <p v-if="watermark" class="flex items-start gap-2 text-xs text-white/60">
                <UIcon name="i-lucide-crown" class="mt-0.5 size-3.5 shrink-0 text-amber-400" />
                <span>{{ t('room.tour.watermark') }} <NuxtLink to="/dashboard/upgrade" class="font-medium text-white underline">{{ t('room.tour.removeWatermark') }}</NuxtLink></span>
              </p>
              <p v-if="withMusic && track?.contentId" class="flex items-start gap-2 text-xs text-amber-300">
                <UIcon name="i-lucide-triangle-alert" class="mt-0.5 size-3.5 shrink-0" />
                <span>{{ t('room.tour.musicClaim') }}</span>
              </p>
              <!-- The link in the video must open this room: offer to put it live -->
              <div v-if="liveIssue" class="rounded-2xl bg-amber-400/15 p-3 ring-1 ring-amber-300/30">
                <p class="flex items-start gap-2 text-sm text-amber-100">
                  <UIcon name="i-lucide-eye-off" class="mt-0.5 size-4 shrink-0 text-amber-300" />
                  <span>{{ t(`room.tour.notLive.${liveIssue}`) }}</span>
                </p>
                <UButton v-if="goLive" class="mt-2.5" size="sm" color="warning" icon="i-lucide-globe" :loading="goingLive" :label="t('room.tour.goLive')" @click="putLive" />
              </div>
              <p v-else-if="wentLive" class="flex items-start gap-2 text-sm text-emerald-300">
                <UIcon name="i-lucide-circle-check" class="mt-0.5 size-4 shrink-0" />
                <span>{{ t('room.tour.wentLive') }}</span>
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
              <!-- TikTok drops text sent with a shared video: the caption is copied for pasting -->
              <div class="rounded-2xl bg-white/10 p-3 ring-1 ring-white/10">
                <p class="text-xs text-white/50">{{ t('room.tour.captionHint') }}</p>
                <p class="mt-1 whitespace-pre-line break-words text-sm text-white/90">{{ postText }}</p>
                <UButton class="mt-2" size="sm" color="neutral" variant="soft" :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'" :label="copied ? t('room.tour.captionCopied') : t('room.tour.copyCaption')" @click="copyCaption" />
              </div>
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
import { PLAN_LIMITS } from '#shared/plans'

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
  /** The site's address as visitors type it: its own domain, or perlink.to/username */
  link?: string
  /** Why the link wouldn't show this room yet (null: it would) */
  liveIssue?: 'unpublished' | 'hidden' | 'draft' | null
  /** Saves, switches the room on for visitors and publishes; false if it failed */
  goLive?: () => Promise<boolean>
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
  ground: 'i-lucide-sprout',
}
const styleItems = computed(() => TOUR_STYLES.map(style => ({
  label: t(`room.tour.styles.${style}`),
  icon: STYLE_ICONS[style],
  type: 'checkbox' as const,
  checked: tourStyle.value === style,
  onUpdateChecked: () => (tourStyle.value = style),
})))
const withMusic = ref(true)
const goingLive = ref(false)
const wentLive = ref(false)
const copied = ref(false)
// setup: choosing options; recording: dialog hidden, recording; done: the video
const phase = ref<'setup' | 'recording' | 'done'>('setup')
const preparing = ref(false)
// While recording: the scene getting ready, the frames being drawn, then recorded
const stage = ref<'loading' | 'drawing' | 'recording'>('loading')
const progress = ref(0)
const stillReady = ref(false)
const liveBox = ref<HTMLElement | null>(null)
const videoBlob = ref<Blob | null>(null)
const videoUrl = ref('')

const track = computed(() => (props.room.music?.trackId ? MUSIC_BY_ID[props.room.music.trackId] : undefined))
// Free plans carry a small Perlink mark
// Paid plans record without the "Made with Perlink" watermark
const watermark = computed(() => !PLAN_LIMITS[billing.value?.plan ?? 'free'].cleanVideo)
const link = computed(() => props.link || `perlink.to/${props.username}`)
const postText = computed(() => t('room.tour.postText', { link: link.value }))

const DURATIONS = [8, 12, 15]
function cycleDuration() {
  duration.value = DURATIONS[(DURATIONS.indexOf(duration.value) + 1) % DURATIONS.length]!
}

/** The best format this browser records: MP4 where possible (TikTok, iPhone), else WebM */
const mimeType = import.meta.client
  ? ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm'].find(type => typeof MediaRecorder !== 'undefined' && MediaRecorder.isTypeSupported(type)) ?? ''
  : ''
// Encoding frame by frame (WebCodecs) needs no MediaRecorder
const supported = !!mimeType || (import.meta.client && typeof VideoEncoder !== 'undefined')
/** The finished video's file extension */
const extension = () => (videoBlob.value?.type.includes('mp4') ? 'mp4' : 'webm')
const canShare = ref(false)

let scene: RoomScene | null = null
/** Video frames are drawn here; shown in the frame while recording */
let recordCanvas: HTMLCanvasElement | null = null
let stillImage: HTMLImageElement | null = null

watch(open, (isOpen) => {
  if (isOpen) {
    caption.value ||= props.siteName
    // A track registered with Content ID gets videos muted or claimed: off by default
    withMusic.value = !track.value?.contentId
    wentLive.value = false
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

/** Name, link, watermark and the closing card */
function drawTitles(ctx: CanvasRenderingContext2D, p: number) {
  // Top shade so the text reads on any sky
  // (TikTok, Reels and Shorts cover the top ~280 px with their tabs and
  // icons, the right edge with buttons and the bottom with the caption, so
  // everything sits below that, centred)
  const shade = ctx.createLinearGradient(0, 0, 0, 760)
  shade.addColorStop(0, 'rgba(0,0,0,0.5)')
  shade.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = shade
  ctx.fillRect(0, 0, WIDTH, 760)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 24
  ctx.font = '700 76px Inter, system-ui, sans-serif'
  ctx.fillText(fit(ctx, caption.value || props.siteName, WIDTH - 260), WIDTH / 2, 380)
  ctx.shadowBlur = 0
  pill(ctx, link.value, WIDTH / 2, 480, 40)

  if (watermark.value) madeWith(ctx, 572, 1)

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
    if (watermark.value) madeWith(ctx, HEIGHT / 2 + 160, end)
    ctx.globalAlpha = 1
  }
}

/** "Made with" and the Perlink wordmark, small and centred: the wordmark's
 *  middle (its lowercase letters') level with the words' middle */
function madeWith(ctx: CanvasRenderingContext2D, y: number, alpha: number) {
  const [before = '', after = ''] = t('room.tour.madeWith').split('Perlink').map(part => part.trim())
  const FONT = 32
  const GAP = 10
  // The wordmark's units: 1000 per em, lowercase 546 high, 3146 wide
  const scale = 0.042
  const markWidth = 3146 * scale
  ctx.globalAlpha = alpha
  ctx.font = `600 ${FONT}px Inter, system-ui, sans-serif`
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  const widthOf = (text: string) => (text ? ctx.measureText(text).width + GAP : 0)
  let x = WIDTH / 2 - (widthOf(before) + markWidth + widthOf(after)) / 2
  // Words sit on this line; their lowercase middle is ~0.27 em above it
  const baseline = y + FONT * 0.27
  ctx.shadowColor = 'rgba(0,0,0,0.45)'
  ctx.shadowBlur = 12
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  if (before) {
    ctx.fillText(before, x, baseline)
    x += widthOf(before)
  }
  ctx.save()
  ctx.translate(x, baseline - FONT * 0.27 + 273 * scale)
  ctx.scale(scale, scale)
  ctx.fillStyle = '#3d95ff'
  ctx.fill(WORDMARK.per)
  ctx.beginPath()
  ctx.arc(1872.5, -662, 75, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.fill(WORDMARK.link)
  ctx.restore()
  x += markWidth + GAP
  if (after) ctx.fillText(after, x, baseline)
  ctx.shadowBlur = 0
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
}

/** The wordmark's letters, the same drawing as AppLogo ("per" in the tint, the rest white) */
const WORDMARK = import.meta.client
  ? { per: new Path2D('M70 150L70 -534L193 -534L196 -420L183 -426Q203 -485 248.5 -515.5Q294 -546 355 -546Q431 -546 481.5 -508Q532 -470 557 -407Q582 -344 582 -267Q582 -190 556.5 -127Q531 -64 480.5 -26Q430 12 354 12Q314 12 279.5 -2Q245 -16 220.5 -42Q196 -68 186 -103L198 -113L198 150ZM324 -92Q382 -92 415.5 -138.5Q449 -185 449 -267Q449 -349 415.5 -395.5Q382 -442 324 -442Q285 -442 257 -422.5Q229 -403 213.5 -364Q198 -325 198 -267Q198 -209 213 -170Q228 -131 256.5 -111.5Q285 -92 324 -92ZM877 12Q797 12 738 -22.5Q679 -57 647 -120Q615 -183 615 -267Q615 -351 647 -413.5Q679 -476 737.5 -511Q796 -546 874 -546Q950 -546 1007.5 -512Q1065 -478 1096 -414Q1127 -350 1127 -260L1127 -231L748 -231Q752 -161 786.5 -125.5Q821 -90 878 -90Q921 -90 949.5 -109.5Q978 -129 989 -164L1120 -156Q1098 -78 1033.5 -33Q969 12 877 12ZM748 -317L995 -317Q991 -382 958 -413.5Q925 -445 874 -445Q823 -445 789.5 -412Q756 -379 748 -317ZM1192 0L1192 -534L1312 -534L1317 -386L1306 -388Q1318 -465 1351.5 -499.5Q1385 -534 1443 -534L1492 -534L1492 -424L1442 -424Q1401 -424 1374 -412Q1347 -400 1333.5 -374.5Q1320 -349 1320 -308L1320 0Z'), link: new Path2D('M1684 0Q1626 0 1591 -30Q1556 -60 1556 -126L1556 -710L1684 -710L1684 -139Q1684 -119 1694.5 -109Q1705 -99 1724 -99L1763 -99L1763 0ZM1808 0L1808 -534L1936 -534L1936 0ZM2032 0L2032 -534L2148 -534L2153 -384L2138 -390Q2146 -446 2171 -480Q2196 -514 2232 -530Q2268 -546 2311 -546Q2370 -546 2410.5 -520Q2451 -494 2472 -448.5Q2493 -403 2493 -343L2493 0L2365 0L2365 -302Q2365 -347 2356 -378Q2347 -409 2326.5 -425.5Q2306 -442 2272 -442Q2221 -442 2190.5 -406Q2160 -370 2160 -302L2160 0ZM2588 0L2588 -710L2716 -710L2716 -293L2935 -534L3093 -534L2884 -312L3100 0L2956 0L2800 -236L2716 -147L2716 0Z') }
  : { per: null as unknown as Path2D, link: null as unknown as Path2D }

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

// ---------- Encoding frame by frame (WebCodecs + mp4-muxer) ----------

/** H.264 profiles to try, best first (1080x1920 needs level 4) */
const AVC_CODECS = ['avc1.640028', 'avc1.4d0028', 'avc1.420028']

interface EncodingSetup { codec: string; audio: AudioEncoderConfig | null }

/**
 * Whether this browser can encode the video (and its music, if it has some)
 * itself; null: record it with MediaRecorder instead
 */
async function encodingSupport(music: AudioBuffer | null): Promise<EncodingSetup | null> {
  if (typeof VideoEncoder === 'undefined' || typeof VideoFrame === 'undefined') return null
  let codec = ''
  for (const candidate of AVC_CODECS) {
    try {
      const { supported } = await VideoEncoder.isConfigSupported({ codec: candidate, width: WIDTH, height: HEIGHT, bitrate: 8_000_000, framerate: FPS })
      if (supported) {
        codec = candidate
        break
      }
    } catch {}
  }
  if (!codec) return null
  if (!music) return { codec, audio: null }
  if (typeof AudioEncoder === 'undefined' || typeof AudioData === 'undefined') return null
  const audio: AudioEncoderConfig = { codec: 'mp4a.40.2', sampleRate: music.sampleRate, numberOfChannels: Math.min(2, music.numberOfChannels), bitrate: 160_000 }
  try {
    if (!(await AudioEncoder.isConfigSupported(audio)).supported) return null
  } catch {
    return null
  }
  return { codec, audio }
}

/**
 * The whole video, frame by frame: each frame is drawn at its own moment,
 * with every effect, and encoded at once with that exact timestamp; the
 * music is cut, faded and encoded straight from the decoded track. However
 * slow the device, the video is exactly 30 fps and in sync.
 */
async function encodeVideo(setup: EncodingSetup, music: AudioBuffer | null): Promise<Blob | null> {
  const { Muxer, ArrayBufferTarget } = await import('mp4-muxer')
  const total = duration.value
  const count = Math.round(total * FPS)
  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: { codec: 'avc', width: WIDTH, height: HEIGHT, frameRate: FPS },
    audio: setup.audio ? { codec: 'aac', numberOfChannels: setup.audio.numberOfChannels, sampleRate: setup.audio.sampleRate } : undefined,
    // The index at the front, so players start it at once
    fastStart: 'in-memory',
    firstTimestampBehavior: 'offset',
  })

  let failure: unknown = null
  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (error) => {
      failure = error
    },
  })
  encoder.configure({ codec: setup.codec, width: WIDTH, height: HEIGHT, bitrate: 8_000_000, framerate: FPS, avc: { format: 'avc' } })

  const live = recordCanvas!
  const ctx = live.getContext('2d')!
  const start = performance.now()
  for (let i = 0; i < count; i++) {
    if (cancelled || !scene) {
      encoder.close()
      return null
    }
    if (failure) throw failure
    const p = i / (count - 1)
    // Drawn into the frame box too, so the video shows taking shape
    ctx.drawImage(scene.renderTour(p, tourStyle.value, start + (i * 1000) / FPS), 0, 0, WIDTH, HEIGHT)
    drawTitles(ctx, p)
    const frame = new VideoFrame(live, { timestamp: Math.round((i * 1_000_000) / FPS), duration: Math.round(1_000_000 / FPS) })
    // A key frame every two seconds
    encoder.encode(frame, { keyFrame: i % (FPS * 2) === 0 })
    frame.close()
    progress.value = (i + 1) / count
    // Let the encoder keep up (and the page breathe)
    while (encoder.encodeQueueSize > 3) await new Promise(r => setTimeout(r, 5))
    if (i % 4 === 3) await new Promise(r => setTimeout(r, 0))
  }
  await encoder.flush()
  encoder.close()
  if (failure) throw failure
  stopScene()

  if (setup.audio && music) await encodeMusic(setup.audio, music, total, muxer)
  muxer.finalize()
  return new Blob([muxer.target.buffer], { type: 'video/mp4' })
}

/** The track from its first sound, looped to the video's length, at the room's volume, fading over the last second */
async function encodeMusic(config: AudioEncoderConfig, music: AudioBuffer, total: number, muxer: { addAudioChunk: (chunk: EncodedAudioChunk, meta?: EncodedAudioChunkMetadata) => void }) {
  const rate = music.sampleRate
  const channels = config.numberOfChannels
  const length = Math.round(total * rate)
  const offset = Math.round(firstSound(music) * rate)
  const loop = Math.max(1, music.length - offset)
  const volume = props.room.music?.volume ?? 0.6
  const fadeFrom = length - rate
  const sources = Array.from({ length: channels }, (_, c) => music.getChannelData(Math.min(c, music.numberOfChannels - 1)))

  let failure: unknown = null
  const encoder = new AudioEncoder({
    output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
    error: (error) => {
      failure = error
    },
  })
  encoder.configure(config)
  // A second at a time, planar float
  for (let at = 0; at < length; at += rate) {
    const frames = Math.min(rate, length - at)
    const data = new Float32Array(frames * channels)
    for (let c = 0; c < channels; c++) {
      const source = sources[c]!
      for (let i = 0; i < frames; i++) {
        const n = at + i
        const fade = n > fadeFrom ? Math.max(0, (length - n) / rate) : 1
        data[c * frames + i] = source[offset + (n % loop)]! * volume * fade
      }
    }
    const chunk = new AudioData({ format: 'f32-planar', sampleRate: rate, numberOfFrames: frames, numberOfChannels: channels, timestamp: Math.round((at / rate) * 1_000_000), data })
    encoder.encode(chunk)
    chunk.close()
  }
  await encoder.flush()
  encoder.close()
  if (failure) throw failure
}

/** A canvas's picture as a JPEG */
function jpeg(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.88))
}

/**
 * Two steps, so phones record as smoothly as computers, with every effect:
 *
 * 1. Drawing: a scene of its own (the editor's stays paused) is prepared
 *    (models, film look, shaders), then every frame is drawn at its own
 *    moment of the video (not the clock's), however long each takes, and
 *    kept as a JPEG. A slow phone only takes longer here.
 * 2. Recording: the frames are played back in real time into the recorder,
 *    with the titles and the music. Playing pictures back is light, so
 *    nothing stutters. The next few frames are decoded ahead of time.
 */
async function record() {
  if (phase.value !== 'setup') return
  // Created inside the click, so the browser lets it play
  const audioContext = withMusic.value && track.value ? new AudioContext() : null
  cancelled = false
  progress.value = 0
  preparing.value = true
  stage.value = 'loading'
  phase.value = 'recording'

  recordCanvas ??= Object.assign(document.createElement('canvas'), { width: WIDTH, height: HEIGHT })
  const shot = Object.assign(document.createElement('canvas'), { width: WIDTH, height: HEIGHT })
  await nextTick()
  startScene()
  liveBox.value?.replaceChildren(recordCanvas)

  // The scene gets ready (models, film look, shaders) while the music decodes
  const music = audioContext && track.value
    ? fetch(track.value.src).then(r => r.arrayBuffer()).then(b => audioContext.decodeAudioData(b)).catch(() => null)
    : Promise.resolve(null)
  const [, buffer] = await Promise.all([scene?.prepareTour(tourStyle.value), music])
  if (cancelled || !scene) return finish(audioContext, null)

  // Straight to an MP4 where the browser can encode it (and its music)
  const encoding = await encodingSupport(buffer)
  if (encoding) {
    stage.value = 'drawing'
    let blob: Blob | null = null
    try {
      blob = await encodeVideo(encoding, buffer)
    } catch (error) {
      console.warn('[tour] encoding failed', error)
    }
    if (blob || cancelled || !mimeType) return finish(audioContext, blob)
    // Encoding failed midway: record the other way instead (with the scene
    // set up again if it was already freed)
    progress.value = 0
    if (!scene) {
      startScene()
      // (startScene sets it again; TypeScript can't see that)
      await (scene as RoomScene | null)?.prepareTour(tourStyle.value)
      if (cancelled || !scene) return finish(audioContext, null)
    }
  }

  // Otherwise, 1. draw every frame
  const total = duration.value
  const count = Math.round(total * FPS) + 1
  const frames: Blob[] = []
  const shotCtx = shot.getContext('2d')!
  const liveCtx = recordCanvas.getContext('2d')!
  const start = performance.now()
  stage.value = 'drawing'
  for (let i = 0; i < count; i++) {
    if (cancelled || !scene) return finish(audioContext, null)
    const p = i / (count - 1)
    // Copied at once: the WebGL picture is only there until the next frame
    shotCtx.drawImage(scene.renderTour(p, tourStyle.value, start + (i * 1000) / FPS), 0, 0, WIDTH, HEIGHT)
    const blob = await jpeg(shot)
    if (!blob) return finish(audioContext, null)
    frames.push(blob)
    // The frame box shows the video taking shape
    liveCtx.drawImage(shot, 0, 0)
    drawTitles(liveCtx, p)
    progress.value = (i + 1) / count
  }
  // The scene's work is done: free the GPU before playing back
  stopScene()

  // 2. Play the frames back into the recorder, in real time
  let stream = recordCanvas.captureStream(0)
  const videoTrack = stream.getVideoTracks()[0] as (MediaStreamTrack & { requestFrame?: () => void }) | undefined
  if (!videoTrack?.requestFrame) stream = recordCanvas.captureStream(FPS)

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

  // Frames decoded a little ahead of when they're shown
  const decoded = new Map<number, Promise<ImageBitmap>>()
  const decode = (i: number) => {
    if (i >= count || decoded.has(i)) return
    decoded.set(i, createImageBitmap(frames[i]!))
  }
  for (let i = 0; i < 8; i++) decode(i)
  const first = await decoded.get(0)!

  const chunks: Blob[] = []
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000, audioBitsPerSecond: 160_000 })
  recorder.ondataavailable = event => event.data.size && chunks.push(event.data)
  const stopped = new Promise<void>(resolve => (recorder.onstop = () => resolve()))

  const show = (bitmap: ImageBitmap, i: number) => {
    liveCtx.drawImage(bitmap, 0, 0, WIDTH, HEIGHT)
    drawTitles(liveCtx, i / (count - 1))
    videoTrack?.requestFrame?.()
  }
  preparing.value = false
  stage.value = 'recording'
  progress.value = 0
  show(first, 0)
  recorder.start(1000)
  source?.start(0, musicOffset)
  const startedAt = performance.now()
  await new Promise<void>((resolve) => {
    let shown = 0
    let pending = false
    const tick = (now: number) => {
      if (cancelled) return resolve()
      const due = Math.min(Math.floor(((now - startedAt) / 1000) * FPS), count - 1)
      // The frame due now, once it's decoded (until then the last one stays)
      if (due > shown && !pending) {
        pending = true
        decoded.get(due)?.then((bitmap) => {
          pending = false
          if (cancelled) return
          show(bitmap, due)
          shown = due
          progress.value = due / (count - 1)
          // Frames passed over and this one are no longer needed
          for (const [i, p] of decoded) {
            if (i <= due) {
              p.then(b => b.close())
              decoded.delete(i)
            }
          }
        })
        for (let i = due; i < due + 8; i++) decode(i)
      }
      if (shown < count - 1) requestAnimationFrame(tick)
      else resolve()
    }
    requestAnimationFrame(tick)
  })
  first.close()
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
  return new File([videoBlob.value!], `perlink-${props.username}.${extension()}`, { type: videoBlob.value!.type })
}

function download() {
  const a = document.createElement('a')
  a.href = videoUrl.value
  a.download = `perlink-${props.username}.${extension()}`
  a.click()
}

async function copyCaption() {
  try {
    await navigator.clipboard.writeText(postText.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 4000)
  } catch {}
}

async function putLive() {
  if (!props.goLive) return
  goingLive.value = true
  try {
    wentLive.value = await props.goLive()
  } finally {
    goingLive.value = false
  }
}

async function share() {
  // Copied first (not awaited, so the share sheet still opens from the tap):
  // TikTok and Reels drop the text that comes with a shared video
  copyCaption()
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
  copied.value = false
  progress.value = 0
  phase.value = 'setup'
  nextTick(drawPreview)
}
</script>
