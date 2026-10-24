<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false" center>
      <div class="mx-auto max-w-2xl text-center">
        <p class="mk-eyebrow mb-4">Pricing</p>
        <h1 class="mk-display text-[44px] sm:text-6xl">Start free. Grow when you need to.</h1>
        <p class="mt-5 text-lg text-ink-muted">Every plan includes templates, the drag-and-drop editor and a 3D world for your page.</p>
      </div>
      <div class="mt-14">
        <MarketingMkPricing />
      </div>
    </MarketingMkSection>

    <MarketingMkSection title="Questions about plans">
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

const title = 'Pricing — Perlink'
const description = 'Simple plans for personal websites and 3D worlds. Start free, upgrade for more pages, themes and extras.'
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: 'https://perlink.to/pricing',
  ogImage: 'https://perlink.to/images/og.jpg',
  twitterCard: 'summary_large_image',
})
useHead({ link: [{ rel: 'canonical', href: 'https://perlink.to/pricing' }] })

const faq = [
  { q: 'Can I really use Perlink for free?', a: 'Yes. The free plan lets you create and publish a page with its own 3D world.' },
  { q: 'How do I upgrade?', a: 'Use “Contact us to upgrade” on the plan you want and we will switch your account over. Online checkout is on its way.' },
  { q: 'Can I change plans later?', a: 'Yes, you can move up or down at any time.' },
  { q: 'What happens to my page if I downgrade?', a: 'Your page stays online at the same address.' },
]
</script>
