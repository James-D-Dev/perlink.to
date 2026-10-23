<template>
  <div>
    <UTabs
      :items="tabItems"
      default-value="solid"
      color="neutral"
      variant="link"
      size="sm"
      :ui="{ list: 'mb-3' }"
    >
      <template #content="{ item }">
        <div class="space-y-3">
          <!-- Solid -->
          <template v-if="item.value === 'solid'">
          
            <div class="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-white/5">
              <label class="text-xs text-gray-500 dark:text-neutral-400 shrink-0">Custom</label>
              <UPopover>
                <UButton size="md" color="neutral" variant="outline" class="p-0 rounded-full overflow-hidden shrink-0">
                  <span
                    class="size-6 rounded-full border-2 border-gray-300 dark:border-white/15"
                    :style="{ backgroundColor: background.color || '#ffffff' }"
                  />
                </UButton>
                <template #content>
                  <UColorPicker
                    :model-value="background.color || '#ffffff'"
                    class="p-2"
                    @update:model-value="emit('select', { type: 'solid', color: $event })"
                  />
                </template>
              </UPopover>
              <UInput
                :model-value="background.color"
                size="xs"
                class="flex-1 font-mono"
                @update:model-value="emit('select', { type: 'solid', color: $event as string })"
              />
            </div>
          </template>

          <!-- Gradient -->
          <template v-else-if="item.value === 'gradient'">
            <div class="grid grid-cols-4 md:grid-cols-5 gap-1">
              <button
                v-for="preset in getPresets('gradient')"
                :key="preset.id"
                class="flex flex-col items-center gap-1"
                @click="emit('select', preset.value)"
              >
                <span
                  class="w-full aspect-9/16 rounded-lg border-2 transition-all block"
                  :class="isSelected(preset) ? 'border-primary-500 scale-105 shadow-md' : 'border-gray-200 dark:border-white/10 hover:border-gray-400'"
                  :style="{ background: preset.preview }"
                />
              </button>
            </div>
            <div class="border-t border-gray-100 dark:border-white/5 pt-2 space-y-2">
              <label class="text-xs text-gray-500 dark:text-neutral-400 block">Custom gradient</label>
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="text-[10px] text-gray-400 dark:text-neutral-500 mb-1 block">From</label>
                  <input
                    :value="background.gradient?.from"
                    type="color"
                    class="w-full h-8 rounded cursor-pointer border border-gray-200 dark:border-white/10"
                    @input="emitGradient('from', ($event.target as HTMLInputElement).value)"
                  />
                </div>
                <div>
                  <label class="text-[10px] text-gray-400 dark:text-neutral-500 mb-1 block">Via</label>
                  <input
                    :value="background.gradient?.via || '#FFFFFF'"
                    type="color"
                    class="w-full h-8 rounded cursor-pointer border border-gray-200 dark:border-white/10"
                    @input="emitGradient('via', ($event.target as HTMLInputElement).value)"
                  />
                </div>
                <div>
                  <label class="text-[10px] text-gray-400 dark:text-neutral-500 mb-1 block">To</label>
                  <input
                    :value="background.gradient?.to"
                    type="color"
                    class="w-full h-8 rounded cursor-pointer border border-gray-200 dark:border-white/10"
                    @input="emitGradient('to', ($event.target as HTMLInputElement).value)"
                  />
                </div>
              </div>
            </div>
          </template>

          <!-- Image -->
          <template v-else-if="item.value === 'image'">
            <div class="grid grid-cols-4 md:grid-cols-5 gap-1">
              <button
                v-for="preset in getPresets('image').filter(p => p.preview)"
                :key="preset.id"
                class="flex flex-col items-center gap-1"
                @click="emit('select', preset.value)"
              >
                <span
                  class="w-full aspect-9/16 rounded-lg border-2 overflow-hidden transition-all block"
                  :class="isSelected(preset) ? 'border-primary-500 scale-105 shadow-md' : 'border-gray-200 dark:border-white/10 hover:border-gray-400'"
                >
                  <img :src="preset.preview" :alt="preset.name" class="w-full h-full object-cover" />
                </span>
              </button>
            </div>
            <div class="border-t border-gray-100 dark:border-white/5 pt-2">
              <label class="text-xs text-gray-500 dark:text-neutral-400 mb-1 block">Custom image URL</label>
              <UInput
                :model-value="background.imageUrl"
                size="sm"
                placeholder="https://..."
                @update:model-value="emit('select', { type: 'image', imageUrl: $event as string })"
              />
            </div>
          </template>

          <!-- Video -->
          <template v-else-if="item.value === 'video'">
            <div>
              <label class="text-xs text-gray-500 dark:text-neutral-400 mb-1 block">Video URL (mp4, webm)</label>
              <UInput
                :model-value="background.videoUrl"
                size="sm"
                placeholder="https://..."
                @update:model-value="emit('select', { type: 'video', videoUrl: $event as string })"
              />
            </div>
          </template>

          <!-- Effect -->
          <template v-else-if="item.value === 'effect'">
            <div class="grid grid-cols-4 md:grid-cols-5 gap-1">
              <button
                v-for="preset in getPresets('effect')"
                :key="preset.id"
                class="flex flex-col items-center gap-1"
                @click="emit('select', preset.value)"
              >
                <span
                  class="w-full aspect-9/16 rounded-lg border-2 overflow-hidden transition-all relative block"
                  :class="[
                    isSelected(preset) ? 'border-primary-500 scale-105 shadow-md' : 'border-gray-200 dark:border-white/10 hover:border-gray-400',
                    effectBgClass(preset.value.effectId)
                  ]"
                >
                  <component
                    :is="effectComponent(preset.value.effectId)"
                    class="absolute inset-0 w-full h-full pointer-events-none"
                  />
                  <span class="absolute inset-0 flex items-end justify-center pb-1">
                    <span class="text-[9px] font-medium px-1 rounded bg-black/40 text-white leading-tight">{{ preset.name }}</span>
                  </span>
                </span>
              </button>
            </div>
          </template>
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { backgroundCategories } from '~/data/backgroundPresets'
import type { ThemeBackground } from '~/types/bio'
import { getEffectBgClass } from '~/utils/effectUtils'

const effectComponents: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  'particles': defineAsyncComponent(() => import('~/components/background-effects/ParticlesBg.vue')),
  'falling-stars': defineAsyncComponent(() => import('~/components/background-effects/FallingStarsBg.vue')),
  'stars': defineAsyncComponent(() => import('~/components/background-effects/StarsBackground.vue')),
  'snow': defineAsyncComponent(() => import('~/components/background-effects/SnowfallBg.vue')),
  'rose': defineAsyncComponent(() => import('~/components/background-effects/RosefallBg.vue')),
  'flickering-grid': defineAsyncComponent(() => import('~/components/background-effects/FlickeringGrid.vue')),
  'interactive-grid': defineAsyncComponent(() => import('~/components/background-effects/InteractiveGridPattern.vue')),
  'neural': defineAsyncComponent(() => import('~/components/background-effects/NeuralBg.vue')),
  'black-hole': defineAsyncComponent(() => import('~/components/background-effects/BlackHoleBackground.vue')),
  'thunderstorm': defineAsyncComponent(() => import('~/components/background-effects/ThunderstormBackground.vue')),
}

const props = defineProps<{
  background: ThemeBackground
}>()

const emit = defineEmits<{
  select: [value: ThemeBackground]
}>()

const tabItems = computed(() =>
  backgroundCategories.map(cat => ({ label: cat.label, value: cat.value }))
)

function getPresets(type: string) {
  return backgroundCategories.find(c => c.value === type)?.presets ?? []
}

function isSelected(preset: { value: ThemeBackground }) {
  const bg = props.background
  if (bg.type !== preset.value.type) return false
  if (bg.type === 'solid') return bg.color === preset.value.color
  if (bg.type === 'gradient') return bg.gradient?.from === preset.value.gradient?.from && bg.gradient?.to === preset.value.gradient?.to
  if (bg.type === 'image') return bg.imageUrl === preset.value.imageUrl
  if (bg.type === 'effect') return bg.effectId === preset.value.effectId
  return false
}

function emitGradient(key: 'from' | 'via' | 'to', value: string) {
  emit('select', {
    type: 'gradient',
    gradient: { ...props.background.gradient, [key]: value },
  })
}

function effectComponent(effectId?: string) {
  return effectId ? effectComponents[effectId] : null
}

function effectBgClass(effectId?: string) {
  return getEffectBgClass(effectId)
}
</script>
