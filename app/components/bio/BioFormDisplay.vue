<template>
  <section class="p-5" :style="cardStyle">
    <h2 v-if="data.title" class="text-[17px]" :style="{ fontFamily: headingStyle?.fontFamily, fontWeight: headingStyle?.fontWeight, letterSpacing: headingStyle?.letterSpacing }">
      {{ data.title }}
    </h2>
    <p v-if="data.description" class="mt-1 text-sm opacity-75">{{ data.description }}</p>

    <Transition
      mode="out-in"
      enter-active-class="motion-safe:transition motion-safe:duration-300 motion-safe:ease-out"
      enter-from-class="opacity-0 motion-safe:translate-y-2"
      leave-active-class="motion-safe:transition motion-safe:duration-150"
      leave-to-class="opacity-0"
    >
      <!-- Sent, or sent before from this device: what they asked for -->
      <div v-if="view !== 'form'" :key="view" class="mt-4 rounded-xl bg-current/[0.05] p-4" role="status">
        <div class="flex items-start gap-3">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-full" :style="iconStyle">
            <UIcon :name="summaryIcon" class="size-[18px]" />
          </span>
          <div class="min-w-0">
            <p class="text-[15px] font-semibold leading-snug">{{ summaryTitle }}</p>
          </div>
        </div>

        <dl v-if="summaryRows.length" class="mt-3 space-y-1.5 border-t border-current/10 pt-3 text-sm">
          <div v-for="row in summaryRows" :key="row.key" class="flex items-start gap-2">
            <UIcon :name="row.icon" class="mt-0.5 size-4 shrink-0 opacity-60" />
            <dt class="sr-only">{{ row.label }}</dt>
            <dd class="min-w-0">{{ row.value }}</dd>
          </div>
        </dl>

        <!-- Their calendar, so the date isn't forgotten -->
        <div v-if="calendarEntry" class="mt-4 grid grid-cols-2 gap-2">
          <a :href="googleCalendarUrl(calendarEntry)" target="_blank" rel="noopener" class="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold" :style="buttonStyle">
            <UIcon name="i-lucide-calendar-plus" class="size-4" />
            Google
          </a>
          <button type="button" class="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold" :style="outlineStyle" @click="downloadIcs(calendarEntry)">
            <UIcon name="i-lucide-download" class="size-4" />
            {{ t('eventIcs') }}
          </button>
        </div>

        <button type="button" class="mt-3 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 opacity-80 hover:underline hover:opacity-100" @click="again">
          <UIcon :name="isRsvp ? 'i-lucide-pencil' : isSubscribe ? 'i-lucide-at-sign' : 'i-lucide-plus'" class="size-3.5" />
          {{ isRsvp ? t('formChangeReply') : isSubscribe ? t('subscribeAnother') : view === 'remembered' ? t('formAnotherBooking') : t('formSendAnother') }}
        </button>
      </div>

      <!-- Newsletter: just an email, the field and the button on one line -->
      <form v-else-if="isSubscribe" key="subscribe" class="mt-4" novalidate @submit.prevent="submit">
        <input v-model="website" type="text" name="website" tabindex="-1" autocomplete="off" class="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true">
        <div class="flex flex-col gap-2 sm:flex-row">
          <label class="block min-w-0 flex-1">
            <span class="sr-only">{{ t('formEmail') }}</span>
            <input
              v-model="values.email"
              type="email"
              inputmode="email"
              required
              maxlength="120"
              autocomplete="email"
              :placeholder="t('formEmailHint')"
              :class="[inputClass, 'h-[44px]']"
              :aria-invalid="!!errors.email"
              :aria-describedby="errors.email ? `${uid}-email` : undefined"
              @input="errors.email = ''"
            >
          </label>
          <button
            type="submit"
            class="flex h-[44px] shrink-0 items-center justify-center gap-2 px-5 text-sm font-semibold transition-opacity disabled:opacity-60"
            :style="buttonStyle"
            :disabled="sending || preview"
          >
            <UIcon :name="sending ? 'i-lucide-loader-circle' : 'i-lucide-mail-plus'" class="size-4" :class="sending && 'animate-spin'" />
            {{ sending ? t('formSending') : data.submitLabel || t('subscribeButton') }}
          </button>
        </div>
        <span v-if="errors.email" :id="`${uid}-email`" :class="errorClass" role="alert">{{ errors.email }}</span>
        <p v-if="error" class="mt-2 text-sm text-red-600" role="alert">{{ error }}</p>
        <p v-if="preview" class="mt-2 text-xs opacity-60">{{ t('formPreview') }}</p>
      </form>

      <form v-else key="form" class="mt-4 space-y-3" novalidate @submit.prevent="submit">
        <!-- Honeypot: hidden from people, bots fill it in -->
        <input v-model="website" type="text" name="website" tabindex="-1" autocomplete="off" class="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true">

        <!-- Invitations: coming or not, before anything else -->
        <div v-if="isRsvp" class="grid grid-cols-2 gap-2" role="radiogroup" :aria-label="t('rsvpQuestion')">
          <button
            v-for="option in (['yes', 'no'] as const)"
            :key="option"
            type="button"
            role="radio"
            :aria-checked="values.attending === option"
            class="flex items-center justify-center gap-1.5 px-3 py-2.5 text-sm font-medium transition-all"
            :style="values.attending === option ? buttonStyle : choiceStyle"
            @click="values.attending = option"
          >
            <UIcon :name="option === 'yes' ? 'i-lucide-party-popper' : 'i-lucide-heart-crack'" class="size-4" />
            {{ option === 'yes' ? t('rsvpYes') : t('rsvpNo') }}
          </button>
        </div>

        <!-- What they'd like, from the page's own price list -->
        <label v-if="fields.service" class="block">
          <span :class="labelClass">{{ serviceLabel }}</span>
          <span v-if="serviceGroups.length" class="relative block">
            <select v-model="values.service" :class="[inputClass, selectClass]">
              <option value="">{{ t('formServicePick') }}</option>
              <optgroup v-for="group in serviceGroups" :key="group.label" :label="group.label">
                <option v-for="option in group.options" :key="option.value" :value="option.value" :disabled="option.disabled">{{ option.label }}</option>
              </optgroup>
            </select>
            <UIcon name="i-lucide-chevron-down" class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-black/45" />
          </span>
          <input v-else v-model="values.service" maxlength="120" :placeholder="t('formServiceFree')" :class="inputClass">
        </label>

        <label class="block">
          <span :class="labelClass">{{ t('formName') }} <span aria-hidden="true">*</span></span>
          <input
            v-model="values.name"
            required
            maxlength="120"
            autocomplete="name"
            :placeholder="t('formNameHint')"
            :class="inputClass"
            :aria-invalid="!!errors.name"
            :aria-describedby="errors.name ? `${uid}-name` : undefined"
            @input="errors.name = ''"
          >
          <span v-if="errors.name" :id="`${uid}-name`" :class="errorClass">{{ errors.name }}</span>
        </label>

        <div v-if="fields.phone || fields.email" class="grid gap-3" :class="fields.phone && fields.email && 'sm:grid-cols-2'">
          <label v-if="fields.phone" class="block">
            <span :class="labelClass">{{ t('formPhone') }}</span>
            <input
              v-model="values.phone"
              type="tel"
              inputmode="tel"
              maxlength="40"
              autocomplete="tel"
              placeholder="09xx xxx xxx"
              :class="inputClass"
              :aria-invalid="!!errors.phone"
              :aria-describedby="errors.phone ? `${uid}-phone` : undefined"
              @input="errors.phone = ''"
              @blur="checkPhone"
            >
            <span v-if="errors.phone" :id="`${uid}-phone`" :class="errorClass">{{ errors.phone }}</span>
          </label>
          <label v-if="fields.email" class="block">
            <span :class="labelClass">{{ t('formEmail') }}</span>
            <input v-model="values.email" type="email" maxlength="120" autocomplete="email" :placeholder="t('formEmailHint')" :class="inputClass" @input="errors.reach = ''">
          </label>
        </div>
        <p v-if="errors.reach" :class="errorClass">{{ errors.reach }}</p>

        <!-- Dates: one row each, native pickers need the width -->
        <div v-if="fields.date" class="grid gap-3" :class="fields.checkout && 'grid-cols-2'">
          <label class="block min-w-0">
            <span :class="labelClass">{{ fields.checkout ? t('formCheckIn') : t('formDate') }}</span>
            <input v-model="values.date" type="date" :min="today" :class="[inputClass, pickerClass]" :aria-invalid="!!closedNote" @change="onDate">
          </label>
          <label v-if="fields.checkout" class="block min-w-0">
            <span :class="labelClass">{{ t('formCheckOut') }}</span>
            <input
              v-model="values.checkout"
              type="date"
              :min="checkoutMin"
              :class="[inputClass, pickerClass]"
              :aria-invalid="!!errors.checkout"
              @change="errors.checkout = ''"
            >
          </label>
        </div>
        <p v-if="closedNote" class="flex items-start gap-1.5 text-sm" role="alert">
          <UIcon name="i-lucide-calendar-x" class="mt-0.5 size-4 shrink-0" />{{ closedNote }}
        </p>
        <p v-else-if="nights" class="-mt-1 inline-flex items-center gap-1.5 rounded-full bg-current/[0.07] px-2.5 py-1 text-xs font-medium">
          <UIcon name="i-lucide-moon" class="size-3.5" />{{ nightsLabel(nights) }}
        </p>
        <p v-if="errors.checkout" :class="errorClass">{{ errors.checkout }}</p>

        <div v-if="fields.time || showGuests" class="grid gap-3" :class="fields.time && showGuests && 'grid-cols-2'">
          <label v-if="fields.time" class="block min-w-0">
            <span :class="labelClass">{{ t('formTime') }}</span>
            <!-- Within the opening hours of the chosen day -->
            <span v-if="slots" class="relative block">
              <select v-model="values.time" :disabled="!slots.length" :class="[inputClass, selectClass, pickerClass]">
                <option value="">{{ t('formPickTime') }}</option>
                <option v-for="slot in slots" :key="slot" :value="slot">{{ time(slot) }}</option>
              </select>
              <UIcon name="i-lucide-chevron-down" class="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-black/45" />
            </span>
            <input v-else v-model="values.time" type="time" :class="[inputClass, pickerClass]">
          </label>
          <div v-if="showGuests" class="block min-w-0">
            <span :id="`${uid}-guests`" :class="labelClass">{{ t('formGuests') }}</span>
            <div class="flex h-[42px] items-center justify-between rounded-md border border-black/10 bg-white/90 px-1 text-[#1c1a17]" role="group" :aria-labelledby="`${uid}-guests`">
              <button type="button" class="flex size-9 items-center justify-center rounded-md transition-colors hover:bg-black/5 disabled:opacity-30" :disabled="guests <= 1" :aria-label="t('formGuestsLess')" @click="setGuests(guests - 1)">
                <UIcon name="i-lucide-minus" class="size-4" />
              </button>
              <output class="min-w-8 text-center text-[15px] font-semibold tabular-nums" aria-live="polite">{{ guests }}</output>
              <button type="button" class="flex size-9 items-center justify-center rounded-md transition-colors hover:bg-black/5 disabled:opacity-30" :disabled="guests >= 99" :aria-label="t('formGuestsMore')" @click="setGuests(guests + 1)">
                <UIcon name="i-lucide-plus" class="size-4" />
              </button>
            </div>
          </div>
        </div>

        <label v-if="fields.message" class="block">
          <span :class="labelClass">{{ t('formMessage') }}</span>
          <textarea v-model="values.message" rows="3" maxlength="2000" :placeholder="t('formMessageHint')" :class="[inputClass, 'resize-none']" @input="errors.reach = ''" />
        </label>

        <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>
        <p v-if="preview" class="text-xs opacity-60">{{ t('formPreview') }}</p>

        <button
          type="submit"
          class="flex w-full items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold transition-opacity disabled:opacity-60"
          :style="buttonStyle"
          :disabled="sending || preview || (isRsvp && !values.attending) || !!closedNote"
        >
          <UIcon v-if="sending" name="i-lucide-loader-circle" class="size-4 animate-spin" />
          {{ sending ? t('formSending') : data.submitLabel || defaultSubmit }}
        </button>
      </form>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { BioBlock, EventBlock, FormBlock, HoursBlock } from '~/types/bio'
import { formatVnd } from '#shared/plans'
import { type CalendarEntry, downloadIcs, googleCalendarUrl, nightsBetween } from '~/utils/formCalendar'

const props = defineProps<{
  data: FormBlock['data']
  blockId: string
  username: string
  /** Editor previews and template thumbnails never send */
  preview?: boolean
  cardStyle: Record<string, string | undefined>
  buttonStyle: Record<string, string | undefined>
  headingStyle?: Record<string, string | undefined>
  /** The page's blocks: its price list, products, opening hours and event */
  blocks?: BioBlock[]
  /** The page's name, for calendar entries */
  siteTitle?: string
}>()

const { t, lang, time } = useSiteI18n()
const uid = useId()

const fields = computed(() => props.data.fields ?? FORM_PRESETS.booking)
const isRsvp = computed(() => props.data.kind === 'rsvp')
const isSubscribe = computed(() => props.data.kind === 'subscribe')
const isStay = computed(() => props.data.kind === 'stay' || !!fields.value.checkout)

interface FormValues { name: string; phone: string; email: string; date: string; checkout: string; time: string; guests: string; message: string; attending: string; service: string }
const values = reactive<FormValues>({ name: '', phone: '', email: '', date: '', checkout: '', time: '', guests: '', message: '', attending: '', service: '' })
const errors = reactive<Record<string, string>>({})
const website = ref('')
const sending = ref(false)
const error = ref('')
const view = ref<'form' | 'sent' | 'remembered'>('form')
const pageBlocks = computed(() => (props.blocks ?? []).filter(b => !b.hidden))

// ---------- Service: the page's own price list and products ----------
const serviceLabel = computed(() => props.data.serviceLabel?.trim() || (isStay.value ? t('formRoom') : t('formService')))
const serviceGroups = computed(() => {
  const groups: { label: string; options: { value: string; label: string; disabled?: boolean }[] }[] = []
  for (const block of pageBlocks.value) {
    if (block.name === 'menu') {
      const menu = block.data
      for (const section of menu.sections ?? []) {
        const options = (section.items ?? []).filter(i => i.name?.trim()).map(item => ({
          value: item.name.trim(),
          label: item.price ? `${item.name.trim()} · ${menuPrice(item.price, menu.currency, section.priceSuffix?.trim() ? section.priceSuffix : menu.priceSuffix)}` : item.name.trim(),
          disabled: !!item.soldOut,
        }))
        if (options.length) groups.push({ label: section.name || menu.title || serviceLabel.value, options })
      }
    } else if (block.name === 'products') {
      const options = (block.data.items ?? []).filter(i => i.name?.trim()).map(item => ({
        value: item.name.trim(),
        label: item.price ? `${item.name.trim()} · ${formatVnd(item.price)}` : item.name.trim(),
        disabled: !!item.soldOut,
      }))
      if (options.length) groups.push({ label: block.data.title || serviceLabel.value, options })
    }
  }
  return groups
})

// Like the price list shows it: "250.000 ₫", "$12", "/night"
const menuPrice = (price: string, currency?: string, suffix = '') => formatListPrice(price, currency, suffix)

// ---------- Dates and opening hours ----------
// The visitor's clock, once mounted: the server's date can differ around midnight
const today = ref<string>()
const now = ref<Date | null>(null)
onMounted(() => {
  now.value = new Date()
  today.value = isoDate(now.value)
})
const isoDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
function parseDate(value: string) {
  const [y, m, d] = value.split('-').map(Number)
  return y && m && d ? new Date(y, m - 1, d) : null
}

const checkoutMin = computed(() => {
  const d = parseDate(values.date || today.value || '')
  if (!d) return today.value
  d.setDate(d.getDate() + 1)
  return isoDate(d)
})
const nights = computed(() => (values.date && values.checkout ? nightsBetween(values.date, values.checkout) : 0))
const nightsLabel = (n: number) => (n === 1 ? t('formNight') : t('formNights', { n }))

const hours = computed(() => pageBlocks.value.find((b): b is HoursBlock => b.name === 'hours' && !!b.data?.days?.length)?.data)
const toMinutes = (value: string) => {
  const [h, m] = value.split(':').map(Number)
  return (h ?? 0) * 60 + (m ?? 0)
}
const hhmm = (minutes: number) => `${String(Math.floor(minutes / 60) % 24).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

// The chosen day's opening hours; null when the page has none or no date is picked
const openingDay = computed(() => {
  if (!hours.value || !values.date) return null
  const date = parseDate(values.date)
  if (!date) return null
  const pause = hours.value.pause
  const paused = !!pause?.enabled && (!pause.until || values.date <= pause.until)
  const day = hours.value.days.find(d => d.day === date.getDay())
  return { closed: paused || !day || day.closed, open: day?.open ?? '', close: day?.close ?? '' }
})
const closedNote = computed(() => (fields.value.date && openingDay.value?.closed ? t('formClosedDay') : ''))

// Times to pick: every 30 minutes (15 on short days), the last one half an
// hour before closing; past times are gone when the day is today
const slots = computed<string[] | null>(() => {
  if (!hours.value || !fields.value.date) return null
  const day = openingDay.value
  if (!day) return []
  if (day.closed || !day.open || !day.close) return []
  const open = toMinutes(day.open)
  let close = toMinutes(day.close)
  if (close <= open) close += 24 * 60
  const step = close - open <= 240 ? 15 : 30
  const earliest = values.date === today.value && now.value ? now.value.getHours() * 60 + now.value.getMinutes() + 30 : -1
  const list: string[] = []
  for (let m = open; m <= close - 30; m += step) if (m >= earliest) list.push(hhmm(m))
  return list
})

function onDate() {
  if (values.checkout && values.date && values.checkout <= values.date) values.checkout = ''
  if (values.time && slots.value && !slots.value.includes(values.time)) values.time = ''
}

// ---------- Guests ----------
const showGuests = computed(() => fields.value.guests && !(isRsvp.value && values.attending === 'no'))
const guests = computed(() => Number(values.guests) || (isRsvp.value ? 1 : 2))
function setGuests(n: number) {
  values.guests = String(Math.min(99, Math.max(1, n)))
}

// ---------- Checks ----------
const phoneOk = (value: string) => {
  const digits = value.replace(/\D/g, '')
  return /^[+()\d\s.-]+$/.test(value) && digits.length >= 8 && digits.length <= 15
}
function checkPhone() {
  errors.phone = values.phone.trim() && !phoneOk(values.phone.trim()) ? t('formPhoneInvalid') : ''
}
const emailOk = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)
function validate() {
  if (isSubscribe.value) {
    errors.email = emailOk(values.email.trim()) ? '' : t('subscribeEmailInvalid')
    return !errors.email
  }
  errors.name = values.name.trim() ? '' : t('formNameRequired')
  checkPhone()
  errors.reach = !isRsvp.value && (fields.value.phone || fields.value.email) && !values.phone.trim() && !values.email.trim() && !values.message.trim()
    ? t('formReachYou')
    : ''
  errors.checkout = fields.value.checkout && values.date && values.checkout && values.checkout <= values.date ? t('formCheckoutAfter') : ''
  return !errors.name && !errors.phone && !errors.reach && !errors.checkout && !closedNote.value
}

// ---------- Send ----------
const storageKey = computed(() => `perlink:form:${props.username}:${props.blockId}`)
const sentValues = ref<Partial<FormValues>>({})

async function submit() {
  if (props.preview || sending.value) return
  if (!validate()) return
  sending.value = true
  error.value = ''
  const payload: FormValues = isSubscribe.value
    ? { name: '', phone: '', email: values.email.trim(), date: '', checkout: '', time: '', guests: '', message: '', attending: '', service: '' }
    : {
        ...values,
        guests: showGuests.value ? String(guests.value) : '',
        checkout: fields.value.checkout ? values.checkout : '',
      }
  try {
    await $fetch(`/api/bio/${props.username}/form`, {
      method: 'POST',
      body: { blockId: props.blockId, values: payload, website: website.value },
    })
    sentValues.value = payload
    view.value = 'sent'
    try {
      localStorage.setItem(storageKey.value, JSON.stringify({ values: payload, at: Date.now() }))
    } catch {}
  } catch {
    error.value = t('formError')
  } finally {
    sending.value = false
  }
}

// A visitor who already replied from this device sees their reply
onMounted(() => {
  if (props.preview) return
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey.value) || 'null')
    if (saved?.values && typeof saved.values === 'object') {
      sentValues.value = saved.values
      view.value = 'remembered'
    }
  } catch {}
})

function again() {
  if (isSubscribe.value) {
    values.email = ''
  } else if (isRsvp.value) {
    // Change the reply: start from what they said
    for (const key of ['name', 'phone', 'email', 'guests', 'message', 'attending'] as const) values[key] = sentValues.value[key] ?? values[key] ?? ''
  } else {
    // Another booking: keep who they are, clear what they booked
    for (const key of ['service', 'date', 'checkout', 'time', 'message'] as const) values[key] = ''
    for (const key of ['name', 'phone', 'email'] as const) values[key] = sentValues.value[key] || values[key] || ''
  }
  view.value = 'form'
}

// ---------- The summary ----------
const fmtDate = (value: string) => parseDate(value)?.toLocaleDateString(lang.value, { weekday: 'short', day: 'numeric', month: 'short' }) ?? value
const peopleLabel = (n: number) => (n === 1 ? t('formPerson') : t('formPeople', { n }))

const summaryIcon = computed(() => (isSubscribe.value ? 'i-lucide-mail-check' : isRsvp.value ? (sentValues.value.attending === 'no' ? 'i-lucide-heart' : 'i-lucide-party-popper') : 'i-lucide-check'))
const summaryTitle = computed(() => {
  const v = sentValues.value
  if (isSubscribe.value) return view.value === 'remembered' ? t('subscribeRemembered') : props.data.successMessage || t('subscribeDone')
  if (view.value === 'remembered') {
    if (isRsvp.value) return `${t('formLastReply')}: ${v.attending === 'no' ? t('formNotComing') : t('formComing')}${v.attending !== 'no' && v.guests ? ` · ${peopleLabel(Number(v.guests))}` : ''}`
    return t('formLastRequest')
  }
  if (isRsvp.value) return v.attending === 'no' ? t('rsvpSorry') : props.data.successMessage || t('rsvpThanks')
  return props.data.successMessage || t('formSent')
})

const summaryRows = computed(() => {
  const v = sentValues.value
  const rows: { key: string; icon: string; label: string; value: string }[] = []
  if (isSubscribe.value) {
    if (v.email) rows.push({ key: 'email', icon: 'i-lucide-mail', label: t('formEmail'), value: v.email })
    return rows
  }
  if (v.service) rows.push({ key: 'service', icon: isStay.value ? 'i-lucide-bed-double' : 'i-lucide-sparkles', label: serviceLabel.value, value: v.service })
  if (v.date && v.checkout) {
    const n = nightsBetween(v.date, v.checkout)
    rows.push({ key: 'stay', icon: 'i-lucide-calendar-range', label: t('formCheckIn'), value: `${fmtDate(v.date)} → ${fmtDate(v.checkout)} · ${nightsLabel(n)}` })
  } else if (v.date) {
    rows.push({ key: 'date', icon: 'i-lucide-calendar', label: t('formDate'), value: v.time ? `${fmtDate(v.date)} · ${time(v.time)}` : fmtDate(v.date) })
  } else if (v.time) {
    rows.push({ key: 'time', icon: 'i-lucide-clock', label: t('formTime'), value: time(v.time) })
  }
  if (v.guests && !(isRsvp.value && v.attending === 'no') && !(view.value === 'remembered' && isRsvp.value)) {
    rows.push({ key: 'guests', icon: 'i-lucide-users', label: t('formGuests'), value: peopleLabel(Number(v.guests)) })
  }
  if (isRsvp.value && view.value === 'sent') {
    rows.unshift({ key: 'attending', icon: v.attending === 'no' ? 'i-lucide-heart-crack' : 'i-lucide-check', label: t('rsvpQuestion'), value: v.attending === 'no' ? t('formNotComing') : t('formComing') })
  }
  return rows
})

// Bookings, stays and "yes, coming" go in their calendar
const pageEvent = computed(() => pageBlocks.value.find((b): b is EventBlock => b.name === 'event' && !!b.data?.date)?.data)
const calendarEntry = computed<CalendarEntry | null>(() => {
  const v = sentValues.value
  const site = props.siteTitle || props.username
  if (isSubscribe.value) return null
  if (isRsvp.value) {
    if (v.attending !== 'yes' || !pageEvent.value) return null
    const e = pageEvent.value
    return { title: e.name ? `${e.name} · ${site}` : site, date: e.date, time: e.startTime, endTime: e.endTime, location: [e.venue, e.address].filter(Boolean).join(', ') }
  }
  if (!v.date) return null
  const address = pageBlocks.value.find(b => b.name === 'contact')?.data as { address?: string } | undefined
  if (v.checkout) return { title: `${t('formStayTitle')} · ${site}`, date: v.date, endDate: v.checkout, location: address?.address, details: v.service }
  return { title: `${v.service || t('formBookingTitle')} · ${site}`, date: v.date, time: v.time || undefined, location: address?.address }
})

// ---------- Looks ----------
const defaultSubmit = computed(() => (props.data.kind === 'booking' || props.data.kind === 'stay' ? t('formBook') : isRsvp.value ? t('rsvpSend') : t('formSend')))
// The choice not picked: the page's button colour, outlined
const choiceStyle = computed(() => ({
  borderRadius: props.buttonStyle.borderRadius,
  border: `1.5px solid ${props.buttonStyle.backgroundColor ?? 'currentColor'}`,
  color: 'inherit',
}))
const outlineStyle = computed<CSSProperties>(() => ({ borderRadius: props.buttonStyle.borderRadius, border: '1.5px solid currentColor' }))
const iconStyle = computed<CSSProperties>(() => ({ backgroundColor: props.buttonStyle.backgroundColor, color: props.buttonStyle.color }))

// Neutral fields that sit on any card colour
const inputClass = 'block w-full min-w-0 rounded-md border border-black/10 bg-white/90 px-3 py-2 text-[15px] text-[#1c1a17] outline-none transition-shadow placeholder:text-black/35 focus:border-black/30 focus:ring-2 focus:ring-black/5 aria-[invalid=true]:border-red-500/70 aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-red-500/10'
const selectClass = 'appearance-none pr-9 disabled:opacity-60'
// iOS draws date and time fields centred and taller; keep them like the others
const pickerClass = 'h-[42px] appearance-none text-left [&::-webkit-date-and-time-value]:text-left'
const labelClass = 'mb-1 block text-xs font-medium opacity-75'
const errorClass = 'mt-1 block text-xs font-medium text-red-600'
</script>
