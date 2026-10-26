<template>
  <div class="bg-paper text-ink">
    <!-- Title band -->
    <section class="relative isolate overflow-hidden border-b border-line">
      <MarketingMkHeroBackdrop class="opacity-60" />
      <div class="mx-auto max-w-6xl border-x border-line px-5 pb-10 pt-12 sm:px-8 md:pb-14 md:pt-20">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <p class="mk-eyebrow">{{ lang === 'vi' ? 'Pháp lý' : 'Legal' }}</p>
          <!-- Language -->
          <div class="inline-flex rounded-full bg-sand p-0.5 text-xs" role="radiogroup" aria-label="Language">
            <button
              v-for="option in LANGS"
              :key="option.code"
              type="button"
              role="radio"
              :aria-checked="lang === option.code"
              class="h-7 rounded-full px-3 font-medium transition-colors"
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
          {{ lang === 'vi' ? 'Cập nhật' : 'Last updated' }}: {{ updatedLabel }}
        </p>
      </div>
    </section>

    <!-- The other legal pages -->
    <nav class="border-b border-line" :aria-label="lang === 'vi' ? 'Trang pháp lý' : 'Legal pages'">
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

const LANGS: { code: LegalLang; label: string }[] = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
]

const updatedLabel = computed(() =>
  new Date(`${LEGAL_UPDATED_ISO}T00:00:00Z`).toLocaleDateString(lang.value === 'vi' ? 'vi-VN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }),
)

const pages = computed(() => {
  const vi = lang.value === 'vi'
  return [
    { to: '/terms', icon: 'i-lucide-scale', label: vi ? 'Điều khoản' : 'Terms' },
    { to: '/privacy', icon: 'i-lucide-lock', label: vi ? 'Quyền riêng tư' : 'Privacy' },
    { to: '/cookie-notice', icon: 'i-lucide-cookie', label: 'Cookie' },
    { to: '/refund', icon: 'i-lucide-receipt', label: vi ? 'Hoàn tiền' : 'Refunds' },
    { to: '/report', icon: 'i-lucide-flag', label: vi ? 'Báo cáo vi phạm' : 'Report a site' },
  ]
})

// On narrow screens, bring the current page's pill into view
const pillsEl = ref<HTMLElement | null>(null)
onMounted(() => {
  const current = pillsEl.value?.querySelector<HTMLElement>('.router-link-exact-active')
  if (current && pillsEl.value) pillsEl.value.scrollLeft = current.offsetLeft - (pillsEl.value.clientWidth - current.offsetWidth) / 2
})

useSeoMeta({ title: () => `${props.title} — Perlink`, description: () => props.description || props.intro })
</script>
