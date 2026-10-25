<template>
  <div :id="`edit-${block.id}`" class="group/block relative scroll-mt-24">
    <slot />

    <!-- Insert a block right after this one (hover on desktop, the ⋯ menu elsewhere) -->
    <div class="pointer-events-none absolute -bottom-3 left-0 right-0 z-10 flex h-4 items-center justify-center opacity-0 transition-opacity [@media(hover:hover)]:group-hover/block:opacity-100">
      <button
        type="button"
        class="pointer-events-auto flex size-6 items-center justify-center rounded-full border border-default bg-default text-muted shadow-sm transition hover:border-inverted hover:text-highlighted dark:border-white/15"
        :aria-label="t('blocks.editor.menu.addBelow')"
        @click="actions.addBelow()"
      >
        <UIcon name="i-lucide-plus" class="size-3.5" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock } from '~/types/bio'
import { BLOCK_ITEM_KEY, type BlockItemActions } from '~/utils/blockItem'

// Wraps one block editor and hands its header the actions that need to know
// about neighbours: move, duplicate, insert below, delete
const props = defineProps<{
  block: BioBlock
  index: number
  count: number
}>()

const emit = defineEmits<{
  move: [direction: -1 | 1]
  duplicate: []
  remove: []
  toggleHidden: []
  addBelow: []
}>()

const { t } = useI18n()

const actions: BlockItemActions = {
  block: computed(() => props.block),
  canMoveUp: computed(() => props.index > 0),
  canMoveDown: computed(() => props.index < props.count - 1),
  moveUp: () => emit('move', -1),
  moveDown: () => emit('move', 1),
  duplicate: () => emit('duplicate'),
  remove: () => emit('remove'),
  toggleHidden: () => emit('toggleHidden'),
  addBelow: () => emit('addBelow'),
}

provide(BLOCK_ITEM_KEY, actions)
</script>
