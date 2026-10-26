<template>
  <div>
    <div class="mb-3 flex items-center justify-between gap-2">
      <p class="text-xs text-muted">{{ t('theme.presetActions.count', { n: THEME_PRESETS.length }) }}</p>
      <UButton size="xs" color="neutral" variant="outline" icon="i-lucide-shuffle" :label="t('theme.presetActions.random')" @click="pickRandom" />
    </div>

    <!-- Category chips scroll sideways on narrow screens; "Pro" gathers the premium looks -->
    <div class="-mx-1 mb-3 flex gap-1.5 overflow-x-auto scroll-fade-x px-1 pb-1 max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden">
      <button
        type="button"
        class="inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-xs font-semibold transition"
        :class="activeCategory === 'pro'
          ? 'border-transparent bg-gradient-to-r from-amber-400 to-pink-500 text-white'
          : 'border-amber-300 text-amber-700 hover:bg-amber-50'"
        @click="activeCategory = 'pro'"
      >
        <UIcon name="i-lucide-crown" class="size-3.5" />
        {{ t('theme.presetActions.pro') }}
      </button>
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
        class="relative overflow-hidden rounded-xl text-left ring-1 transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
        :class="selectedId === preset.id ? 'ring-2 ring-inverted' : 'ring-default hover:ring-accented dark:ring-white/10'"
        @click="selectPreset(preset)"
      >
        <!-- Preview: a tiny page with the preset's background, cards and name -->
        <div class="relative flex h-32 w-full flex-col items-center gap-1.5 overflow-hidden px-3 pt-3.5" :style="previewBgStyle(preset)">
          <div class="size-6 shrink-0" :style="{ background: avatarFill(preset), borderRadius: avatarRadius(preset) }" />
          <p class="max-w-full truncate text-[14px] leading-tight" :style="previewNameStyle(preset)">
            {{ presetName(preset) }}
          </p>
          <div class="mt-0.5 w-full space-y-1.5">
            <div v-for="i in 2" :key="i" class="flex h-4 items-center justify-center" :style="previewCardStyle(preset)">
              <div class="h-0.5 w-1/3 rounded-full" :style="{ backgroundColor: preset.theme.card?.textColor || preset.preview.text, opacity: 0.8 }" />
            </div>
          </div>
        </div>

        <!-- Label -->
        <div class="bg-white px-2 py-1.5 dark:bg-white/[0.04] dark:backdrop-blur-xl">
          <p class="truncate text-xs font-semibold text-gray-900 dark:text-white">{{ presetName(preset) }}</p>
          <p class="truncate text-[10px] text-gray-400 dark:text-neutral-500">{{ presetDescription(preset) }}</p>
        </div>

        <!-- Pro, top left -->
        <span
          v-if="preset.pro"
          class="absolute left-1.5 top-1.5 inline-flex items-center gap-0.5 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow"
        >
          <UIcon name="i-lucide-crown" class="size-2.5" />
          {{ t('theme.presetActions.pro') }}
        </span>

        <!-- Selected check -->
        <div
          v-if="selectedId === preset.id"
          class="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-inverted text-inverted"
        >
          <UIcon name="i-lucide-check" class="size-2.5" />
        </div>
      </button>
    </div>

    <!-- Pro themes are open to everyone for now; say so, and where Pro lives -->
    <div class="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-gradient-to-r from-amber-50 to-pink-50 px-3 py-2.5 text-xs text-amber-900 ring-1 ring-amber-200/70">
      <UIcon name="i-lucide-crown" class="size-4 shrink-0 text-amber-500" />
      <span class="min-w-0 flex-1">{{ t('theme.presetActions.proNote') }}</span>
      <NuxtLink to="/dashboard/upgrade" class="font-semibold underline-offset-2 hover:underline">{{ t('theme.presetActions.seePlans') }}</NuxtLink>
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
import { backgroundCss } from '~/utils/themeBackground'

const { t, te } = useI18n()

const props = defineProps<{
  selectedId?: string
}>()

const emit = defineEmits<{
  select: [preset: ThemePreset]
}>()

// Opens on the newest, most striking looks
const activeCategory = ref<ThemePresetCategory | 'pro'>('glass')

const presets = computed(() =>
  activeCategory.value === 'pro'
    ? THEME_PRESETS.filter(p => p.pro)
    : THEME_PRESETS_BY_CATEGORY.find(c => c.id === activeCategory.value)?.presets ?? [],
)

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

// Same background as the real page; the animated aurora shows as its mesh
function previewBgStyle(preset: ThemePreset) {
  const bg = preset.theme.background
  const still = bg.type === 'effect' && bg.gradient ? { ...bg, type: 'gradient' as const, gradient: { ...bg.gradient, style: 'mesh' as const } } : bg
  return backgroundCss(still, preset.preview.bg, preset.preview.text)
}

const avatarRadius = (preset: ThemePreset) =>
  preset.theme.avatar.shape === 'square' ? '2px' : preset.theme.avatar.shape === 'rounded' ? '6px' : '9999px'

const avatarFill = (preset: ThemePreset) => {
  const c = preset.theme.colors
  return preset.theme.header.textGradient ? `linear-gradient(135deg, ${c.primary}, ${c.secondary})` : c.secondary || preset.preview.text
}

function previewNameStyle(preset: ThemePreset) {
  const c = preset.theme.colors
  const base = { fontFamily: preset.theme.typography.nameFont, fontWeight: preset.theme.header.fontWeight, color: preset.preview.text }
  return preset.theme.header.textGradient
    ? { ...base, backgroundImage: `linear-gradient(100deg, ${c.primary}, ${c.secondary})`, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }
    : base
}

function previewCardStyle(preset: ThemePreset) {
  const card = preset.theme.card
  const accent = preset.theme.colors?.primary || preset.preview.card
  // Cards are drawn in their surface colour, or the accent when they have none
  const color = card?.backgroundColor || accent
  const edge = card?.outlineColor || card?.textColor || accent
  const style: Record<string, string> = { borderRadius: `${Math.min(card?.cornerRadius ?? 8, 8)}px` }
  switch (card?.style) {
    case 'outline':
      Object.assign(style, { backgroundColor: card.backgroundColor || 'transparent', border: `1px solid ${card.outlineColor || color}` })
      break
    case 'ghost':
      style.backgroundColor = `color-mix(in srgb, ${color} 8%, transparent)`
      break
    case 'soft':
      style.backgroundColor = `color-mix(in srgb, ${color} 30%, transparent)`
      break
    default:
      style.backgroundColor = color
  }
  if (card?.borderWidth) style.border = `${Math.min(card.borderWidth, 2)}px solid ${card.outlineColor || edge}`
  if (card?.backdropBlur && card.backdropBlur !== 'none') style.backdropFilter = 'blur(6px)'
  if (card?.shadow === 'hard') style.boxShadow = `2px 2px 0 0 ${edge}`
  if (card?.shadow === 'glow') style.boxShadow = `0 0 10px color-mix(in srgb, ${accent} 60%, transparent)`
  return style
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
