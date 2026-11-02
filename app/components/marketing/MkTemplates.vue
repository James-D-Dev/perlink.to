<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false">
      <div class="max-w-2xl">
        <p class="mk-eyebrow mb-4">{{ text.eyebrow }}</p>
        <h1 class="mk-display text-[40px] sm:text-6xl">{{ text.title }}</h1>
        <p class="mt-5 text-lg text-ink-muted">{{ text.intro }}</p>
        <NuxtLink :to="lang === 'vi' ? '/vi/portfolio-3d' : '/3d-portfolio'" class="mt-4 inline-block text-sm font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink">{{ text.portfolioLink }}</NuxtLink>
      </div>

      <!-- Categories -->
      <div class="mt-10 flex flex-wrap gap-2" role="radiogroup" :aria-label="text.filter">
        <button
          v-for="option in filters"
          :key="option.id"
          type="button"
          role="radio"
          :aria-checked="filter === option.id"
          class="h-9 rounded-full px-4 text-sm transition-colors"
          :class="filter === option.id ? 'bg-ink text-paper' : 'bg-sand text-ink-muted hover:text-ink'"
          @click="filter = option.id"
        >
          {{ option.label }}
        </button>
      </div>

      <div class="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <article v-for="(template, i) in shown" :key="template.id" v-reveal="(i % 3) * 90" class="group">
          <NuxtLink :to="`/templates/${template.id}`" class="block" :aria-label="`${text.preview}: ${nameOf(template)}`">
            <div class="relative aspect-[4/5] overflow-hidden rounded-2xl bg-sand">
              <div class="absolute inset-x-5 top-5 bottom-0 overflow-hidden rounded-t-xl ring-1 ring-line transition-transform duration-500 group-hover:-translate-y-1">
                <LazySiteTemplateThumbnail hydrate-on-visible :template="template" :scale="0.42" />
              </div>
            </div>
          </NuxtLink>
          <h2 class="mt-4 text-base font-medium text-ink">{{ nameOf(template) }}</h2>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ descriptionOf(template) }}</p>
          <div class="mt-4 flex items-center gap-2">
            <MarketingMkButton :to="`/dashboard?template=${template.id}`" size="sm">{{ text.use }}</MarketingMkButton>
            <MarketingMkButton :to="`/templates/${template.id}`" size="sm" variant="outline">{{ text.preview }} {{ nameOf(template).toLowerCase() }}</MarketingMkButton>
          </div>
        </article>
      </div>
    </MarketingMkSection>

    <MarketingMkSection :padded="false">
      <div class="flex flex-col items-start gap-6 px-5 py-16 sm:px-8 md:flex-row md:items-center md:justify-between md:py-20">
        <div v-reveal>
          <h2 class="mk-display text-3xl sm:text-4xl">{{ text.ctaTitle }}</h2>
          <p class="mt-2 text-ink-muted">{{ text.ctaText }}</p>
        </div>
        <MarketingMkClaimForm />
      </div>
    </MarketingMkSection>
  </div>
</template>

<script setup lang="ts">
import { PAGE_TEMPLATES, TEMPLATE_CATEGORIES, type PageTemplate, type TemplateCategory } from '~/data/pageTemplates'

// The template gallery, an address per language (/templates, /vi/templates)
// so each renders the same for search engines
const { lang, copy } = useMarketingLang()

const TEXT = {
  en: {
    eyebrow: 'Templates',
    title: 'Free website & link in bio templates',
    intro: 'Real pages with sample content, a matching theme and a matching 3D room. Pick one for your portfolio, restaurant, shop or creator page, then make it yours.',
    metaTitle: 'Free Website & Link in Bio Templates | Perlink',
    metaDescription: 'Browse free templates for link in bio pages and personal websites: portfolios, restaurant menus, hotels, cafés, shops and creators, each with a 3D room.',
    filter: 'Filter templates',
    all: 'All',
    use: 'Use template',
    preview: 'Preview',
    portfolioLink: 'Making a portfolio? See 3D portfolio websites',
    ctaTitle: 'Ready to make it yours?',
    ctaText: 'Claim your name and start from any template.',
  },
  vi: {
    eyebrow: 'Mẫu',
    title: 'Mẫu trang web & link bio miễn phí',
    intro: 'Những trang thật có sẵn nội dung mẫu, giao diện và phòng 3D đi kèm. Chọn một mẫu cho hồ sơ cá nhân, nhà hàng, cửa hàng hay kênh sáng tạo, rồi chỉnh theo ý bạn.',
    metaTitle: 'Mẫu trang web & link bio miễn phí | Perlink',
    metaDescription: 'Kho mẫu link bio và trang web cá nhân miễn phí: hồ sơ cá nhân, thực đơn nhà hàng, khách sạn, quán cà phê, cửa hàng, nhà sáng tạo. Mỗi mẫu có phòng 3D.',
    filter: 'Lọc mẫu',
    all: 'Tất cả',
    use: 'Dùng mẫu',
    preview: 'Xem mẫu',
    portfolioLink: 'Làm portfolio? Xem website portfolio 3D',
    ctaTitle: 'Sẵn sàng làm trang của bạn?',
    ctaText: 'Giữ tên của bạn và bắt đầu từ bất kỳ mẫu nào.',
  },
}
const CATEGORY_VI: Record<TemplateCategory, string> = {
  gifts: 'Quà tặng', blog: 'Blog', personal: 'Cá nhân', food: 'Ăn uống', beauty: 'Làm đẹp', health: 'Sức khoẻ',
  shop: 'Cửa hàng', education: 'Giáo dục', hospitality: 'Khách sạn & du lịch', business: 'Doanh nghiệp',
  creative: 'Sáng tạo', events: 'Sự kiện', community: 'Cộng đồng',
}
const text = computed(() => TEXT[lang.value])

const nameOf = (template: PageTemplate) => copy.value.templates.names[template.id]?.name ?? template.name
const descriptionOf = (template: PageTemplate) => copy.value.templates.names[template.id]?.description ?? template.description

// Only the categories that have templates
const filters = computed(() => [
  { id: 'all' as const, label: text.value.all },
  ...TEMPLATE_CATEGORIES.filter(c => PAGE_TEMPLATES.some(t => t.category === c.id))
    .map(c => ({ id: c.id, label: lang.value === 'vi' ? CATEGORY_VI[c.id] : c.label })),
])
const filter = ref<TemplateCategory | 'all'>('all')
const shown = computed(() => (filter.value === 'all' ? PAGE_TEMPLATES : PAGE_TEMPLATES.filter(t => t.category === filter.value)))

// ---------- SEO ----------
const SITE = 'https://perlink.to'
const pageUrl = computed(() => `${SITE}${lang.value === 'vi' ? '/vi/templates' : '/templates'}`)
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
    { rel: 'alternate', hreflang: 'en', href: `${SITE}/templates` },
    { rel: 'alternate', hreflang: 'vi', href: `${SITE}/vi/templates` },
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE}/templates` },
  ],
  script: () => [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: text.value.metaTitle,
      description: text.value.metaDescription,
      url: pageUrl.value,
      inLanguage: lang.value,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: PAGE_TEMPLATES.map((template, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: nameOf(template),
          url: `${SITE}/templates/${template.id}`,
        })),
      },
    }).replace(/</g, '\\u003c'),
  }],
})

// The rest of the page in the same language
const { setLocale } = useI18n()
onMounted(() => {
  if (lang.value === 'vi') setLocale('vi')
})
</script>
