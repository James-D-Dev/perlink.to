<template>
  <!-- When and where, as an invitation card: the day in a tile, the time,
       the place, and buttons to save it to a calendar and find the way -->
  <section class="px-5 py-6 sm:px-6" :style="cardStyle">
    <p v-if="data.name" class="text-center text-xs font-semibold uppercase tracking-[0.2em]" :style="accentText">{{ data.name }}</p>

    <div v-if="day" class="mt-4 flex items-center justify-center gap-4">
      <div class="flex size-[76px] shrink-0 flex-col items-center justify-center" :style="tileStyle">
        <span class="text-[11px] font-semibold uppercase tracking-wider opacity-90">{{ day.month }}</span>
        <span class="text-[32px] font-semibold leading-none tabular-nums">{{ day.date }}</span>
      </div>
      <div class="min-w-0 text-left">
        <p class="text-lg font-semibold capitalize leading-snug" :style="titleStyle">{{ day.weekday }}</p>
        <p class="text-sm opacity-75">{{ day.full }}</p>
        <p v-if="hours" class="mt-0.5 inline-flex items-center gap-1 text-sm font-medium">
          <UIcon name="i-lucide-clock" class="size-3.5 opacity-70" />{{ hours }}
        </p>
      </div>
    </div>

    <div v-if="data.venue || data.address" class="mt-5 border-t border-current/10 pt-4 text-center">
      <p v-if="data.venue" class="text-base font-semibold" :style="titleStyle">{{ data.venue }}</p>
      <p v-if="data.address" class="mt-0.5 text-sm opacity-75">{{ data.address }}</p>
    </div>
    <p v-if="data.dressCode" class="mt-3 text-center text-sm">
      <span class="opacity-70">{{ t('eventDressCode') }}:</span> <span class="font-medium">{{ data.dressCode }}</span>
    </p>
    <p v-if="data.note" class="mt-3 whitespace-pre-line text-center text-sm leading-relaxed opacity-80">{{ data.note }}</p>

    <div class="mt-5 grid gap-2" :class="mapHref && 'grid-cols-2'">
      <div class="relative">
        <button
          type="button"
          class="flex w-full items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold"
          :style="buttonStyle"
          :aria-expanded="calendarOpen"
          @click="calendarOpen = !calendarOpen"
        >
          <UIcon name="i-lucide-calendar-plus" class="size-4" />
          {{ t('eventAddToCalendar') }}
        </button>
        <div v-if="calendarOpen" class="absolute inset-x-0 top-full z-10 mt-1.5 overflow-hidden rounded-xl bg-white text-left text-sm text-[#1c1a17] shadow-lg ring-1 ring-black/10">
          <a :href="googleHref" target="_blank" rel="noopener" class="flex items-center gap-2 px-3 py-2.5 hover:bg-black/5" @click="calendarOpen = false">
            <UIcon name="i-lucide-calendar" class="size-4 opacity-60" />Google Calendar
          </a>
          <button type="button" class="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-black/5" @click="downloadIcs">
            <UIcon name="i-lucide-download" class="size-4 opacity-60" />{{ t('eventIcs') }}
          </button>
        </div>
      </div>
      <a
        v-if="mapHref"
        :href="mapHref"
        target="_blank"
        rel="noopener"
        class="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-semibold"
        :style="outlineStyle"
      >
        <UIcon name="i-lucide-navigation" class="size-4" />
        {{ t('directions') }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { EventBlock } from '~/types/bio'

const props = defineProps<{
  data: EventBlock['data']
  cardStyle?: CSSProperties
  /** The page's filled button */
  accentStyle?: CSSProperties
  headingStyle?: CSSProperties
}>()

const { t, lang, time } = useSiteI18n()
const calendarOpen = ref(false)

const date = computed(() => {
  const [year, month, day] = (props.data.date || '').split('-').map(Number)
  return year && month && day ? new Date(year, month - 1, day) : null
})
// A date with no time of day reads the same on the server and in the browser
const day = computed(() => {
  if (!date.value) return null
  const d = date.value
  return {
    month: d.toLocaleDateString(lang.value, { month: 'short' }).replace('.', ''),
    date: d.getDate(),
    weekday: d.toLocaleDateString(lang.value, { weekday: 'long' }),
    full: d.toLocaleDateString(lang.value, { day: 'numeric', month: 'long', year: 'numeric' }),
  }
})
const hours = computed(() => {
  if (!props.data.startTime) return ''
  return props.data.endTime ? `${time(props.data.startTime)} – ${time(props.data.endTime)}` : time(props.data.startTime)
})
const mapHref = computed(() => contactMapHref({ mapUrl: props.data.mapUrl, address: props.data.address || props.data.venue }))

// ---------- Calendar ----------
// Times are the guests' local time; an event without a start time takes the whole day
const compact = (value: string) => value.replace(/[-:]/g, '')
const span = computed(() => {
  const dateValue = props.data.date
  if (!props.data.startTime) {
    const next = new Date(date.value!.getTime() + 86_400_000)
    const end = `${next.getFullYear()}${String(next.getMonth() + 1).padStart(2, '0')}${String(next.getDate()).padStart(2, '0')}`
    return { start: compact(dateValue), end, allDay: true }
  }
  const start = `${compact(dateValue)}T${compact(props.data.startTime)}00`
  // Two hours when no end time is given
  const [h, m] = props.data.startTime.split(':').map(Number)
  const endTime = props.data.endTime || `${String(Math.min(23, (h ?? 0) + 2)).padStart(2, '0')}:${String(m ?? 0).padStart(2, '0')}`
  return { start, end: `${compact(dateValue)}T${compact(endTime)}00`, allDay: false }
})
const title = computed(() => props.data.name || props.data.venue || 'Event')
const where = computed(() => [props.data.venue, props.data.address].filter(Boolean).join(', '))
const details = computed(() => [props.data.dressCode && `${t('eventDressCode')}: ${props.data.dressCode}`, props.data.note].filter(Boolean).join('\n'))

const googleHref = computed(() => {
  if (!date.value) return '#'
  const params = new URLSearchParams({ action: 'TEMPLATE', text: title.value, dates: `${span.value.start}/${span.value.end}` })
  if (where.value) params.set('location', where.value)
  if (details.value) params.set('details', details.value)
  return `https://calendar.google.com/calendar/render?${params}`
})

function downloadIcs() {
  calendarOpen.value = false
  if (!date.value) return
  const escape = (value: string) => value.replace(/[\\;,]/g, m => `\\${m}`).replace(/\n/g, '\\n')
  const when = span.value.allDay
    ? [`DTSTART;VALUE=DATE:${span.value.start}`, `DTEND;VALUE=DATE:${span.value.end}`]
    : [`DTSTART:${span.value.start}`, `DTEND:${span.value.end}`]
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Perlink//Event//EN', 'BEGIN:VEVENT',
    `UID:${Date.now()}@perlink.to`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    ...when,
    `SUMMARY:${escape(title.value)}`,
    ...(where.value ? [`LOCATION:${escape(where.value)}`] : []),
    ...(details.value ? [`DESCRIPTION:${escape(details.value)}`] : []),
    `URL:${location.href}`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n')
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = 'event.ics'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ---------- Looks ----------
const accent = computed(() => String(props.accentStyle?.backgroundColor || 'currentColor'))
const accentText = computed<CSSProperties>(() => ({ color: accent.value }))
const titleStyle = computed<CSSProperties>(() => ({ fontFamily: props.headingStyle?.fontFamily }))
const radius = computed(() => `calc(${String(props.cardStyle?.borderRadius || '16px')} * 0.7)`)
const tileStyle = computed<CSSProperties>(() => ({
  backgroundColor: accent.value,
  color: String(props.accentStyle?.color || '#ffffff'),
  borderRadius: radius.value,
}))
const buttonStyle = computed<CSSProperties>(() => ({ ...props.accentStyle, borderRadius: radius.value }))
const outlineStyle = computed<CSSProperties>(() => ({ border: `1.5px solid ${accent.value}`, color: accent.value, borderRadius: radius.value }))
</script>
