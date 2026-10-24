<template>
  <span class="inline-flex items-center" :class="variant === 'full' && 'gap-2'" :style="{ height: `${size}px` }">
    <!-- Mark: a geometric lowercase "p" with a gradient orb in its bowl -->
    <svg :width="size" :height="size" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="variant === 'mark' ? 'Perlink' : undefined" :aria-hidden="variant === 'full' ? 'true' : undefined">
      <defs>
        <radialGradient :id="gradientId" cx="0.35" cy="0.32" r="0.75">
          <stop offset="0" stop-color="#ffe0b8" />
          <stop offset="0.45" stop-color="#ff8a4c" />
          <stop offset="1" stop-color="#c2410c" />
        </radialGradient>
      </defs>
      <rect x="5" y="6" width="6" height="22" rx="3" :fill="inkColor" />
      <circle cx="17.5" cy="13.5" r="7.5" :stroke="inkColor" stroke-width="5.5" />
      <circle cx="17.5" cy="13.5" r="3.4" :fill="`url(#${gradientId})`" />
    </svg>
    <span
      v-if="variant === 'full'"
      class="font-[family-name:var(--font-display)] font-medium tracking-[-0.04em] leading-none"
      :style="{ fontSize: `${size * 0.82}px`, color: inkColor }"
    >perlink</span>
  </span>
</template>

<script setup lang="ts">
// Perlink logo: mark alone, or mark + wordmark. Ink on light surfaces,
// paper on dark ones.
const props = withDefaults(defineProps<{
  variant?: 'full' | 'mark'
  size?: number
  inverted?: boolean
}>(), {
  variant: 'full',
  size: 28,
})

const inkColor = computed(() => (props.inverted ? '#fdfcfb' : '#0c0b0a'))
const gradientId = `perlink-orb-${useId()}`
</script>
