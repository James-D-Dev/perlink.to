<template>
  <UDashboardPanel id="superadmin-reports">
    <template #header>
      <UDashboardNavbar title="Reports">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <USelect v-model="filter" :items="filterOptions" class="w-36" />
          <UButton variant="ghost" color="neutral" icon="i-lucide-refresh-cw" :loading="pending" @click="refresh()" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-5xl space-y-3">
        <p v-if="!pending && !reports.length" class="py-16 text-center text-sm text-muted">
          {{ filter === 'open' ? 'No open reports.' : 'No reports yet.' }}
        </p>

        <UCard v-for="report in reports" :key="report.id" :ui="superadminCardUi">
          <div class="flex flex-wrap items-start justify-between gap-4">
            <div class="min-w-0 flex-1 space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <UBadge :color="reasonColor(report.reason)" variant="soft" :label="REASON_LABELS[report.reason] ?? report.reason" />
                <a :href="`/${report.site.username}`" target="_blank" class="font-medium hover:underline">perlink.to/{{ report.site.username }}</a>
                <span v-if="report.site.reportedAs !== report.site.username" class="text-xs text-muted">(reported as {{ report.site.reportedAs }})</span>
                <UBadge v-if="report.site.removed" color="error" variant="subtle" label="Taken down" />
                <UBadge v-else-if="!report.site.published" color="neutral" variant="subtle" label="Unpublished" />
                <UBadge v-if="report.siteReports > 1" color="warning" variant="subtle" :label="`${report.siteReports} reports`" />
              </div>
              <p v-if="report.details" class="whitespace-pre-line text-sm">{{ report.details }}</p>
              <p class="text-xs text-muted">
                {{ formatDate(report.createdAt) }} · Owner {{ report.site.ownerEmail ?? '—' }}
                <template v-if="report.reporterEmail"> · From {{ report.reporterEmail }}</template>
                <template v-if="report.status !== 'open'"> · {{ report.status }}</template>
              </p>
            </div>

            <div class="flex shrink-0 gap-2">
              <template v-if="report.status === 'open'">
                <UButton size="sm" color="neutral" variant="outline" label="Dismiss" :loading="busy === `${report.id}:dismiss`" @click="act(report.id, 'dismiss')" />
                <UButton size="sm" color="error" icon="i-lucide-ban" label="Take down" :loading="busy === `${report.id}:remove`" @click="act(report.id, 'remove')" />
              </template>
              <UButton
                v-else-if="report.site.removed"
                size="sm"
                color="neutral"
                variant="outline"
                icon="i-lucide-undo-2"
                label="Restore"
                :loading="busy === `${report.id}:restore`"
                @click="act(report.id, 'restore')"
              />
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { superadminCardUi } from '~/utils/superadmin'

definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
  colorMode: 'dark',
})
useSeoMeta({ title: 'Reports — Superadmin', robots: 'noindex' })

interface Report {
  id: string
  reason: string
  details: string | null
  reporterEmail: string | null
  status: 'open' | 'dismissed' | 'removed'
  createdAt: string
  siteReports: number
  site: { id: string; username: string; reportedAs: string; title: string | null; published: boolean; removed: boolean; ownerEmail: string | null }
}

const REASON_LABELS: Record<string, string> = {
  scam: 'Scam',
  phishing: 'Phishing',
  adult: 'Adult',
  violence: 'Violence / hate',
  illegal: 'Illegal goods',
  copyright: 'Copyright',
  impersonation: 'Impersonation',
  spam: 'Spam',
  other: 'Other',
}
const reasonColor = (reason: string) => (['scam', 'phishing', 'adult', 'illegal'].includes(reason) ? 'error' : reason === 'other' ? 'neutral' : 'warning')

const toast = useToast()
const filter = ref<'open' | 'all'>('open')
const filterOptions = [
  { label: 'Open', value: 'open' },
  { label: 'All', value: 'all' },
]

const { data, pending, refresh } = await useFetch<{ reports: Report[] }>('/api/superadmin/reports', { query: { status: filter } })
const reports = computed(() => data.value?.reports ?? [])

const busy = ref<string | null>(null)
async function act(id: string, action: 'remove' | 'dismiss' | 'restore') {
  busy.value = `${id}:${action}`
  try {
    await $fetch(`/api/superadmin/reports/${id}`, { method: 'POST', body: { action } })
    toast.add({ title: action === 'remove' ? 'Site taken down' : action === 'restore' ? 'Site restored (unpublished)' : 'Report dismissed', color: 'success' })
    await refresh()
  } catch (error: any) {
    toast.add({ title: 'Failed', description: error?.data?.statusMessage, color: 'error' })
  } finally {
    busy.value = null
  }
}

const formatDate = (value: string) => new Date(`${value.replace(' ', 'T')}Z`).toLocaleString()
</script>
