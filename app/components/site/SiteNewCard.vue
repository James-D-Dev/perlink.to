<template>
  <!-- "New site", first in the list: what a site can hold drifts up behind it -->
  <NuxtLink
    to="/dashboard"
    class="new-site group relative flex h-56 flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-b from-[#fff6ee] via-[#fcf0f4] to-[#eef1ff] ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-xl sm:h-auto sm:aspect-[4/5] dark:from-[#1c1613] dark:via-[#1b1320] dark:to-[#11141f] dark:ring-white/10"
  >
    <!-- Social networks and site features rising like bubbles -->
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <span
        v-for="(b, i) in BUBBLES"
        :key="i"
        class="new-site-bubble absolute bottom-0 flex items-center justify-center rounded-full bg-white/85 shadow-[0_6px_18px_-6px_rgb(0_0_0/0.25)] ring-1 ring-black/5 backdrop-blur dark:bg-white/10 dark:ring-white/10"
        :style="{
          left: `${b.x}%`,
          width: `${b.size}px`,
          height: `${b.size}px`,
          animationDuration: `${b.duration}s`,
          animationDelay: `${-b.delay}s`,
          '--sway': `${b.sway}px`,
        }"
      >
        <UIcon :name="b.icon" class="size-[55%]" :class="b.dark" :style="{ color: b.color }" />
      </span>
    </div>

    <!-- The glow, the plus, the words -->
    <div class="relative flex flex-col items-center gap-3 text-center">
      <span class="relative flex items-center justify-center">
        <MarketingMkOrb palette="sunset" :size="84" />
        <span class="absolute flex size-11 items-center justify-center rounded-full bg-white/90 text-[#1c1a17] shadow-lg transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110">
          <UIcon name="i-lucide-plus" class="size-5" />
        </span>
      </span>
      <span class="text-base font-semibold text-ink">{{ t('dashboard.sites.newSite') }}</span>
      <span class="max-w-[14rem] text-xs text-ink-muted">{{ t('dashboard.sites.newSiteHint') }}</span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Brand colours for the networks; the features in the site's own ink.
// x: position across the card (%), delay staggers them so some are always rising
const BUBBLES: { icon: string; color?: string; dark?: string; x: number; size: number; duration: number; delay: number; sway: number }[] = [
  { icon: 'i-simple-icons-instagram', color: '#E4405F', x: 8, size: 38, duration: 9, delay: 0, sway: 10 },
  { icon: 'i-lucide-link', dark: 'text-ink', x: 72, size: 32, duration: 8, delay: 1.2, sway: -8 },
  { icon: 'i-simple-icons-tiktok', dark: 'text-[#111] dark:text-white', x: 40, size: 34, duration: 10, delay: 2.4, sway: 12 },
  { icon: 'i-lucide-shopping-bag', dark: 'text-ink', x: 84, size: 36, duration: 9.5, delay: 3.1, sway: -10 },
  { icon: 'i-simple-icons-youtube', color: '#FF0000', x: 22, size: 34, duration: 8.5, delay: 4.2, sway: 8 },
  { icon: 'i-lucide-box', dark: 'text-ink', x: 58, size: 38, duration: 10.5, delay: 5, sway: -12 },
  { icon: 'i-simple-icons-facebook', color: '#1877F2', x: 90, size: 30, duration: 9, delay: 6.1, sway: -6 },
  { icon: 'i-lucide-calendar-check', dark: 'text-ink', x: 6, size: 32, duration: 8, delay: 6.8, sway: 10 },
  { icon: 'i-simple-icons-spotify', color: '#1DB954', x: 66, size: 32, duration: 9.5, delay: 7.6, sway: 8 },
  { icon: 'i-lucide-image', dark: 'text-ink', x: 30, size: 36, duration: 10, delay: 8.4, sway: -10 },
  { icon: 'i-simple-icons-whatsapp', color: '#25D366', x: 48, size: 30, duration: 8.5, delay: 3.8, sway: 6 },
  { icon: 'i-lucide-map-pin', dark: 'text-ink', x: 78, size: 30, duration: 9, delay: 9.2, sway: -8 },
  { icon: 'i-lucide-music', dark: 'text-ink', x: 14, size: 30, duration: 10, delay: 5.6, sway: 12 },
  { icon: 'i-lucide-qr-code', dark: 'text-ink', x: 52, size: 30, duration: 9, delay: 0.8, sway: -6 },
]
</script>

<style scoped>
.new-site-bubble {
  opacity: 0;
  animation-name: new-site-rise;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

/* From below the card to above it: fading in, swaying, fading out near the top */
@keyframes new-site-rise {
  0% { transform: translate(0, 110%) scale(0.7); opacity: 0; }
  12% { opacity: 1; }
  35% { transform: translate(var(--sway), -120px) scale(1) rotate(-6deg); }
  65% { transform: translate(calc(var(--sway) * -0.6), -260px) scale(1) rotate(5deg); }
  85% { opacity: 0.9; }
  100% { transform: translate(0, -420px) scale(0.9) rotate(0deg); opacity: 0; }
}

/* Still for people who prefer less motion: a few icons resting round the edge */
@media (prefers-reduced-motion: reduce) {
  .new-site-bubble {
    animation: none;
    opacity: 0.85;
  }
  .new-site-bubble:nth-child(odd) { bottom: 12%; }
  .new-site-bubble:nth-child(even) { bottom: 78%; }
  .new-site-bubble:nth-child(n + 9) { display: none; }
}
</style>
