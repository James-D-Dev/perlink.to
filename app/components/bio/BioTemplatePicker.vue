<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    <button
      v-for="template in PAGE_TEMPLATES"
      :key="template.id"
      type="button"
      class="group flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl text-left transition hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-md"
      @click="emit('select', template.id)"
    >
      <div class="h-40 border-b border-gray-200 dark:border-white/10">
        <SiteTemplateThumbnail :template="template" :scale="0.36" />
      </div>
      <div class="space-y-1 p-3">
        <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ template.name }}</p>
        <p class="text-xs leading-snug text-gray-500 dark:text-neutral-400">{{ template.description }}</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PAGE_TEMPLATES } from '~/data/pageTemplates'

const emit = defineEmits<{ select: [templateId: string] }>()
</script>
