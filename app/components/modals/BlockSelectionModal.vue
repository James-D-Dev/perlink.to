<template>
  <UModal
    :open="open"
    :title="t('blocks.picker.title')"
    :description="t('blocks.picker.description')"
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
                    {{ t('blocks.picker.added') }}
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

const { t } = useI18n()

// Each block can appear once per page
const groupDefs: { key: string; blocks: { id: string; key: string; icon: string }[] }[] = [
  {
    key: 'content',
    blocks: [
      { id: 'links', key: 'links', icon: 'i-lucide-link' },
      { id: 'social', key: 'social', icon: 'i-lucide-at-sign' },
      { id: 'text', key: 'text', icon: 'i-lucide-text' },
      { id: 'image-album', key: 'imageAlbum', icon: 'i-lucide-images' },
      { id: 'video', key: 'video', icon: 'i-lucide-clapperboard' },
    ],
  },
  {
    key: 'business',
    blocks: [
      { id: 'menu', key: 'menu', icon: 'i-lucide-utensils' },
      { id: 'hours', key: 'hours', icon: 'i-lucide-clock' },
      { id: 'contact', key: 'contact', icon: 'i-lucide-map-pin' },
      { id: 'form', key: 'form', icon: 'i-lucide-calendar-check' },
      { id: 'testimonials', key: 'testimonials', icon: 'i-lucide-quote' },
    ],
  },
  {
    key: 'extras',
    blocks: [
      { id: 'vietqr', key: 'vietqr', icon: 'i-lucide-qr-code' },
      { id: 'birthday-countdown', key: 'birthdayCountdown', icon: 'i-lucide-cake' },
    ],
  },
]

const groups = computed<{ label: string; blocks: BlockOption[] }[]>(() =>
  groupDefs.map(group => ({
    label: t(`blocks.picker.groups.${group.key}`),
    blocks: group.blocks.map(block => ({
      id: block.id,
      icon: block.icon,
      label: t(`blocks.picker.items.${block.key}.label`),
      description: t(`blocks.picker.items.${block.key}.description`),
    })),
  })),
)

// Repeatable blocks (links, text, gallery, menu) can always be added again
function isAdded(blockId: string) {
  return !isRepeatableBlock(blockId) && props.enabledBlocks.includes(blockId)
}

function selectBlock(blockId: string) {
  emit('select', blockId)
  emit('update:open', false)
}
</script>
