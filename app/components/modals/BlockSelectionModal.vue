<template>
  <UModal
    :open="open"
    title="Add Block"
    :close="{ color: 'neutral', variant: 'ghost' }"
    @update:open="$emit('update:open', $event)"
  >
    <template #content>
      <div class="p-4">
        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="block in availableBlocks"
            :key="block.id"
            class="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-white/10 hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent"
            :disabled="block.disabled || enabledBlocks.includes(block.id)"
            @click="selectBlock(block.id)"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :class="block.colorClass"
            >
              <UIcon :name="block.icon" class="w-6 h-6" />
            </div>
            <span class="font-medium text-sm text-gray-900 dark:text-white">{{ block.label }}</span>
            <span
              v-if="enabledBlocks.includes(block.id)"
              class="text-xs text-gray-400 dark:text-neutral-500"
            >
              Already added
            </span>
          </button>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface BlockOption {
  id: string
  label: string
  icon: string
  colorClass: string
  disabled?: boolean
}

const props = withDefaults(defineProps<{
  open: boolean
  enabledBlocks?: string[]
}>(), {
  enabledBlocks: () => []
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  select: [blockId: string]
}>()

const availableBlocks: BlockOption[] = [
  {
    id: 'social',
    label: 'Social Links',
    icon: 'i-lucide-link',
    colorClass: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400'
  },
  {
    id: 'links',
    label: 'Links',
    icon: 'i-lucide-link',
    colorClass: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400'
  },
  {
    id: 'text',
    label: 'Text',
    icon: 'i-lucide-text',
    colorClass: 'bg-stone-100 dark:bg-stone-500/15 text-stone-700 dark:text-stone-300'
  },
  {
    id: 'vietqr',
    label: 'VietQR',
    icon: 'i-lucide-qr-code',
    colorClass: 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400'
  },
  {
    id: 'image-album',
    label: 'Image Album',
    icon: 'i-lucide-images',
    colorClass: 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400'
  },
  {
    id: 'birthday-countdown',
    label: 'Birthday Countdown',
    icon: 'i-lucide-cake',
    colorClass: 'bg-pink-100 dark:bg-pink-500/15 text-pink-600 dark:text-pink-400'
  },
  {
    id: 'menu',
    label: 'Menu / Price list',
    icon: 'i-lucide-utensils',
    colorClass: 'bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400'
  },
  {
    id: 'hours',
    label: 'Opening Hours',
    icon: 'i-lucide-clock',
    colorClass: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
  },
  {
    id: 'contact',
    label: 'Contact & Booking',
    icon: 'i-lucide-map-pin',
    colorClass: 'bg-sky-100 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400'
  },
  // more block
]

function selectBlock(blockId: string) {
  emit('select', blockId)
  emit('update:open', false)
}
</script>
