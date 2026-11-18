<template>
  <div class="bg-paper text-ink">
    <!-- Title band -->
    <section class="relative isolate overflow-hidden border-b border-line">
      <MarketingMkHeroBackdrop class="opacity-60" />
      <div class="mx-auto max-w-6xl border-x border-line px-5 pb-10 pt-12 sm:px-8 md:pb-14 md:pt-20">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="mk-eyebrow">{{ ui.legal }}</p>
          <!-- Language -->
          <div class="inline-flex max-w-full overflow-x-auto rounded-full bg-sand p-0.5 text-xs [scrollbar-width:none]" role="radiogroup" aria-label="Language">
            <button
              v-for="option in LANGS"
              :key="option.code"
              type="button"
              role="radio"
              :aria-checked="lang === option.code"
              class="h-7 shrink-0 rounded-full px-3 font-medium transition-colors"
              :class="lang === option.code ? 'bg-paper text-ink shadow-[0_1px_2px_rgba(12,11,10,0.08)]' : 'text-ink-muted hover:text-ink'"
              @click="setLocale(option.code)"
            >
              {{ option.label }}
            </button>
          </div>
        </div>
        <h1 class="mk-display mt-5 text-[40px] sm:text-6xl">{{ title }}</h1>
        <p class="mt-5 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">{{ intro }}</p>
        <p v-if="updated" class="mt-6 inline-flex items-center gap-1.5 rounded-full bg-paper/80 px-3 py-1 text-xs text-ink-muted ring-1 ring-line backdrop-blur">
          <UIcon name="i-lucide-calendar" class="size-3.5" />
          {{ ui.updated }}: {{ updatedLabel }}
        </p>
      </div>
    </section>

    <!-- The other legal pages -->
    <nav class="border-b border-line" :aria-label="ui.pages">
      <div class="mx-auto max-w-6xl border-x border-line">
        <div ref="pillsEl" class="flex gap-1 overflow-x-auto scroll-fade-x px-3 py-2 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <NuxtLink
            v-for="item in pages"
            :key="item.to"
            :to="item.to"
            class="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm transition-colors"
            :class="item.to === route.path ? 'bg-ink text-paper' : 'text-ink-muted hover:bg-sand hover:text-ink'"
          >
            <UIcon :name="item.icon" class="size-4" />
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
    </nav>

    <slot />
  </div>
</template>

<script setup lang="ts">
import type { LegalLang } from '~/data/legal/types'
import { APP_LANGUAGES, LANGUAGE_INFO } from '#shared/language'

// Frame for the legal pages and the report form: title band, language
// switch and links between the pages
const props = defineProps<{
  title: string
  intro: string
  /** For search results; the intro otherwise */
  description?: string
  /** Show the "last updated" date */
  updated?: boolean
}>()

const route = useRoute()
const { setLocale } = useI18n()
const lang = useLegalLang()

const LANGS: { code: LegalLang; label: string }[] = APP_LANGUAGES.map(code => ({ code, label: LANGUAGE_INFO[code].label }))

const UI: Record<LegalLang, { legal: string; updated: string; pages: string; terms: string; privacy: string; cookies: string; refunds: string; report: string }> = {
  en: { legal: 'Legal', updated: 'Last updated', pages: 'Legal pages', terms: 'Terms', privacy: 'Privacy', cookies: 'Cookie', refunds: 'Refunds', report: 'Report a site' },
  vi: { legal: 'Pháp lý', updated: 'Cập nhật', pages: 'Trang pháp lý', terms: 'Điều khoản', privacy: 'Quyền riêng tư', cookies: 'Cookie', refunds: 'Hoàn tiền', report: 'Báo cáo vi phạm' },
  zh: { legal: '法律信息', updated: '最后更新', pages: '法律页面', terms: '服务条款', privacy: '隐私政策', cookies: 'Cookie', refunds: '退款政策', report: '举报网站' },
  ja: { legal: '法的情報', updated: '最終更新日', pages: '法的情報のページ', terms: '利用規約', privacy: 'プライバシー', cookies: 'Cookie', refunds: '返金', report: 'サイトを報告' },
  ko: { legal: '법적 고지', updated: '최종 업데이트', pages: '법적 고지 페이지', terms: '이용약관', privacy: '개인정보', cookies: '쿠키', refunds: '환불', report: '사이트 신고' },
}
const ui = computed(() => UI[lang.value])

const updatedLabel = computed(() => formatLegalDate(LEGAL_UPDATED_ISO, lang.value))

const pages = computed(() => [
  { to: '/terms', icon: 'i-lucide-scale', label: ui.value.terms },
  { to: '/privacy', icon: 'i-lucide-lock', label: ui.value.privacy },
  { to: '/cookie-notice', icon: 'i-lucide-cookie', label: ui.value.cookies },
  { to: '/refund', icon: 'i-lucide-receipt', label: ui.value.refunds },
  { to: '/report', icon: 'i-lucide-flag', label: ui.value.report },
])

// On narrow screens, bring the current page's pill into view
const pillsEl = ref<HTMLElement | null>(null)
onMounted(() => {
  const current = pillsEl.value?.querySelector<HTMLElement>('.router-link-exact-active')
  if (current && pillsEl.value) pillsEl.value.scrollLeft = current.offsetLeft - (pillsEl.value.clientWidth - current.offsetWidth) / 2
})

// Search and sharing: the page's own address as canonical
const pageUrl = computed(() => `https://perlink.to${route.path === '/' ? '' : route.path}`)
useSeoMeta({
  title: () => `${props.title} — Perlink`,
  description: () => props.description || props.intro,
  ogTitle: () => `${props.title} — Perlink`,
  ogDescription: () => props.description || props.intro,
  ogUrl: () => pageUrl.value,
  ogType: 'website',
  ogImage: 'https://perlink.to/images/og.jpg',
  twitterCard: 'summary_large_image',
  twitterSite: X_HANDLE,
})
useHead({ link: () => [{ rel: 'canonical', href: pageUrl.value }] })
</script>
