<template>
  <USelect
    :model-value="selected"
    :items="items"
    :size="size"
    :placeholder="placeholder ?? t('theme.font.selectPlaceholder')"
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

const { t } = useI18n();

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

// "Inter, system-ui, sans-serif" and "Inter, sans-serif" are the same font
const firstFamily = (value: string) => value.split(',')[0]!.replace(/["']/g, '').trim().toLowerCase();

const match = computed(() => props.modelValue
  ? props.fontOptions.find(f => f.value === props.modelValue || firstFamily(f.value) === firstFamily(props.modelValue))
  : undefined);

// A font set by a preset that isn't in the list still shows its name, not the raw CSS
const items = computed(() => {
  const list = props.fontOptions.map(f => ({ label: f.label, value: f.value }));
  if (props.modelValue && !match.value) {
    const name = props.modelValue.split(',')[0]!.replace(/["']/g, '').trim();
    const label = name === 'ui-monospace' ? 'Monospace' : name;
    list.unshift({ label, value: props.modelValue });
  }
  return list;
});

const selected = computed(() => match.value?.value ?? props.modelValue);
</script>
