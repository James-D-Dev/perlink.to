<template>
  <div class="min-h-dvh">
    <!-- What this is, and the way to use it -->
    <div class="fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
      <div class="flex w-full max-w-xl items-center gap-3 rounded-full bg-white/80 py-1.5 pl-4 pr-1.5 text-[#0c0b0a] shadow-[inset_0_1px_0_rgb(255_255_255/0.85),0_10px_30px_-8px_rgb(0_0_0/0.3)] ring-1 ring-black/[0.06] backdrop-blur-xl">
        <div class="min-w-0 flex-1 leading-tight">
          <p class="text-[11px] font-medium uppercase tracking-wide text-black/50">{{ t('dashboard.home.previewTitle') }}</p>
          <p class="truncate text-sm font-semibold">{{ name }}</p>
        </div>
        <UButton :to="`/dashboard?template=${template.id}`" icon="i-lucide-sparkles" :label="t('dashboard.home.previewUse')" />
      </div>
    </div>

    <BioPageView :bio-data="bioData" :username="template.id" mode="template" />
  </div>
</template>

<script setup lang="ts">
import type { BioData } from '~/types/bio'
import { PAGE_TEMPLATES } from '~/data/pageTemplates'
import { localizeTemplateContent } from '~/data/templateCopyVi'

// A template as a full live page, opened from the template pickers so people
// can look around before choosing. Blocks show their sample content.
definePageMeta({ layout: 'blank', colorMode: 'light' })
provide(TEMPLATE_PREVIEW_KEY, true)

const route = useRoute()
const { t, locale } = useI18n()

const template = PAGE_TEMPLATES.find(item => item.id === route.params.id)
if (!template) throw createError({ statusCode: 404, statusMessage: 'Template not found', fatal: true })

const name = computed(() => t(`dashboard.templates.${template.id}.name`))

const bioData = computed<BioData>(() => {
  const content = localizeTemplateContent(template.build(), locale.value)
  return {
    title: content.title,
    bio: content.bio,
    avatarUrl: content.avatarUrl || '',
    templateId: 'modern',
    themeConfig: { ...content.themeConfig, showShare: false, roomButton: false },
    blocks: content.blocks,
  }
})

useSeoMeta({ title: () => `${name.value} · ${t('dashboard.home.previewTitle')}`, robots: 'noindex' })
</script>
