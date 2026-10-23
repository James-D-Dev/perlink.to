<template>
  <div
    class="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors select-none"
    @click="$emit('toggle')"
  >
    <!-- Drag Handle -->
    <div v-if="!container" class="drag-handle cursor-move text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300">
      <UIcon name="i-lucide-grip-vertical" class="w-5 h-5" />
    </div>

    <!-- Icon (hidden on mobile) -->
    <div
      v-if="icon"
      class="hidden md:flex w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] items-center justify-center"
    >
      <slot name="icon">
        <UIcon :name="icon" class="w-4 h-4 text-gray-600 dark:text-neutral-300" />
      </slot>
    </div>

    <!-- Icon Image (for VietQR) -->
    <div
      v-else-if="iconImage"
      class="hidden md:flex h-8 rounded-lg bg-gray-100 dark:bg-white/[0.06] items-center justify-center px-2"
    >
      <slot name="icon-image">
        <img :src="iconImage" class="h-5" />
      </slot>
    </div>

    <!-- Title -->
    <span class="font-medium text-sm md:text-base text-gray-900 dark:text-white flex-1">
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
