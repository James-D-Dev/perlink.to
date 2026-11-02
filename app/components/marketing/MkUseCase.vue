<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false">
      <div class="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <p class="mk-eyebrow mb-4">{{ text.eyebrow }}</p>
          <h1 class="mk-display text-[40px] sm:text-6xl">{{ text.title }}</h1>
          <p class="mt-5 text-lg leading-relaxed text-ink-muted">{{ text.intro }}</p>
          <div class="mt-8">
            <MarketingMkClaimForm />
          </div>
          <p class="mt-4 text-sm text-ink-muted">{{ text.note }}</p>
        </div>
        <!-- The main template, on a phone -->
        <NuxtLink :to="`/templates/${heroTemplate.id}`" class="flex justify-center rounded-2xl bg-sand px-6 pt-10">
          <div class="w-[68%] max-w-[300px] overflow-hidden rounded-t-[32px] border-x-[7px] border-t-[7px] border-ink bg-white shadow-[0_20px_50px_rgba(12,11,10,0.15)]">
            <div class="aspect-[9/16] w-full" role="img" :aria-label="text.heroAlt">
              <LazySiteTemplateThumbnail hydrate-on-visible :template="heroTemplate" :scale="0.55" />
            </div>
          </div>
        </NuxtLink>
      </div>
    </MarketingMkSection>

    <!-- What's on the page -->
    <MarketingMkSection :title="text.featuresTitle" :description="text.featuresText">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="(item, i) in text.features" :key="item.title" v-reveal="(i % 3) * 90" class="rounded-2xl bg-sand p-6">
          <UIcon :name="item.icon" class="size-5 text-ink" />
          <h3 class="mt-4 text-base font-medium text-ink">{{ item.title }}</h3>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ item.text }}</p>
        </div>
      </div>
    </MarketingMkSection>

    <!-- Templates -->
    <MarketingMkSection :title="text.templatesTitle" :description="text.templatesText">
      <div class="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
        <NuxtLink v-for="(template, i) in templates" :key="template.id" v-reveal="(i % 4) * 90" :to="`/templates/${template.id}`" class="group block">
          <div class="relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
            <div class="absolute inset-x-4 top-4 bottom-0 overflow-hidden rounded-t-xl ring-1 ring-line transition-transform duration-500 group-hover:-translate-y-1">
              <LazySiteTemplateThumbnail hydrate-on-visible :template="template" :scale="0.38" />
            </div>
          </div>
          <h3 class="mt-3 text-sm font-medium text-ink">{{ copy.templates.names[template.id]?.name ?? template.name }}</h3>
          <p class="mt-0.5 text-xs leading-relaxed text-ink-muted">{{ copy.templates.names[template.id]?.description ?? template.description }}</p>
        </NuxtLink>
      </div>
    </MarketingMkSection>

    <!-- How -->
    <MarketingMkSection :title="text.stepsTitle">
      <ol class="grid gap-4 md:grid-cols-3">
        <li v-for="(step, i) in text.steps" :key="step.title" v-reveal="i * 110" class="rounded-2xl bg-sand p-6 md:p-8">
          <span class="mk-display text-4xl text-ink-faint">0{{ i + 1 }}</span>
          <p class="mt-6 text-base font-medium text-ink">{{ step.title }}</p>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ step.text }}</p>
        </li>
      </ol>
      <div class="mt-10 flex flex-wrap gap-3">
        <MarketingMkButton to="/login" trailing-icon="i-lucide-arrow-right">{{ text.cta }}</MarketingMkButton>
        <MarketingMkButton :to="lang === 'vi' ? '/vi/templates' : '/templates'" variant="outline">{{ more.templates }}</MarketingMkButton>
      </div>
    </MarketingMkSection>

    <!-- Questions -->
    <MarketingMkSection :title="more.faqTitle">
      <div class="divide-y divide-line border-y border-line">
        <details v-for="item in text.faq" :key="item.q" class="group py-5">
          <summary class="flex cursor-pointer list-none items-center justify-between gap-6 text-[15px] text-ink [&::-webkit-details-marker]:hidden">
            {{ item.q }}
            <UIcon name="i-lucide-plus" class="size-4 shrink-0 text-ink-muted transition-transform group-open:rotate-45" />
          </summary>
          <p class="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">{{ item.a }}</p>
        </details>
      </div>
    </MarketingMkSection>

    <!-- The other pages like this one -->
    <MarketingMkSection :title="more.othersTitle">
      <ul class="flex flex-wrap gap-2">
        <li v-for="other in others" :key="other.id">
          <NuxtLink :to="other.path[lang]" class="inline-flex rounded-full bg-sand px-4 py-2 text-sm text-ink transition-colors hover:bg-line">{{ other[lang].label }}</NuxtLink>
        </li>
        <li>
          <NuxtLink :to="lang === 'vi' ? '/vi/portfolio-3d' : '/3d-portfolio'" class="inline-flex rounded-full bg-sand px-4 py-2 text-sm text-ink transition-colors hover:bg-line">{{ copy.footer.portfolio3d }}</NuxtLink>
        </li>
      </ul>
    </MarketingMkSection>
  </div>
</template>

<script setup lang="ts">
import { PAGE_TEMPLATES } from '~/data/pageTemplates'
import { USE_CASES } from '~/data/useCases'

// A page for one thing people come to make (a birthday website, a QR menu...),
// at an address per language; the words are in data/useCases
const props = defineProps<{ id: string }>()

const { lang, copy } = useMarketingLang()
const useCase = USE_CASES.find(item => item.id === props.id)!
const others = USE_CASES.filter(item => item.id !== props.id)
const text = computed(() => useCase[lang.value])

const templates = useCase.templates.map(id => PAGE_TEMPLATES.find(item => item.id === id)).filter(item => !!item)
const heroTemplate = templates[0]!

const MORE = {
  en: { templates: 'Browse all templates', faqTitle: 'Questions', othersTitle: 'More you can make with Perlink' },
  vi: { templates: 'Xem tất cả mẫu', faqTitle: 'Câu hỏi', othersTitle: 'Làm gì khác với Perlink' },
}
const more = computed(() => MORE[lang.value])

// ---------- SEO ----------
const SITE = 'https://perlink.to'
const pageUrl = computed(() => `${SITE}${useCase.path[lang.value]}`)
useSeoMeta({
  title: () => text.value.metaTitle,
  description: () => text.value.metaDescription,
  ogTitle: () => text.value.metaTitle,
  ogDescription: () => text.value.metaDescription,
  ogUrl: () => pageUrl.value,
  ogType: 'website',
  ogSiteName: 'Perlink',
  ogImage: `${SITE}/images/og.jpg`,
  twitterCard: 'summary_large_image',
})
useHead({
  htmlAttrs: { lang: () => lang.value },
  link: () => [
    { rel: 'canonical', href: pageUrl.value },
    { rel: 'alternate', hreflang: 'en', href: `${SITE}${useCase.path.en}` },
    { rel: 'alternate', hreflang: 'vi', href: `${SITE}${useCase.path.vi}` },
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE}${useCase.path.en}` },
  ],
  // The product and the questions, for search results
  script: () => [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Perlink',
        applicationCategory: 'DesignApplication',
        operatingSystem: 'Web',
        url: pageUrl.value,
        description: text.value.metaDescription,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: lang.value,
        mainEntity: text.value.faq.map(item => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ]).replace(/</g, '\\u003c'),
  }],
})

const { setLocale } = useI18n()
onMounted(() => {
  if (lang.value === 'vi') setLocale('vi')
})
</script>
