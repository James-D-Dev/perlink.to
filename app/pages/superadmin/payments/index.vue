<template>
  <UDashboardPanel id="superadmin-payments">
    <template #header>
      <UDashboardNavbar title="Payments">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UInput
            v-model="search"
            icon="i-lucide-search"
            placeholder="Search email or ref"
            class="hidden w-56 sm:block"
          />
          <UTooltip text="Refresh">
            <UButton variant="ghost" color="neutral" icon="i-lucide-refresh-cw" aria-label="Refresh" :loading="pending" @click="refresh()" />
          </UTooltip>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-5xl space-y-5 py-2 sm:py-4">
        <!-- Money -->
        <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div v-for="tile in tiles" :key="tile.label" class="rounded-3xl bg-paper p-4 ring-1 ring-line sm:p-5">
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm text-ink-muted">{{ tile.label }}</p>
              <span class="flex size-8 items-center justify-center rounded-full" :class="tile.iconClass">
                <UIcon :name="tile.icon" class="size-4" />
              </span>
            </div>
            <p class="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-ink">{{ tile.value }}</p>
            <p class="mt-0.5 text-xs text-ink-muted">{{ tile.hint }}</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex flex-wrap items-center gap-2">
          <div class="inline-flex rounded-full bg-sand/60 p-1">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              type="button"
              class="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors"
              :class="filter === tab.value ? 'bg-default font-medium text-ink shadow-sm' : 'text-ink-muted hover:text-ink'"
              @click="filter = tab.value"
            >
              <UIcon :name="tab.icon" class="size-4" :class="filter === tab.value && tab.tint" />
              {{ tab.label }}
              <span
                class="min-w-5 rounded-full px-1.5 text-center text-xs tabular-nums"
                :class="tab.value === 'submitted' && counts.submitted ? 'bg-warning text-white' : 'bg-accented text-ink-muted'"
              >{{ counts[tab.value] }}</span>
            </button>
          </div>
          <UInput v-model="search" icon="i-lucide-search" placeholder="Search email or ref" class="w-full sm:hidden" />
        </div>

        <!-- List -->
        <div class="overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
          <div v-if="pending && !payments.length" class="divide-y divide-line">
            <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-5">
              <USkeleton class="size-11 rounded-2xl" />
              <div class="flex-1 space-y-2">
                <USkeleton class="h-4 w-48" />
                <USkeleton class="h-3 w-64" />
              </div>
              <USkeleton class="h-5 w-16" />
            </div>
          </div>

          <div v-else-if="!shown.length" class="flex flex-col items-center gap-2 px-6 py-16 text-center">
            <span class="flex size-12 items-center justify-center rounded-full bg-sand text-ink-muted">
              <UIcon :name="search ? 'i-lucide-search-x' : filter === 'submitted' ? 'i-lucide-inbox' : 'i-lucide-receipt'" class="size-6" />
            </span>
            <p class="font-medium text-ink">{{ search ? 'Nothing matches' : emptyText }}</p>
            <p class="text-sm text-ink-muted">
              {{ search ? `No payment with “${search}”.` : filter === 'submitted' ? 'Bank and crypto payments land here when the payer presses Done.' : 'Card sales from Creem show up here as soon as they are paid.' }}
            </p>
          </div>

          <ul v-else class="divide-y divide-line">
            <li v-for="p in shown" :key="p.id" class="p-4 sm:p-5" :class="p.status === 'submitted' && 'bg-warning/5'">
              <div class="flex gap-3 sm:gap-4">
                <!-- What was bought -->
                <span class="flex size-11 shrink-0 items-center justify-center rounded-2xl text-lg" :class="productTile(p).class">
                  <UIcon v-if="productTile(p).icon" :name="productTile(p).icon!" class="size-5" />
                  <template v-else>{{ productTile(p).emoji }}</template>
                </span>

                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                    <div class="min-w-0">
                      <p class="flex flex-wrap items-center gap-2">
                        <span class="font-semibold text-ink">{{ title(p) }}</span>
                        <span v-if="p.period" class="rounded-full px-2 py-0.5 text-[11px] font-medium" :class="periodClass(p)">{{ p.period === 'annual' ? 'Yearly' : 'Monthly' }}</span>
                        <span v-else-if="isPack(p)" class="rounded-full bg-fuchsia-500/10 px-2 py-0.5 text-[11px] font-medium text-fuchsia-500">One-time</span>
                      </p>
                      <NuxtLink
                        v-if="p.userId"
                        :to="`/superadmin/users/${p.userId}`"
                        class="mt-1 inline-flex max-w-full items-center gap-1.5 text-sm text-ink-soft hover:text-primary"
                      >
                        <UAvatar :src="p.avatar || undefined" :text="initial(p.name || p.email)" size="3xs" />
                        <span class="truncate">{{ p.name ? `${p.name} · ${p.email}` : p.email ?? 'Deleted account' }}</span>
                      </NuxtLink>
                    </div>

                    <div class="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1">
                      <p class="text-lg font-semibold tabular-nums" :class="p.status === 'refunded' || p.status === 'rejected' ? 'text-ink-muted line-through decoration-1' : 'text-ink'">
                        {{ amount(p) }}
                      </p>
                      <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1" :class="STATUS[p.status]?.class ?? STATUS.pending!.class">
                        <UIcon :name="STATUS[p.status]?.icon ?? 'i-lucide-circle'" class="size-3.5" />
                        {{ STATUS[p.status]?.label ?? p.status }}
                      </span>
                    </div>
                  </div>

                  <!-- How it was paid -->
                  <div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
                    <span class="inline-flex items-center gap-1.5" :class="METHOD[p.method]?.text">
                      <UIcon :name="METHOD[p.method]?.icon ?? 'i-lucide-landmark'" class="size-3.5" />
                      {{ METHOD[p.method]?.label ?? p.method }}<template v-if="p.network"> · {{ p.network }}</template>
                    </span>
                    <button
                      type="button"
                      class="inline-flex max-w-full items-center gap-1.5 font-mono hover:text-ink"
                      :title="`Copy ${refText(p)}`"
                      @click="copy(refText(p))"
                    >
                      <UIcon name="i-lucide-hash" class="size-3.5 shrink-0" />
                      <span class="truncate">{{ refText(p) }}</span>
                      <UIcon :name="copied === refText(p) ? 'i-lucide-check' : 'i-lucide-copy'" class="size-3 shrink-0" />
                    </button>
                    <span class="inline-flex items-center gap-1.5" :title="timeline(p)">
                      <UIcon name="i-lucide-calendar" class="size-3.5" />
                      {{ formatDate(p.paidAt || p.submittedAt || p.createdAt) }}
                    </span>
                  </div>

                  <!-- Crypto: what the chain says -->
                  <div v-if="p.method === 'crypto' && (p.txHash || p.checkText)" class="mt-3 space-y-1 rounded-2xl bg-sand/50 px-3 py-2.5 text-xs">
                    <p v-if="p.txHash" class="flex items-center gap-2 font-mono">
                      <span class="truncate">{{ p.txHash }}</span>
                      <a v-if="p.check?.explorer" :href="p.check.explorer" target="_blank" rel="noopener" class="inline-flex shrink-0 items-center gap-1 font-sans text-primary hover:underline">
                        Explorer <UIcon name="i-lucide-arrow-up-right" class="size-3" />
                      </a>
                    </p>
                    <p v-if="p.checkText" class="flex items-start gap-1.5 text-ink-soft">
                      <UIcon name="i-lucide-shield-check" class="mt-px size-3.5 shrink-0" />
                      {{ p.checkText }}
                    </p>
                  </div>

                  <!-- Decision -->
                  <div v-if="p.status === 'submitted' || p.status === 'pending' || p.status === 'rejected' || (p.method === 'crypto' && p.txHash && p.status !== 'paid')" class="mt-3 flex flex-wrap gap-2">
                    <UButton
                      v-if="p.method === 'crypto' && p.txHash && p.status !== 'paid'"
                      size="sm"
                      color="neutral"
                      variant="outline"
                      icon="i-lucide-scan-search"
                      label="Re-check"
                      :loading="busy === `${p.id}:recheck`"
                      @click="act(p.id, 'recheck')"
                    />
                    <template v-if="p.status === 'submitted' || p.status === 'pending'">
                      <UButton size="sm" color="success" icon="i-lucide-check" label="Approve" :loading="busy === `${p.id}:approve`" @click="act(p.id, 'approve')" />
                      <UButton size="sm" color="error" variant="soft" icon="i-lucide-x" label="Reject" :loading="busy === `${p.id}:reject`" @click="act(p.id, 'reject')" />
                    </template>
                    <UButton v-else-if="p.status === 'rejected'" size="sm" color="success" variant="outline" icon="i-lucide-check" label="Approve anyway" :loading="busy === `${p.id}:approve`" @click="act(p.id, 'approve')" />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { refDebounced } from '@vueuse/core'
import { formatVnd } from '#shared/plans'

// Payments: card sales from Creem, and bank / crypto payments the payer
// marked as done, waiting for a decision. Approving puts the plan on their
// account (same as the Telegram button).
definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
})
useSeoMeta({ title: 'Payments — Superadmin', robots: 'noindex' })

type Filter = 'submitted' | 'paid' | 'refunded' | 'all'

interface Payment {
  id: string
  userId: string | null
  email: string | null
  name: string | null
  avatar: string | null
  plan: string | null
  /** 'wedding', or 'pack:<id>' for a room pack */
  product?: string | null
  period: string | null
  method: string
  amount: number
  amountUsd: number | null
  code: string
  status: string
  network: string | null
  token: string | null
  txHash: string | null
  check: { verdict: string; explorer?: string } | null
  checkText: string | null
  createdAt: string
  submittedAt: string | null
  reviewedAt: string | null
  paidAt: string | null
}

interface Response {
  counts: Record<Filter, number>
  totals: { paidUsd: number; paidVnd: number; paidUsd30: number; refundedUsd: number }
  payments: Payment[]
}

const METHOD: Record<string, { label: string; icon: string; text: string }> = {
  creem: { label: 'Card · Creem', icon: 'i-lucide-credit-card', text: 'text-sky-500' },
  lemon: { label: 'Card · Lemon Squeezy', icon: 'i-lucide-credit-card', text: 'text-yellow-500' },
  bank: { label: 'Bank transfer', icon: 'i-lucide-landmark', text: 'text-emerald-500' },
  crypto: { label: 'Crypto', icon: 'i-lucide-bitcoin', text: 'text-amber-500' },
}

const STATUS: Record<string, { label: string; icon: string; class: string }> = {
  paid: { label: 'Paid', icon: 'i-lucide-circle-check', class: 'bg-success/10 text-success ring-success/25' },
  submitted: { label: 'Needs review', icon: 'i-lucide-clock', class: 'bg-warning/10 text-warning ring-warning/30' },
  pending: { label: 'Not paid yet', icon: 'i-lucide-hourglass', class: 'bg-sand text-ink-muted ring-line' },
  rejected: { label: 'Rejected', icon: 'i-lucide-circle-x', class: 'bg-error/10 text-error ring-error/25' },
  refunded: { label: 'Refunded', icon: 'i-lucide-undo-2', class: 'bg-orange-500/10 text-orange-500 ring-orange-500/25' },
  expired: { label: 'Expired', icon: 'i-lucide-timer-off', class: 'bg-sand text-ink-muted ring-line' },
}

// Plan tile colours, the same as the Dashboard's plan bar
const PLAN_TILE: Record<string, string> = {
  starter: 'bg-sky-500/15 text-sky-500',
  plus: 'bg-primary/15 text-primary',
  max: 'bg-violet-500/15 text-violet-500',
}

const route = useRoute()
const toast = useToast()
const askedTab = String(route.query.status || '')
const filter = ref<Filter>((['submitted', 'paid', 'refunded', 'all'] as const).includes(askedTab as Filter) ? askedTab as Filter : 'all')
// First character, emoji included
const initial = (text: string | null) => (Array.from(text?.trim() || '')[0] || '?').toUpperCase()
const search = ref('')
const query = refDebounced(search, 150)

const { data, pending, refresh } = await useFetch<Response>('/api/superadmin/payments', { query: { status: filter } })
const payments = computed(() => data.value?.payments ?? [])
const counts = computed(() => data.value?.counts ?? { submitted: 0, paid: 0, refunded: 0, all: 0 })
const totals = computed(() => data.value?.totals ?? { paidUsd: 0, paidVnd: 0, paidUsd30: 0, refundedUsd: 0 })

const shown = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return payments.value
  return payments.value.filter(p => [p.email, p.name, p.code, p.txHash].some(v => v?.toLowerCase().includes(q)))
})

const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`

const tiles = computed(() => [
  { label: 'Last 30 days', value: usd(totals.value.paidUsd30), hint: 'Paid, in USD', icon: 'i-lucide-trending-up', iconClass: 'bg-success/15 text-success' },
  { label: 'All time', value: usd(totals.value.paidUsd), hint: totals.value.paidVnd ? `+ ${formatVnd(totals.value.paidVnd)} by bank` : `${counts.value.paid} paid`, icon: 'i-lucide-wallet', iconClass: 'bg-primary/15 text-primary' },
  { label: 'Needs review', value: String(counts.value.submitted), hint: counts.value.submitted ? 'Bank or crypto, waiting for you' : 'Nothing waiting', icon: 'i-lucide-clock', iconClass: counts.value.submitted ? 'bg-warning/15 text-warning' : 'bg-sand text-ink-muted' },
  { label: 'Refunded', value: usd(totals.value.refundedUsd), hint: `${counts.value.refunded} ${counts.value.refunded === 1 ? 'payment' : 'payments'}`, icon: 'i-lucide-undo-2', iconClass: 'bg-orange-500/15 text-orange-500' },
])

const tabs: { value: Filter; label: string; icon: string; tint: string }[] = [
  { value: 'all', label: 'All', icon: 'i-lucide-list', tint: 'text-primary' },
  { value: 'paid', label: 'Paid', icon: 'i-lucide-circle-check', tint: 'text-success' },
  { value: 'submitted', label: 'Needs review', icon: 'i-lucide-clock', tint: 'text-warning' },
  { value: 'refunded', label: 'Refunded', icon: 'i-lucide-undo-2', tint: 'text-orange-500' },
]

const emptyText = computed(() => ({
  all: 'No payments yet',
  paid: 'No paid payments yet',
  submitted: 'Nothing waiting for review',
  refunded: 'No refunds',
}[filter.value]))

const productTile = (p: Payment): { class: string; icon?: string; emoji?: string } => {
  if (p.product === 'wedding') return { class: 'bg-pink-500/15', emoji: '💍' }
  if (isPack(p)) return { class: 'bg-fuchsia-500/15', emoji: PACK_EMOJI[packId(p)] ?? '🎁' }
  return { class: PLAN_TILE[p.plan ?? ''] ?? 'bg-sand text-ink-soft', icon: p.plan === 'max' ? 'i-lucide-crown' : p.plan === 'plus' ? 'i-lucide-sparkles' : 'i-lucide-rocket' }
}

const PACK_EMOJI: Record<string, string> = { valentine: '💝', birthday: '🎂', proposal: '💍', wedding: '💒', christmas: '🎄', halloween: '🎃', newyear: '🎆', tet: '🧧' }
const isPack = (p: Payment) => !!p.product?.startsWith('pack:')
const packId = (p: Payment) => p.product!.slice(5)
const capital = (s: string) => `${s.charAt(0).toUpperCase()}${s.slice(1)}`

const title = (p: Payment) => {
  if (p.product === 'wedding') return 'Wedding pass'
  if (isPack(p)) return `${capital(packId(p))} room pack`
  return `${capital(p.plan ?? 'Unknown')} plan`
}
const periodClass = (p: Payment) => p.period === 'annual' ? 'bg-primary/10 text-primary' : 'bg-sand text-ink-muted'

const amount = (p: Payment) => {
  if (p.method === 'crypto') return `${usd(p.amountUsd ?? 0)}${p.token ? ` ${p.token}` : ''}`
  if (p.amountUsd != null && p.method !== 'bank') return usd(p.amountUsd)
  return formatVnd(p.amount)
}

const refText = (p: Payment) => p.method === 'bank' ? `PERLINK ${p.code}` : p.code

const formatDate = (value: string) => new Date(`${value.replace(' ', 'T')}Z`).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const timeline = (p: Payment) => [
  `Created ${formatDate(p.createdAt)}`,
  p.submittedAt && `Done pressed ${formatDate(p.submittedAt)}`,
  p.reviewedAt && `Reviewed ${formatDate(p.reviewedAt)}`,
  p.paidAt && `Paid ${formatDate(p.paidAt)}`,
].filter(Boolean).join('\n')

const copied = ref<string | null>(null)
async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = text
    setTimeout(() => { if (copied.value === text) copied.value = null }, 1500)
  } catch {
    toast.add({ title: 'Could not copy', color: 'error' })
  }
}

const busy = ref<string | null>(null)
async function act(id: string, action: 'approve' | 'reject' | 'recheck') {
  busy.value = `${id}:${action}`
  try {
    await $fetch(`/api/superadmin/payments/${id}/${action}`, { method: 'POST' })
    toast.add({ title: action === 'approve' ? 'Approved, plan is on' : action === 'reject' ? 'Rejected' : 'Checked again', color: 'success' })
    await refresh()
  } catch (error: any) {
    toast.add({ title: 'Failed', description: error?.data?.statusMessage, color: 'error' })
  } finally {
    busy.value = null
  }
}
</script>
