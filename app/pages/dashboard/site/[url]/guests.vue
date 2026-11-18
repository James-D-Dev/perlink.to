<template>
  <UDashboardPanel id="site-guests">
    <template #header>
      <DashboardNavbar :mobile-title="t('dashboard.guests.title')">
        <template #title>
          <SiteBreadcrumb :username="username" :page="t('dashboard.guests.title')" />
        </template>
        <template #right>
          <UButton
            :to="`/dashboard/site/${username}`"
            color="neutral"
            variant="outline"
            icon="i-lucide-pencil"
            :label="t('dashboard.inbox.editSite')"
            size="sm"
            :ui="{ label: 'max-lg:hidden' }"
          />
        </template>
      </DashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-5xl space-y-5 py-2 sm:py-4">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{{ t('dashboard.guests.title') }}</h1>
          <p class="mt-1 max-w-2xl text-sm text-ink-muted">{{ t('dashboard.guests.intro') }}</p>
        </div>

        <!-- How many guests, opened, not yet, replied -->
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <div v-for="stat in stats" :key="stat.label" class="rounded-2xl bg-sand px-4 py-3">
            <p class="text-2xl font-semibold tabular-nums text-ink">{{ stat.value }}</p>
            <p class="text-xs text-ink-muted">{{ stat.label }}</p>
          </div>
        </div>

        <!-- Who opened it: paid plans (the Wedding pass) -->
        <div v-if="data && !data.tracking && data.stats.guests" class="flex flex-wrap items-center gap-4 rounded-3xl bg-gradient-to-br from-rose-50 to-amber-50 p-5 ring-1 ring-rose-100">
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-rose-500 ring-1 ring-rose-100">
            <UIcon name="i-lucide-eye" class="size-5" />
          </span>
          <div class="min-w-0 flex-1">
            <p class="font-medium text-ink">{{ t('dashboard.guests.lockedTitle') }}</p>
            <p class="mt-0.5 text-sm text-ink-muted">{{ t('dashboard.guests.lockedText', { opened: data.stats.opened, total: data.stats.guests }) }}</p>
          </div>
          <UButton to="/dashboard/upgrade?pass=wedding" icon="i-lucide-gem" :label="t('dashboard.guests.lockedButton')" />
        </div>
        <TelegramConnect v-else-if="data?.tracking" compact />

        <!-- Add names, one per line -->
        <section class="rounded-3xl bg-paper p-4 ring-1 ring-line sm:p-5">
          <h2 class="font-medium text-ink">{{ t('dashboard.guests.addTitle') }}</h2>
          <p class="mt-0.5 text-sm text-ink-muted">{{ t('dashboard.guests.addHelp') }}</p>
          <UTextarea v-model="newNames" :rows="4" autoresize :maxrows="12" :placeholder="t('dashboard.guests.addPlaceholder')" class="mt-3 w-full" />
          <div class="mt-3 flex flex-wrap items-center gap-3">
            <div class="inline-flex rounded-full bg-sand p-0.5" role="radiogroup" :aria-label="t('dashboard.guests.side')">
              <button
                v-for="option in sideOptions"
                :key="String(option.value)"
                type="button"
                role="radio"
                :aria-checked="newSide === option.value"
                class="rounded-full px-3 py-1 text-sm transition-colors"
                :class="newSide === option.value ? 'bg-paper font-medium text-ink shadow-sm' : 'text-ink-muted hover:text-ink'"
                @click="newSide = option.value"
              >
                {{ option.label }}
              </button>
            </div>
            <UButton class="ml-auto" icon="i-lucide-user-plus" :loading="adding" :disabled="!newNames.trim()" :label="t('dashboard.guests.add')" @click="addGuests" />
          </div>
        </section>

        <!-- The list -->
        <section v-if="data?.guests.length" class="space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <UInput v-model="query" icon="i-lucide-search" :placeholder="t('dashboard.guests.search')" class="min-w-0 flex-1 sm:max-w-xs" />
            <div v-if="data.tracking" class="inline-flex rounded-full bg-sand p-0.5">
              <button
                v-for="option in filters"
                :key="option.value"
                type="button"
                class="rounded-full px-3 py-1 text-sm transition-colors"
                :class="filter === option.value ? 'bg-paper font-medium text-ink shadow-sm' : 'text-ink-muted hover:text-ink'"
                @click="filter = option.value"
              >
                {{ option.label }}
              </button>
            </div>
            <UButton class="sm:ml-auto" color="neutral" variant="outline" icon="i-lucide-copy" :label="t('dashboard.guests.copyAll')" @click="copyAll" />
          </div>

          <div class="divide-y divide-line overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
            <div v-for="guest in shown" :key="guest.id" class="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
              <!-- Opened or not -->
              <span
                class="size-2.5 shrink-0 rounded-full"
                :class="!data.tracking ? 'bg-line' : guest.firstOpenAt ? 'bg-emerald-500' : 'bg-amber-400'"
                aria-hidden="true"
              />
              <div class="min-w-0 flex-1">
                <p class="flex flex-wrap items-center gap-2 font-medium text-ink">
                  <span class="truncate">{{ guest.name }}</span>
                  <span v-if="guest.side" class="rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700">
                    {{ guest.side === 'groom' ? t('dashboard.guests.sideGroom') : t('dashboard.guests.sideBride') }}
                  </span>
                  <span v-if="guest.rsvp?.attending" class="rounded-full px-2 py-0.5 text-[11px] font-medium" :class="guest.rsvp.attending === 'yes' ? 'bg-emerald-50 text-emerald-700' : 'bg-sand text-ink-muted'">
                    {{ guest.rsvp.attending === 'yes' ? t('dashboard.guests.rsvpYes') : t('dashboard.guests.rsvpNo') }}<template v-if="guest.rsvp.attending === 'yes' && guest.rsvp.guests"> · {{ t('dashboard.guests.rsvpGuests', { n: guest.rsvp.guests }) }}</template>
                  </span>
                </p>
                <p class="mt-0.5 text-xs text-ink-muted">
                  <template v-if="!data.tracking">{{ linkFor(guest).replace('https://', '') }}</template>
                  <template v-else-if="guest.firstOpenAt">
                    {{ t('dashboard.guests.openedAt', { date: formatDate(guest.lastOpenAt || guest.firstOpenAt) }) }}
                    · {{ t('dashboard.guests.opens', { n: guest.opens ?? 0 }, guest.opens ?? 0) }}
                    <template v-if="guest.letterOpenedAt"> · {{ t('dashboard.guests.letterOpened') }}</template>
                    <template v-if="!guest.listed"> · {{ t('dashboard.guests.viaLink') }}</template>
                  </template>
                  <template v-else>{{ t('dashboard.guests.notOpened') }}</template>
                </p>
              </div>
              <div class="flex items-center gap-1">
                <UTooltip :text="t('dashboard.guests.copy')">
                  <UButton size="sm" color="neutral" variant="ghost" icon="i-lucide-link" :aria-label="t('dashboard.guests.copy')" @click="copyLink(guest)" />
                </UTooltip>
                <UDropdownMenu :items="menuFor(guest)" :content="{ align: 'end' }">
                  <UButton size="sm" color="neutral" variant="ghost" icon="i-lucide-ellipsis" :aria-label="t('blocks.editor.menu.more')" />
                </UDropdownMenu>
              </div>
            </div>
          </div>
        </section>

        <div v-else-if="!loading" class="flex flex-col items-center rounded-3xl bg-sand px-6 py-14 text-center">
          <span class="flex size-12 items-center justify-center rounded-full bg-paper ring-1 ring-line">
            <UIcon name="i-lucide-users-round" class="size-5 text-ink-soft" />
          </span>
          <h3 class="mt-4 font-medium text-ink">{{ t('dashboard.guests.emptyTitle') }}</h3>
          <p class="mt-1 max-w-sm text-sm text-ink-muted">{{ t('dashboard.guests.emptyText') }}</p>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { LANGUAGE_INFO, toAppLanguage } from '#shared/language'
import type { PlanId } from '#shared/plans'

definePageMeta({
  colorMode: 'light',
  layout: 'admin',
  middleware: 'auth',
  ssr: false,
})

type Side = 'groom' | 'bride'
interface Guest {
  id: string
  name: string
  side: Side | null
  listed: boolean
  opens: number | null
  firstOpenAt: string | null
  lastOpenAt: string | null
  letterOpenedAt: string | null
  rsvp: { attending: string | null; guests: string | null } | null
}
interface GuestList {
  tracking: boolean
  trackingPlan: PlanId
  stats: { guests: number; opened: number; notOpened: number; replied: number }
  guests: Guest[]
}

const { t, locale } = useI18n()
const toast = useToast()
const confirm = useConfirm()
const route = useRoute()
const username = computed(() => String(route.params.url || ''))

useSeoMeta({ title: () => `${t('dashboard.guests.title')} · ${username.value} — Perlink`, robots: 'noindex, nofollow' })

const loading = ref(true)
const data = ref<GuestList | null>(null)
async function load() {
  try {
    data.value = await $fetch<GuestList>(`/api/bio/${username.value}/guests`)
  } catch (error: any) {
    toast.add({ title: t('dashboard.guests.failed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    loading.value = false
  }
}
onMounted(load)

const stats = computed(() => {
  const s = data.value?.stats
  return [
    { label: t('dashboard.guests.statGuests'), value: s?.guests ?? 0 },
    { label: t('dashboard.guests.statOpened'), value: s?.opened ?? 0 },
    { label: t('dashboard.guests.statNotOpened'), value: s?.notOpened ?? 0 },
    { label: t('dashboard.guests.statReplied'), value: s?.replied ?? 0 },
  ]
})

// Adding: names, one per line, on one family's side or both
const newNames = ref('')
const newSide = ref<Side | null>(null)
const sideOptions = computed(() => [
  { value: null, label: t('dashboard.guests.sideNone') },
  { value: 'groom' as const, label: t('dashboard.guests.sideGroom') },
  { value: 'bride' as const, label: t('dashboard.guests.sideBride') },
])
const adding = ref(false)
async function addGuests() {
  adding.value = true
  try {
    const res = await $fetch<{ added: number }>(`/api/bio/${username.value}/guests`, { method: 'POST', body: { names: newNames.value, side: newSide.value } })
    toast.add({ title: t('dashboard.guests.added', { n: res.added }, res.added), color: 'success' })
    newNames.value = ''
    await load()
  } catch (error: any) {
    toast.add({ title: t('dashboard.guests.failed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    adding.value = false
  }
}

// Search and the opened / not opened filter
const query = ref('')
const filter = ref<'all' | 'opened' | 'not'>('all')
const filters = computed(() => [
  { value: 'all' as const, label: t('dashboard.guests.filterAll') },
  { value: 'opened' as const, label: t('dashboard.guests.filterOpened') },
  { value: 'not' as const, label: t('dashboard.guests.filterNotOpened') },
])
const fold = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase()
const shown = computed(() => {
  const q = fold(query.value.trim())
  return (data.value?.guests ?? []).filter((g) => {
    if (q && !fold(g.name).includes(q)) return false
    if (filter.value === 'opened') return !!g.firstOpenAt
    if (filter.value === 'not') return !g.firstOpenAt
    return true
  })
})

// Each guest's own link: their name on the envelope, their family's tab
function linkFor(guest: Guest) {
  const params = new URLSearchParams({ to: guest.name })
  if (guest.side) params.set('side', guest.side)
  return `https://perlink.to/${username.value}?${params.toString().replace(/\+/g, '%20')}`
}
async function copyText(text: string, title: string) {
  try {
    await navigator.clipboard.writeText(text)
    toast.add({ title, color: 'success' })
  } catch {
    toast.add({ title: text, color: 'neutral' })
  }
}
const copyLink = (guest: Guest) => copyText(linkFor(guest), t('dashboard.guests.copied'))
function copyAll() {
  const list = shown.value
  copyText(list.map(g => `${g.name}: ${linkFor(g)}`).join('\n'), t('dashboard.guests.copiedAll', { n: list.length }))
}

async function setSide(guest: Guest, side: Side | null) {
  try {
    await $fetch(`/api/bio/${username.value}/guests`, { method: 'PATCH', body: { id: guest.id, side } })
    guest.side = side
  } catch (error: any) {
    toast.add({ title: t('dashboard.guests.failed'), description: error?.data?.statusMessage, color: 'error' })
  }
}
async function remove(guest: Guest) {
  const ok = await confirm({ title: t('dashboard.guests.removeConfirm', { name: guest.name }), confirmLabel: t('dashboard.guests.remove') })
  if (!ok) return
  try {
    await $fetch(`/api/bio/${username.value}/guests`, { method: 'DELETE', body: { ids: [guest.id] } })
    await load()
  } catch (error: any) {
    toast.add({ title: t('dashboard.guests.failed'), description: error?.data?.statusMessage, color: 'error' })
  }
}
function menuFor(guest: Guest) {
  return [
    sideOptions.value.map(option => ({
      label: option.label,
      type: 'checkbox' as const,
      checked: guest.side === option.value,
      onSelect: () => setSide(guest, option.value),
    })),
    [{ label: t('dashboard.guests.remove'), icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: () => remove(guest) }],
  ]
}

const formatDate = (iso: string) => new Date(iso.includes('T') ? iso : `${iso.replace(' ', 'T')}Z`)
  .toLocaleString(toAppLanguage(locale.value) === 'en' ? 'en-GB' : LANGUAGE_INFO[toAppLanguage(locale.value)].intl, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
</script>
