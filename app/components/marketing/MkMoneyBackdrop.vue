<template>
  <!-- Decoration for the affiliate hero: an emerald glow with coins, notes and
       a rising chart floating around. Purely visual; sits behind the content. -->
  <div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
    <div class="absolute inset-0 bg-[radial-gradient(120%_90%_at_100%_0%,#10b981_0%,#047857_38%,#022c22_100%)]" />
    <div class="absolute -right-24 -top-24 size-80 rounded-full bg-lime-300/30 blur-3xl" />
    <div class="absolute -bottom-32 -left-20 size-80 rounded-full bg-amber-300/20 blur-3xl" />
    <!-- faint grid -->
    <div class="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(80%_80%_at_80%_20%,#000,transparent)]" />

    <!-- rising chart -->
    <svg class="absolute bottom-0 right-0 h-2/3 w-2/3 opacity-30" viewBox="0 0 300 200" preserveAspectRatio="none" fill="none">
      <path d="M0 190 L60 160 L110 170 L160 120 L210 130 L260 70 L300 30 L300 200 L0 200 Z" fill="url(#mb-fill)" />
      <path d="M0 190 L60 160 L110 170 L160 120 L210 130 L260 70 L300 30" stroke="#bef264" stroke-width="3" stroke-linejoin="round" />
      <defs>
        <linearGradient id="mb-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#bef264" stop-opacity="0.6" />
          <stop offset="1" stop-color="#bef264" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>

    <!-- coins -->
    <span
      v-for="coin in COINS"
      :key="coin.class"
      class="mb-float absolute flex items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 font-bold text-[#78350f] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.5),inset_0_-3px_0_rgba(0,0,0,0.15),inset_0_2px_0_rgba(255,255,255,0.6)] ring-2 ring-amber-300/70"
      :class="coin.class"
      :style="{ animationDelay: coin.delay }"
    >$</span>

    <!-- bank notes -->
    <span
      v-for="note in NOTES"
      :key="note.class"
      class="mb-float absolute flex items-center justify-center rounded-md bg-gradient-to-br from-emerald-200 to-emerald-400 font-bold text-[#065f46] shadow-[0_10px_24px_-8px_rgba(0,0,0,0.55)] ring-1 ring-emerald-100/70"
      :class="note.class"
      :style="{ animationDelay: note.delay }"
    >
      <span class="flex size-[55%] items-center justify-center rounded-full ring-1 ring-emerald-700/30">$</span>
    </span>

    <!-- sparkles -->
    <UIcon v-for="s in SPARKLES" :key="s" name="i-lucide-sparkle" class="mb-twinkle absolute text-lime-200" :class="s" />
  </div>
</template>

<script setup lang="ts">
const COINS = [
  { class: 'right-[4%] top-[3%] size-9 text-base rotate-12 sm:right-[8%] sm:top-[10%] sm:size-12 sm:text-xl', delay: '0s' },
  { class: 'right-[24%] top-[30%] size-8 text-sm -rotate-12 hidden lg:flex', delay: '1.2s' },
  { class: 'right-[4%] top-[48%] size-10 text-lg rotate-6 hidden lg:flex', delay: '0.6s' },
  { class: 'right-[30%] bottom-[8%] size-9 text-base -rotate-6 hidden lg:flex', delay: '1.8s' },
]
const NOTES = [
  { class: 'right-[14%] top-[26%] h-9 w-16 text-sm -rotate-[18deg] hidden lg:flex', delay: '0.9s' },
  { class: 'right-[12%] bottom-[14%] h-8 w-14 text-xs rotate-[14deg] hidden lg:flex', delay: '2.2s' },
]
const SPARKLES = [
  'right-[36%] top-[12%] size-4',
  'right-[3%] top-[30%] size-3 hidden sm:block',
  'right-[20%] bottom-[30%] size-3.5 hidden lg:block',
]
</script>

<style scoped>
.mb-float { animation: mb-float 6s ease-in-out infinite; }
.mb-twinkle { animation: mb-twinkle 3s ease-in-out infinite; }
@keyframes mb-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -10px; }
}
@keyframes mb-twinkle {
  0%, 100% { opacity: 0.3; scale: 0.8; }
  50% { opacity: 1; scale: 1.1; }
}
@media (prefers-reduced-motion: reduce) {
  .mb-float, .mb-twinkle { animation: none; }
}
</style>
