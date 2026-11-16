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
        <!-- Email: Cloudflare Email Sending -->
        <UCard :ui="superadminPanelUi">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-mail" class="size-5 text-[#F38020]" />
              <h2 class="font-medium">Email sending</h2>
            </div>
          </template>
          <div class="flex flex-wrap items-center justify-between gap-3 text-sm">
            <p class="text-muted">Sends a test email to the superadmin through Cloudflare Email Sending.</p>
            <UButton size="sm" icon="i-lucide-send" label="Send test email" :loading="sendingTest" @click="sendTestEmail" />
          </div>
          <p v-if="emailTest" class="mt-3 text-sm" :class="emailTest.ok ? 'text-success' : 'text-error'">
            {{ emailTest.ok ? `Sent to ${emailTest.to} (${emailTest.transport})` : `Failed${emailTest.transport ? ` (${emailTest.transport})` : ''}: ${emailTest.error}` }}
          </p>
        </UCard>

        <!-- Ways to pay for plans -->
        <UCard :ui="superadminPanelUi">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-wallet" class="size-5 text-primary" />
              <h2 class="font-medium">Payment methods</h2>
            </div>
          </template>
          <div class="space-y-4 text-sm">
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-medium">Card, Apple Pay, Google Pay (Creem)</p>
                <p class="text-muted">{{ payments?.card ? 'On: set up with NUXT_CREEM_API_KEY.' : 'Off: add NUXT_CREEM_API_KEY to turn it on.' }}</p>
              </div>
              <UBadge :color="payments?.card ? 'success' : 'neutral'" variant="subtle" :label="payments?.card ? 'On' : 'Off'" />
            </div>
            <div class="flex items-start justify-between gap-4">
              <div>
                <p class="font-medium">VietQR bank transfer (VND)</p>
                <p class="text-muted">
                  When off, the plan buttons go straight to Creem's checkout and prices show in US dollars.
                  <template v-if="payments && !payments.bankConfigured"><br>No bank account is set up, so it stays off even when switched on.</template>
                </p>
              </div>
              <USwitch :model-value="payments?.bank ?? false" :loading="savingPayments" :disabled="!payments" @update:model-value="setBank" />
            </div>
          </div>
        </UCard>

        <!-- Creem: card subscriptions and one-time orders -->
        <UCard :ui="superadminPanelUi">
          <template #header>
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-credit-card" class="size-5 text-[#ff6b4a]" />
                <h2 class="font-medium">Creem</h2>
                <UBadge v-if="creem?.configured" :color="creem.testMode ? 'warning' : 'success'" variant="subtle" size="sm" :label="creem.testMode ? 'Test mode' : 'Live'" />
              </div>
              <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-refresh-cw" :loading="creemPending" aria-label="Check again" @click="refreshCreem()" />
            </div>
          </template>

          <p v-if="creemPending && !creem" class="text-sm text-muted">Loading…</p>
          <p v-else-if="!creem?.configured" class="text-sm text-muted">Not set up. Add <code>NUXT_CREEM_API_KEY</code> and <code>NUXT_CREEM_WEBHOOK_SECRET</code> (see <code>docs/billing.md</code>), then redeploy.</p>
          <div v-else class="space-y-4 text-sm">
            <p v-if="creem.error" class="text-error">{{ creem.error }}</p>
            <dl class="grid grid-cols-[9rem_1fr] gap-x-4 gap-y-2">
              <dt class="text-muted">Webhook secret</dt>
              <dd>{{ creem.hasWebhookSecret ? 'Set' : 'Missing' }}</dd>
              <dt class="text-muted">Webhook URL</dt>
              <dd class="break-all font-mono text-xs">{{ webhookUrl }}</dd>
            </dl>

            <div v-if="creem.products?.length">
              <div class="mb-1.5 flex items-center justify-between gap-2">
                <p class="font-medium">Products</p>
                <UButton v-if="missing" size="xs" icon="i-lucide-plus" :loading="syncing" :label="`Create ${missing} missing on Creem`" @click="syncProducts" />
              </div>
              <ul class="space-y-1">
                <li v-for="row in creem.products" :key="row.key" class="flex items-center gap-2">
                  <UIcon :name="row.productId ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" :class="row.productId ? 'text-success' : 'text-error'" />
                  <span>{{ row.name }}</span>
                  <span class="text-muted">· ${{ row.livePrice ?? row.price }}{{ row.recurring ? '' : ' once' }}</span>
                  <UBadge v-if="row.livePrice !== null && row.livePrice !== row.price" color="warning" variant="subtle" size="sm" :label="`site says $${row.price}`" />
                </li>
              </ul>
            </div>
          </div>
        </UCard>

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

interface CreemStatus {
  configured: boolean
  testMode?: boolean
  hasWebhookSecret?: boolean
  error?: string
  products?: { key: string; name: string; price: number; recurring: boolean; productId: string | null; livePrice: number | null }[]
}

const toast = useToast()

const sendingTest = ref(false)
const emailTest = ref<{ ok: boolean; transport: string | null; to?: string; error?: string | null } | null>(null)
async function sendTestEmail() {
  sendingTest.value = true
  try {
    emailTest.value = await $fetch('/api/superadmin/email/test', { method: 'POST' })
  } catch (error: any) {
    emailTest.value = { ok: false, transport: null, error: error?.data?.statusMessage || 'Request failed' }
  } finally {
    sendingTest.value = false
  }
}

const { data: payments, refresh: refreshPayments } = useFetch<{ bank: boolean; bankConfigured: boolean; card: boolean }>('/api/superadmin/settings/payments', { server: false })
const savingPayments = ref(false)
async function setBank(bank: boolean) {
  savingPayments.value = true
  try {
    await $fetch('/api/superadmin/settings/payments', { method: 'POST', body: { bank } })
    await refreshPayments()
    toast.add({ title: bank ? 'VietQR bank transfer is on' : 'VietQR bank transfer is off', color: 'success' })
  } catch (error: any) {
    toast.add({ title: 'Failed', description: error?.data?.statusMessage, color: 'error' })
  } finally {
    savingPayments.value = false
  }
}

const { data: creem, pending: creemPending, refresh: refreshCreem } = useFetch<CreemStatus>('/api/superadmin/creem', { server: false })
const webhookUrl = computed(() => `${useRuntimeConfig().public.siteUrl}/api/billing/creem-webhook`)
const missing = computed(() => creem.value?.products?.filter(p => !p.productId).length ?? 0)
const syncing = ref(false)
async function syncProducts() {
  syncing.value = true
  try {
    const res = await $fetch<{ created: string[] }>('/api/superadmin/creem-sync', { method: 'POST' })
    toast.add({ title: `Created ${res.created.length} products on Creem`, color: 'success' })
    await refreshCreem()
  } catch (error: any) {
    toast.add({ title: 'Failed', description: error?.data?.statusMessage, color: 'error' })
  } finally {
    syncing.value = false
  }
}
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
