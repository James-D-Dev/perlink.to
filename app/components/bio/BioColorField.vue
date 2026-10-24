<template>
  <div class="flex items-center gap-2">
    <UPopover>
      <UButton size="md" color="neutral" variant="outline" class="p-0 rounded-full overflow-hidden shrink-0" :aria-label="label">
        <span
          class="size-8 rounded-full border-2 border-gray-300 dark:border-white/15"
          :style="{ backgroundColor: modelValue || fallback }"
        />
      </UButton>
      <template #content>
        <UColorPicker :model-value="modelValue || fallback" class="p-2" @update:model-value="$emit('update:modelValue', $event)" />
      </template>
    </UPopover>
    <span v-if="!modelValue && placeholder" class="text-xs text-gray-400 dark:text-neutral-500">{{ placeholder }}</span>
    <button
      v-if="modelValue"
      type="button"
      class="text-xs text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300"
      @click="$emit('update:modelValue', undefined)"
    >
      {{ t('common.reset') }}
    </button>
  </div>
</template>

<script setup lang="ts">
// Swatch + colour picker with a reset back to "not set"
const { t } = useI18n()

withDefaults(defineProps<{
  modelValue?: string
  fallback?: string
  label?: string
  /** Shown while no colour is set, e.g. "Auto" */
  placeholder?: string
}>(), {
  fallback: '#000000',
})

defineEmits<{
  'update:modelValue': [value: string | undefined]
}>()
</script>
