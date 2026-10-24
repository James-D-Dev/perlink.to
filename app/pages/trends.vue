<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false">
      <div class="max-w-2xl">
        <p class="mk-eyebrow mb-4">Trends</p>
        <h1 class="mk-display text-[44px] sm:text-6xl">What people are building</h1>
        <p class="mt-5 text-lg text-ink-muted">Popular 3D worlds and site styles to start from. Pick one you like, then make it yours.</p>
      </div>

      <div class="mt-12 inline-flex rounded-full bg-sand p-1" role="radiogroup" aria-label="Filter trends">
        <button
          v-for="option in filters"
          :key="option.id"
          type="button"
          role="radio"
          :aria-checked="filter === option.id"
          class="h-9 rounded-full px-4 text-sm transition-colors"
          :class="filter === option.id ? 'bg-paper text-ink shadow-[0_1px_2px_rgba(12,11,10,0.06)]' : 'text-ink-muted hover:text-ink'"
          @click="filter = option.id"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="mt-10 grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <MarketingMkTrendCard v-for="trend in shown" :key="trend.id" :trend="trend" />
      </div>
    </MarketingMkSection>

    <MarketingMkSection :padded="false">
      <div class="flex flex-col items-start gap-6 px-5 py-16 sm:px-8 md:flex-row md:items-center md:justify-between md:py-20">
        <div>
          <h2 class="mk-display text-3xl sm:text-4xl">Found your look?</h2>
          <p class="mt-2 text-ink-muted">Claim your name and start from it.</p>
        </div>
        <MarketingMkClaimForm />
      </div>
    </MarketingMkSection>
  </div>
</template>

<script setup lang="ts">
import { TRENDS } from '~/data/trends'

definePageMeta({ layout: 'default', colorMode: 'light' })

const title = 'Trends — Perlink'
const description = 'Popular 3D worlds and website styles on Perlink: city nights, sakura gardens, restaurant menus, creator hubs and more.'
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: 'https://perlink.to/trends',
  ogImage: 'https://perlink.to/images/og.jpg',
  twitterCard: 'summary_large_image',
})
useHead({ link: [{ rel: 'canonical', href: 'https://perlink.to/trends' }] })

const filters = [
  { id: 'all', label: 'All' },
  { id: '3d', label: '3D worlds' },
  { id: 'site', label: 'Sites' },
] as const
const filter = ref<'all' | '3d' | 'site'>('all')
const shown = computed(() => (filter.value === 'all' ? TRENDS : TRENDS.filter(t => t.kind === filter.value)))
</script>
