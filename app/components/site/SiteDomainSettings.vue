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
        <p class="text-sm text-muted">{{ t('dashboard.domain.instructions') }}</p>
        <div class="overflow-x-auto rounded-lg border border-default dark:border-white/10">
          <table class="w-full text-left text-xs">
            <thead class="bg-elevated/60 text-muted">
              <tr>
                <th class="px-3 py-2 font-medium">{{ t('dashboard.domain.type') }}</th>
                <th class="px-3 py-2 font-medium">{{ t('dashboard.domain.name') }}</th>
                <th class="px-3 py-2 font-medium">{{ t('dashboard.domain.value') }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-default dark:divide-white/10">
              <tr v-for="record in domain.records" :key="record.type + record.name">
                <td class="px-3 py-2 font-medium">{{ record.type }}</td>
                <td class="px-3 py-2"><button type="button" class="break-all text-left font-mono hover:underline" @click="copy(record.name)">{{ record.name }}</button></td>
                <td class="px-3 py-2"><button type="button" class="break-all text-left font-mono hover:underline" @click="copy(record.value)">{{ record.value }}</button></td>
              </tr>
            </tbody>
          </table>
        </div>
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

async function load(manual = false) {
  if (manual) checking.value = true
  try {
    const response = await $fetch<{ enabled: boolean; domain: DomainInfo | null }>(api.value)
    enabled.value = response.enabled
    domain.value = response.domain
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
