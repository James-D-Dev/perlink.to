<template>
  <div
    class="flex min-h-12 items-center gap-2 px-2.5 py-2 cursor-pointer hover:bg-elevated/60 dark:hover:bg-white/5 transition-colors select-none sm:gap-3 sm:px-3"
    @click="$emit('toggle')"
  >
    <!-- Drag Handle -->
    <div v-if="!container" class="drag-handle cursor-move text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300">
      <UIcon name="i-lucide-grip-vertical" class="size-4" />
    </div>

    <!-- The block's coloured icon, as in the "Add block" picker -->
    <div
      v-if="look"
      class="flex size-7 shrink-0 items-center justify-center rounded-lg"
      :class="look.tint"
    >
      <UIcon :name="look.icon" class="size-4" />
    </div>

    <!-- Icon (blocks without a catalog entry) -->
    <div
      v-else-if="icon"
      class="flex size-7 shrink-0 rounded-md bg-elevated dark:bg-white/[0.06] items-center justify-center"
    >
      <slot name="icon">
        <UIcon :name="icon" class="size-3.5 text-toned dark:text-neutral-300" />
      </slot>
    </div>

    <!-- Icon Image (for VietQR) -->
    <div
      v-else-if="iconImage"
      class="flex h-7 shrink-0 rounded-md bg-elevated dark:bg-white/[0.06] items-center justify-center px-1.5"
    >
      <slot name="icon-image">
        <img :src="iconImage" class="h-4" />
      </slot>
    </div>

    <!-- Title -->
    <span class="min-w-0 flex-1 truncate text-sm font-medium" :class="isHidden ? 'text-muted' : 'text-highlighted dark:text-white'">
      {{ title }}
    </span>

    <!-- Hidden blocks say so, instead of a greyed-out eye nobody notices -->
    <span v-if="isHidden" class="shrink-0 rounded-full bg-elevated px-2 py-0.5 text-[11px] font-medium text-muted dark:bg-white/10">
      {{ t('blocks.editor.hiddenBadge') }}
    </span>

    <!-- Badge/Count (optional) -->
    <slot name="badge" />

    <!-- Preview Items (optional, like social icons) -->
    <slot name="preview" />

    <!-- Expand/Collapse Button -->
    <UButton
      v-if="container"
      variant="ghost"
      color="neutral"
      size="xs"
      :icon="isActive ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
    />

    <template v-else>
      <!-- Show / hide stays one tap away -->
      <UTooltip :text="isHidden ? t('blocks.editor.menu.show') : t('blocks.editor.menu.hide')">
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          :icon="isHidden ? 'i-lucide-eye-off' : 'i-lucide-eye'"
          :aria-label="isHidden ? t('blocks.editor.menu.show') : t('blocks.editor.menu.hide')"
          @click.stop="onToggleHidden"
        />
      </UTooltip>

      <!-- Everything else lives in one menu so the row stays calm -->
      <UDropdownMenu v-if="item" :items="menuItems" :content="{ align: 'end' }" :ui="{ content: 'w-52' }">
        <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-ellipsis" :aria-label="t('blocks.editor.menu.more')" @click.stop />
      </UDropdownMenu>
      <slot v-else name="actions" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { BLOCK_ITEM_KEY } from '~/utils/blockItem'
import { isRepeatableBlock } from '~/utils/blocks'

const props = defineProps<{
  isActive: boolean;
  title: string;
  /** Block name: its icon and colour come from the block catalog */
  block?: string;
  icon?: string;
  iconImage?: string;
  hidden?: boolean;
  container?: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
  toggleHidden: [];
}>();

const { t } = useI18n()
const look = computed(() => (props.block ? blockLook(props.block) : null))

// Present when the header sits inside the block list of the editor
const item = inject(BLOCK_ITEM_KEY, null)

const isHidden = computed(() => item ? !!item.block.value.hidden : !!props.hidden)

function onToggleHidden() {
  if (item) item.toggleHidden()
  else emit('toggleHidden')
}

const menuItems = computed(() => {
  if (!item) return []
  const repeatable = isRepeatableBlock(item.block.value.name)
  return [
    [
      { label: t('blocks.editor.menu.up'), icon: 'i-lucide-arrow-up', disabled: !item.canMoveUp.value, onSelect: item.moveUp },
      { label: t('blocks.editor.menu.down'), icon: 'i-lucide-arrow-down', disabled: !item.canMoveDown.value, onSelect: item.moveDown },
    ],
    [
      ...(repeatable ? [{ label: t('blocks.editor.menu.duplicate'), icon: 'i-lucide-copy', onSelect: item.duplicate }] : []),
      { label: t('blocks.editor.menu.addBelow'), icon: 'i-lucide-plus', onSelect: item.addBelow },
    ],
    [
      { label: t('common.delete'), icon: 'i-lucide-trash-2', color: 'error' as const, onSelect: item.remove },
    ],
  ]
})
</script>
