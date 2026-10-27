<template>
  <UDashboardPanel id="upgrade">
    <template #header>
      <UDashboardNavbar :title="t('dashboard.upgrade.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-6xl py-2 sm:py-6">
        <div class="mb-8 max-w-xl">
          <h1 class="mk-display text-4xl sm:text-5xl">{{ t('dashboard.upgrade.heading') }}</h1>
          <p class="mt-3 text-muted">{{ t('dashboard.upgrade.intro') }}</p>
        </div>

        <!-- Where the account stands -->
        <div v-if="info" class="mb-8 grid gap-3 lg:grid-cols-2">
          <div class="flex items-center gap-4 rounded-3xl bg-paper ring-1 ring-line p-5">
            <div class="flex size-11 shrink-0 items-center justify-center rounded-xl" :class="info.plan === 'free' ? 'bg-sand text-ink-muted' : 'bg-gradient-to-br from-amber-400 to-pink-500 text-white'">
              <UIcon :name="info.plan === 'free' ? 'i-lucide-user' : 'i-lucide-crown'" class="size-5" />
            </div>
            <div class="min-w-0">
              <p class="font-medium text-ink">
                {{ info.plan === 'free' ? t('dashboard.billing.status.free') : t('dashboard.billing.status.paid', { plan: t(`dashboard.billing.plans.${info.plan}.name`) }) }}
              </p>
              <p class="mt-0.5 text-sm text-ink-muted">
                <template v-if="info.expiresAt">{{ t('dashboard.billing.status.until', { date: formatDate(info.expiresAt) }) }} · </template>
                {{ t('dashboard.billing.status.sites', { used: info.sites, max: info.limits.sites >= 1000 ? '∞' : info.limits.sites }) }}
              </p>
              <!-- A card subscription: when it renews or ends, and where to manage it -->
              <p v-if="subscriptionLine" class="mt-0.5 text-sm" :class="info.subscription?.status === 'past_due' ? 'text-error' : 'text-ink-muted'">{{ subscriptionLine }}</p>
            </div>
            <UButton
              v-if="info.subscription?.portalUrl"
              class="ml-auto shrink-0"
              size="sm"
              color="neutral"
              variant="outline"
              icon="i-lucide-settings-2"
              :to="info.subscription.portalUrl"
              target="_blank"
              :label="t('dashboard.billing.subscription.manage')"
            />
          </div>

          <!-- One free trial for free accounts -->
          <div v-if="info.canTrial" class="relative isolate flex flex-wrap items-center gap-4 overflow-hidden rounded-3xl bg-paper ring-1 ring-line p-5">
            <MarketingMkHeroBackdrop :fade="false" />
            <div class="min-w-0 flex-1">
              <p class="font-medium text-ink">{{ t('dashboard.billing.trial.title') }}</p>
              <p class="mt-0.5 text-sm text-ink-muted">{{ t('dashboard.billing.trial.text') }}</p>
            </div>
            <UButton icon="i-lucide-sparkles" :loading="startingTrial" :label="t('dashboard.billing.trial.start')" @click="startTrial" />
          </div>
        </div>

        <MarketingMkPricing :highlight="highlight" />

        <!-- Payments -->
        <section v-if="info?.payments.length" class="mt-12">
          <h2 class="mb-3 text-sm font-medium text-ink">{{ t('dashboard.billing.history') }}</h2>
          <div class="divide-y divide-line overflow-hidden rounded-3xl bg-paper ring-1 ring-line text-sm">
            <div v-for="p in info.payments" :key="p.id" class="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div class="min-w-0">
                <p class="font-medium text-ink">
                  {{ t(`dashboard.billing.plans.${p.plan}.name`) }} · {{ t(p.period === 'annual' ? 'dashboard.billing.checkout.periodAnnual' : 'dashboard.billing.checkout.periodMonthly') }}
                </p>
                <p class="text-xs text-ink-muted">{{ formatDate(p.paidAt || p.createdAt) }} · <span class="font-mono">{{ p.code }}</span></p>
              </div>
              <div class="flex items-center gap-3">
                <span class="font-medium text-ink">{{ (p.method === 'crypto' || p.method === 'lemon') && p.amountUsd ? `$${p.amountUsd}` : formatVnd(p.amount) }}</span>
                <UBadge :color="STATUS_COLOR[p.status] ?? 'neutral'" variant="soft" :label="t(`dashboard.billing.paymentStatus.${p.status}`)" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { formatVnd, isPlanId } from '#shared/plans'

const STATUS_COLOR: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = { paid: 'success', submitted: 'warning', rejected: 'error' }

definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  colorMode: 'light',
})
const { t, locale } = useI18n()
const toast = useToast()
const route = useRoute()
useSeoMeta({ title: () => t('dashboard.upgrade.seoTitle'), robots: 'noindex' })

const { info, refresh } = useBilling()
onMounted(refresh)

const subscriptionLine = computed(() => {
  const sub = info.value?.subscription
  if (!sub) return ''
  if (sub.status === 'past_due' || sub.status === 'unpaid') return t('dashboard.billing.subscription.pastDue')
  if (sub.status === 'cancelled' && sub.endsAt) return t('dashboard.billing.subscription.ends', { date: formatDate(sub.endsAt) })
  if (sub.renewsAt) return t('dashboard.billing.subscription.renews', { date: formatDate(sub.renewsAt) })
  return ''
})

// Back from Lemon Squeezy's checkout: the webhook turns the plan on within
// seconds, so look again a few times (the "you're upgraded" screen follows)
let paidTimer: ReturnType<typeof setInterval> | null = null
onBeforeUnmount(() => { if (paidTimer) clearInterval(paidTimer) })
onMounted(() => {
  if (route.query.paid !== '1') return
  toast.add({ title: t('dashboard.billing.checkout.returned'), description: t('dashboard.billing.checkout.returnedText'), color: 'success' })
  navigateTo({ query: { ...route.query, paid: undefined } }, { replace: true })
  let tries = 0
  paidTimer = setInterval(async () => {
    tries++
    await refresh().catch(() => {})
    if ((info.value?.plan !== 'free' || tries >= 12) && paidTimer) clearInterval(paidTimer)
  }, 3000)
})

// The plan an upgrade prompt pointed to
const highlight = computed(() => (isPlanId(route.query.plan) ? route.query.plan : undefined))

const formatDate = (iso: string) => new Date(iso.includes('T') ? iso : `${iso.replace(' ', 'T')}Z`).toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-GB')

const startingTrial = ref(false)
async function startTrial() {
  startingTrial.value = true
  try {
    const res = await $fetch<{ expiresAt: string }>('/api/billing/trial', { method: 'POST' })
    await refresh()
    toast.add({ title: t('dashboard.billing.trial.started', { date: formatDate(res.expiresAt) }), color: 'success' })
  } catch (error: any) {
    toast.add({ title: t('dashboard.billing.trial.failed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    startingTrial.value = false
  }
}
</script>
