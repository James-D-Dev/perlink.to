<template>
  <UDashboardPanel id="site-inbox">
    <template #header>
      <UDashboardNavbar :title="t('dashboard.inbox.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            :to="`/dashboard/site/${username}`"
            color="neutral"
            variant="outline"
            icon="i-lucide-pencil"
            :label="t('dashboard.inbox.editSite')"
            size="sm"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-3xl space-y-4 py-2 sm:py-4">
        <div class="flex items-end justify-between gap-3">
          <div>
            <h1 class="mk-display text-3xl text-ink">{{ t('dashboard.inbox.title') }}</h1>
            <p class="mt-1 text-sm text-ink-muted">
              perlink.to/{{ username }}<template v-if="!loading"> · {{ t('dashboard.inbox.unreadCount', { n: unread }, unread) }}</template>
            </p>
          </div>
          <div v-if="submissions.length" class="inline-flex rounded-full bg-sand p-0.5">
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
        </div>

        <!-- Get new requests on the phone -->
        <TelegramConnect compact />

        <div v-if="loading" class="divide-y divide-line overflow-hidden rounded-xl bg-paper ring-1 ring-line">
          <div v-for="i in 3" :key="i" class="space-y-2 p-4">
            <USkeleton class="h-4 w-40" />
            <USkeleton class="h-3 w-64" />
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="!submissions.length" class="flex flex-col items-center rounded-xl bg-sand px-6 py-14 text-center">
          <span class="flex size-12 items-center justify-center rounded-full bg-paper ring-1 ring-line">
            <UIcon name="i-lucide-inbox" class="size-5 text-ink-soft" />
          </span>
          <h3 class="mt-4 font-medium text-ink">{{ t('dashboard.inbox.emptyTitle') }}</h3>
          <p class="mt-1 max-w-sm text-sm text-ink-muted">{{ t('dashboard.inbox.emptyText') }}</p>
          <UButton :to="`/dashboard/site/${username}`" class="mt-5" size="sm" icon="i-lucide-plus" :label="t('dashboard.inbox.addForm')" />
        </div>

        <ul v-else class="divide-y divide-line overflow-hidden rounded-xl bg-paper ring-1 ring-line">
          <li v-if="!visible.length" class="p-6 text-center text-sm text-ink-muted">{{ t('dashboard.inbox.noUnread') }}</li>
          <li v-for="item in visible" :key="item.id" class="p-4" :class="!item.read && 'bg-sand/40'">
            <div class="flex items-start gap-3">
              <span class="mt-1.5 size-2 shrink-0 rounded-full" :class="item.read ? 'bg-transparent' : 'bg-ink'" />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-baseline justify-between gap-x-3">
                  <p class="flex items-center gap-2 font-medium text-ink">
                    {{ item.data.name }}
                    <span v-if="item.data.kind === 'order'" class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                      <UIcon name="i-lucide-shopping-bag" class="size-3" />
                      {{ t('dashboard.inbox.order', { code: item.data.code }) }}
                    </span>
                  </p>
                  <p class="text-xs text-ink-muted">{{ formatWhen(item.createdAt) }}</p>
                </div>

                <!-- Order -->
                <div v-if="item.data.kind === 'order'" class="mt-2 rounded-lg bg-sand/60 px-3 py-2.5 text-sm">
                  <div class="flex flex-wrap items-baseline justify-between gap-x-3">
                    <p class="font-medium text-ink">{{ item.data.product }} <span class="text-ink-muted">× {{ item.data.quantity }}</span></p>
                    <p v-if="item.data.total" class="font-semibold tabular-nums text-ink">{{ item.data.total }}</p>
                  </div>
                  <p class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-ink-soft">
                    <span class="inline-flex items-center gap-1">
                      <UIcon :name="item.data.payment === 'transfer' ? 'i-lucide-landmark' : 'i-lucide-truck'" class="size-3.5" />
                      {{ item.data.payment === 'transfer' ? t('dashboard.inbox.payTransfer') : t('dashboard.inbox.payCod') }}
                    </span>
                    <span v-if="item.data.address" class="inline-flex items-start gap-1"><UIcon name="i-lucide-map-pin" class="mt-0.5 size-3.5 shrink-0" />{{ item.data.address }}</span>
                  </p>
                </div>
                <!-- Booking details -->
                <p v-if="item.data.date || item.data.time || item.data.guests" class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-soft">
                  <span v-if="item.data.date" class="inline-flex items-center gap-1"><UIcon name="i-lucide-calendar" class="size-3.5" />{{ formatDate(item.data.date) }}</span>
                  <span v-if="item.data.time" class="inline-flex items-center gap-1"><UIcon name="i-lucide-clock" class="size-3.5" />{{ item.data.time }}</span>
                  <span v-if="item.data.guests" class="inline-flex items-center gap-1"><UIcon name="i-lucide-users" class="size-3.5" />{{ t('dashboard.inbox.guests', { n: Number(item.data.guests) }, Number(item.data.guests)) }}</span>
                </p>
                <p v-if="item.data.message" class="mt-2 whitespace-pre-line text-sm text-ink">{{ item.data.message }}</p>

                <div class="mt-3 flex flex-wrap items-center gap-1.5">
                  <UButton v-if="item.data.phone" :to="`tel:${item.data.phone.replace(/\s+/g, '')}`" size="xs" icon="i-lucide-phone" :label="item.data.phone" />
                  <UButton v-if="item.data.email" :to="`mailto:${item.data.email}`" size="xs" color="neutral" variant="outline" icon="i-lucide-mail" :label="item.data.email" />
                  <div class="flex-1" />
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    :icon="item.read ? 'i-lucide-mail' : 'i-lucide-mail-open'"
                    :label="item.read ? t('dashboard.inbox.markUnread') : t('dashboard.inbox.markRead')"
                    @click="setRead(item, !item.read)"
                  />
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-trash-2"
                    :aria-label="t('common.delete')"
                    @click="remove(item)"
                  />
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
  layout: 'admin',
  middleware: 'auth',
  ssr: false,
})

interface Submission {
  id: string
  blockId: string | null
  data: Record<string, string>
  read: boolean
  createdAt: string
}

const { t, locale } = useI18n()
const toast = useToast()
const confirm = useConfirm()
const route = useRoute()
const username = computed(() => String(route.params.url || ''))

useSeoMeta({ title: () => `${t('dashboard.inbox.title')} · ${username.value} — Perlink`, robots: 'noindex, nofollow' })

const loading = ref(true)
const submissions = ref<Submission[]>([])
const unread = computed(() => submissions.value.filter(s => !s.read).length)

const filter = ref<'all' | 'unread'>('all')
const filters = computed(() => [
  { value: 'all' as const, label: t('dashboard.inbox.all') },
  { value: 'unread' as const, label: t('dashboard.inbox.unread') },
])
const visible = computed(() => (filter.value === 'unread' ? submissions.value.filter(s => !s.read) : submissions.value))

const dateLocale = computed(() => (locale.value === 'vi' ? 'vi-VN' : 'en-GB'))

// Stored as UTC "YYYY-MM-DD HH:MM:SS"
function formatWhen(value: string) {
  const date = new Date(`${value.replace(' ', 'T')}Z`)
  return date.toLocaleString(dateLocale.value, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(dateLocale.value, { weekday: 'short', day: 'numeric', month: 'short' })
}

async function load() {
  try {
    const response = await $fetch<{ submissions: Submission[] }>(`/api/admin/bio/${username.value}/inbox`)
    submissions.value = response.submissions
  } catch {
    toast.add({ title: t('dashboard.inbox.loadFailed'), color: 'error' })
  } finally {
    loading.value = false
  }
}

async function setRead(item: Submission, read: boolean) {
  item.read = read
  try {
    await $fetch(`/api/admin/bio/${username.value}/inbox/${item.id}`, { method: 'PATCH', body: { read } })
  } catch {
    item.read = !read
  }
}

async function remove(item: Submission) {
  const ok = await confirm({ title: t('dashboard.inbox.deleteTitle'), description: t('dashboard.inbox.deleteText'), confirmLabel: t('common.delete') })
  if (!ok) return
  try {
    await $fetch(`/api/admin/bio/${username.value}/inbox/${item.id}`, { method: 'DELETE' })
    submissions.value = submissions.value.filter(s => s.id !== item.id)
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  }
}

onMounted(load)
</script>
