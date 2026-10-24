<template>
  <section class="p-5" :style="cardStyle">
    <div class="mb-3 flex items-center justify-between gap-2">
      <h2 class="text-[17px]" :style="{ fontFamily: headingStyle?.fontFamily, fontWeight: headingStyle?.fontWeight, letterSpacing: headingStyle?.letterSpacing }">{{ data.title || t('openingHours') }}</h2>
      <span
        v-if="status"
        class="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
        :class="status.open ? 'bg-emerald-500/20' : 'bg-current/10'"
      >
        <span class="size-1.5 rounded-full" :class="status.open ? 'bg-emerald-500' : 'bg-current opacity-60'" />
        {{ status.label }}
      </span>
    </div>
    <p v-if="paused && data.pause?.message" class="mb-3 rounded-lg bg-current/5 px-3 py-2 text-sm">{{ data.pause.message }}</p>
    <ul class="space-y-1.5 text-sm" :class="paused && 'opacity-50'">
      <li
        v-for="day in orderedDays"
        :key="day.day"
        class="flex justify-between gap-4"
        :class="today === day.day ? 'font-semibold' : 'opacity-80'"
      >
        <span class="capitalize">{{ weekday(day.day) }}</span>
        <span class="tabular-nums">{{ day.closed ? t('closed') : `${time(day.open)} – ${time(day.close)}` }}</span>
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
  timer = setInterval(() => (now.value = new Date()), 60_000)
})
onBeforeUnmount(() => clearInterval(timer))

const today = computed(() => now.value?.getDay() ?? -1)

const toMinutes = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

const status = computed(() => {
  if (paused.value) return { open: false, label: pauseLabel.value }
  if (!now.value) return null
  const minutes = now.value.getHours() * 60 + now.value.getMinutes()
  const current = props.data.days?.find(d => d.day === now.value!.getDay())
  const yesterday = props.data.days?.find(d => d.day === (now.value!.getDay() + 6) % 7)

  // Yesterday's hours may run past midnight (e.g. 18:00 – 02:00)
  if (yesterday && !yesterday.closed && toMinutes(yesterday.close) < toMinutes(yesterday.open) && minutes < toMinutes(yesterday.close)) {
    return { open: true, label: t('openUntil', { time: time(yesterday.close) }) }
  }
  if (!current || current.closed) return { open: false, label: t('closedToday') }
  const open = toMinutes(current.open)
  const close = toMinutes(current.close)
  const overnight = close < open
  const isOpen = overnight ? minutes >= open : minutes >= open && minutes < close
  if (isOpen) return { open: true, label: t('openUntil', { time: time(current.close) }) }
  return { open: false, label: minutes < open ? t('opensAt', { time: time(current.open) }) : t('closedNow') }
})
</script>
