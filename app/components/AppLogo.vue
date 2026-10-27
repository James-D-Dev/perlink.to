<template>
  <span class="inline-flex items-center" :style="{ height: `${size}px` }">
    <!-- Wordmark: "perlink" in Geist, the dot of the i a perfect circle in
         the tint colour (the one spot of colour in the brand) -->
    <span
      v-if="variant === 'full'"
      class="whitespace-nowrap leading-none"
      :style="{ fontFamily: 'Geist, var(--font-display)', fontWeight: 600, letterSpacing: '-0.045em', fontSize: `${size * 0.82}px`, color: ink }"
      role="img"
      aria-label="Perlink"
    ><span aria-hidden="true">perl<span class="relative inline-block">ı<span class="absolute rounded-full bg-tint" :style="dotStyle" /></span>nk</span></span>

    <!-- Mark (favicons, folded sidebar): a lowercase p on an app-icon tile,
         the same tint dot in its bowl -->
    <svg v-else :width="size" :height="size" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Perlink">
      <rect width="32" height="32" rx="7.4" :fill="ink" />
      <rect x="9.6" y="7.5" width="4" height="18.5" rx="2" :fill="paper" />
      <circle cx="17.6" cy="14.2" r="4.7" :stroke="paper" stroke-width="4" />
      <circle cx="17.6" cy="14.2" r="2.1" class="fill-tint" />
    </svg>
  </span>
</template>

<script setup lang="ts">
// Perlink logo: the wordmark, or the mark alone. Ink on light surfaces,
// paper on dark ones.
const props = withDefaults(defineProps<{
  variant?: 'full' | 'mark'
  size?: number
  inverted?: boolean
}>(), {
  variant: 'full',
  size: 28,
})

const ink = computed(() => (props.inverted ? '#fdfcfb' : '#0c0b0a'))
const paper = computed(() => (props.inverted ? '#0c0b0a' : '#fdfcfb'))

// Where Geist draws the dot of an i (measured): centred on the stem,
// 0.65em above the baseline; a touch larger so it reads as round
const dotStyle = { width: '0.15em', height: '0.15em', left: '0.1325em', top: '0.1275em', transform: 'translateX(-50%)' }
</script>
