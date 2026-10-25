<template>
  <!-- Soft lights in the page's own colours drifting behind everything -->
  <div class="aurora pointer-events-none overflow-hidden" aria-hidden="true">
    <span class="aurora-light aurora-light--a" :style="{ background: glow(colors[0]) }" />
    <span class="aurora-light aurora-light--b" :style="{ background: glow(colors[1]) }" />
    <span class="aurora-light aurora-light--c" :style="{ background: glow(colors[2]) }" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  /** Three colours: usually the theme's gradient or accents */
  colors?: string[]
}>(), {
  colors: () => ['#ff9ec7', '#a78bfa', '#7dd3fc'],
})

const glow = (color?: string) =>
  `radial-gradient(circle, color-mix(in srgb, ${color || '#a78bfa'} 85%, transparent) 0%, transparent 68%)`
</script>

<style scoped>
.aurora-light {
  position: absolute;
  width: 70%;
  aspect-ratio: 1;
  border-radius: 9999px;
  filter: blur(40px);
  will-change: transform;
}
.aurora-light--a { left: -15%; top: -10%; animation: aurora-a 9s ease-in-out infinite; }
.aurora-light--b { right: -20%; top: 25%; animation: aurora-b 11s ease-in-out infinite; }
.aurora-light--c { left: 10%; bottom: -20%; animation: aurora-c 13s ease-in-out infinite; }

@keyframes aurora-a {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(35%, 25%) scale(1.2); }
}
@keyframes aurora-b {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30%, 20%) scale(0.85); }
}
@keyframes aurora-c {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20%, -35%) scale(1.15); }
}
@media (prefers-reduced-motion: reduce) {
  .aurora-light { animation: none; }
}
</style>
