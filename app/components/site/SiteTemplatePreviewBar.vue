<template>
  <!-- On template preview pages: what this is, and the way to use it. A bar
       across the bottom of the screen, clear of the home indicator; pages
       leave room for it with <SiteTemplatePreviewSpacer /> -->
  <div class="fixed inset-x-0 bottom-0 z-[60] border-t border-black/[0.08] bg-white/85 pb-[env(safe-area-inset-bottom)] text-[#0c0b0a] shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl">
    <div class="mx-auto flex h-16 w-full max-w-3xl items-center gap-3 px-4">
      <div class="min-w-0 flex-1 leading-tight">
        <p class="text-[11px] font-medium uppercase tracking-wide text-black/50">{{ t('dashboard.home.previewTitle') }}</p>
        <!-- The page's heading: the template's name -->
        <h1 class="truncate text-sm font-semibold">{{ t(`dashboard.templates.${templateId}.name`) }}</h1>
      </div>
      <UButton :to="`/dashboard?template=${templateId}`" icon="i-lucide-sparkles" :label="t('dashboard.home.previewUse')" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ templateId: string }>()
const { t } = useI18n()
</script>
