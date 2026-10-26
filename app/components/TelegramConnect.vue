<template>
  <div
    v-if="status?.enabled && !(compact && status.connected)"
    :class="compact ? 'flex flex-wrap items-center gap-3 rounded-xl bg-sky-50 px-4 py-3 ring-1 ring-sky-100' : 'rounded-3xl bg-paper ring-1 ring-line p-5'"
  >
    <h2 v-if="!compact" class="mb-4 text-sm font-medium text-ink">{{ t('dashboard.telegram.section') }}</h2>
    <div class="flex min-w-0 flex-1 items-start gap-3">
      <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#229ED9] text-white">
        <UIcon name="i-simple-icons-telegram" class="size-5" />
      </span>
      <div class="min-w-0">
        <p class="flex flex-wrap items-center gap-2 text-sm font-medium text-ink">
          {{ t('dashboard.telegram.title') }}
          <UBadge v-if="status.connected" color="success" variant="soft" size="sm" icon="i-lucide-check" :label="t('dashboard.telegram.connected')" />
        </p>
        <p class="mt-0.5 text-xs leading-relaxed text-ink-muted">
          {{ status.connected ? t('dashboard.telegram.connectedText') : waiting ? t('dashboard.telegram.waiting') : t('dashboard.telegram.text') }}
        </p>
      </div>
    </div>

    <div class="flex shrink-0 flex-wrap gap-2" :class="!compact && 'mt-4'">
      <template v-if="status.connected">
        <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-send" :loading="testing" :label="t('dashboard.telegram.test')" @click="sendTest" />
        <UButton size="sm" color="neutral" variant="ghost" :label="t('dashboard.telegram.disconnect')" @click="disconnect" />
      </template>
      <UButton v-else size="sm" icon="i-simple-icons-telegram" :loading="linking" :label="waiting ? t('dashboard.telegram.reopen') : t('dashboard.telegram.connect')" @click="connect" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Link the account to the Perlink Telegram bot, so new orders and form
// requests arrive as Telegram messages
defineProps<{
  /** One-line hint (inbox); hidden once connected */
  compact?: boolean
}>()

const { t } = useI18n()
const toast = useToast()

interface Status { enabled: boolean; connected: boolean; botUsername?: string }
const status = ref<Status | null>(null)
const linking = ref(false)
const testing = ref(false)
const waiting = ref(false)

async function load() {
  try {
    status.value = await $fetch<Status>('/api/account/telegram')
  } catch {
    status.value = null
  }
}
onMounted(load)

// After opening Telegram, check every few seconds until the bot links the chat
let timer: ReturnType<typeof setInterval> | null = null
function stopWaiting() {
  if (timer) clearInterval(timer)
  timer = null
  waiting.value = false
}
onBeforeUnmount(stopWaiting)

async function connect() {
  linking.value = true
  try {
    const { url } = await $fetch<{ url: string }>('/api/account/telegram', { method: 'POST' })
    window.open(url, '_blank', 'noopener')
    stopWaiting()
    waiting.value = true
    const startedAt = Date.now()
    timer = setInterval(async () => {
      await load()
      if (status.value?.connected) {
        stopWaiting()
        toast.add({ title: t('dashboard.telegram.done'), color: 'success' })
      } else if (Date.now() - startedAt > 10 * 60_000) {
        stopWaiting()
      }
    }, 3000)
  } catch (error: any) {
    toast.add({ title: t('dashboard.telegram.failed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    linking.value = false
  }
}

async function sendTest() {
  testing.value = true
  try {
    await $fetch('/api/account/telegram/test', { method: 'POST' })
    toast.add({ title: t('dashboard.telegram.testSent'), color: 'success' })
  } catch (error: any) {
    toast.add({ title: t('dashboard.telegram.failed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    testing.value = false
  }
}

async function disconnect() {
  await $fetch('/api/account/telegram', { method: 'DELETE' })
  await load()
}
</script>
