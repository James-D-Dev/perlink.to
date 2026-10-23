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
import type { BioBlock, BioData } from '~/types/bio'
import type { PageTemplate } from '~/data/pageTemplates'

const props = withDefaults(defineProps<{
  template: PageTemplate
  scale?: number
}>(), {
  scale: 0.5,
})

// Fill empty sample fields so the preview shows what the page will look like
function forPreview(blocks: BioBlock[]): BioBlock[] {
  return blocks.map((block) => {
    switch (block.name) {
      case 'links':
        return { ...block, data: { items: block.data.items.map(i => ({ ...i, url: i.url || '#' })) } }
      case 'social':
        return { ...block, data: { links: block.data.links.map(l => ({ ...l, url: l.url || 'https://example.com' })) } }
      case 'contact':
        return { ...block, data: { ...block.data, address: block.data.address || '12 Riverside Street', phone: block.data.phone || '+84 90 123 4567' } }
      default:
        return block
    }
  })
}

const bioData = computed<BioData>(() => {
  const content = props.template.build()
  return {
    title: content.title,
    bio: content.bio,
    avatarUrl: '',
    templateId: 'modern',
    themeConfig: { ...content.themeConfig, showShare: false },
    blocks: forPreview(content.blocks),
  }
})
</script>
