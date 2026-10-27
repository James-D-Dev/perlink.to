<template>
  <!-- Opens the template as a live page in a new tab, to look around before
       choosing. Stops the click so the card underneath doesn't pick it -->
  <a
    :href="`/templates/${templateId}`"
    target="_blank"
    rel="noopener"
    class="absolute right-2 top-2 z-10 inline-flex h-8 items-center gap-1.5 rounded-full bg-white/85 pl-2.5 pr-3 text-xs font-semibold text-[#0c0b0a] shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_4px_14px_-4px_rgb(0_0_0/0.3)] ring-1 ring-black/[0.06] backdrop-blur-xl transition hover:bg-white active:scale-[0.97]"
    @click.stop
    @keydown.stop
  >
    <UIcon name="i-lucide-eye" class="size-4" />
    {{ t('dashboard.home.previewTemplate') }}
  </a>
</template>

<script setup lang="ts">
defineProps<{ templateId: string }>()
const { t } = useI18n()
</script>
