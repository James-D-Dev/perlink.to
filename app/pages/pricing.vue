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
definePageMeta({ layout: 'default', colorMode: 'light' })

const { t, tm, rt } = useI18n()

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
