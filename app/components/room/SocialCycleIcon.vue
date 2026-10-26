<template>
  <!-- Where the video goes: the networks' logos slide down one after another,
       each as its own solid brand-coloured circle -->
  <span class="relative inline-flex size-6 shrink-0 overflow-hidden rounded-full shadow-sm ring-1 ring-white/70" aria-hidden="true">
    <span class="social-cycle absolute inset-x-0 top-0 flex flex-col motion-reduce:animate-none">
      <span v-for="(logo, i) in LOGOS" :key="i" class="flex size-6 shrink-0 items-center justify-center rounded-full" :style="{ background: logo.background }">
        <UIcon :name="logo.icon" :class="logo.size" :style="{ color: logo.color }" />
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
// Top to bottom; the column moves down, so they show from the bottom up and
// the first logo is repeated at the end to loop without a jump.
// Facebook's mark is already a circle: blue on white fills the whole disc.
const FACEBOOK = { icon: 'i-simple-icons-facebook', color: '#1877F2', background: '#fff', size: 'size-6' }
const LOGOS = [
  FACEBOOK,
  { icon: 'i-simple-icons-tiktok', color: '#fff', background: '#000', size: 'size-3.5' },
  { icon: 'i-simple-icons-youtube', color: '#fff', background: '#FF0000', size: 'size-3.5' },
  // Instagram's own gradient
  { icon: 'i-simple-icons-instagram', color: '#fff', background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)', size: 'size-3.5' },
  { icon: 'i-simple-icons-x', color: '#fff', background: '#000', size: 'size-3' },
  FACEBOOK,
]
</script>

<style scoped>
.social-cycle {
  animation: social-cycle 7.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

/* Each logo holds, then the next slides in from above (one step = one 1.5rem logo) */
@keyframes social-cycle {
  0%, 14% { transform: translateY(-7.5rem); }
  20%, 34% { transform: translateY(-6rem); }
  40%, 54% { transform: translateY(-4.5rem); }
  60%, 74% { transform: translateY(-3rem); }
  80%, 94% { transform: translateY(-1.5rem); }
  100% { transform: translateY(0); }
}
</style>
