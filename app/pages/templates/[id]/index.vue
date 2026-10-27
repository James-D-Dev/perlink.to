<template>
  <div class="min-h-dvh">
    <SiteTemplatePreviewBar :template-id="template.id" />

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
