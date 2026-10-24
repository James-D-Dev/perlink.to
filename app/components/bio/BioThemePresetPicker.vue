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
            type="button"
            class="relative overflow-hidden rounded-lg text-left ring-1 transition hover:-translate-y-px active:translate-y-0"
            :class="selectedId === preset.id ? 'ring-2 ring-inverted' : 'ring-default hover:ring-accented dark:ring-white/10'"
            @click="selectPreset(preset)"
          >
            <!-- Preview: a tiny page in the preset's colours -->
            <div
              class="flex h-24 w-full flex-col items-center gap-1 px-3 pt-2.5"
              :style="previewBgStyle(preset)"
            >
              <div class="size-5 shrink-0 rounded-full" :style="{ backgroundColor: preset.theme.colors?.secondary || preset.preview.text }" />
              <div class="h-1 w-10 rounded-full" :style="{ backgroundColor: preset.preview.text }" />
              <div class="mt-1 w-full space-y-1">
                <div v-for="i in 2" :key="i" class="flex h-3.5 items-center justify-center rounded" :style="previewCardStyle(preset)">
                  <div class="h-0.5 w-1/3 rounded-full" :style="{ backgroundColor: preset.theme.card?.textColor || preset.preview.text, opacity: 0.8 }" />
                </div>
              </div>
            </div>

            <!-- Label -->
            <div class="px-2 py-1.5 bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl">
              <p class="text-xs font-semibold text-gray-900 dark:text-white truncate">{{ preset.name }}</p>
              <p class="text-[10px] text-gray-400 dark:text-neutral-500 truncate">{{ presetDescription(preset) }}</p>
            </div>

            <!-- Selected check -->
            <div
              v-if="selectedId === preset.id"
              class="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-inverted text-inverted"
            >
              <UIcon name="i-lucide-check" class="size-2.5" />
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

const { t, te } = useI18n()

const props = defineProps<{
  selectedId?: string
}>()

const emit = defineEmits<{
  select: [preset: ThemePreset]
}>()

const activeCategory = ref<ThemePresetCategory>('classic')

const tabItems = computed(() =>
  THEME_PRESET_CATEGORIES.map(cat => ({ label: t(`theme.presetCategories.${cat.id}`), value: cat.id }))
)

function getPresets(category: ThemePresetCategory) {
  return THEME_PRESETS_BY_CATEGORY.find(c => c.id === category)?.presets ?? []
}

// Preset names stay as-is; descriptions are translated when a key exists
function presetDescription(preset: ThemePreset) {
  const key = `theme.presets.${preset.id}.description`
  return te(key) ? t(key) : preset.description
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

function previewCardStyle(preset: ThemePreset) {
  // Cards are drawn in the accent colour on the real page
  const color = preset.theme.card?.backgroundColor || preset.theme.colors?.primary || preset.preview.card
  switch (preset.theme.card?.style) {
    case 'outline':
      return { border: `1px solid ${color}` }
    case 'ghost':
      return { backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)` }
    case 'soft':
      return { backgroundColor: `color-mix(in srgb, ${color} 30%, transparent)` }
    default:
      return { backgroundColor: color }
  }
}

function selectPreset(preset: ThemePreset) {
  emit('select', preset)
}
</script>
