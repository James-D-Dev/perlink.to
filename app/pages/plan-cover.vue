<template>
  <!-- A product picture for a plan (Creem product image), 1200 x 800 -->
  <div v-if="look" class="cover relative isolate overflow-hidden text-white" :style="{ backgroundImage: `linear-gradient(135deg, ${look.colors.join(', ')})` }">
    <div class="pointer-events-none absolute -right-40 -top-40 -z-10 size-[600px] rounded-full bg-white/20 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-52 -left-40 -z-10 size-[560px] rounded-full bg-black/25 blur-3xl" />
    <div class="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:28px_28px]" />

    <div class="flex h-full">
      <!-- Name, price and what's included -->
      <div class="flex w-[560px] shrink-0 flex-col justify-between py-16 pl-16 pr-6">
        <div>
          <p class="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[17px] font-semibold ring-1 ring-white/30 backdrop-blur">
            <UIcon :name="look.icon" class="size-5" />Perlink plan
          </p>
          <h1 class="mt-6 text-[84px] font-extrabold leading-[0.95] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.25)]">{{ look.name }}</h1>
          <p class="mt-4 text-[24px] font-medium text-white/90">{{ look.tagline }}</p>
          <ul class="mt-7 space-y-2.5 text-[20px] text-white/90">
            <li v-for="item in features" :key="item" class="flex items-start gap-3">
              <span class="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-white/25"><UIcon name="i-lucide-check" class="size-4" /></span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
        <p class="flex items-center gap-2 text-[22px] font-semibold">
          <img src="/favicon.svg" alt="" class="size-8 rounded-lg">perlink.to
        </p>
      </div>

      <!-- The plan card, with a few perks floating round it -->
      <div class="relative flex flex-1 items-center justify-center pr-14">
        <div class="relative w-[420px] rounded-[40px] bg-white/15 p-10 ring-1 ring-white/35 backdrop-blur-md shadow-[0_40px_80px_-30px_rgba(0,0,0,0.45)]">
          <div class="flex size-24 items-center justify-center rounded-[28px] shadow-xl" :class="look.badge">
            <UIcon :name="look.icon" class="size-12" />
          </div>
          <p class="mt-8 text-[22px] font-semibold text-white/80">{{ look.name }}</p>
          <p class="mt-1 flex items-end gap-2">
            <span class="text-[88px] font-extrabold leading-none tracking-tight">{{ formatUsd(prices.monthly) }}</span>
            <span class="pb-3 text-[26px] font-medium text-white/75">/mo</span>
          </p>
          <p class="mt-3 text-[21px] text-white/80">or {{ formatUsd(prices.annual) }} billed annually</p>
          <div class="mt-8 h-px bg-white/25" />
          <p class="mt-6 text-[19px] text-white/80">Cancel any time · 7-day money back</p>
        </div>
        <div
          v-for="(perk, i) in look.perks"
          :key="perk.text"
          class="absolute flex items-center gap-2.5 rounded-2xl bg-white px-4 py-3 text-[18px] font-semibold text-zinc-900 shadow-[0_20px_40px_-16px_rgba(0,0,0,0.45)]"
          :class="PERK_SPOTS[i]"
        >
          <span class="flex size-9 items-center justify-center rounded-xl" :class="perk.tone"><UIcon :name="perk.icon" class="size-5" /></span>
          {{ perk.text }}
        </div>
      </div>
    </div>
    <span id="cover-ready" class="hidden" />
  </div>
</template>

<script setup lang="ts">
import { PLAN_PRICES_USD, formatUsd, type PaidPlanId } from '#shared/plans'

definePageMeta({ layout: false, colorMode: 'light' })
useSeoMeta({ robots: 'noindex, nofollow', title: 'Plan cover' })

const route = useRoute()
const { t } = useI18n()

const LOOKS: Record<PaidPlanId, { name: string; tagline: string; icon: string; colors: string[]; badge: string; perks: { icon: string; text: string; tone: string }[] }> = {
  starter: {
    name: 'Starter', tagline: 'For your first real site', icon: 'i-lucide-rocket',
    colors: ['#0ea5e9', '#2563eb', '#4f46e5'], badge: 'bg-white text-sky-600',
    perks: [
      { icon: 'i-lucide-chart-line', text: 'Pixels & analytics', tone: 'bg-sky-100 text-sky-700' },
      { icon: 'i-lucide-lock', text: 'Password pages', tone: 'bg-indigo-100 text-indigo-700' },
      { icon: 'i-lucide-shopping-bag', text: 'Order tracking', tone: 'bg-emerald-100 text-emerald-700' },
    ],
  },
  plus: {
    name: 'Plus', tagline: 'Everything you need to grow', icon: 'i-lucide-crown',
    colors: ['#0f172a', '#1e3a8a', '#4338ca'], badge: 'bg-gradient-to-br from-amber-300 to-pink-500 text-white',
    perks: [
      { icon: 'i-lucide-globe', text: 'Your own domain', tone: 'bg-blue-100 text-blue-700' },
      { icon: 'i-lucide-palette', text: 'Pro themes', tone: 'bg-pink-100 text-pink-700' },
      { icon: 'i-lucide-box', text: '3D rooms', tone: 'bg-amber-100 text-amber-700' },
    ],
  },
  max: {
    name: 'Max', tagline: 'For agencies and growing businesses', icon: 'i-lucide-gem',
    colors: ['#f59e0b', '#ec4899', '#7c3aed'], badge: 'bg-zinc-950 text-amber-300',
    perks: [
      { icon: 'i-lucide-headset', text: 'Priority support', tone: 'bg-pink-100 text-pink-700' },
      { icon: 'i-lucide-layout-grid', text: '50 live sites', tone: 'bg-violet-100 text-violet-700' },
      { icon: 'i-lucide-store', text: 'All 3D room packs', tone: 'bg-amber-100 text-amber-700' },
    ],
  },
}
// Where the perk chips float round the card
const PERK_SPOTS = ['-left-2 top-[120px] -rotate-3', 'right-24 top-[290px] rotate-2', 'left-4 bottom-[110px] rotate-1']

const id = String(route.query.plan ?? '') as PaidPlanId
const look = LOOKS[id] ?? null
if (!look) throw createError({ statusCode: 404, statusMessage: 'Not found' })
const prices = PLAN_PRICES_USD[id]

// The pricing page's list, in English (these go on the Creem store)
const en = (key: string, params: Record<string, unknown> = {}, n?: number) => (n === undefined ? t(key, params, { locale: 'en' }) : t(key, params, { locale: 'en', plural: n }))
const features = computed(() => {
  const list = planFeatures(id, en)
  return list.slice(0, 8)
})
</script>

<style scoped>
.cover {
  width: 1200px;
  height: 800px;
}
</style>
