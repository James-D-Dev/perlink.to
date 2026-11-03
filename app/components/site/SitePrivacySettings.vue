<template>
  <div class="space-y-5">
    <div v-if="locked" class="flex flex-wrap items-center gap-3 rounded-lg bg-elevated/60 px-3 py-2">
      <UIcon name="i-lucide-lock" class="size-4 shrink-0 text-muted" />
      <p class="min-w-0 flex-1 text-sm text-muted">{{ t('dashboard.privacy.locked') }}</p>
      <UButton size="xs" icon="i-lucide-sparkles" :label="t('dashboard.tracking.upgrade')" @click="upgrade.open('protect', 'starter')" />
    </div>

    <!-- Password: applies right away -->
    <div>
      <div class="mb-2 flex items-center justify-between gap-3">
        <p class="text-sm font-medium text-highlighted">{{ t('dashboard.privacy.passwordLabel') }}</p>
        <UBadge v-if="hasPassword" color="success" variant="subtle" icon="i-lucide-lock" :label="t('dashboard.privacy.on')" />
      </div>
      <form class="flex flex-col gap-2 sm:flex-row" @submit.prevent="savePassword">
        <UInput
          v-model="password"
          type="password"
          autocomplete="new-password"
          :placeholder="hasPassword ? t('dashboard.privacy.newPassword') : t('dashboard.privacy.setPassword')"
          :disabled="locked && !hasPassword"
          class="min-w-0 flex-1"
        />
        <UButton type="submit" :loading="saving" :disabled="password.trim().length < 4" :label="hasPassword ? t('dashboard.privacy.change') : t('dashboard.privacy.lock')" />
        <UButton v-if="hasPassword" color="neutral" variant="ghost" :loading="removing" :label="t('dashboard.privacy.remove')" @click="removePassword" />
      </form>
      <p class="mt-1.5 text-xs text-muted">{{ t('dashboard.privacy.passwordHelp') }}</p>
    </div>

    <!-- Opening time: part of the site, so it goes live with Publish -->
    <div>
      <p class="mb-2 text-sm font-medium text-highlighted">{{ t('dashboard.privacy.opensLabel') }}</p>
      <div class="flex flex-col gap-2 sm:flex-row">
        <UInput
          :model-value="opensLocal"
          type="datetime-local"
          :disabled="locked"
          class="min-w-0 flex-1"
          @update:model-value="setOpens(String($event))"
        />
        <UButton v-if="opensAt" color="neutral" variant="ghost" :label="t('dashboard.privacy.clear')" @click="setOpens('')" />
      </div>
      <p class="mt-1.5 text-xs text-muted">
        {{ opensAt && Date.parse(opensAt) > Date.now() ? t('dashboard.privacy.opensSet', { date: opensLabel }) : t('dashboard.privacy.opensHelp') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioData, ThemeConfig } from '~/types/bio'

const props = defineProps<{ bioData: BioData; username: string }>()
const emit = defineEmits<{ updateTheme: [patch: Partial<ThemeConfig>] }>()

const { t, locale } = useI18n()
const toast = useToast()
const { info, ensure } = useBilling()
const upgrade = useUpgradePrompt()

const locked = computed(() => !!info.value && !info.value.limits.protect)
const api = computed(() => `/api/admin/bio/${props.username}/access`)

// Password
const hasPassword = ref(false)
const password = ref('')
const saving = ref(false)
const removing = ref(false)
onMounted(async () => {
  ensure()
  try {
    hasPassword.value = (await $fetch<{ hasPassword: boolean }>(api.value)).hasPassword
  } catch {
    // Not saved yet (new site): no password
  }
})

async function savePassword() {
  saving.value = true
  try {
    await $fetch(api.value, { method: 'PUT', body: { password: password.value } })
    hasPassword.value = true
    password.value = ''
    toast.add({ title: t('dashboard.privacy.saved'), color: 'success' })
  } catch (error: any) {
    if (!upgrade.fromError(error)) toast.add({ title: t('common.error'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    saving.value = false
  }
}

async function removePassword() {
  removing.value = true
  try {
    await $fetch(api.value, { method: 'PUT', body: { password: null } })
    hasPassword.value = false
    toast.add({ title: t('dashboard.privacy.removed') })
  } finally {
    removing.value = false
  }
}

// Opening time, kept as an ISO time and shown in the owner's own time zone
const opensAt = computed(() => props.bioData.themeConfig.opensAt)
const opensLocal = computed(() => {
  if (!opensAt.value) return ''
  const d = new Date(opensAt.value)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
})
const opensLabel = computed(() =>
  opensAt.value ? new Intl.DateTimeFormat(locale.value, { dateStyle: 'long', timeStyle: 'short' }).format(new Date(opensAt.value)) : '',
)
function setOpens(value: string) {
  const time = value ? new Date(value) : null
  emit('updateTheme', { opensAt: time && !Number.isNaN(time.getTime()) ? time.toISOString() : undefined })
}
</script>
