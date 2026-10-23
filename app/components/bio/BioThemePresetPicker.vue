<template>
  <div>
    <UTabs
      :items="tabItems"
      :model-value="activeCategory"
      color="neutral"
      variant="link"
      size="sm"
      :ui="{ list: 'mb-3' }"
      @update:model-value="activeCategory = $event as ThemePresetCategory"
    >
      <template #content="{ item }">
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="preset in getPresets(item.value as ThemePresetCategory)"
            :key="preset.id"
            class="relative rounded-xl overflow-hidden border-2 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
            :class="selectedId === preset.id ? 'border-perlink-cyan ring-2 ring-cyan-200' : 'border-transparent'"
            @click="selectPreset(preset)"
          >
            <!-- Preview swatch -->
            <div
              class="h-16 w-full flex flex-col items-center justify-center gap-1 px-2"
              :style="previewBgStyle(preset)"
            >
              <!-- Fake avatar -->
              <div
                class="w-6 h-6 rounded-full"
                :style="{ backgroundColor: preset.preview.card, border: `2px solid ${preset.preview.text}40` }"
              />
              <!-- Fake card bars -->
              <div class="w-full space-y-1 px-1">
                <div
                  class="h-2 rounded w-full opacity-70"
                  :style="{ backgroundColor: preset.preview.card }"
                />
                <div
                  class="h-2 rounded w-full opacity-50"
                  :style="{ backgroundColor: preset.preview.card }"
                />
              </div>
            </div>

            <!-- Label -->
            <div class="px-2 py-1.5 bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl">
              <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ preset.name }}</p>
              <p class="text-[10px] text-gray-400 dark:text-neutral-500 truncate">{{ preset.description }}</p>
            </div>

            <!-- Selected check -->
            <div
              v-if="selectedId === preset.id"
              class="absolute top-1.5 right-1.5 w-4 h-4 bg-cyan-500 rounded-full flex items-center justify-center"
            >
              <UIcon name="i-lucide-check" class="w-2.5 h-2.5 text-white" />
            </div>
          </button>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import type { ThemeConfig } from '~/types/bio'
import {
  THEME_PRESET_CATEGORIES,
  THEME_PRESETS_BY_CATEGORY,
  type ThemePreset,
  type ThemePresetCategory,
} from '~/data/themePresets'

const props = defineProps<{
  selectedId?: string
}>()

const emit = defineEmits<{
  select: [preset: ThemePreset]
}>()

const activeCategory = ref<ThemePresetCategory>('classic')

const tabItems = computed(() =>
  THEME_PRESET_CATEGORIES.map(cat => ({ label: cat.label, value: cat.id }))
)

function getPresets(category: ThemePresetCategory) {
  return THEME_PRESETS_BY_CATEGORY.find(c => c.id === category)?.presets ?? []
}

function previewBgStyle(preset: ThemePreset) {
  const bg = preset.theme.background
  if (bg.type === 'gradient' && bg.gradient) {
    const { angle = 135, from = '#888', via, to = '#444' } = bg.gradient
    const stops = via ? `${from}, ${via}, ${to}` : `${from}, ${to}`
    return { background: `linear-gradient(${angle}deg, ${stops})` }
  }
  return { backgroundColor: preset.preview.bg }
}

function selectPreset(preset: ThemePreset) {
  emit('select', preset)
}
</script>
