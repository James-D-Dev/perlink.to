<template>
  <div>
    <div class="mb-8 flex flex-col items-center gap-2">
      <div class="inline-flex rounded-full bg-sand p-1" role="radiogroup" :aria-label="t('dashboard.billing.annual')">
        <button
          v-for="option in periods"
          :key="option"
          type="button"
          role="radio"
          :aria-checked="period === option"
          class="h-9 rounded-full px-4 text-sm transition-colors"
          :class="period === option ? 'bg-paper text-ink shadow-[0_1px_2px_rgba(12,11,10,0.06)]' : 'text-ink-muted hover:text-ink'"
          @click="period = option"
        >
          {{ t(`dashboard.billing.${option}`) }}
          <span v-if="option === 'annual'" class="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">{{ t('dashboard.billing.annualSave') }}</span>
        </button>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <article
        v-for="plan in PLAN_ORDER"
        :key="plan"
        class="relative flex flex-col rounded-2xl p-6 transition"
        :class="[
          isPopular(plan) ? 'bg-ink text-paper' : 'bg-sand text-ink',
          highlight === plan && 'ring-2 ring-amber-400 ring-offset-2 ring-offset-paper',
        ]"
      >
        <div class="flex items-center justify-between">
          <h3 class="text-base font-medium">{{ t(`dashboard.billing.plans.${plan}.name`) }}</h3>
          <span v-if="currentPlan === plan" class="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-medium" :class="isPopular(plan) ? 'text-emerald-300' : 'text-emerald-700'">{{ t('dashboard.billing.current') }}</span>
          <span v-else-if="isPopular(plan)" class="rounded-full bg-paper/15 px-2.5 py-0.5 text-xs">{{ t('dashboard.billing.recommended') }}</span>
        </div>
        <p class="mt-1 text-sm" :class="muted(plan)">{{ t(`dashboard.billing.plans.${plan}.description`) }}</p>
        <p class="mt-6 flex items-baseline gap-1">
          <span class="mk-display text-4xl" :class="isPopular(plan) && 'text-paper'">{{ monthlyPrice(plan) }}</span>
          <span class="text-sm" :class="muted(plan)">{{ t('dashboard.billing.perMonth') }}</span>
        </p>
        <p class="mt-1 h-4 text-xs" :class="isPopular(plan) ? 'text-paper/50' : 'text-ink-faint'">
          <template v-if="plan !== 'free' && period === 'annual'">{{ t('dashboard.billing.billedYearly', { amount: usd ? formatUsd(PLAN_PRICES_USD[plan].annual) : formatVnd(PLAN_PRICES[plan].annual) }) }}</template>
        </p>

        <ul class="mt-6 flex-1 space-y-2.5">
          <li v-for="feature in features(plan)" :key="feature" class="flex items-start gap-2 text-sm">
            <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0" :class="isPopular(plan) ? 'text-paper/70' : 'text-ink-muted'" />
            {{ feature }}
          </li>
        </ul>

        <div class="mt-8">
          <template v-if="plan === 'free'">
            <MarketingMkButton v-if="!loggedIn" to="/login" variant="outline" block>{{ t('dashboard.billing.startFree') }}</MarketingMkButton>
          </template>
          <MarketingMkButton v-else-if="!loggedIn" :to="`/login?redirect=${encodeURIComponent(`/dashboard/upgrade?plan=${plan}`)}`" :variant="isPopular(plan) ? 'inverse' : 'solid'" block>
            {{ t('dashboard.billing.choose', { plan: t(`dashboard.billing.plans.${plan}.name`) }) }}
          </MarketingMkButton>
          <!-- Not sold yet (see PRO_ON_SALE) -->
          <MarketingMkButton v-else-if="!onSale(plan)" variant="outline" block disabled>
            {{ t('dashboard.billing.comingSoon') }}
          </MarketingMkButton>
          <MarketingMkButton v-else-if="checkoutEnabled" :variant="isPopular(plan) ? 'inverse' : 'solid'" block @click="buy(plan)">
            {{ currentPlan === plan ? t('dashboard.billing.renew') : t('dashboard.billing.choose', { plan: t(`dashboard.billing.plans.${plan}.name`) }) }}
          </MarketingMkButton>
          <MarketingMkButton v-else :href="upgradeMail(plan)" :variant="isPopular(plan) ? 'inverse' : 'solid'" block>
            {{ t('dashboard.billing.contact') }}
          </MarketingMkButton>
        </div>
      </article>
    </div>
    <p class="mt-6 text-center text-xs text-ink-faint">
      {{ loggedIn && !checkoutEnabled && info ? t('dashboard.billing.contactNote') : t('dashboard.billing.payNote') }}
      <template v-if="usd"><br>{{ t('dashboard.billing.usdNote') }}</template>
    </p>

    <BillingCheckoutDialog v-if="buying" v-model:open="checkoutOpen" :plan="buying" :period="period" />
  </div>
</template>

<script setup lang="ts">
import { PLAN_LIMITS, PLAN_ORDER, PLAN_PRICES, PLAN_PRICES_USD, formatUsd, formatVnd, onSale, type BillingPeriod, type PaidPlanId, type PlanId } from '#shared/plans'

// Plan cards for /pricing and the dashboard upgrade page. Signed in, a paid
// plan opens the bank-transfer checkout.
const props = defineProps<{
  /** Plan to draw attention to, e.g. the one an upgrade prompt asked for */
  highlight?: PlanId
}>()

const { t, locale } = useI18n()
const { loggedIn } = useUserSession()
const { info, ensure } = useBilling()

const periods: BillingPeriod[] = ['monthly', 'annual']
const period = ref<BillingPeriod>('monthly')
const buying = ref<PaidPlanId | null>(null)
const checkoutOpen = ref(false)

// The account's billing info arrives after the server has drawn the cards,
// so anything that depends on it waits for the browser; otherwise the page
// would keep the server's "contact us" buttons after it starts
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
  if (loggedIn.value) ensure()
})

const currentPlan = computed(() => (mounted.value && loggedIn.value ? info.value?.plan : undefined))
const checkoutEnabled = computed(() => mounted.value && !!info.value?.checkoutEnabled)
const highlight = computed(() => props.highlight)

const isPopular = (plan: PlanId) => plan === 'plus'
const muted = (plan: PlanId) => (isPopular(plan) ? 'text-paper/60' : 'text-ink-muted')

// English shows dollars; payment itself is still in VND (see PLAN_PRICES_USD)
const usd = computed(() => locale.value === 'en')

function monthlyPrice(plan: PlanId) {
  if (usd.value) {
    if (plan === 'free') return '$0'
    const price = PLAN_PRICES_USD[plan]
    return formatUsd(period.value === 'annual' ? Math.round((price.annual / 12) * 100) / 100 : price.monthly)
  }
  if (plan === 'free') return '0đ'
  const price = PLAN_PRICES[plan]
  return formatVnd(period.value === 'annual' ? Math.round(price.annual / 12 / 1000) * 1000 : price.monthly)
}

function features(plan: PlanId) {
  const limits = PLAN_LIMITS[plan]
  const f = (key: string, params: Record<string, unknown> = {}, n?: number) => (n === undefined ? t(`dashboard.billing.features.${key}`, params) : t(`dashboard.billing.features.${key}`, params, n))
  const list = [
    f('sites', { n: limits.sites }, limits.sites),
    f('basics'),
    f('room'),
  ]
  if (limits.proThemes) list.push(f('proThemes'))
  if (limits.customDomain) list.push(f('customDomains', { n: limits.domains }, limits.domains))
  if (limits.removeBranding) list.push(f('removeBranding'))
  const years = Math.round(limits.analyticsDays / 365)
  list.push(years >= 2 ? f('analyticsYears', { n: years }) : years === 1 ? f('analyticsYear') : f('analytics', { n: limits.analyticsDays }))
  if (plan === 'pro') list.push(f('support'))
  return list
}

function buy(plan: Exclude<PlanId, 'free'>) {
  buying.value = plan
  checkoutOpen.value = true
}

function upgradeMail(plan: PlanId) {
  return `mailto:kimduc10a@gmail.com?subject=${encodeURIComponent(`Upgrade to Perlink ${plan}`)}`
}
</script>
