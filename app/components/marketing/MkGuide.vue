<template>
  <div class="bg-paper text-ink">
    <MarketingMkSection :ruled="false">
      <nav class="mb-8 text-sm text-ink-muted" :aria-label="more.breadcrumb">
        <NuxtLink :to="home" class="hover:text-ink">Perlink</NuxtLink>
        <span class="mx-2" aria-hidden="true">/</span>
        <span>{{ text.eyebrow }}</span>
      </nav>
      <article class="max-w-3xl">
        <p class="mk-eyebrow mb-4">{{ text.eyebrow }} · {{ more.read(text.readMinutes) }}</p>
        <h1 class="mk-display text-[40px] sm:text-6xl">{{ text.title }}</h1>
        <p class="mt-5 text-lg leading-relaxed text-ink-muted">{{ text.intro }}</p>
        <p class="mt-4 text-sm text-ink-muted">
          {{ more.by }} <NuxtLink :to="aboutPath" class="underline decoration-line underline-offset-4 hover:text-ink">Perlink</NuxtLink>
          · {{ more.updated }} <time :datetime="guide.updated">{{ updatedLabel }}</time>
        </p>

        <section v-for="section in text.sections" :key="section.title" class="mt-14">
          <h2 class="mk-display text-2xl sm:text-3xl">{{ section.title }}</h2>
          <p v-for="(paragraph, i) in section.paragraphs" :key="i" class="mt-4 text-base leading-relaxed text-ink-muted">{{ paragraph }}</p>
          <ul v-if="section.bullets" class="mt-4 space-y-2.5">
            <li v-for="bullet in section.bullets" :key="bullet" class="flex gap-3 text-base leading-relaxed text-ink-muted">
              <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-tint" />
              <span>{{ bullet }}</span>
            </li>
          </ul>
        </section>
      </article>
    </MarketingMkSection>

    <!-- The steps -->
    <MarketingMkSection :title="text.stepsTitle">
      <ol class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <li v-for="(step, i) in text.steps" :key="step.title" class="rounded-2xl bg-sand p-6 md:p-8">
          <span class="mk-display text-4xl text-ink-faint">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="mt-6 text-base font-medium text-ink">{{ step.title }}</h3>
          <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ step.text }}</p>
        </li>
      </ol>
      <div class="mt-10 flex flex-wrap gap-3">
        <MarketingMkButton to="/login" trailing-icon="i-lucide-arrow-right">{{ more.start }}</MarketingMkButton>
        <MarketingMkButton :to="`/templates/${guide.templateId}`" variant="outline">{{ more.template }}</MarketingMkButton>
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

    <!-- Start -->
    <MarketingMkSection>
      <div class="max-w-2xl">
        <h2 class="mk-display text-3xl sm:text-4xl">{{ text.ctaTitle }}</h2>
        <p class="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">{{ text.ctaText }}</p>
        <div class="mt-8">
          <MarketingMkClaimForm :topic="id === 'personal-website' ? 'personal' : id" />
        </div>
      </div>
      <ul class="mt-12 flex flex-wrap gap-2">
        <li v-for="other in others" :key="other.id">
          <NuxtLink :to="local(other.path.en)" class="inline-flex rounded-full bg-sand px-4 py-2 text-sm text-ink transition-colors hover:bg-line">{{ other[lang].title }}</NuxtLink>
        </li>
        <li v-for="useCase in useCases" :key="useCase.id">
          <NuxtLink :to="local(useCase.path.en)" class="inline-flex rounded-full bg-sand px-4 py-2 text-sm text-ink transition-colors hover:bg-line">{{ useCase[lang].label }}</NuxtLink>
        </li>
      </ul>
    </MarketingMkSection>
  </div>
</template>

<script setup lang="ts">
import { LANGUAGE_INFO } from '#shared/language'
import { alternateLinks } from '~/data/langPaths'
import { ABOUT_PAIR, GUIDES } from '~/data/guides'
import { USE_CASES } from '~/data/useCases'
import type { MarketingLang } from '~/data/marketingCopy'

// A how-to guide at an address per language; the words are in data/guides
const props = defineProps<{ id: string }>()

const { lang, home, local } = useMarketingLang()
const guide = GUIDES.find(item => item.id === props.id)!
const others = GUIDES.filter(item => item.id !== props.id)
const useCases = USE_CASES.filter(item => ['personal', 'link-in-bio'].includes(item.id))
const text = computed(() => guide[lang.value])
const aboutPath = computed(() => local(ABOUT_PAIR[0]))

interface MoreText { breadcrumb: string; read: (n: number) => string; by: string; updated: string; start: string; template: string; faqTitle: string }
const MORE: Record<MarketingLang, MoreText> = {
  en: { breadcrumb: 'Breadcrumb', read: n => `${n} min read`, by: 'By', updated: 'Updated', start: 'Start free', template: 'See the template', faqTitle: 'Questions' },
  vi: { breadcrumb: 'Đường dẫn', read: n => `${n} phút đọc`, by: 'Bởi', updated: 'Cập nhật', start: 'Bắt đầu miễn phí', template: 'Xem mẫu', faqTitle: 'Câu hỏi' },
  zh: { breadcrumb: '面包屑导航', read: n => `阅读约 ${n} 分钟`, by: '作者', updated: '更新于', start: '免费开始', template: '查看模板', faqTitle: '常见问题' },
  ja: { breadcrumb: 'パンくずリスト', read: n => `${n}分で読めます`, by: '執筆', updated: '更新日', start: '無料ではじめる', template: 'テンプレートを見る', faqTitle: 'よくある質問' },
  ko: { breadcrumb: '탐색 경로', read: n => `${n}분 분량`, by: '작성', updated: '업데이트', start: '무료로 시작하기', template: '템플릿 보기', faqTitle: '자주 묻는 질문' },
}
const more = computed(() => MORE[lang.value])
const updatedLabel = computed(() =>
  new Date(`${guide.updated}T00:00:00Z`).toLocaleDateString(LANGUAGE_INFO[lang.value].intl, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
)

// ---------- SEO ----------
const pageUrl = computed(() => `${PERLINK_URL}${local(guide.path.en)}`)
useSeoMeta({
  title: () => text.value.seoTitle,
  description: () => text.value.description,
  ogTitle: () => text.value.seoTitle,
  ogDescription: () => text.value.description,
  ogUrl: () => pageUrl.value,
  ogType: 'article',
  ogSiteName: 'Perlink',
  ogImage: `${PERLINK_URL}/images/og.jpg`,
  twitterCard: 'summary_large_image',
  twitterSite: X_HANDLE,
  articleModifiedTime: guide.updated,
})
useHead({
  htmlAttrs: { lang: () => LANGUAGE_INFO[lang.value].html },
  link: () => [
    { rel: 'canonical', href: pageUrl.value },
    ...alternateLinks(guide.path.en),
  ],
  script: () => [{
    type: 'application/ld+json',
    innerHTML: jsonLd([
      perlinkOrganization(),
      {
        '@type': 'Article',
        '@id': `${pageUrl.value}#article`,
        headline: text.value.title,
        description: text.value.description,
        inLanguage: LANGUAGE_INFO[lang.value].html,
        url: pageUrl.value,
        mainEntityOfPage: pageUrl.value,
        image: `${PERLINK_URL}/images/og.jpg`,
        datePublished: guide.updated,
        dateModified: guide.updated,
        author: { '@id': PERLINK_ORG_ID },
        publisher: { '@id': PERLINK_ORG_ID },
        about: { '@id': PERLINK_APP_ID },
      },
      breadcrumbs([
        { name: 'Perlink', url: `${PERLINK_URL}${home.value === '/' ? '' : home.value}` },
        { name: text.value.title, url: pageUrl.value },
      ]),
    ]),
  }],
})

const { locale, setLocale } = useI18n()
onMounted(() => {
  if (lang.value !== 'en' && locale.value !== lang.value) setLocale(lang.value)
})
</script>
