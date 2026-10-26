<template>
  <UDashboardPanel id="superadmin-payments">
    <template #header>
      <UDashboardNavbar title="Payments">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <USelect v-model="filter" :items="filterOptions" class="w-40" />
          <UButton variant="ghost" color="neutral" icon="i-lucide-refresh-cw" :loading="pending" @click="refresh()" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-5xl space-y-3">
        <p v-if="!pending && !payments.length" class="py-16 text-center text-sm text-muted">
          {{ filter === 'submitted' ? 'Nothing waiting for review.' : 'No payments yet.' }}
        </p>

        <UCard v-for="p in payments" :key="p.id" :ui="superadminCardUi">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="min-w-0 flex-1 space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <UBadge :color="STATUS_COLOR[p.status] ?? 'neutral'" variant="soft" :label="STATUS_LABEL[p.status] ?? p.status" />
                <UBadge color="neutral" variant="subtle" :icon="p.method === 'crypto' ? 'i-lucide-bitcoin' : 'i-lucide-landmark'" :label="p.method === 'crypto' ? 'Crypto' : 'Bank'" />
                <span class="font-medium">{{ p.plan.toUpperCase() }} · {{ p.period === 'annual' ? '1 year' : '1 month' }}</span>
                <span class="font-semibold tabular-nums">
                  {{ p.method === 'crypto' ? `$${(p.amountUsd ?? 0).toFixed(2)} ${p.token ?? ''}` : formatVnd(p.amount) }}
                </span>
              </div>
              <p class="text-sm">{{ p.email ?? '—' }}</p>

              <template v-if="p.method === 'crypto'">
                <p class="text-xs text-muted">{{ p.network ?? '—' }}</p>
                <p v-if="p.txHash" class="flex items-center gap-1.5 font-mono text-xs">
                  <span class="truncate">{{ p.txHash }}</span>
                  <a v-if="p.check?.explorer" :href="p.check.explorer" target="_blank" rel="noopener" class="shrink-0 text-primary hover:underline">Explorer ↗</a>
                </p>
                <p v-if="p.checkText" class="text-sm">{{ p.checkText }}</p>
              </template>
              <p v-else class="text-xs text-muted">Transfer message: <span class="font-mono text-default">PERLINK {{ p.code }}</span></p>

              <p class="text-xs text-muted">
                Created {{ formatDate(p.createdAt) }}
                <template v-if="p.submittedAt"> · Done pressed {{ formatDate(p.submittedAt) }}</template>
                <template v-if="p.reviewedAt"> · Reviewed {{ formatDate(p.reviewedAt) }}</template>
              </p>
            </div>

            <div class="flex shrink-0 flex-wrap gap-2">
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
                <UButton size="sm" color="neutral" variant="outline" label="Reject" :loading="busy === `${p.id}:reject`" @click="act(p.id, 'reject')" />
                <UButton size="sm" color="success" icon="i-lucide-check" label="Approve" :loading="busy === `${p.id}:approve`" @click="act(p.id, 'approve')" />
              </template>
              <UButton v-else-if="p.status === 'rejected'" size="sm" color="success" variant="outline" icon="i-lucide-check" label="Approve anyway" :loading="busy === `${p.id}:approve`" @click="act(p.id, 'approve')" />
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { superadminCardUi } from '~/utils/superadmin'
import { formatVnd } from '#shared/plans'

// Payments people marked as done, waiting for a decision. Approving puts the
// plan on their account (same as the Telegram button).
definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
  colorMode: 'dark',
})
useSeoMeta({ title: 'Payments — Superadmin', robots: 'noindex' })

interface Payment {
  id: string
  email: string | null
  plan: string
  period: string
  method: 'bank' | 'crypto'
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

const STATUS_LABEL: Record<string, string> = { submitted: 'Waiting for review', pending: 'Not paid yet', paid: 'Approved', rejected: 'Rejected', expired: 'Expired' }
const STATUS_COLOR: Record<string, 'warning' | 'neutral' | 'success' | 'error'> = { submitted: 'warning', pending: 'neutral', paid: 'success', rejected: 'error', expired: 'neutral' }

const toast = useToast()
const filter = ref<'submitted' | 'all'>('submitted')
const filterOptions = [
  { label: 'Waiting for review', value: 'submitted' },
  { label: 'All', value: 'all' },
]

const { data, pending, refresh } = await useFetch<{ payments: Payment[] }>('/api/superadmin/payments', { query: { status: filter } })
const payments = computed(() => data.value?.payments ?? [])

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

const formatDate = (value: string) => new Date(`${value.replace(' ', 'T')}Z`).toLocaleString()
</script>
