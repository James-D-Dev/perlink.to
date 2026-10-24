<template>
  <div class="bg-paper text-ink">
    <!-- ============ HERO ============ -->
    <MarketingMkSection :ruled="false" :padded="false">
      <div class="px-5 pb-12 pt-16 sm:px-8 md:pb-16 md:pt-24">
        <div class="grid gap-10 md:grid-cols-[1.45fr_1fr] md:items-end">
          <div>
            <h1 class="mk-display text-[44px] sm:text-6xl md:text-[64px]">
              Your own site.<br>
              <span class="text-ink-muted">Or a whole 3D world.</span>
            </h1>
          </div>
          <div class="md:pb-2">
            <p class="text-lg leading-relaxed text-ink-soft">
              Perlink turns your work, your menu or your shop into a personal website, and lets visitors walk around it in 3D.
              Pick a template, make it yours, publish at perlink.to/you.
            </p>
          </div>
        </div>
        <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <MarketingMkClaimForm />
          <MarketingMkButton to="#3d" variant="outline" size="lg" class="sm:ml-1">Explore 3D worlds</MarketingMkButton>
        </div>
        <p class="mt-4 text-sm text-ink-faint">Free to start · No credit card · Live in a minute</p>
      </div>

      <!-- Showcase: switch between worlds -->
      <div class="px-5 pb-16 sm:px-8 md:pb-24">
        <div class="rounded-2xl bg-sand p-1.5">
          <div class="grid grid-cols-2 gap-1 sm:grid-cols-4" role="tablist" aria-label="3D worlds">
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
                :alt="`${world.title}: a Perlink 3D world`"
                class="absolute inset-0 size-full object-cover"
                :loading="i === 0 ? 'eager' : 'lazy'"
              >
            </TransitionGroup>
            <div class="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/55 to-transparent p-5 text-white sm:flex-row sm:items-end sm:justify-between md:p-7">
              <div>
                <p class="text-lg font-medium">{{ showcase[active]!.title }}</p>
                <p class="text-sm text-white/75">{{ showcase[active]!.caption }}</p>
              </div>
              <p class="text-xs text-white/60">Rendered live in the browser</p>
            </div>
          </div>
        </div>
      </div>
    </MarketingMkSection>

    <!-- ============ MADE FOR ============ -->
    <MarketingMkSection :padded="false">
      <div class="flex flex-col gap-2 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p class="text-[15px] text-ink">Made for people, places and small businesses</p>
        <MarketingMkButton to="/trends" variant="outline" size="sm" trailing-icon="i-lucide-arrow-right">See what's trending</MarketingMkButton>
      </div>
      <div class="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
        <div v-for="audience in audiences" :key="audience.label" class="flex flex-col items-center justify-center gap-2 bg-paper py-8 text-ink-muted">
          <UIcon :name="audience.icon" class="size-5" />
          <span class="text-sm">{{ audience.label }}</span>
        </div>
      </div>
    </MarketingMkSection>

    <!-- ============ TWO WAYS ============ -->
    <MarketingMkSection title="One page, two ways to show it" description="Start with a fast, mobile-first site. Switch on 3D and the same content becomes a room people can explore.">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="flex flex-col rounded-2xl bg-sand p-6 md:p-8">
          <p class="text-sm font-medium text-ink">Site</p>
          <p class="mt-1 text-sm text-ink-muted">Menus, rooms, portfolios and links, laid out for phones first.</p>
          <div class="mt-8 flex flex-1 items-end justify-center">
            <div class="w-[62%] max-w-[260px] overflow-hidden rounded-t-[28px] border-x-[6px] border-t-[6px] border-ink bg-white shadow-[0_20px_50px_rgba(12,11,10,0.15)]">
              <div class="aspect-[3/4] w-full" role="img" aria-label="A restaurant menu site made with Perlink">
                <SiteTemplateThumbnail :template="showcaseTemplate" :scale="0.5" />
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col rounded-2xl bg-sand p-6 md:p-8">
          <p class="text-sm font-medium text-ink">3D world</p>
          <p class="mt-1 text-sm text-ink-muted">A room on a floating land, with day and night, music and clickable objects.</p>
          <div class="mt-8 flex flex-1 items-end">
            <img src="/images/landing/sakura.jpg" alt="A Perlink 3D room in a sakura garden" class="aspect-[4/3] w-full rounded-xl object-cover" loading="lazy">
          </div>
        </div>
      </div>
    </MarketingMkSection>

    <!-- ============ TEMPLATES ============ -->
    <MarketingMkSection
      id="templates"
      eyebrow="Templates"
      title="Start from a page that already fits"
      description="Every template is a real page with sample content, a matching theme and a matching 3D room."
    >
      <div class="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        <article v-for="template in templates" :key="template.id" class="group">
          <div class="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
            <div class="absolute inset-x-4 top-4 bottom-0 overflow-hidden rounded-t-xl ring-1 ring-line transition-transform duration-500 group-hover:-translate-y-1">
              <SiteTemplateThumbnail :template="template" :scale="0.38" />
            </div>
          </div>
          <h3 class="mt-3 text-sm font-medium text-ink">{{ template.name }}</h3>
          <p class="mt-0.5 text-xs leading-relaxed text-ink-muted">{{ template.description }}</p>
        </article>
      </div>
      <div class="mt-10">
        <MarketingMkButton to="/login" trailing-icon="i-lucide-arrow-right">Use a template</MarketingMkButton>
      </div>
    </MarketingMkSection>

    <!-- ============ 3D ============ -->
    <MarketingMkSection id="3d" :padded="false">
      <div class="grid md:grid-cols-[1fr_1.2fr]">
        <div class="px-5 py-16 sm:px-8 md:py-24">
          <p class="mk-eyebrow mb-4">3D worlds</p>
          <h2 class="mk-display text-3xl sm:text-4xl md:text-[44px]">Build a world, not just a page</h2>
          <p class="mt-4 max-w-md text-base leading-relaxed text-ink-muted md:text-lg">
            Furnish a room, pick a land and let people look around. Link any object to your menu, shop or socials.
          </p>
          <MarketingMkButton to="/login" class="mt-8" trailing-icon="i-lucide-arrow-right">Build your world</MarketingMkButton>
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
    <MarketingMkSection id="trends" eyebrow="Trends" title="What people are building" description="Popular worlds and site styles to start from this season.">
      <div class="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        <MarketingMkTrendCard v-for="trend in trends" :key="trend.id" :trend="trend" />
      </div>
      <div class="mt-10">
        <MarketingMkButton to="/trends" variant="outline" trailing-icon="i-lucide-arrow-right">All trends</MarketingMkButton>
      </div>
    </MarketingMkSection>

    <!-- ============ HOW IT WORKS ============ -->
    <MarketingMkSection title="Live in three steps">
      <ol class="grid gap-4 md:grid-cols-3">
        <li v-for="(step, i) in steps" :key="step.title" class="rounded-2xl bg-sand p-6 md:p-8">
          <span class="mk-display text-4xl text-ink-faint">0{{ i + 1 }}</span>
          <p class="mt-6 text-base font-medium text-ink">{{ step.title }}</p>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ step.text }}</p>
        </li>
      </ol>
    </MarketingMkSection>

    <!-- ============ FAQ ============ -->
    <MarketingMkSection id="faq" title="Questions">
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
          <h2 class="mk-display mx-auto max-w-2xl text-4xl sm:text-5xl">Claim your name before someone else does</h2>
          <p class="mx-auto mt-4 max-w-md text-ink-muted">Free to start. Your page and your 3D world, at one short address.</p>
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

definePageMeta({ colorMode: 'light' })
defineOptions({ name: 'IndexPage' })

// ---------- SEO ----------
const SITE_URL = 'https://perlink.to'
const title = 'Perlink — Personal websites and 3D worlds'
const description = 'Build a personal website for your work, restaurant, hotel or shop, and turn it into a 3D world people can explore. Templates, drag-and-drop editing, live at perlink.to/you.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: SITE_URL,
  ogType: 'website',
  ogSiteName: 'Perlink',
  ogImage: `${SITE_URL}/images/og.jpg`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterCard: 'summary_large_image',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: `${SITE_URL}/images/og.jpg`,
})

useHead({
  link: [{ rel: 'canonical', href: SITE_URL }],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'WebSite', name: 'Perlink', url: SITE_URL, description },
          { '@type': 'Organization', name: 'Perlink', url: SITE_URL, logo: `${SITE_URL}/web-app-manifest-512x512.png` },
          {
            '@type': 'SoftwareApplication',
            name: 'Perlink',
            url: SITE_URL,
            applicationCategory: 'WebApplication',
            operatingSystem: 'Any',
            description,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          },
        ],
      }),
    },
  ],
})

// ---------- Content ----------
const showcase = [
  { id: 'city', title: 'City nights', caption: 'Traffic, street lamps and lit windows after dark', image: '/images/landing/city-night.jpg', orb: 'night' as const },
  { id: 'sakura', title: 'Sakura', caption: 'Cherry blossoms, butterflies and a pond', image: '/images/landing/sakura.jpg', orb: 'sakura' as const },
  { id: 'island', title: 'Sky island', caption: 'A floating meadow above the clouds', image: '/images/landing/island.jpg', orb: 'lagoon' as const },
  { id: 'mars', title: 'Mars', caption: 'Craters, rocks and planets all around', image: '/images/landing/mars.jpg', orb: 'mars' as const },
]
const active = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
function select(i: number) {
  active.value = i
  // A manual pick stops the slideshow
  if (timer) clearInterval(timer)
}
onMounted(() => {
  timer = setInterval(() => (active.value = (active.value + 1) % showcase.length), 5000)
})
onBeforeUnmount(() => timer && clearInterval(timer))

const audiences = [
  { label: 'Creators', icon: 'i-lucide-video' },
  { label: 'Restaurants', icon: 'i-lucide-utensils' },
  { label: 'Cafés', icon: 'i-lucide-coffee' },
  { label: 'Hotels', icon: 'i-lucide-bed-double' },
  { label: 'Portfolios', icon: 'i-lucide-palette' },
  { label: 'Events', icon: 'i-lucide-calendar-heart' },
]

const templates = PAGE_TEMPLATES.slice(0, 8)
const showcaseTemplate = PAGE_TEMPLATES.find(t => t.id === 'restaurant')!

const worldFeatures = [
  { icon: 'i-lucide-mountain-snow', title: 'Five lands', text: 'Sky island, sakura, winter, Mars and a city with traffic.' },
  { icon: 'i-lucide-sun-moon', title: 'Day and night', text: 'Follows the real time of day, with lamps that light up.' },
  { icon: 'i-lucide-armchair', title: '60+ objects', text: 'Furniture, plants, dungeon props and photo frames.' },
  { icon: 'i-lucide-mouse-pointer-click', title: 'Clickable', text: 'Link objects to anything; frames open your photos.' },
]

const trends = TRENDS.slice(0, 6)

const steps = [
  { title: 'Claim your name', text: 'Pick perlink.to/yourname. It is yours as long as you use it.' },
  { title: 'Make it yours', text: 'Start from a template, then edit blocks, colours and your 3D room.' },
  { title: 'Share it', text: 'Publish with one click and share the link anywhere.' },
]

const faq = [
  { q: 'Is Perlink free?', a: 'Yes. You can create and publish a site and a 3D world for free. Paid plans add more pages and extras.' },
  { q: 'Do I need to know how to code?', a: 'No. Everything is drag and drop: pick a template, edit the blocks and arrange your 3D room.' },
  { q: 'Does the 3D world work on phones?', a: 'Yes. It runs in the browser on phones, tablets and computers, and adjusts its quality to the device.' },
  { q: 'Can visitors still see a normal page?', a: 'Always. Every 3D world has a fast 2D version one tap away, which is also what search engines read.' },
  { q: 'Can I use my own photos and music?', a: 'Upload photos into picture frames and pick background music for your world.' },
]
</script>
