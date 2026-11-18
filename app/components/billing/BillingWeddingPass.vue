<template>
  <!-- The Wedding pass: paid once for a wedding site, next to the monthly plans -->
  <section id="wedding-pass" class="relative isolate scroll-mt-24 overflow-hidden rounded-3xl bg-paper p-5 ring-1 ring-line sm:p-7">
    <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_0%,#fbe7ec_0%,transparent_55%),radial-gradient(90%_80%_at_0%_100%,#f6ecd9_0%,transparent_60%)]" />
    <div class="flex flex-col gap-6 lg:flex-row lg:items-center">
      <div class="min-w-0 flex-1">
        <div class="flex flex-wrap items-center gap-2">
          <span class="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-amber-400 text-white">
            <UIcon name="i-lucide-gem" class="size-4.5" />
          </span>
          <h2 class="text-lg font-semibold text-ink">{{ t('dashboard.billing.weddingPass.title') }}</h2>
          <span class="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">{{ t('dashboard.billing.weddingPass.badge') }}</span>
        </div>
        <p class="mt-2 max-w-xl text-sm text-ink-muted">{{ t('dashboard.billing.weddingPass.text') }}</p>
        <ul class="mt-4 grid gap-2 sm:grid-cols-2">
          <li v-for="(perk, i) in perks" :key="i" class="flex gap-2 text-sm text-ink">
            <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-rose-500" />
            <span>{{ perk }}</span>
          </li>
        </ul>
      </div>
      <div class="flex shrink-0 flex-col items-start gap-3 lg:w-60 lg:items-stretch">
        <p class="text-3xl font-semibold tabular-nums text-ink">
          {{ price }}
          <span class="text-base font-normal text-ink-muted">/ {{ t('dashboard.billing.weddingPass.once') }}</span>
        </p>
        <p v-if="info?.weddingPass?.included" class="text-sm text-ink-muted">{{ t('dashboard.billing.weddingPass.included') }}</p>
        <UButton
          v-else
          size="lg"
          block
          icon="i-lucide-gem"
          :disabled="!canBuy"
          :label="t('dashboard.billing.weddingPass.buy')"
          @click="buy"
        />
      </div>
    </div>

    <BillingCheckoutDialog v-model:open="checkoutOpen" :plan="WEDDING_PASS.plan" :period="WEDDING_PASS.period" product="wedding" />
  </section>
</template>

<script setup lang="ts">
import { WEDDING_PASS, formatUsd, formatVnd } from '#shared/plans'

// Opens on its own when the page is reached with ?pass=wedding (from an
// upgrade prompt or the wedding pages)
const props = defineProps<{ autoOpen?: boolean }>()

const { t, tm, rt, locale } = useI18n()
const { info } = useBilling()
const checkoutOpen = ref(false)

const perks = computed(() => (tm('dashboard.billing.weddingPass.perks') as unknown[]).map(p => rt(p as never)))
// Vietnamese pays in VND by bank transfer; every other language and card buyers see dollars
const usd = computed(() => locale.value !== 'vi' || (info.value?.weddingPass && !info.value.weddingPass.bank))
const price = computed(() => (usd.value ? formatUsd(WEDDING_PASS.priceUsd) : formatVnd(WEDDING_PASS.price)))
const canBuy = computed(() => !!(info.value?.weddingPass?.bank || info.value?.weddingPass?.card))

function buy() {
  checkoutOpen.value = true
}

watch(() => [props.autoOpen, canBuy.value] as const, ([auto, ready]) => {
  if (auto && ready && !info.value?.weddingPass?.included) {
    checkoutOpen.value = true
    nextTick(() => document.getElementById('wedding-pass')?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }
}, { immediate: true })
</script>
