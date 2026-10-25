<template>
  <div class="bg-paper text-ink">
    <!-- ============ HERO ============ -->
    <MarketingMkSection :ruled="false" :padded="false">
      <div class="relative isolate px-5 pb-12 pt-16 sm:px-8 md:pb-16 md:pt-24">
        <MarketingMkHeroBackdrop />
        <div class="grid gap-10 md:grid-cols-[1.45fr_1fr] md:items-end">
          <div>
            <h1 class="mk-display text-[44px] sm:text-6xl md:text-[64px]">
              {{ c.hero.line1 }}<br>
              <span class="text-ink-muted">{{ c.hero.line2 }}</span>
            </h1>
          </div>
          <div class="md:pb-2">
            <p class="text-lg leading-relaxed text-ink-soft">
              {{ c.hero.lead }}
            </p>
          </div>
        </div>
        <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <MarketingMkClaimForm />
          <MarketingMkButton to="#3d" variant="outline" size="lg" class="sm:ml-1">{{ c.hero.explore }}</MarketingMkButton>
        </div>
        <p class="mt-4 text-sm text-ink-faint">{{ c.hero.note }}</p>
      </div>

      <!-- Showcase: switch between worlds -->
      <div class="px-5 pb-16 sm:px-8 md:pb-24">
        <div class="rounded-2xl bg-sand p-1.5">
          <div class="grid grid-cols-2 gap-1 sm:grid-cols-4" role="tablist" :aria-label="c.hero.worldsLabel">
            <button
              v-for="(world, i) in showcase"
              :key="world.id"
              type="button"
              role="tab"
              :aria-selected="active === i"
              class="flex h-11 items-center justify-center gap-2 rounded-2xl text-sm transition-colors"
              :class="active === i ? 'bg-paper text-ink shadow-[0_1px_2px_rgba(12,11,10,0.06)]' : 'text-ink-muted hover:text-ink'"
              @click="select(i)"
            >
              <MarketingMkOrb :palette="world.orb" :size="12" still />
              {{ world.title }}
            </button>
          </div>
          <div class="relative mt-1.5 aspect-[16/9] overflow-hidden rounded-2xl bg-ink md:aspect-[2/1]">
            <TransitionGroup
              enter-active-class="transition-opacity duration-700"
              enter-from-class="opacity-0"
              leave-active-class="transition-opacity duration-700 absolute inset-0"
              leave-to-class="opacity-0"
            >
              <img
                v-for="(world, i) in showcase"
                v-show="active === i"
                :key="world.id"
                :src="world.image"
                :alt="c.hero.worldAlt(world.title)"
                class="absolute inset-0 size-full object-cover"
                :loading="i === 0 ? 'eager' : 'lazy'"
              >
            </TransitionGroup>
            <div class="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/55 to-transparent p-5 text-white sm:flex-row sm:items-end sm:justify-between md:p-7">
              <div>
                <p class="text-lg font-medium">{{ showcase[active]!.title }}</p>
                <p class="text-sm text-white/75">{{ showcase[active]!.caption }}</p>
              </div>
              <p class="text-xs text-white/60">{{ c.hero.rendered }}</p>
            </div>
          </div>
        </div>
      </div>
    </MarketingMkSection>

    <!-- ============ MADE FOR ============ -->
    <MarketingMkSection :padded="false">
      <div class="flex flex-col gap-2 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p class="text-[15px] text-ink">{{ c.audiences.heading }}</p>
        <MarketingMkButton to="/trends" variant="outline" size="sm" trailing-icon="i-lucide-arrow-right">{{ c.audiences.trending }}</MarketingMkButton>
      </div>
      <div class="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
        <div v-for="audience in audiences" :key="audience.label" class="flex flex-col items-center justify-center gap-2 bg-paper py-8 text-ink-muted">
          <UIcon :name="audience.icon" class="size-5" />
          <span class="text-sm">{{ audience.label }}</span>
        </div>
      </div>
    </MarketingMkSection>

    <!-- ============ TWO WAYS ============ -->
    <MarketingMkSection :title="c.twoWays.title" :description="c.twoWays.description">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="flex flex-col rounded-2xl bg-sand p-6 md:p-8">
          <p class="text-sm font-medium text-ink">{{ c.twoWays.site }}</p>
          <p class="mt-1 text-sm text-ink-muted">{{ c.twoWays.siteText }}</p>
          <div class="mt-8 flex flex-1 items-end justify-center">
            <div class="w-[62%] max-w-[260px] overflow-hidden rounded-t-[28px] border-x-[6px] border-t-[6px] border-ink bg-white shadow-[0_20px_50px_rgba(12,11,10,0.15)]">
              <div class="aspect-[3/4] w-full" role="img" :aria-label="c.twoWays.siteAlt">
                <SiteTemplateThumbnail :template="showcaseTemplate" :scale="0.5" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col rounded-2xl bg-sand p-6 md:p-8">
          <p class="text-sm font-medium text-ink">{{ c.twoWays.world }}</p>
          <p class="mt-1 text-sm text-ink-muted">{{ c.twoWays.worldText }}</p>
          <div class="mt-8 flex flex-1 items-end">
            <img src="/images/landing/sakura.jpg" :alt="c.twoWays.worldAlt" class="aspect-[4/3] w-full rounded-xl object-cover" loading="lazy">
          </div>
        </div>
      </div>
    </MarketingMkSection>

    <!-- ============ TEMPLATES ============ -->
    <MarketingMkSection
      id="templates"
      :eyebrow="c.templates.eyebrow"
      :title="c.templates.title"
      :description="c.templates.description"
    >
      <div class="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        <article v-for="template in templates" :key="template.id" class="group">
          <div class="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
            <div class="absolute inset-x-4 top-4 bottom-0 overflow-hidden rounded-t-xl ring-1 ring-line transition-transform duration-500 group-hover:-translate-y-1">
              <SiteTemplateThumbnail :template="template" :scale="0.38" />
            </div>
          </div>
          <h3 class="mt-3 text-sm font-medium text-ink">{{ c.templates.names[template.id]?.name ?? template.name }}</h3>
          <p class="mt-0.5 text-xs leading-relaxed text-ink-muted">{{ c.templates.names[template.id]?.description ?? template.description }}</p>
        </article>
      </div>
      <div class="mt-10">
        <MarketingMkButton to="/login" trailing-icon="i-lucide-arrow-right">{{ c.templates.cta }}</MarketingMkButton>
      </div>
    </MarketingMkSection>

    <!-- ============ 3D ============ -->
    <MarketingMkSection id="3d" :padded="false">
      <div class="grid md:grid-cols-[1fr_1.2fr]">
        <div class="px-5 py-16 sm:px-8 md:py-24">
          <p class="mk-eyebrow mb-4">{{ c.worlds.eyebrow }}</p>
          <h2 class="mk-display text-3xl sm:text-4xl md:text-[44px]">{{ c.worlds.title }}</h2>
          <p class="mt-4 max-w-md text-base leading-relaxed text-ink-muted md:text-lg">
            {{ c.worlds.text }}
          </p>
          <MarketingMkButton to="/login" class="mt-8" trailing-icon="i-lucide-arrow-right">{{ c.worlds.cta }}</MarketingMkButton>
        </div>
        <div class="grid grid-cols-2 gap-px border-t border-line bg-line md:border-l md:border-t-0">
          <div v-for="feature in worldFeatures" :key="feature.title" class="bg-paper p-6 md:p-8">
            <UIcon :name="feature.icon" class="size-5 text-ink" />
            <p class="mt-4 text-sm font-medium text-ink">{{ feature.title }}</p>
            <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ feature.text }}</p>
          </div>
        </div>
      </div>
    </MarketingMkSection>

    <!-- ============ TRENDS ============ -->
    <MarketingMkSection id="trends" :eyebrow="c.trends.eyebrow" :title="c.trends.title" :description="c.trends.description">
      <div class="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        <MarketingMkTrendCard v-for="trend in trends" :key="trend.id" :trend="trend" />
      </div>
      <div class="mt-10">
        <MarketingMkButton to="/trends" variant="outline" trailing-icon="i-lucide-arrow-right">{{ c.trends.all }}</MarketingMkButton>
      </div>
    </MarketingMkSection>

    <!-- ============ HOW IT WORKS ============ -->
    <MarketingMkSection :title="c.steps.title">
      <ol class="grid gap-4 md:grid-cols-3">
        <li v-for="(step, i) in c.steps.items" :key="step.title" class="rounded-2xl bg-sand p-6 md:p-8">
          <span class="mk-display text-4xl text-ink-faint">0{{ i + 1 }}</span>
          <p class="mt-6 text-base font-medium text-ink">{{ step.title }}</p>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ step.text }}</p>
        </li>
      </ol>
    </MarketingMkSection>

    <!-- ============ FAQ ============ -->
    <MarketingMkSection id="faq" :title="c.faq.title">
      <div class="divide-y divide-line border-y border-line">
        <details v-for="item in c.faq.items" :key="item.q" class="group py-5">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] text-ink [&::-webkit-details-marker]:hidden">
            {{ item.q }}
            <UIcon name="i-lucide-plus" class="size-4 shrink-0 text-ink-muted transition-transform group-open:rotate-45" />
          </summary>
          <p class="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{{ item.a }}</p>
        </details>
      </div>
    </MarketingMkSection>

    <!-- ============ CTA ============ -->
    <MarketingMkSection :padded="false">
      <div class="relative overflow-hidden px-5 py-20 text-center sm:px-8 md:py-28">
        <!-- Orbs sit in the margins, clear of the text -->
        <div class="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
          <span class="absolute left-12 top-16"><MarketingMkOrb palette="sakura" :size="120" /></span>
          <span class="absolute bottom-16 left-44"><MarketingMkOrb palette="sunset" :size="56" /></span>
          <span class="absolute right-48 top-14"><MarketingMkOrb palette="lagoon" :size="48" /></span>
          <span class="absolute bottom-14 right-12"><MarketingMkOrb palette="night" :size="130" /></span>
        </div>
        <div class="relative">
          <h2 class="mk-display mx-auto max-w-2xl text-4xl sm:text-5xl">{{ c.cta.title }}</h2>
          <p class="mx-auto mt-4 max-w-md text-ink-muted">{{ c.cta.text }}</p>
          <div class="mt-8 flex justify-center">
            <MarketingMkClaimForm />
          </div>
        </div>
      </div>
    </MarketingMkSection>
  </div>
</template>

<script setup lang="ts">
import { PAGE_TEMPLATES } from '~/data/pageTemplates'
import { TRENDS } from '~/data/trends'

// The landing page, in the language of its URL ("/" English, "/vi" Vietnamese)
const { lang, copy: c } = useMarketingLang()

// ---------- SEO ----------
const SITE_URL = 'https://perlink.to'
const pageUrl = computed(() => (lang.value === 'vi' ? `${SITE_URL}/vi` : SITE_URL))

useSeoMeta({
  title: () => c.value.meta.title,
  description: () => c.value.meta.description,
  ogTitle: () => c.value.meta.title,
  ogDescription: () => c.value.meta.description,
  ogUrl: () => pageUrl.value,
  ogType: 'website',
  ogSiteName: 'Perlink',
  ogLocale: () => (lang.value === 'vi' ? 'vi_VN' : 'en_US'),
  ogImage: `${SITE_URL}/images/og.jpg`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterTitle: () => c.value.meta.title,
  twitterDescription: () => c.value.meta.description,
  twitterImage: `${SITE_URL}/images/og.jpg`,
})

useHead({
  htmlAttrs: { lang: () => lang.value },
  link: () => [
    { rel: 'canonical', href: pageUrl.value },
    // Tell search engines both languages are the same page
    { rel: 'alternate', hreflang: 'en', href: SITE_URL },
    { rel: 'alternate', hreflang: 'vi', href: `${SITE_URL}/vi` },
    { rel: 'alternate', hreflang: 'x-default', href: SITE_URL },
  ],
  script: () => [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'WebSite', name: 'Perlink', url: pageUrl.value, inLanguage: lang.value, description: c.value.meta.description },
          { '@type': 'Organization', name: 'Perlink', url: SITE_URL, logo: `${SITE_URL}/web-app-manifest-512x512.png` },
          {
            '@type': 'SoftwareApplication',
            name: 'Perlink',
            url: SITE_URL,
            applicationCategory: 'WebApplication',
            operatingSystem: 'Any',
            description: c.value.meta.description,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
        ],
      }),
    },
  ],
})

// Visitors who come in through /vi get the dashboard in Vietnamese too
const { setLocale } = useI18n()
onMounted(() => {
  if (lang.value === 'vi') setLocale('vi')
})

// ---------- Content ----------
const SHOWCASE = [
  { id: 'city', image: '/images/landing/city-night.jpg', orb: 'night' as const },
  { id: 'sakura', image: '/images/landing/sakura.jpg', orb: 'sakura' as const },
  { id: 'island', image: '/images/landing/island.jpg', orb: 'lagoon' as const },
  { id: 'mars', image: '/images/landing/mars.jpg', orb: 'mars' as const },
] as const
const showcase = computed(() => SHOWCASE.map(world => ({ ...world, ...c.value.showcase[world.id] })))
const active = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
function select(i: number) {
  active.value = i
  // A manual pick stops the slideshow
  if (timer) clearInterval(timer)
}
onMounted(() => {
  timer = setInterval(() => (active.value = (active.value + 1) % SHOWCASE.length), 5000)
})
onBeforeUnmount(() => timer && clearInterval(timer))

const audiences = computed(() => [
  { label: c.value.audiences.items.creators, icon: 'i-lucide-video' },
  { label: c.value.audiences.items.restaurants, icon: 'i-lucide-utensils' },
  { label: c.value.audiences.items.cafes, icon: 'i-lucide-coffee' },
  { label: c.value.audiences.items.hotels, icon: 'i-lucide-bed-double' },
  { label: c.value.audiences.items.portfolios, icon: 'i-lucide-palette' },
  { label: c.value.audiences.items.events, icon: 'i-lucide-calendar-heart' },
])

const templates = PAGE_TEMPLATES.slice(0, 8)
const showcaseTemplate = PAGE_TEMPLATES.find(t => t.id === 'restaurant')!

const worldFeatures = computed(() => {
  const f = c.value.worlds.features
  return [
    { icon: 'i-lucide-mountain-snow', ...f.lands },
    { icon: 'i-lucide-sun-moon', ...f.daynight },
    { icon: 'i-lucide-armchair', ...f.objects },
    { icon: 'i-lucide-mouse-pointer-click', ...f.clickable },
  ]
})

const trends = TRENDS.slice(0, 6)
</script>
