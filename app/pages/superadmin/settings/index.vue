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

        <!-- Lemon Squeezy: card / PayPal subscriptions -->
        <UCard :ui="superadminPanelUi">
          <template #header>
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-credit-card" class="size-5 text-[#7047EB]" />
                <h2 class="font-medium">Lemon Squeezy</h2>
              </div>
              <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-refresh-cw" :loading="lemonPending" aria-label="Check again" @click="refreshLemon()" />
            </div>
          </template>

          <p v-if="lemonPending && !lemon" class="text-sm text-muted">Loading…</p>
          <p v-else-if="!lemon?.configured" class="text-sm text-muted">Not set up. Add <code>NUXT_LEMON_API_KEY</code> and <code>NUXT_LEMON_WEBHOOK_SECRET</code> (see <code>docs/billing.md</code>), then redeploy.</p>
          <div v-else class="space-y-4 text-sm">
            <p v-if="lemon.error" class="text-error">{{ lemon.error }}</p>
            <dl v-if="lemon.store" class="grid grid-cols-[9rem_1fr] gap-x-4 gap-y-2">
              <dt class="text-muted">Store</dt>
              <dd>{{ lemon.store.name }} <span class="text-muted">· #{{ lemon.store.id }} · {{ lemon.store.domain }}</span></dd>
              <dt class="text-muted">Webhook secret</dt>
              <dd>{{ lemon.hasWebhookSecret ? 'Set' : 'Missing' }}</dd>
            </dl>

            <div v-if="lemon.plans">
              <p class="mb-1.5 font-medium">Plans on sale</p>
              <ul class="space-y-1">
                <li v-for="row in lemon.plans" :key="`${row.plan}:${row.period}`" class="flex items-center gap-2">
                  <UIcon :name="row.variantId ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4" :class="row.variantId ? 'text-success' : 'text-error'" />
                  <span class="capitalize">{{ row.plan }} · {{ row.period }}</span>
                  <span class="text-muted">{{ row.variantId ? `variant #${row.variantId}` : 'no matching variant' }}</span>
                </li>
              </ul>
            </div>

            <div v-if="lemon.products?.length">
              <p class="mb-1.5 font-medium">Products in the store</p>
              <ul class="space-y-2">
                <li v-for="product in lemon.products" :key="product.id">
                  <p>{{ product.name }} <span class="text-muted">· {{ product.status }}</span></p>
                  <p v-for="v in product.variants" :key="v.id" class="pl-4 text-xs text-muted">
                    #{{ v.id }} {{ v.name }} · ${{ v.price }} / {{ v.interval ?? 'one-time' }} · {{ v.status }}
                  </p>
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

interface LemonStatus {
  configured: boolean
  hasWebhookSecret?: boolean
  error?: string
  store?: { id: string; name: string; domain: string }
  plans?: { plan: string; period: string; variantId: string | null }[]
  products?: { id: string; name: string; status: string; variants: { id: string; name: string; price: number; interval: string | null; status: string }[] }[]
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

const { data: lemon, pending: lemonPending, refresh: refreshLemon } = useFetch<LemonStatus>('/api/superadmin/lemon', { server: false })
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
