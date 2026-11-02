<template>
  <!-- "New site", first in the list, shaped like the site cards: what a site
       can hold drifts up through the picture, the words sit on the strip below -->
  <NuxtLink
    to="/dashboard/new"
    class="new-site group relative flex flex-col overflow-hidden rounded-3xl bg-paper ring-1 ring-line transition [--float-scale:0.7] hover:-translate-y-0.5 hover:shadow-xl sm:[--float-scale:0.85]"
  >
    <div class="relative flex aspect-[4/3] items-center justify-center overflow-hidden border-b border-line bg-gradient-to-b from-[#fff6ee] via-[#fcf0f4] to-[#eef1ff] dark:from-[#1c1613] dark:via-[#1b1320] dark:to-[#11141f]">
      <!-- Social networks and reactions rising through it, like on a live video -->
      <div class="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <!-- Room around each one (p-3) for its shadow: Safari clips a moving,
             filtered element to its own box -->
        <span
          v-for="(b, i) in FLOATERS"
          :key="i"
          class="new-site-float absolute bottom-0 -ml-3 box-content p-3 drop-shadow-[0_6px_14px_rgb(0_0_0/0.22)]"
          :style="{
            left: `${b.x}%`,
            width: `calc(${b.size}px * var(--float-scale))`,
            height: `calc(${b.size}px * var(--float-scale))`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${-b.delay}s`,
            '--sway': `${b.sway}px`,
          }"
        >
          <!-- Facebook, Instagram, YouTube: their own full-colour logos -->
          <UIcon v-if="b.kind === 'logo'" :name="b.icon!" class="size-full" />
          <!-- TikTok: the app icon, a white note edged cyan and red on black -->
          <span v-else-if="b.kind === 'tiktok'" class="flex size-full items-center justify-center rounded-[28%] bg-[#010101]">
            <UIcon name="i-simple-icons-tiktok" class="tiktok-note size-[58%] text-white" />
          </span>
          <!-- Love and like, as on the "Share your room" button -->
          <span
            v-else
            class="flex size-full items-center justify-center rounded-full border-2 border-white"
            :style="{ background: REACTIONS[b.kind].background }"
          >
            <svg viewBox="0 0 24 24" class="size-[56%] fill-white"><path :d="REACTIONS[b.kind].path" /></svg>
          </span>
        </span>
      </div>

      <span class="relative z-10 flex items-center justify-center">
        <MarketingMkOrb palette="sunset" :size="72" />
        <span class="absolute flex size-10 items-center justify-center rounded-full bg-white/90 text-[#1c1a17] shadow-lg transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110">
          <UIcon name="i-lucide-plus" class="size-5" />
        </span>
      </span>
    </div>
    <div class="p-3 sm:p-4">
      <p class="truncate text-sm font-semibold text-ink sm:text-base">{{ t('dashboard.sites.newSite') }}</p>
      <p class="mt-0.5 truncate text-xs text-ink-muted">{{ t('dashboard.sites.newSiteHint') }}</p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Facebook's reaction colours, with filled glyphs (as ReactionBurst)
const REACTIONS = {
  like: {
    background: 'linear-gradient(180deg, #18afff, #0062df)',
    path: 'M2 21h3V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.3l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 6.59 7.59C6.22 7.95 6 8.45 6 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z',
  },
  love: {
    background: 'linear-gradient(180deg, #ff6680, #e61739)',
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  },
} as const

// Few and large, slow, rising in two lanes along the sides (the middle stays
// clear for the words), so only a handful are in view at once.
// x: across the card (%); delay staggers them
const FLOATERS: { kind: 'logo' | 'tiktok' | 'like' | 'love'; icon?: string; x: number; size: number; duration: number; delay: number; sway: number }[] = [
  { kind: 'logo', icon: 'i-logos-facebook', x: 8, size: 44, duration: 12, delay: 0, sway: 10 },
  { kind: 'love', x: 84, size: 36, duration: 10, delay: 1.5, sway: -10 },
  { kind: 'logo', icon: 'i-skill-icons-instagram', x: 82, size: 46, duration: 13, delay: 3, sway: -8 },
  { kind: 'like', x: 8, size: 34, duration: 10.5, delay: 4.6, sway: 8 },
  { kind: 'tiktok', x: 84, size: 44, duration: 12.5, delay: 6.4, sway: -12 },
  { kind: 'love', x: 6, size: 32, duration: 9.5, delay: 7.4, sway: 10 },
  { kind: 'logo', icon: 'i-logos-youtube-icon', x: 5, size: 46, duration: 12, delay: 9, sway: 8 },
  { kind: 'like', x: 86, size: 34, duration: 10, delay: 10.2, sway: -6 },
  { kind: 'love', x: 4, size: 30, duration: 9, delay: 11.6, sway: 8 },
  { kind: 'love', x: 88, size: 32, duration: 10.5, delay: 5.2, sway: -10 },
]
</script>

<style scoped>
.new-site-float {
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

/* TikTok's note: edged cyan on one side, red on the other */
.tiktok-note {
  filter: drop-shadow(-1.5px -1px 0 #25f4ee) drop-shadow(1.5px 1px 0 #fe2c55);
}

/* Still for people who prefer less motion: a few icons resting round the edge */
@media (prefers-reduced-motion: reduce) {
  .new-site-float {
    animation: none;
    opacity: 0.85;
  }
  .new-site-float:nth-child(odd) { bottom: 12%; }
  .new-site-float:nth-child(even) { bottom: 78%; }
  .new-site-float:nth-child(n + 7) { display: none; }
}
</style>
