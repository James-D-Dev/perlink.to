<template>
  <!-- A real, scaled-down render of the template page -->
  <div class="relative h-full w-full overflow-hidden" :style="{ background: template.preview.bg }">
    <div
      class="pointer-events-none absolute left-0 top-0 origin-top-left"
      :style="{ width: `${100 / scale}%`, transform: `scale(${scale})` }"
      aria-hidden="true"
      inert
    >
      <BioPageView :bio-data="bioData" :username="template.id" mode="thumbnail" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { stableBlockIds } from '~/data/templateKit'
import type { BioData } from '~/types/bio'
import { localizeTemplateContent } from '~/data/templateCopyVi'
import type { PageTemplate } from '~/data/pageTemplates'

// Blocks inside show sample content instead of asking the server
provide(TEMPLATE_PREVIEW_KEY, true)

const props = withDefaults(defineProps<{
  template: PageTemplate
  scale?: number
}>(), {
  scale: 0.5,
})

// Dashboard previews follow the dashboard language; marketing pages their URL
const route = useRoute()
const { locale } = useI18n()
const { lang: marketingLang } = useMarketingLang()
const lang = computed(() => (route.path.startsWith('/dashboard') ? locale.value : marketingLang.value))

/** Template photos swapped for their small versions (480 px), anywhere in a value */
function smallPhotos<T>(value: T): T {
  return JSON.parse(JSON.stringify(value).replace(/(\/images\/templates\/photos\/[a-z0-9-]+?)(-sm)?\.(webp|jpg)/g, '$1-sm.webp')) as T
}

const bioData = computed<BioData>(() => {
  const content = localizeTemplateContent(props.template.build(), lang.value)
  return {
    title: content.title,
    bio: content.bio,
    avatarUrl: smallPhotos(content.avatarUrl || ''),
    templateId: 'modern',
    themeConfig: smallPhotos({ ...content.themeConfig, showShare: false }),
    // Numbered ids, so the thumbnail renders the same on the server and in the
    // browser; the photos' small versions, as a thumbnail shows them small
    blocks: smallPhotos(stableBlockIds(content.blocks, props.template.id)),
  }
})
</script>
