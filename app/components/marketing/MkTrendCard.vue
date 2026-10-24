<template>
  <article class="group">
    <div class="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand">
      <img
        v-if="trend.image"
        :src="trend.image"
        :alt="`${trend.title} 3D world`"
        loading="lazy"
        class="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      >
      <div v-else-if="template" class="absolute inset-x-6 top-6 bottom-0 overflow-hidden rounded-t-xl shadow-[0_8px_30px_rgba(12,11,10,0.08)] ring-1 ring-line transition-transform duration-500 group-hover:-translate-y-1">
        <SiteTemplateThumbnail :template="template" :scale="0.42" />
      </div>
      <span class="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-paper/90 px-2.5 py-1 text-xs font-medium text-ink backdrop-blur">
        <UIcon :name="trend.kind === '3d' ? 'i-lucide-box' : 'i-lucide-layout-template'" class="size-3.5" />
        {{ trend.kind === '3d' ? '3D world' : 'Site' }}
      </span>
    </div>
    <h3 class="mt-4 text-base font-medium text-ink">{{ trend.title }}</h3>
    <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ trend.description }}</p>
    <p class="mt-2 text-xs text-ink-faint">{{ trend.tags.join(' · ') }}</p>
  </article>
</template>

<script setup lang="ts">
import type { Trend } from '~/data/trends'
import { PAGE_TEMPLATES } from '~/data/pageTemplates'

const props = defineProps<{ trend: Trend }>()
const template = computed(() => (props.trend.template ? PAGE_TEMPLATES.find(t => t.id === props.trend.template) : undefined))
</script>
