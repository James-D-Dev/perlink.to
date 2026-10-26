<template>
  <!-- Where the video goes: the networks' logos slide down one after another -->
  <span class="relative inline-flex size-6 shrink-0 overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-black/5" aria-hidden="true">
    <span class="social-cycle absolute inset-x-0 top-0 flex flex-col motion-reduce:animate-none">
      <span v-for="(logo, i) in LOGOS" :key="i" class="flex size-6 shrink-0 items-center justify-center">
        <UIcon :name="logo.icon" class="size-3.5" :style="{ color: logo.color }" />
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
// Top to bottom; the column moves down, so they show from the bottom up and
// the first logo is repeated at the end to loop without a jump
const LOGOS = [
  { icon: 'i-simple-icons-facebook', color: '#1877F2' },
  { icon: 'i-simple-icons-tiktok', color: '#000000' },
  { icon: 'i-simple-icons-youtube', color: '#FF0000' },
  { icon: 'i-simple-icons-instagram', color: '#E4405F' },
  { icon: 'i-simple-icons-x', color: '#000000' },
  { icon: 'i-simple-icons-facebook', color: '#1877F2' },
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
