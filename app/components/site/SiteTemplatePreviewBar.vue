<template>
  <!-- On template preview pages: what this is, and the way to use it -->
  <div class="fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
    <div class="flex w-full max-w-xl items-center gap-3 rounded-full bg-white/80 py-1.5 pl-4 pr-1.5 text-[#0c0b0a] shadow-[inset_0_1px_0_rgb(255_255_255/0.85),0_10px_30px_-8px_rgb(0_0_0/0.3)] ring-1 ring-black/[0.06] backdrop-blur-xl">
      <div class="min-w-0 flex-1 leading-tight">
        <p class="text-[11px] font-medium uppercase tracking-wide text-black/50">{{ t('dashboard.home.previewTitle') }}</p>
        <p class="truncate text-sm font-semibold">{{ t(`dashboard.templates.${templateId}.name`) }}</p>
      </div>
      <UButton :to="`/dashboard?template=${templateId}`" icon="i-lucide-sparkles" :label="t('dashboard.home.previewUse')" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ templateId: string }>()
const { t } = useI18n()
</script>
