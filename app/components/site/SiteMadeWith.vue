<template>
  <!-- "Made with Perlink" on live sites (see showsBranding): every
       visitor is a chance to make their own. Absolute link, so it also works
       on custom domains; tagged so these visits can be counted -->
  <a
    v-if="variant === 'card'"
    :href="href"
    target="_blank"
    rel="noopener"
    class="group flex w-full max-w-sm items-center gap-3 rounded-2xl bg-white/90 p-3 pr-4 text-left text-[#0c0b0a] shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
  >
    <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#fff7ed] ring-1 ring-black/5">
      <AppLogo variant="mark" :size="24" />
    </span>
    <span class="min-w-0 flex-1">
      <span class="flex items-center gap-[0.3em] text-sm font-semibold" :aria-label="siteT(lang, 'madeWith')">
        <span v-if="before">{{ before }}</span>
        <AppLogo :size="20" class="translate-y-[0.5px]" />
        <span v-if="after">{{ after }}</span>
      </span>
      <span class="mt-0.5 block text-xs leading-snug text-black/55">{{ siteT(lang, 'madeWithCta') }}</span>
    </span>
    <UIcon name="i-lucide-arrow-up-right" class="size-4 shrink-0 text-black/40 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black/70" />
  </a>

  <a
    v-else
    :href="href"
    target="_blank"
    rel="noopener"
    :title="siteT(lang, 'madeWithCta')"
    :aria-label="siteT(lang, 'madeWith')"
    class="group pointer-events-auto inline-flex h-9 items-center gap-1.5 rounded-full bg-black/35 pl-3.5 pr-3 text-xs font-medium text-white shadow-lg ring-1 ring-white/15 backdrop-blur-xl transition hover:bg-black/50"
  >
    <span v-if="before">{{ before }}</span>
    <AppLogo :size="17" inverted class="translate-y-[0.5px]" />
    <span v-if="after">{{ after }}</span>
    <UIcon name="i-lucide-arrow-up-right" class="size-3.5 text-white/60 transition group-hover:text-white" />
  </a>
</template>

<script setup lang="ts">
import { siteT, type SiteLanguage } from '~/utils/siteI18n'

const props = withDefaults(defineProps<{
  username: string
  lang?: SiteLanguage
  /** card: under a 2D page; pill: over the 3D room */
  variant?: 'card' | 'pill'
}>(), {
  lang: 'en',
  variant: 'card',
})

// The brand name in the sentence is drawn as the logo
const parts = computed(() => siteT(props.lang, 'madeWith').split('Perlink'))
const before = computed(() => parts.value[0]?.trim() ?? '')
const after = computed(() => parts.value.slice(1).join('Perlink').trim())

const href = computed(() => `https://perlink.to/?utm_source=site&utm_medium=${props.variant === 'pill' ? 'room-badge' : 'badge'}&utm_campaign=${encodeURIComponent(props.username)}`)
</script>
