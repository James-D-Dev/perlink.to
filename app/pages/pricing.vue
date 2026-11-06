<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false" center>
      <div class="mx-auto max-w-2xl text-center">
        <p class="mk-eyebrow mb-4">{{ t('pricingPage.eyebrow') }}</p>
        <h1 class="mk-display text-[44px] sm:text-6xl">{{ t('pricingPage.title') }}</h1>
        <p class="mt-5 text-lg text-ink-muted">{{ t('pricingPage.intro') }}</p>
      </div>
      <div class="mt-14">
        <MarketingMkPricing />
      </div>

      <!-- Paid once, for a wedding site -->
      <div id="wedding-pass" class="mx-auto mt-10 flex max-w-4xl scroll-mt-24 flex-col gap-5 rounded-3xl bg-gradient-to-br from-rose-50 to-amber-50 p-6 text-left ring-1 ring-rose-100 sm:flex-row sm:items-center sm:p-8">
        <div class="min-w-0 flex-1">
          <p class="flex flex-wrap items-center gap-2 text-lg font-semibold text-ink">
            <UIcon name="i-lucide-gem" class="size-5 text-rose-500" />
            {{ t('dashboard.billing.weddingPass.title') }}
            <span class="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-rose-700 ring-1 ring-rose-100">{{ t('dashboard.billing.weddingPass.badge') }}</span>
          </p>
          <p class="mt-2 text-sm text-ink-muted">{{ t('dashboard.billing.weddingPass.text') }}</p>
          <ul class="mt-3 space-y-1.5">
            <li v-for="(perk, i) in passPerks" :key="i" class="flex gap-2 text-sm text-ink">
              <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-rose-500" />{{ perk }}
            </li>
          </ul>
        </div>
        <div class="shrink-0 sm:w-56">
          <p class="text-3xl font-semibold tabular-nums text-ink">{{ passPrice }} <span class="text-base font-normal text-ink-muted">/ {{ t('dashboard.billing.weddingPass.once') }}</span></p>
          <UButton class="mt-3" block size="lg" to="/dashboard/upgrade?pass=wedding" icon="i-lucide-gem" :label="t('dashboard.billing.weddingPass.buy')" />
        </div>
      </div>
    </MarketingMkSection>

    <MarketingMkSection :title="t('pricingPage.faqTitle')">
      <div class="divide-y divide-line border-y border-line">
        <details v-for="item in faq" :key="item.q" class="group py-5">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] text-ink [&::-webkit-details-marker]:hidden">
            {{ item.q }}
            <UIcon name="i-lucide-plus" class="size-4 shrink-0 text-ink-muted transition-transform group-open:rotate-45" />
          </summary>
          <p class="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{{ item.a }}</p>
        </details>
      </div>
    </MarketingMkSection>
  </div>
</template>

<script setup lang="ts">
import { WEDDING_PASS, formatUsd, formatVnd } from '#shared/plans'

definePageMeta({ layout: 'default', colorMode: 'light' })

const { t, tm, rt, locale } = useI18n()

// The Wedding pass, next to the monthly plans
const passPerks = computed(() => (tm('dashboard.billing.weddingPass.perks') as unknown[]).map(p => rt(p as never)))
const passPrice = computed(() => (locale.value === 'vi' ? formatVnd(WEDDING_PASS.price) : formatUsd(WEDDING_PASS.priceUsd)))

const title = computed(() => t('pricingPage.seoTitle'))
const description = computed(() => t('pricingPage.seoDescription'))
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: 'https://perlink.to/pricing',
  ogImage: 'https://perlink.to/images/og.jpg',
  twitterCard: 'summary_large_image',
  twitterSite: X_HANDLE,
})
useHead({
  link: [{ rel: 'canonical', href: 'https://perlink.to/pricing' }],
  // The app with each plan's price, and the questions below
  script: () => [{
    type: 'application/ld+json',
    innerHTML: jsonLd([
      perlinkOrganization(),
      perlinkApp(description.value),
      breadcrumbs([{ name: 'Perlink', url: PERLINK_URL }, { name: title.value, url: `${PERLINK_URL}/pricing` }]),
      { '@type': 'WebPage', '@id': `${PERLINK_URL}/pricing`, url: `${PERLINK_URL}/pricing`, name: title.value, description: description.value, about: { '@id': PERLINK_APP_ID }, isPartOf: { '@id': PERLINK_WEBSITE_ID } },
    ]),
  }],
})

// Questions and answers in the visitor's language
const faq = computed(() =>
  (tm('pricingPage.faq') as unknown as { q: unknown; a: unknown }[]).map(item => ({ q: rt(item.q as any), a: rt(item.a as any) })),
)
</script>
