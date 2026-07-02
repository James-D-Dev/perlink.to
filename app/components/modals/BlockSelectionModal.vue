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
            class="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent"
            :disabled="block.disabled || enabledBlocks.includes(block.id)"
            @click="selectBlock(block.id)"
          >
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center"
              :class="block.colorClass"
            >
              <UIcon :name="block.icon" class="w-6 h-6" />
            </div>
            <span class="font-medium text-sm text-gray-900">{{ block.label }}</span>
            <span
              v-if="enabledBlocks.includes(block.id)"
              class="text-xs text-gray-400"
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
    colorClass: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'links',
    label: 'Links',
    icon: 'i-lucide-link',
    colorClass: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'vietqr',
    label: 'VietQR',
    icon: 'i-lucide-qr-code',
    colorClass: 'bg-red-100 text-red-600'
  },
  {
    id: 'image-album',
    label: 'Image Album',
    icon: 'i-lucide-images',
    colorClass: 'bg-purple-100 text-purple-600'
  },
  {
    id: 'birthday-countdown',
    label: 'Birthday Countdown',
    icon: 'i-lucide-cake',
    colorClass: 'bg-pink-100 text-pink-600'
  },
  // more block
]

function selectBlock(blockId: string) {
  emit('select', blockId)
  emit('update:open', false)
}
</script>
