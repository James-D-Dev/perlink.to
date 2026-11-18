<template>
  <!-- First-visit walkthrough of the room editor: dims the screen, lights up
       one control at a time ([data-tour] in RoomStudio) with a card that says
       what it does. Shown once per browser; the "?" button replays it. -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="opacity-0"
    >
      <div v-if="open" class="fixed inset-0 z-[70]" role="dialog" aria-modal="true" :aria-label="t('room.coach.label')" @keydown.esc="finish('skip')">
        <!-- Dim everything; the lit-up control shows through the hole -->
        <div
          v-if="rect"
          class="pointer-events-none absolute rounded-2xl ring-2 ring-perlink-blue transition-all duration-300 ease-out"
          :style="{
            left: `${rect.left - PAD}px`,
            top: `${rect.top - PAD}px`,
            width: `${rect.width + PAD * 2}px`,
            height: `${rect.height + PAD * 2}px`,
            boxShadow: '0 0 0 9999px rgb(2 6 23 / 0.6), 0 0 24px 4px rgb(0 102 214 / 0.45)',
          }"
        />
        <div v-else class="pointer-events-none absolute inset-0 bg-slate-950/60" />

        <!-- Clicks outside the card do nothing (no accidental edits mid-tour) -->
        <div class="absolute inset-0" @click.stop />

        <div
          ref="cardRef"
          class="absolute w-[min(340px,calc(100vw-24px))] rounded-3xl bg-white p-5 text-slate-900 shadow-2xl ring-1 ring-black/5 transition-all duration-300 ease-out dark:bg-slate-900 dark:text-white dark:ring-white/10"
          :style="cardStyle"
        >
          <div class="flex items-start gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-2xl text-lg" :class="current.tile">
              <UIcon :name="current.icon" class="size-5" />
            </span>
            <div class="min-w-0">
              <p class="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{{ t('room.coach.step', { n: index + 1, total: steps.length }) }}</p>
              <h3 class="mt-0.5 font-semibold leading-snug">{{ t(`room.coach.steps.${current.key}.title`) }}</h3>
            </div>
          </div>
          <p class="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{{ t(`room.coach.steps.${current.key}.text`, { name: username || 'you' }) }}</p>

          <div class="mt-4 flex items-center gap-2">
            <div class="flex flex-1 gap-1">
              <span
                v-for="(s, i) in steps"
                :key="s.key"
                class="h-1.5 rounded-full transition-all"
                :class="i === index ? 'w-5 bg-perlink-blue' : 'w-1.5 bg-slate-300 dark:bg-slate-600'"
              />
            </div>
            <button v-if="index < steps.length - 1" type="button" class="h-9 rounded-full px-3 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" @click="finish('skip')">
              {{ t('room.coach.skip') }}
            </button>
            <button v-if="index > 0" type="button" class="flex size-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15" :aria-label="t('room.coach.back')" @click="go(index - 1)">
              <UIcon name="i-lucide-arrow-left" class="size-4" />
            </button>
            <button
              ref="nextRef"
              type="button"
              class="h-9 rounded-full bg-perlink-blue px-4 text-sm font-medium text-white hover:brightness-110"
              @click="index < steps.length - 1 ? go(index + 1) : finish('done')"
            >
              {{ index < steps.length - 1 ? t('room.coach.next') : t('room.coach.done') }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** Don't start while something else covers the editor (the video recorder) */
  paused?: boolean
  username?: string
}>()

const open = defineModel<boolean>('open', { default: false })
const { t } = useI18n()
const { track } = useAnalytics()

const SEEN_KEY = 'pl_room_tour_v1'
const PAD = 6
const GAP = 12

const steps = [
  { key: 'welcome', target: null, icon: 'i-lucide-sparkles', tile: 'bg-perlink-blue/15 text-perlink-blue' },
  { key: 'add', target: 'tray', icon: 'i-lucide-armchair', tile: 'bg-amber-500/15 text-amber-500' },
  { key: 'move', target: 'camera', icon: 'i-lucide-move-3d', tile: 'bg-violet-500/15 text-violet-500' },
  { key: 'objects', target: 'objects', icon: 'i-lucide-link', tile: 'bg-pink-500/15 text-pink-500' },
  { key: 'publish', target: 'publish', icon: 'i-lucide-globe', tile: 'bg-emerald-500/15 text-emerald-500' },
] as const

const index = ref(0)
const current = computed(() => steps[index.value]!)
const rect = ref<DOMRect | null>(null)
const cardRef = ref<HTMLElement | null>(null)
const nextRef = ref<HTMLElement | null>(null)
const cardSize = ref({ width: 340, height: 220 })

function measure() {
  const target = current.value.target
  const el = target ? document.querySelector<HTMLElement>(`[data-tour="${target}"]`) : null
  const box = el?.getBoundingClientRect()
  rect.value = box && box.width && box.height ? box : null
  if (cardRef.value) cardSize.value = { width: cardRef.value.offsetWidth, height: cardRef.value.offsetHeight }
}

// Below the control when there's room, else above, else beside it; always on screen
const cardStyle = computed(() => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const { width, height } = cardSize.value
  const r = rect.value
  if (!r) return { left: `${(vw - width) / 2}px`, top: `${Math.max(12, (vh - height) / 2)}px` }
  const clampX = (x: number) => Math.min(Math.max(12, x), vw - width - 12)
  const clampY = (y: number) => Math.min(Math.max(12, y), vh - height - 12)
  const below = r.bottom + PAD + GAP
  const above = r.top - PAD - GAP - height
  if (below + height <= vh - 12) return { left: `${clampX(r.left + r.width / 2 - width / 2)}px`, top: `${below}px` }
  if (above >= 12) return { left: `${clampX(r.left + r.width / 2 - width / 2)}px`, top: `${above}px` }
  const left = r.left - PAD - GAP - width >= 12 ? r.left - PAD - GAP - width : r.right + PAD + GAP
  return { left: `${clampX(left)}px`, top: `${clampY(r.top + r.height / 2 - height / 2)}px` }
})

function go(i: number) {
  index.value = i
  nextTick(() => {
    measure()
    nextRef.value?.focus()
  })
}

function finish(how: 'done' | 'skip') {
  open.value = false
  try { localStorage.setItem(SEEN_KEY, '1') } catch { /* private mode */ }
  track(how === 'done' ? 'room_tour_complete' : 'room_tour_skip', { step: current.value.key })
}

watch(open, (value) => {
  if (value) go(0)
})

const onResize = () => open.value && measure()
let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  window.addEventListener('resize', onResize)
  let seen = false
  try { seen = localStorage.getItem(SEEN_KEY) === '1' } catch { /* private mode */ }
  // Once the room has had a moment to appear
  if (!seen) timer = setTimeout(() => { if (!props.paused) open.value = true }, 900)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  clearTimeout(timer)
})
</script>
