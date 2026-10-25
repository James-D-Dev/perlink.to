<template>
  <!-- Behind the hero: clean colour light in one warm family (peach, pink,
       lavender) with a sky accent kept apart so colours never mix to grey,
       drifting on short loops, plus a soft sheen sweeping across. CSS only. -->
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" :class="{ 'mk-backdrop--fade': fade }" aria-hidden="true">
    <span class="mk-light mk-light--peach" />
    <span class="mk-light mk-light--pink" />
    <span class="mk-light mk-light--lavender" />
    <span class="mk-light mk-light--sky" />
    <span class="mk-sheen" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  /** Fade out towards the bottom (the landing hero); off inside a card */
  fade?: boolean
}>(), { fade: true })
</script>

<style scoped>
.mk-backdrop--fade {
  /* Melt into the page at the bottom so the showcase below sits on paper */
  mask-image: linear-gradient(to bottom, #000 0%, #000 60%, transparent 100%);
}

.mk-light {
  position: absolute;
  border-radius: 9999px;
  filter: blur(36px);
  will-change: transform;
}
/* Each light is a solid colour fading to transparent at its own edge, so
   overlaps add up as light instead of muddying */
.mk-light--peach {
  width: 360px; height: 360px;
  right: 6%; top: -6%;
  background: radial-gradient(circle, rgb(255 170 120 / 0.85) 0%, rgb(255 170 120 / 0) 68%);
  animation: mk-orbit-a 8s ease-in-out infinite;
}
.mk-light--pink {
  width: 420px; height: 420px;
  right: 24%; top: 18%;
  background: radial-gradient(circle, rgb(255 133 178 / 0.7) 0%, rgb(255 133 178 / 0) 68%);
  animation: mk-orbit-b 9s ease-in-out infinite;
}
.mk-light--lavender {
  width: 380px; height: 380px;
  right: 44%; top: -10%;
  background: radial-gradient(circle, rgb(178 150 255 / 0.6) 0%, rgb(178 150 255 / 0) 68%);
  animation: mk-orbit-c 10s ease-in-out infinite;
}
/* Kept on the far left, away from the warm lights */
.mk-light--sky {
  width: 340px; height: 340px;
  left: -6%; top: 30%;
  background: radial-gradient(circle, rgb(120 196 255 / 0.55) 0%, rgb(120 196 255 / 0) 68%);
  animation: mk-orbit-b 7s ease-in-out infinite reverse;
}

/* A soft diagonal band of light passing over every few seconds */
.mk-sheen {
  position: absolute;
  inset: -50% -20%;
  background: linear-gradient(105deg, transparent 40%, rgb(255 255 255 / 0.55) 50%, transparent 60%);
  animation: mk-sheen 6s ease-in-out infinite;
}

@keyframes mk-orbit-a {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-140px, 70px) scale(1.15); }
  66% { transform: translate(-40px, 130px) scale(0.9); }
}
@keyframes mk-orbit-b {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(160px, -60px) scale(1.18); }
}
@keyframes mk-orbit-c {
  0%, 100% { transform: translate(0, 0) scale(1); }
  40% { transform: translate(-120px, 110px) scale(1.12); }
  75% { transform: translate(90px, 50px) scale(0.92); }
}
@keyframes mk-sheen {
  0%, 15% { transform: translateX(-60%); }
  85%, 100% { transform: translateX(60%); }
}

@media (max-width: 640px) {
  .mk-light { width: 260px; height: 260px; }
}

@media (prefers-reduced-motion: reduce) {
  .mk-light,
  .mk-sheen { animation: none; }
  .mk-sheen { display: none; }
}
</style>
