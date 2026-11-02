<template>
  <!-- A date that matters: counted down to (a birthday, every year; a
       wedding, once) or counted up from ("together for"). The 'card' look
       takes the page's own cards; the others are washes of colour -->
  <div class="w-full overflow-hidden" :class="look.box" :style="boxStyle">
    <div class="px-5 py-6 text-center sm:px-6">
      <p v-if="data.label" class="mb-4 text-sm font-medium" :class="look.soft">{{ data.label }}</p>

      <!-- Counting up: one big number of days, then years, months, days -->
      <template v-if="counting === 'since'">
        <p class="text-5xl font-semibold leading-none tracking-tight tabular-nums" :style="numberStyle">{{ since.days }}</p>
        <p class="mt-2 text-sm uppercase tracking-[0.18em]" :class="look.soft">{{ t('days') }}</p>
        <p v-if="since.parts" class="mt-4 text-sm" :class="look.soft">{{ since.parts }}</p>
      </template>

      <!-- Today -->
      <div v-else-if="isToday" class="flex flex-col items-center gap-2 py-2 text-xl font-semibold">
        <UIcon name="i-lucide-party-popper" class="size-10 animate-bounce" />
        <span>{{ repeat ? t('birthdayTime') : t('countdownToday') }}</span>
      </div>

      <!-- Counting down: four tiles -->
      <div v-else class="grid grid-cols-4 gap-2">
        <div v-for="unit in units" :key="unit.key" class="flex flex-col items-center rounded-xl py-3" :class="look.tile">
          <span class="text-2xl font-semibold tabular-nums sm:text-3xl" :style="numberStyle">{{ unit.value }}</span>
          <span class="mt-0.5 text-[11px] uppercase tracking-wider" :class="look.soft">{{ t(unit.key) }}</span>
        </div>
      </div>

      <p v-if="counting === 'until' && !isToday && data.showAge && repeat && nextAge" class="mt-4 text-sm" :class="look.soft">
        {{ t('turning', { age: nextAge }) }}
      </p>
      <p class="mt-4 text-xs" :class="look.faint">{{ counting === 'since' ? t('countdownSince', { date: fullDate }) : shownDate }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { BirthdayCountdownBlock } from '~/types/bio'

const props = defineProps<{
  data: BirthdayCountdownBlock['data']
  /** The page's card look, for the 'card' style */
  cardStyle?: CSSProperties
  /** The page's filled button, whose colour the 'card' style's numbers take */
  accentStyle?: CSSProperties
}>()

const { t, lang } = useSiteI18n()

// The visitor's clock, from mount on: the server's moment (and time zone)
// differs, so counting from it would not match the page in the browser
const now = ref<Date | null>(null)
let interval: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  now.value = new Date()
  interval = setInterval(() => (now.value = new Date()), 1000)
})
onUnmounted(() => {
  if (interval) clearInterval(interval)
})

const date = computed(() => {
  const [year, month, day] = (props.data.birthDate || '').split('-').map(Number)
  return year && month && day ? new Date(year, month - 1, day) : null
})
const repeat = computed(() => props.data.repeat !== false)

// The day counted to: this year's or next year's return of the date, or the
// date itself
const target = computed(() => {
  if (!date.value || !now.value) return null
  if (!repeat.value) return date.value
  const today = now.value
  const thisYear = new Date(today.getFullYear(), date.value.getMonth(), date.value.getDate())
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return thisYear < startOfToday ? new Date(today.getFullYear() + 1, date.value.getMonth(), date.value.getDate()) : thisYear
})

const isToday = computed(() => {
  if (!target.value || !now.value) return false
  return target.value.toDateString() === now.value.toDateString()
})

// A one-off date that has gone by counts up from it
const counting = computed<'until' | 'since'>(() => {
  if (props.data.mode === 'since') return 'since'
  if (!repeat.value && target.value && now.value && target.value < now.value && !isToday.value) return 'since'
  return 'until'
})

const pad = (n: number) => String(n).padStart(2, '0')
const units = computed(() => {
  // Until mounted: dashes, the same on the server and in the browser
  if (!target.value || !now.value) return (['days', 'hours', 'minutes', 'seconds'] as const).map(key => ({ key, value: '–' }))
  const diff = Math.max(0, target.value.getTime() - now.value.getTime())
  const values = {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  }
  return (['days', 'hours', 'minutes', 'seconds'] as const).map(key => ({ key, value: key === 'days' ? String(values[key]) : pad(values[key]) }))
})

// Since the date: whole days, and years · months · days
const since = computed(() => {
  if (!date.value || !now.value) return { days: '–', parts: '' }
  const start = date.value
  const today = now.value
  const days = Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86_400_000))
  let years = today.getFullYear() - start.getFullYear()
  let months = today.getMonth() - start.getMonth()
  let rest = today.getDate() - start.getDate()
  if (rest < 0) {
    months -= 1
    rest += new Date(today.getFullYear(), today.getMonth(), 0).getDate()
  }
  if (months < 0) {
    years -= 1
    months += 12
  }
  const parts = [
    years > 0 ? `${years} ${t('unitYears')}` : '',
    months > 0 ? `${months} ${t('unitMonths')}` : '',
    rest > 0 ? `${rest} ${t('days')}` : '',
  ].filter(Boolean)
  return { days: days.toLocaleString(lang.value), parts: years > 0 || months > 0 ? parts.join(' · ') : '' }
})

const nextAge = computed(() => (date.value && target.value ? target.value.getFullYear() - date.value.getFullYear() : null))

const fullDate = computed(() => date.value?.toLocaleDateString(lang.value, { day: 'numeric', month: 'long', year: 'numeric' }) ?? '')
// A yearly date shows without its year (it's a birthday, not that day)
const shownDate = computed(() => date.value?.toLocaleDateString(lang.value, repeat.value ? { day: 'numeric', month: 'long' } : { day: 'numeric', month: 'long', year: 'numeric' }) ?? '')

// ---------- Looks ----------
const LOOKS: Record<string, { box: string; tile: string; soft: string; faint: string }> = {
  classic: { box: 'rounded-3xl bg-gradient-to-br from-pink-400 to-rose-500 text-white', tile: 'bg-white/15', soft: 'text-white/85', faint: 'text-white/70' },
  modern: { box: 'rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-500 text-white', tile: 'bg-white/15', soft: 'text-white/85', faint: 'text-white/70' },
  minimal: { box: 'rounded-3xl bg-white text-neutral-900 ring-1 ring-black/10', tile: 'bg-neutral-100', soft: 'text-neutral-600', faint: 'text-neutral-500' },
  party: { box: 'rounded-3xl bg-gradient-to-br from-fuchsia-500 via-pink-500 to-orange-400 text-white', tile: 'bg-white/15', soft: 'text-white/85', faint: 'text-white/75' },
  elegant: { box: 'rounded-3xl bg-gradient-to-br from-[#3b2a20] to-[#6b4a2f] text-[#f7e7c6] ring-1 ring-[#f7e7c6]/20', tile: 'bg-[#f7e7c6]/10', soft: 'text-[#f7e7c6]/85', faint: 'text-[#f7e7c6]/65' },
  rose: { box: 'rounded-3xl bg-gradient-to-br from-[#ffe1ea] to-[#ffc6d6] text-[#7a1f3d]', tile: 'bg-white/55', soft: 'text-[#7a1f3d]/80', faint: 'text-[#7a1f3d]/65' },
  night: { box: 'rounded-3xl bg-gradient-to-br from-[#1b1230] to-[#3a1838] text-[#ffe4ee] ring-1 ring-white/10', tile: 'bg-white/[0.07]', soft: 'text-[#ffe4ee]/80', faint: 'text-[#ffe4ee]/60' },
  card: { box: '', tile: 'bg-current/[0.06]', soft: 'opacity-75', faint: 'opacity-60' },
}
const look = computed(() => LOOKS[props.data.theme] ?? LOOKS.classic!)
const boxStyle = computed<CSSProperties | undefined>(() => (props.data.theme === 'card' ? props.cardStyle : undefined))
// The page's accent on its own cards; white or the wash's ink elsewhere
const numberStyle = computed<CSSProperties | undefined>(() => {
  if (props.data.theme !== 'card') return undefined
  const accent = props.accentStyle?.backgroundColor
  return accent ? { color: String(accent) } : undefined
})
</script>
