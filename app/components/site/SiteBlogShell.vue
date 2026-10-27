<template>
  <!-- A site's blog pages, in the site's own look: its background, fonts and
       cards, with the site's name on top and the Perlink badge at the end -->
  <div class="min-h-screen" :style="[{ color: '#1c1a17' }, pageStyle]">
    <div class="mx-auto max-w-2xl px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))]" :class="sample ? 'pt-24' : 'pt-6 sm:pt-10'">
      <header class="mb-8 flex items-center justify-between gap-3">
        <NuxtLink :to="homeHref ?? `/${site.username}`" class="flex min-w-0 items-center gap-2.5 rounded-full py-1 pl-1 pr-3 transition hover:bg-black/5">
          <img v-if="site.avatarUrl" :src="site.avatarUrl" :alt="site.title" class="size-9 shrink-0 rounded-full object-cover">
          <span v-else class="flex size-9 shrink-0 items-center justify-center rounded-full bg-black/10 text-sm font-semibold">{{ site.title.charAt(0).toUpperCase() }}</span>
          <span class="truncate text-[15px] font-semibold" :style="{ fontFamily: headingStyle.fontFamily }">{{ site.title }}</span>
        </NuxtLink>
        <NuxtLink v-if="blogHref !== null" :to="blogHref ?? `/${site.username}/blog`" class="shrink-0 rounded-full px-3 py-1.5 text-sm font-medium opacity-70 transition hover:bg-black/5 hover:opacity-100">
          {{ siteT(lang, 'blog') }}
        </NuxtLink>
      </header>

      <slot :lang="lang" :card-style="cardStyle" :heading-style="headingStyle" />

      <footer v-if="!sample" class="mt-14 flex flex-col items-center gap-1">
        <SiteMadeWith v-if="site.showBranding" :username="site.username" :lang="lang" />
        <a
          :href="`https://perlink.to/report?site=${encodeURIComponent(site.username)}`"
          target="_blank"
          rel="noopener nofollow"
          class="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-xs opacity-60 transition hover:bg-black/5 hover:opacity-100"
        >
          <UIcon name="i-lucide-flag" class="size-3.5" />
          {{ siteT(lang, 'report') }}
        </a>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ThemeConfig } from '~/types/bio'
import { googleFontsUrlFor } from '~/composables/useGoogleFonts'

export interface BlogSite {
  username: string
  title: string
  avatarUrl: string | null
  themeConfig: Partial<ThemeConfig>
  showBranding: boolean
}

const props = defineProps<{
  site: BlogSite
  /** Where the site name leads (default: the site) */
  homeHref?: string
  /** Where "Blog" leads; null hides it (default: the site's blog) */
  blogHref?: string | null
  /** A template's sample post: no badge or report link */
  sample?: boolean
}>()

const { theme, pageStyle, cardStyle, headingStyle } = useBioTheme(computed(() => props.site.themeConfig))
const lang = computed(() => normalizeSiteLanguage(theme.value.language))
provide(SITE_LANG_KEY, lang)

const fontsHref = computed(() => googleFontsUrlFor([theme.value.typography.headingFont, theme.value.typography.paragraphFont, theme.value.typography.nameFont]))
useHead({
  htmlAttrs: { lang },
  link: computed(() => (fontsHref.value ? [{ key: fontsHref.value, rel: 'stylesheet', href: fontsHref.value }] : [])),
})
</script>
