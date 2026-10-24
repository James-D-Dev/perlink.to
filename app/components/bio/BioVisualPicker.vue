<template>
  <div class="grid gap-2" :class="colsClass">
    <button
      v-for="option in options"
      :key="String(option.value)"
      type="button"
      class="group flex flex-col items-stretch gap-1.5 rounded-lg border p-1.5 text-left transition"
      :class="modelValue === option.value
        ? 'border-inverted ring-1 ring-inverted'
        : 'border-default hover:border-accented dark:border-white/10'"
      :aria-pressed="modelValue === option.value"
      @click="$emit('update:modelValue', option.value)"
    >
      <!-- Mini picture of the option -->
      <span class="flex h-16 items-center justify-center overflow-hidden rounded-md bg-elevated/70 p-2 dark:bg-white/[0.04]">
        <slot name="preview" :value="option.value" />
      </span>
      <span class="truncate px-0.5 text-center text-[11px] font-medium" :class="modelValue === option.value ? 'text-highlighted' : 'text-muted'">
        {{ option.label }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number">
// A row of options shown as small pictures, so people see what they pick
const props = withDefaults(defineProps<{
  modelValue?: T
  options: { value: T; label: string }[]
  cols?: 2 | 3 | 4 | 5
}>(), {
  modelValue: undefined,
  cols: 4,
})

defineEmits<{ 'update:modelValue': [value: T] }>()

const colsClass = computed(() => ({
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-4',
  5: 'grid-cols-3 sm:grid-cols-5',
})[props.cols])
</script>
