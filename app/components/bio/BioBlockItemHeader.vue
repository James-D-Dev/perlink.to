<template>
  <div
    class="flex min-h-12 items-center gap-2 px-2.5 py-2 cursor-pointer hover:bg-elevated/60 dark:hover:bg-white/5 transition-colors select-none sm:gap-3 sm:px-3"
    @click="$emit('toggle')"
  >
    <!-- Drag Handle -->
    <div v-if="!container" class="drag-handle cursor-move text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300">
      <UIcon name="i-lucide-grip-vertical" class="size-4" />
    </div>

    <!-- Icon (hidden on mobile) -->
    <div
      v-if="icon"
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
    <span class="min-w-0 flex-1 truncate text-sm font-medium text-highlighted dark:text-white">
      {{ title }}
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

    <!-- Hidden Toggle Button -->
    <UButton
    v-if="!container"
      variant="ghost"
      color="neutral"
      size="xs"
      :icon="hidden ? 'i-lucide-eye-off' : 'i-lucide-eye'"
      @click.stop="$emit('toggleHidden')"
    />

    <!-- More Menu (optional) -->
    <slot name="actions" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isActive: boolean;
  title: string;
  icon?: string;
  iconImage?: string;
  hidden?: boolean;
  container?: boolean;
}>();

defineEmits<{
  toggle: [];
  toggleHidden: [];
}>();
</script>
