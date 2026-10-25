<template>
  <span class="relative inline-flex shrink-0 items-center justify-center" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg viewBox="0 0 36 36" class="absolute inset-0 -rotate-90" aria-hidden="true">
      <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-sand-strong)" stroke-width="4" />
      <circle
        cx="18"
        cy="18"
        r="15"
        fill="none"
        stroke="var(--color-ink)"
        stroke-width="4"
        stroke-linecap="round"
        class="transition-[stroke-dasharray] duration-500"
        :stroke-dasharray="`${value * 94.2} 94.2`"
      />
    </svg>
    <span v-if="label" class="relative text-[9px] font-semibold tabular-nums text-ink">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  /** 0 to 1 */
  value: number
  size?: number
  label?: string
}>(), { size: 36, label: undefined })
</script>
