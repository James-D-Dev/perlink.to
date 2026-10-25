<template>
  <div>
    <div class="mb-3 flex items-center justify-between gap-2">
      <p class="text-xs text-muted">{{ t('theme.presetActions.count', { n: THEME_PRESETS.length }) }}</p>
      <UButton size="xs" color="neutral" variant="outline" icon="i-lucide-shuffle" :label="t('theme.presetActions.random')" @click="pickRandom" />
    </div>

    <!-- Category chips scroll sideways on narrow screens -->
    <div class="-mx-1 mb-3 flex gap-1.5 overflow-x-auto px-1 pb-1">
      <button
        v-for="cat in THEME_PRESET_CATEGORIES"
        :key="cat.id"
        type="button"
        class="shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition"
        :class="activeCategory === cat.id
          ? 'border-inverted bg-inverted text-inverted'
          : 'border-default text-muted hover:border-accented hover:text-highlighted dark:border-white/10'"
        @click="activeCategory = cat.id"
      >
        {{ t(`theme.presetCategories.${cat.id}`) }}
      </button>
    </div>

    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <button
        v-for="preset in presets"
        :key="preset.id"
        type="button"
        class="relative overflow-hidden rounded-lg text-left ring-1 transition hover:-translate-y-px active:translate-y-0"
        :class="selectedId === preset.id ? 'ring-2 ring-inverted' : 'ring-default hover:ring-accented dark:ring-white/10'"
        @click="selectPreset(preset)"
      >
        <!-- Preview: a tiny page in the preset's colours and name font -->
        <div class="flex h-28 w-full flex-col items-center gap-1 px-3 pt-3" :style="previewBgStyle(preset)">
          <div class="size-5 shrink-0" :style="{ backgroundColor: preset.theme.colors?.secondary || preset.preview.text, borderRadius: avatarRadius(preset) }" />
          <p
            class="max-w-full truncate text-[13px] leading-tight"
            :style="{ fontFamily: preset.theme.typography.nameFont, fontWeight: preset.theme.header.fontWeight, color: preset.preview.text }"
          >
            {{ presetName(preset) }}
          </p>
          <div class="mt-0.5 w-full space-y-1">
            <div v-for="i in 2" :key="i" class="flex h-3.5 items-center justify-center" :style="previewCardStyle(preset)">
              <div class="h-0.5 w-1/3 rounded-full" :style="{ backgroundColor: preset.theme.card?.textColor || preset.preview.text, opacity: 0.8 }" />
            </div>
          </div>
        </div>

        <!-- Label -->
        <div class="bg-white px-2 py-1.5 dark:bg-white/[0.04] dark:backdrop-blur-xl">
          <p class="truncate text-xs font-semibold text-gray-900 dark:text-white">{{ presetName(preset) }}</p>
          <p class="truncate text-[10px] text-gray-400 dark:text-neutral-500">{{ presetDescription(preset) }}</p>
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
  </div>
</template>

<script setup lang="ts">
import {
  THEME_PRESETS,
  THEME_PRESET_CATEGORIES,
  THEME_PRESETS_BY_CATEGORY,
  type ThemePreset,
  type ThemePresetCategory,
} from '~/data/themePresets'
import { googleFontsUrlFor } from '~/composables/useGoogleFonts'

const { t, te } = useI18n()

const props = defineProps<{
  selectedId?: string
}>()

const emit = defineEmits<{
  select: [preset: ThemePreset]
}>()

const activeCategory = ref<ThemePresetCategory>('minimal')

const presets = computed(() => THEME_PRESETS_BY_CATEGORY.find(c => c.id === activeCategory.value)?.presets ?? [])

// The cards show each preset's own name font
useHead({
  link: computed(() => {
    const href = googleFontsUrlFor(presets.value.map(p => p.theme.typography.nameFont))
    return href ? [{ key: href, rel: 'stylesheet', href }] : []
  }),
})

function presetName(preset: ThemePreset) {
  const key = `theme.presets.${preset.id}.name`
  return te(key) ? t(key) : preset.name
}

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

const avatarRadius = (preset: ThemePreset) =>
  preset.theme.avatar.shape === 'square' ? '2px' : preset.theme.avatar.shape === 'rounded' ? '5px' : '9999px'

function previewCardStyle(preset: ThemePreset) {
  const card = preset.theme.card
  // Cards are drawn in their surface colour, or the accent when they have none
  const color = card?.backgroundColor || preset.theme.colors?.primary || preset.preview.card
  const radius = { borderRadius: `${Math.min(card?.cornerRadius ?? 8, 7)}px` }
  const border = card?.outlineColor ? { border: `1px solid ${card.outlineColor}` } : {}
  switch (card?.style) {
    case 'outline':
      return { ...radius, backgroundColor: card.backgroundColor, border: `1px solid ${card.outlineColor || color}` }
    case 'ghost':
      return { ...radius, backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)` }
    case 'soft':
      return { ...radius, backgroundColor: `color-mix(in srgb, ${color} 30%, transparent)` }
    default:
      return { ...radius, ...border, backgroundColor: color }
  }
}

function selectPreset(preset: ThemePreset) {
  emit('select', preset)
}

function pickRandom() {
  const others = THEME_PRESETS.filter(p => p.id !== props.selectedId)
  const preset = others[Math.floor(Math.random() * others.length)]!
  activeCategory.value = preset.category
  emit('select', preset)
}
</script>
