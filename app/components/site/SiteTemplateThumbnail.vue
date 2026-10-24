<template>
  <!-- A real, scaled-down render of the template page -->
  <div class="relative h-full w-full overflow-hidden" :style="{ background: template.preview.bg }">
    <div
      class="pointer-events-none absolute left-0 top-0 origin-top-left"
      :style="{ width: `${100 / scale}%`, transform: `scale(${scale})` }"
      aria-hidden="true"
      inert
    >
      <BioPageView :bio-data="bioData" :username="template.id" mode="preview" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioData } from '~/types/bio'
import { localizeTemplateContent } from '~/data/templateCopyVi'
import type { PageTemplate } from '~/data/pageTemplates'

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

const bioData = computed<BioData>(() => {
  const content = localizeTemplateContent(props.template.build(), lang.value)
  return {
    title: content.title,
    bio: content.bio,
    avatarUrl: content.avatarUrl || '',
    templateId: 'modern',
    themeConfig: { ...content.themeConfig, showShare: false },
    blocks: content.blocks,
  }
})
</script>
