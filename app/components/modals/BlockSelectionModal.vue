<template>
  <UModal
    :open="open"
    title="Add a block"
    description="Blocks are the sections of your page. You can reorder them later."
    :ui="{ content: 'sm:max-w-2xl', body: 'p-0 sm:p-0' }"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <div class="max-h-[70vh] space-y-5 overflow-y-auto p-4 sm:p-5">
        <section v-for="group in groups" :key="group.label">
          <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ group.label }}</h3>
          <div class="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              v-for="block in group.blocks"
              :key="block.id"
              type="button"
              class="group flex items-start gap-3 rounded-lg border border-default p-3 text-left transition hover:border-inverted/40 hover:bg-elevated/60 disabled:cursor-default disabled:opacity-60 disabled:hover:border-default disabled:hover:bg-transparent dark:border-white/10"
              :disabled="isAdded(block.id)"
              @click="selectBlock(block.id)"
            >
              <span class="flex size-9 shrink-0 items-center justify-center rounded-md bg-elevated text-highlighted dark:bg-white/[0.06]">
                <UIcon :name="block.icon" class="size-4" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-2">
                  <span class="text-sm font-medium text-highlighted dark:text-white">{{ block.label }}</span>
                  <span v-if="isAdded(block.id)" class="inline-flex items-center gap-0.5 text-[11px] font-medium text-muted">
                    <UIcon name="i-lucide-check" class="size-3" />
                    Added
                  </span>
                </span>
                <span class="mt-0.5 block text-xs leading-snug text-muted">{{ block.description }}</span>
              </span>
              <UIcon
                v-if="!isAdded(block.id)"
                name="i-lucide-plus"
                class="mt-2.5 size-4 shrink-0 text-dimmed transition group-hover:text-highlighted"
              />
            </button>
          </div>
        </section>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface BlockOption {
  id: string
  label: string
  description: string
  icon: string
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

// Each block can appear once per page
const groups: { label: string; blocks: BlockOption[] }[] = [
  {
    label: 'Content',
    blocks: [
      { id: 'links', label: 'Links', description: 'Buttons to your website, shop, videos or anything else.', icon: 'i-lucide-link' },
      { id: 'social', label: 'Social icons', description: 'A row of icons for Instagram, TikTok, Zalo and more.', icon: 'i-lucide-at-sign' },
      { id: 'text', label: 'Text', description: 'An about section or any paragraph with a title.', icon: 'i-lucide-text' },
      { id: 'image-album', label: 'Gallery', description: 'Up to 6 photos as a grid, masonry, stack or carousel.', icon: 'i-lucide-images' },
    ],
  },
  {
    label: 'Business',
    blocks: [
      { id: 'menu', label: 'Menu / price list', description: 'Dishes, rooms or services with prices.', icon: 'i-lucide-utensils' },
      { id: 'hours', label: 'Opening hours', description: 'Your week, with a live "Open now" badge.', icon: 'i-lucide-clock' },
      { id: 'contact', label: 'Contact & booking', description: 'Address, phone, email and a booking button.', icon: 'i-lucide-map-pin' },
    ],
  },
  {
    label: 'Extras',
    blocks: [
      { id: 'vietqr', label: 'VietQR', description: 'A bank QR code so people can pay or tip you.', icon: 'i-lucide-qr-code' },
      { id: 'birthday-countdown', label: 'Birthday countdown', description: 'Days until your next birthday.', icon: 'i-lucide-cake' },
    ],
  },
]

function isAdded(blockId: string) {
  return props.enabledBlocks.includes(blockId)
}

function selectBlock(blockId: string) {
  emit('select', blockId)
  emit('update:open', false)
}
</script>
