<template>
  <section class="p-5" :style="cardStyle">
    <div class="mb-3 flex items-center justify-between gap-2">
      <h2 class="text-[17px]" :style="{ fontFamily: headingStyle?.fontFamily, fontWeight: headingStyle?.fontWeight, letterSpacing: headingStyle?.letterSpacing }">{{ data.title || 'Opening hours' }}</h2>
      <span
        v-if="status"
        class="flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
        :class="status.open ? 'bg-emerald-500/20' : 'bg-current/10'"
      >
        <span class="size-1.5 rounded-full" :class="status.open ? 'bg-emerald-500' : 'bg-current opacity-60'" />
        {{ status.label }}
      </span>
    </div>
    <ul class="space-y-1.5 text-sm">
      <li
        v-for="day in orderedDays"
        :key="day.day"
        class="flex justify-between gap-4"
        :class="today === day.day ? 'font-semibold' : 'opacity-80'"
      >
        <span>{{ DAY_NAMES[day.day] }}</span>
        <span class="tabular-nums">{{ day.closed ? 'Closed' : `${day.open} – ${day.close}` }}</span>
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

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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
  if (!now.value) return null
  const minutes = now.value.getHours() * 60 + now.value.getMinutes()
  const current = props.data.days?.find(d => d.day === now.value!.getDay())
  const yesterday = props.data.days?.find(d => d.day === (now.value!.getDay() + 6) % 7)

  // Yesterday's hours may run past midnight (e.g. 18:00 – 02:00)
  if (yesterday && !yesterday.closed && toMinutes(yesterday.close) < toMinutes(yesterday.open) && minutes < toMinutes(yesterday.close)) {
    return { open: true, label: `Open until ${yesterday.close}` }
  }
  if (!current || current.closed) return { open: false, label: 'Closed today' }
  const open = toMinutes(current.open)
  const close = toMinutes(current.close)
  const overnight = close < open
  const isOpen = overnight ? minutes >= open : minutes >= open && minutes < close
  if (isOpen) return { open: true, label: `Open until ${current.close}` }
  return { open: false, label: minutes < open ? `Opens at ${current.open}` : 'Closed now' }
})
</script>
