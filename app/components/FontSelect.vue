<template>
  <USelect
    :model-value="modelValue"
    :items="fontOptions.map(f => ({ label: f.label, value: f.value }))"
    :size="size"
    :placeholder="placeholder"
    class="w-full"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #item-label="{ item }">
      <span :style="{ fontFamily: item.value }">{{ item.label }}</span>
    </template>
  </USelect>
</template>

<script setup lang="ts">
import type { FontOption } from '~/data/fontOptions';

interface Props {
  modelValue: string;
  fontOptions: FontOption[];
  size?: 'sm' | 'md' | 'lg' | 'xl';
  placeholder?: string;
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  placeholder: 'Select font...',
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
