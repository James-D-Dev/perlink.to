<template>
  <UDashboardPanel id="superadmin-settings">
    <template #header>
      <UDashboardNavbar title="System Settings">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-3xl space-y-4 py-2 sm:py-4">
        <!-- Telegram bot for owners' order and request alerts -->
        <UCard :ui="superadminPanelUi">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-simple-icons-telegram" class="size-5 text-[#229ED9]" />
              <h2 class="font-medium">Telegram notifications</h2>
            </div>
          </template>

          <p v-if="pending" class="text-sm text-muted">Loading…</p>
          <div v-else-if="!telegram?.configured" class="space-y-1 text-sm text-muted">
            <p>Not set up. Add <code>NUXT_TELEGRAM_BOT_TOKEN</code>, <code>NUXT_TELEGRAM_BOT_USERNAME</code> and <code>NUXT_TELEGRAM_WEBHOOK_SECRET</code> as Cloudflare Pages secrets, then redeploy.</p>
            <p>Steps: <code>docs/telegram-notifications.md</code></p>
          </div>
          <div v-else class="space-y-3 text-sm">
            <dl class="grid grid-cols-[9rem_1fr] gap-x-4 gap-y-2">
              <dt class="text-muted">Bot</dt>
              <dd>
                @{{ telegram.botUsername ?? '—' }}
                <UBadge v-if="!telegram.usernameMatches" color="warning" variant="subtle" size="sm" label="Differs from NUXT_TELEGRAM_BOT_USERNAME" class="ml-1" />
              </dd>
              <dt class="text-muted">Webhook secret</dt>
              <dd>{{ telegram.hasSecret ? 'Set' : 'Missing' }}</dd>
              <dt class="text-muted">Webhook</dt>
              <dd class="break-all">{{ telegram.webhookUrl || 'Not registered' }}</dd>
              <template v-if="telegram.lastError">
                <dt class="text-muted">Last error</dt>
                <dd class="text-red-400">{{ telegram.lastError }}</dd>
              </template>
            </dl>
            <UButton icon="i-lucide-webhook" :loading="registering" :disabled="!telegram.hasSecret" label="Register webhook for this site" @click="register" />
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { superadminPanelUi } from '~/utils/superadmin'

definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
});

interface TelegramStatus {
  configured: boolean
  botUsername?: string | null
  usernameMatches?: boolean
  hasSecret?: boolean
  webhookUrl?: string
  lastError?: string | null
}

const toast = useToast()
const { data: telegram, pending, refresh } = await useFetch<TelegramStatus>('/api/superadmin/telegram')

const registering = ref(false)
async function register() {
  registering.value = true
  try {
    const res = await $fetch<{ url: string }>('/api/superadmin/telegram/setup', { method: 'POST' })
    toast.add({ title: 'Webhook registered', description: res.url, color: 'success' })
    await refresh()
  } catch (error: any) {
    toast.add({ title: 'Failed', description: error?.data?.statusMessage, color: 'error' })
  } finally {
    registering.value = false
  }
}
</script>
