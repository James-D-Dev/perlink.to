<template>
  <div>
    <UTabs
      :items="tabItems"
      default-value="neutral"
      color="neutral"
      variant="link"
      size="sm"
      :ui="{ list: 'mb-3' }"
    >
      <template #content="{ item }">
        <div class="grid grid-cols-2 gap-2">
          <button
            v-for="palette in getCategoryPalettes(item.value as string)"
            :key="palette.name"
            class="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all hover:border-primary-400"
            :class="isSelected(palette) ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-400' : 'border-gray-200 bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100'"
            @click="emit('select', palette)"
          >
            <div class="flex items-center justify-center">
              <span
                class="w-8 h-8 rounded-full border-2 border-white shadow-sm -mr-2 z-10"
                :style="{ backgroundColor: palette.primary }"
              />
              <span
                class="w-8 h-8 rounded-full border-2 border-white shadow-sm -mr-2 z-20"
                :style="{ backgroundColor: palette.secondary }"
              />
              <span
                class="w-8 h-8 rounded-full border-2 border-white shadow-sm z-30"
                :style="{ backgroundColor: palette.third }"
              />
            </div>
            <span class="text-xs text-center text-gray-600 dark:text-neutral-300 leading-tight">{{ palette.name }}</span>
          </button>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { colorPaletteCategories } from '~/data/colorPalettes'
import type { ColorPalette } from '~/data/colorPalettes'

const { t } = useI18n()

const props = defineProps<{
  primary: string
  secondary: string
  third: string
}>()

const emit = defineEmits<{
  select: [palette: ColorPalette]
}>()

const tabItems = computed(() =>
  colorPaletteCategories.map(cat => ({ label: t(`theme.colors.categories.${cat.value}`), value: cat.value }))
)

function getCategoryPalettes(value: string) {
  return colorPaletteCategories.find(c => c.value === value)?.palettes ?? []
}

function isSelected(palette: ColorPalette) {
  return (
    palette.primary === props.primary &&
    palette.secondary === props.secondary &&
    palette.third === props.third
  )
}
</script>
