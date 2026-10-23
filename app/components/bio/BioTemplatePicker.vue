<template>
  <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
    <button
      v-for="template in PAGE_TEMPLATES"
      :key="template.id"
      type="button"
      class="group flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl text-left transition hover:-translate-y-0.5 hover:border-perlink-blue hover:shadow-md"
      @click="emit('select', template.id)"
    >
      <div class="flex h-20 items-center justify-center" :style="{ background: template.preview.bg }">
        <div class="flex size-11 items-center justify-center rounded-full text-white shadow" :style="{ background: template.preview.accent }">
          <UIcon :name="template.icon" class="size-5" />
        </div>
      </div>
      <div class="space-y-1 p-3">
        <p class="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-perlink-blue">{{ template.name }}</p>
        <p class="text-xs leading-snug text-gray-500 dark:text-neutral-400">{{ template.description }}</p>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { PAGE_TEMPLATES } from '~/data/pageTemplates'

const emit = defineEmits<{ select: [templateId: string] }>()
</script>
