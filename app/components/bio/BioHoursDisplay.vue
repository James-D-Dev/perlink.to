<template>
  <section class="p-5" :style="cardStyle">
    <div class="mb-3 flex items-center justify-between gap-2">
      <h2 class="text-[17px]" :style="{ fontFamily: headingStyle?.fontFamily, fontWeight: headingStyle?.fontWeight, letterSpacing: headingStyle?.letterSpacing }">{{ data.title || t('openingHours') }}</h2>
      <!-- Open now with a live dot; "Closes in 20 min" turns amber -->
      <Transition enter-from-class="opacity-0 scale-95" enter-active-class="transition duration-300">
        <span
          v-if="status"
          class="flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
          :class="status.tone === 'open' ? 'bg-emerald-500/15' : status.tone === 'soon' ? 'bg-amber-500/20' : 'bg-current/10'"
          role="status"
        >
          <span class="relative flex size-2">
            <span v-if="status.tone !== 'closed'" class="absolute inline-flex size-full animate-ping rounded-full opacity-60" :class="status.tone === 'soon' ? 'bg-amber-500' : 'bg-emerald-500'" />
            <span class="relative inline-flex size-2 rounded-full" :class="status.tone === 'open' ? 'bg-emerald-500' : status.tone === 'soon' ? 'bg-amber-500' : 'bg-current opacity-50'" />
          </span>
          {{ status.label }}
        </span>
      </Transition>
    </div>
    <p v-if="paused && data.pause?.message" class="mb-3 rounded-lg bg-current/5 px-3 py-2 text-sm">{{ data.pause.message }}</p>
    <ul class="-mx-2 space-y-0.5 text-sm" :class="paused && 'opacity-50'">
      <li
        v-for="day in orderedDays"
        :key="day.day"
        class="flex items-center justify-between gap-4 rounded-lg px-2 py-1.5 transition-colors"
        :class="today === day.day ? 'bg-current/[0.07] font-semibold' : 'opacity-80'"
        :aria-current="today === day.day ? 'date' : undefined"
      >
        <span class="flex items-center gap-2 capitalize">
          {{ weekday(day.day) }}
          <span v-if="today === day.day" class="rounded-full bg-current/10 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide">{{ t('hoursToday') }}</span>
        </span>
        <span class="tabular-nums" :class="day.closed && 'opacity-60'">{{ day.closed ? t('closed') : `${time(day.open)} – ${time(day.close)}` }}</span>
      </li>
    </ul>
    <p v-if="data.note" class="mt-3 text-xs opacity-70">{{ data.note }}</p>
  </section>
</template>

<script setup lang="ts">
import type { HoursBlock } from '~/types/bio'

const props = defineProps<{
  data: HoursBlock['data']
  cardStyle: Record<string, string | undefined>
  headingStyle?: Record<string, string | undefined>
}>()

const { t, weekday, time, lang } = useSiteI18n()

// Temporarily closed until the reopening date (works on the server too)
const todayIso = new Date().toISOString().slice(0, 10)
const paused = computed(() => {
  const pause = props.data.pause
  return !!pause?.enabled && (!pause.until || todayIso < pause.until)
})
const pauseLabel = computed(() => {
  const until = props.data.pause?.until
  if (!until) return t('temporarilyClosed')
  const date = new Date(`${until}T00:00:00`).toLocaleDateString(lang.value, { day: 'numeric', month: 'short' })
  return t('closedUntil', { date })
})

// Monday first
const orderedDays = computed(() =>
  [...(props.data.days || [])].sort((a, b) => ((a.day + 6) % 7) - ((b.day + 6) % 7)),
)

// "Open now" depends on the visitor's clock, so it is computed after mount
const now = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  now.value = new Date()
  timer = setInterval(() => (now.value = new Date()), 30_000)
})
onBeforeUnmount(() => clearInterval(timer))

const today = computed(() => now.value?.getDay() ?? -1)

const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

// Within this long of closing, "Closes in 20 min" replaces "Open until"
const SOON = 60

type Status = { tone: 'open' | 'soon' | 'closed'; label: string }

function openStatus(minutesLeft: number, close: string): Status {
  if (minutesLeft <= SOON) return { tone: 'soon', label: t('hoursClosesIn', { n: Math.max(1, minutesLeft) }) }
  return { tone: 'open', label: t('openUntil', { time: time(close) }) }
}

// The next time the doors open, from today onwards
function nextOpening(minutes: number, day: number): Status {
  const days = props.data.days ?? []
  for (let ahead = 0; ahead < 7; ahead++) {
    const d = days.find(x => x.day === (day + ahead) % 7)
    if (!d || d.closed) continue
    if (ahead === 0 && minutes >= toMinutes(d.open)) continue
    const at = time(d.open)
    if (ahead === 0) return { tone: 'closed', label: t('hoursOpensToday', { time: at }) }
    if (ahead === 1) return { tone: 'closed', label: t('hoursOpensTomorrow', { time: at }) }
    return { tone: 'closed', label: t('hoursOpensOn', { day: weekday(d.day), time: at }) }
  }
  return { tone: 'closed', label: t('closedNow') }
}

const status = computed<Status | null>(() => {
  if (paused.value) return { tone: 'closed', label: pauseLabel.value }
  if (!now.value) return null
  const day = now.value.getDay()
  const minutes = now.value.getHours() * 60 + now.value.getMinutes()
  const current = props.data.days?.find(d => d.day === day)
  const yesterday = props.data.days?.find(d => d.day === (day + 6) % 7)

  // Yesterday's hours may run past midnight (e.g. 18:00 – 02:00)
  if (yesterday && !yesterday.closed && toMinutes(yesterday.close) < toMinutes(yesterday.open) && minutes < toMinutes(yesterday.close)) {
    return openStatus(toMinutes(yesterday.close) - minutes, yesterday.close)
  }
  if (current && !current.closed) {
    const open = toMinutes(current.open)
    const close = toMinutes(current.close)
    const overnight = close <= open
    if (overnight ? minutes >= open : minutes >= open && minutes < close) {
      return openStatus(overnight ? close + 24 * 60 - minutes : close - minutes, current.close)
    }
  }
  return nextOpening(minutes, day)
})
</script>
