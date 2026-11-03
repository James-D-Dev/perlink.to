<template>
  <div>
    <div v-if="loading" class="space-y-2">
      <USkeleton class="h-9 w-full" />
    </div>

    <!-- Not set up on the platform yet -->
    <p v-else-if="!enabled && !domain" class="rounded-lg bg-elevated/60 px-3 py-2 text-sm text-muted">
      {{ t('dashboard.domain.unavailable') }}
    </p>

    <!-- Connect a domain -->
    <form v-else-if="!domain" class="flex flex-col gap-2 sm:flex-row" @submit.prevent="connect">
      <UInput v-model="hostname" placeholder="www.myshop.com" icon="i-lucide-globe" autocomplete="off" class="min-w-0 flex-1" />
      <UButton type="submit" :loading="busy" :disabled="!hostname.trim()" :label="t('dashboard.domain.connect')" />
    </form>

    <!-- Connected: status and DNS records -->
    <div v-else class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <span class="font-medium text-highlighted">{{ domain.hostname }}</span>
        <span
          class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
          :class="{
            'bg-emerald-50 text-emerald-700': domain.status === 'active',
            'bg-amber-50 text-amber-700': domain.status === 'pending',
            'bg-red-50 text-red-700': domain.status === 'error',
          }"
        >
          <span class="size-1.5 rounded-full" :class="{ 'bg-emerald-500': domain.status === 'active', 'bg-amber-500': domain.status === 'pending', 'bg-red-500': domain.status === 'error' }" />
          {{ t(`dashboard.domain.status.${domain.status}`) }}
        </span>
        <div class="flex-1" />
        <UButton v-if="domain.status === 'active'" :to="`https://${domain.hostname}`" target="_blank" size="xs" color="neutral" variant="outline" icon="i-lucide-external-link" :label="t('dashboard.domain.open')" />
      </div>

      <template v-if="domain.status !== 'active'">
        <!-- Where the DNS is managed, with a button straight to its settings -->
        <div class="flex flex-col gap-2 rounded-lg bg-elevated/60 p-3 sm:flex-row sm:items-center">
          <p class="min-w-0 flex-1 text-sm text-muted">
            <template v-if="dns?.providers.length">{{ t('dashboard.domain.detected', { provider: provider.name }) }}</template>
            <template v-else>{{ t('dashboard.domain.pickProvider') }}</template>
          </p>
          <USelect v-model="providerId" :items="providerItems" size="sm" class="w-full sm:w-48" />
          <UButton
            v-if="providerUrl"
            :to="providerUrl"
            target="_blank"
            size="sm"
            icon="i-lucide-external-link"
            trailing
            :label="t('dashboard.domain.openProvider', { provider: provider.name })"
          />
        </div>

        <p class="text-sm text-muted">{{ t('dashboard.domain.instructions') }}</p>
        <div class="overflow-x-auto rounded-lg border border-default dark:border-white/10">
          <table class="w-full text-left text-xs">
            <thead class="bg-elevated/60 text-muted">
              <tr>
                <th class="px-3 py-2 font-medium">{{ t('dashboard.domain.type') }}</th>
                <th class="px-3 py-2 font-medium">{{ t('dashboard.domain.name') }}</th>
                <th class="px-3 py-2 font-medium">{{ t('dashboard.domain.value') }}</th>
                <th v-if="dns" class="px-3 py-2 font-medium">{{ t('dashboard.domain.found') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default dark:divide-white/10">
              <tr v-for="record in rows" :key="record.type + record.name">
                <td class="px-3 py-2 font-medium">{{ record.type }}</td>
                <td class="px-3 py-2">
                  <div class="flex items-start gap-1">
                    <span class="min-w-0 break-all font-mono">{{ record.short }}</span>
                    <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-copy" class="-my-1 shrink-0" :aria-label="t('common.copy')" @click="copy(record.short)" />
                  </div>
                  <p v-if="record.short !== record.name" class="mt-0.5 break-all text-[10px] text-dimmed">{{ record.name }}</p>
                </td>
                <td class="px-3 py-2">
                  <div class="flex items-start gap-1">
                    <span class="min-w-0 break-all font-mono">{{ record.value }}</span>
                    <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-copy" class="-my-1 shrink-0" :aria-label="t('common.copy')" @click="copy(record.value)" />
                  </div>
                </td>
                <td v-if="dns" class="px-3 py-2">
                  <UTooltip :text="t(`dashboard.domain.check_${record.check}`)">
                    <UIcon
                      :name="record.check === 'ok' ? 'i-lucide-circle-check' : record.check === 'missing' ? 'i-lucide-circle-dashed' : 'i-lucide-triangle-alert'"
                      class="size-4"
                      :class="record.check === 'ok' ? 'text-emerald-500' : record.check === 'missing' ? 'text-dimmed' : 'text-amber-500'"
                    />
                  </UTooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- The mistakes we can see, spelled out -->
        <p v-if="rows.some(r => r.check === 'doubled')" class="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          {{ t('dashboard.domain.doubledHelp', { zone: dns?.zone }) }}
        </p>
        <p v-if="rows.some(r => r.check === 'other')" class="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          {{ t('dashboard.domain.otherHelp') }}
        </p>
        <p v-if="provider.tip" class="text-xs text-muted">{{ t(`dashboard.domain.tips.${provider.tip}`) }}</p>
        <p class="text-xs text-muted">{{ t('dashboard.domain.wait') }}</p>
      </template>

      <div class="flex flex-wrap gap-2">
        <UButton v-if="domain.status !== 'active'" size="sm" color="neutral" variant="outline" icon="i-lucide-refresh-cw" :loading="checking" :label="t('dashboard.domain.check')" @click="load(true)" />
        <UButton size="sm" color="neutral" variant="ghost" icon="i-lucide-unlink" :loading="busy" :label="t('dashboard.domain.remove')" @click="remove" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DNS_PROVIDERS, dnsProvider, shortRecordName, type DnsProviderId } from '#shared/dnsProviders'

interface DnsInfo {
  zone: string | null
  providers: DnsProviderId[]
  records: { type: string; name: string; value: string; short: string; check: 'ok' | 'missing' | 'doubled' | 'other' }[]
}

interface DomainInfo {
  hostname: string
  status: 'pending' | 'active' | 'error'
  records: { type: string; name: string; value: string }[]
}

const props = defineProps<{ username: string }>()

const { t } = useI18n()
const toast = useToast()
const confirm = useConfirm()

const loading = ref(true)
const checking = ref(false)
const busy = ref(false)
const enabled = ref(false)
const domain = ref<DomainInfo | null>(null)
const hostname = ref('')

const api = computed(() => `/api/admin/bio/${props.username}/domain`)

// What public DNS shows for the records, and where the domain's DNS lives
const dns = ref<DnsInfo | null>(null)
const providerId = ref<DnsProviderId>('other')
const provider = computed(() => dnsProvider(providerId.value))
const providerItems = computed(() => DNS_PROVIDERS.map(p => ({ label: p.id === 'other' ? t('dashboard.domain.otherProvider') : p.name, value: p.id })))
const providerUrl = computed(() => provider.value.url?.(dns.value?.zone ?? domain.value?.hostname ?? ''))
const rows = computed(() => (domain.value?.records ?? []).map((record) => {
  const found = dns.value?.records.find(r => r.type === record.type && r.name === record.name)
  return { ...record, short: found?.short ?? shortRecordName(record.name, dns.value?.zone ?? null), check: found?.check ?? 'missing' }
}))

async function loadDns() {
  try {
    const response = await $fetch<DnsInfo>(`${api.value}/dns`)
    // Keep a provider the owner picked by hand
    if (!dns.value && response.providers[0]) providerId.value = response.providers[0]
    dns.value = response
  } catch {
    dns.value = null
  }
}

async function load(manual = false) {
  if (manual) checking.value = true
  try {
    const response = await $fetch<{ enabled: boolean; domain: DomainInfo | null }>(api.value, { query: manual ? { recheck: 1 } : undefined })
    enabled.value = response.enabled
    domain.value = response.domain
    if (response.domain && response.domain.status !== 'active') await loadDns()
    if (manual && response.domain?.status === 'active') toast.add({ title: t('dashboard.domain.nowActive'), color: 'success' })
  } catch {
    if (manual) toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
    checking.value = false
  }
}

async function connect() {
  busy.value = true
  try {
    const response = await $fetch<{ domain: DomainInfo }>(api.value, { method: 'POST', body: { hostname: hostname.value } })
    domain.value = response.domain
    hostname.value = ''
    loadDns()
  } catch (error: any) {
    if (useUpgradePrompt().fromError(error)) return
    toast.add({ title: t('dashboard.domain.connectFailed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    busy.value = false
  }
}

async function remove() {
  const ok = await confirm({
    title: t('dashboard.domain.removeTitle'),
    description: t('dashboard.domain.removeText'),
    confirmLabel: t('dashboard.domain.remove'),
  })
  if (!ok) return
  busy.value = true
  try {
    await $fetch(api.value, { method: 'DELETE' })
    domain.value = null
    dns.value = null
  } finally {
    busy.value = false
  }
}

function copy(value: string) {
  navigator.clipboard.writeText(value)
  toast.add({ title: t('common.copied') })
}

onMounted(() => load())
</script>
