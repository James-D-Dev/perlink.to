<template>
  <!-- The greeting on a small moving scene for the time of day: a sunrise,
       the afternoon sun, a sunset over the sea, or the moon and stars -->
  <!-- Full width, starting under the frosted bar so the sky shows through
       it; the words line up with the page below -->
  <section
    class="greeting relative isolate -mx-4 -mt-[calc(var(--ui-header-height)+1rem)] shrink-0 overflow-hidden rounded-b-3xl sm:-mx-6 sm:-mt-[calc(var(--ui-header-height)+1.5rem)]"
    :class="`greeting--${part}`"
  >
    <!-- The art sits below the bar (the bar only shows the sky) and keeps its
         shape at the right; bands and stars run past the left edge of the
         view box to fill wide banners -->
    <svg
      class="pointer-events-none absolute inset-x-0 bottom-0 top-(--ui-header-height) -z-10 h-[calc(100%-var(--ui-header-height))] w-full"
      viewBox="0 0 400 150"
      preserveAspectRatio="xMaxYMid meet"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="g-sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff7d6" />
          <stop offset="55%" stop-color="#ffd166" />
          <stop offset="100%" stop-color="#ffb347" />
        </radialGradient>
        <radialGradient id="g-sunset" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff1c1" />
          <stop offset="60%" stop-color="#ff9a5a" />
          <stop offset="100%" stop-color="#ff6b6b" />
        </radialGradient>
        <radialGradient id="g-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#fff" stop-opacity="0" />
        </radialGradient>
      </defs>

      <!-- Morning: the sun rising behind soft hills, clouds drifting -->
      <g v-if="part === 'morning'">
        <circle cx="318" cy="70" r="60" fill="url(#g-glow)" class="pulse" />
        <g class="rise">
          <g class="spin" style="transform-origin: 318px 70px">
            <path v-for="i in 12" :key="i" :d="ray(318, 70, 34, 48, i * 30)" stroke="#ffd166" stroke-width="3" stroke-linecap="round" opacity="0.7" />
          </g>
          <circle cx="318" cy="70" r="26" fill="url(#g-sun)" />
        </g>
        <path d="M-600 150 C -400 128, -200 140, 0 132 S 120 112, 160 124 C 220 104, 280 112, 330 128 S 400 116, 420 122 L 420 150 Z" fill="#f7b58f" opacity="0.55" />
        <path d="M-600 150 C -300 136, -100 146, 60 140 S 180 126, 220 150 Z M220 150 C 280 118, 350 120, 420 136 L 420 150 Z" fill="#f29e7a" opacity="0.6" />
        <g class="drift"><path :d="cloud(240, 40, 1)" fill="#fff" opacity="0.85" /></g>
        <g class="drift drift--slow"><path :d="cloud(350, 26, 0.7)" fill="#fff" opacity="0.7" /></g>
      </g>

      <!-- Afternoon: a high sun, clouds crossing the sky -->
      <g v-else-if="part === 'afternoon'">
        <circle cx="330" cy="44" r="62" fill="url(#g-glow)" class="pulse" />
        <g class="spin" style="transform-origin: 330px 44px">
          <path v-for="i in 12" :key="i" :d="ray(330, 44, 32, 46, i * 30)" stroke="#ffe08a" stroke-width="3" stroke-linecap="round" opacity="0.8" />
        </g>
        <circle cx="330" cy="44" r="24" fill="url(#g-sun)" />
        <g class="drift"><path :d="cloud(250, 78, 1.15)" fill="#fff" opacity="0.9" /></g>
        <g class="drift drift--slow"><path :d="cloud(370, 96, 0.8)" fill="#fff" opacity="0.75" /></g>
        <g class="drift drift--fast"><path :d="cloud(190, 40, 0.6)" fill="#fff" opacity="0.6" /></g>
      </g>

      <!-- Evening: the sun setting into the sea, birds flying home -->
      <g v-else-if="part === 'evening'">
        <circle cx="318" cy="104" r="70" fill="url(#g-glow)" class="pulse" />
        <circle cx="318" cy="104" r="34" fill="url(#g-sunset)" class="set" />
        <rect x="-1000" y="104" width="1420" height="46" fill="#5b2a5e" opacity="0.55" />
        <g class="shimmer">
          <rect x="286" y="112" width="64" height="2.5" rx="1.25" fill="#ffd3a1" opacity="0.8" />
          <rect x="296" y="121" width="44" height="2" rx="1" fill="#ffd3a1" opacity="0.6" />
          <rect x="306" y="129" width="26" height="2" rx="1" fill="#ffd3a1" opacity="0.45" />
        </g>
        <g class="fly">
          <path d="M214 46 q6 -6 12 0 q6 -6 12 0" stroke="#3b1d3f" stroke-width="2" fill="none" stroke-linecap="round" />
          <path d="M240 34 q4 -4 8 0 q4 -4 8 0" stroke="#3b1d3f" stroke-width="1.6" fill="none" stroke-linecap="round" />
          <path d="M196 30 q3.5 -3.5 7 0 q3.5 -3.5 7 0" stroke="#3b1d3f" stroke-width="1.4" fill="none" stroke-linecap="round" />
        </g>
      </g>

      <!-- Night: the moon, twinkling stars, now and then a shooting star -->
      <g v-else>
        <circle cx="328" cy="50" r="58" fill="url(#g-glow)" opacity="0.5" class="pulse" />
        <circle cx="328" cy="50" r="24" fill="#f4f1de" />
        <circle cx="338" cy="44" r="21" fill="#1b2350" />
        <circle
          v-for="(star, i) in STARS"
          :key="i"
          :cx="star[0]"
          :cy="star[1]"
          :r="star[2]"
          fill="#fff"
          class="twinkle"
          :style="{ animationDelay: `${(i % 7) * 0.45}s` }"
        />
        <path class="shoot" d="M150 18 l-34 14" stroke="url(#g-glow)" stroke-width="2" stroke-linecap="round" />
        <path class="shoot" d="M150 18 l-34 14" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.9" />
      </g>
    </svg>

    <div class="mx-auto w-full px-4 pb-7 pt-[calc(var(--ui-header-height)+1.5rem)] sm:px-6 sm:pb-9 sm:pt-[calc(var(--ui-header-height)+2rem)]" :class="width">
      <!-- The greeting, then the name on a line of its own; each stays on one
           line, a long name ends in an ellipsis -->
      <h1 class="relative max-w-[72%] text-2xl font-semibold leading-tight tracking-tight sm:text-[28px]" :style="{ color: INK[part] }">
        <span class="block truncate">{{ title }}<template v-if="name">,</template></span>
        <span v-if="name" class="block truncate">{{ name }}</span>
      </h1>
      <p v-if="subtitle" class="relative mt-2 text-sm" :style="{ color: INK[part], opacity: 0.8 }">{{ subtitle }}</p>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { dayPart, type DayPart } from '~/composables/useGreeting'

const props = defineProps<{
  /** "Good evening" */
  title: string
  /** The owner's name, on its own line */
  name?: string
  subtitle?: string
  /** The page's content width, so the words line up with it */
  width?: string
  /** The scene; the owner's time of day by default */
  part?: DayPart
}>()

const part = computed(() => props.part ?? dayPart())

// Text that reads on each sky
const INK: Record<DayPart, string> = { morning: '#4a2614', afternoon: '#0f2f4d', evening: '#fff4ec', night: '#eef0ff' }

// [x, y, radius]
const STARS: [number, number, number][] = [
  [130, 22, 1.3], [150, 96, 1.1], [168, 54, 1.6], [190, 128, 1.2], [204, 18, 1.4], [214, 78, 1.8], [236, 40, 1.2],
  [248, 110, 1.5], [262, 14, 1.1], [270, 70, 1.3], [284, 132, 1.6], [296, 96, 1.1], [372, 104, 1.7], [388, 22, 1.2],
  [392, 76, 1.4], [360, 132, 1.1], [228, 138, 1], [118, 60, 1.1], [140, 140, 1.2], [384, 118, 0.9],
  // Past the left edge, behind the text on wide banners
  [96, 120, 1], [70, 30, 1.2], [40, 90, 0.9], [10, 136, 1.1], [-20, 16, 1], [-50, 70, 1.3], [-90, 122, 0.9],
  [-120, 40, 1.1], [-160, 96, 1], [-200, 18, 1.2], [-240, 130, 1], [-280, 60, 1.1],
]

/** One sun ray: a short line pointing out from the centre */
function ray(cx: number, cy: number, from: number, to: number, angle: number) {
  const a = (angle * Math.PI) / 180
  const x = (r: number) => (cx + Math.cos(a) * r).toFixed(1)
  const y = (r: number) => (cy + Math.sin(a) * r).toFixed(1)
  return `M${x(from)} ${y(from)} L${x(to)} ${y(to)}`
}

/** A puffy cloud, its base centred on x, y */
function cloud(x: number, y: number, s: number) {
  const p = (dx: number, dy: number) => `${(x + dx * s).toFixed(1)} ${(y + dy * s).toFixed(1)}`
  return `M${p(-34, 0)} C${p(-44, 0)} ${p(-44, -14)} ${p(-30, -16)} C${p(-28, -30)} ${p(-6, -32)} ${p(0, -20)} C${p(8, -34)} ${p(32, -30)} ${p(30, -14)} C${p(44, -14)} ${p(44, 0)} ${p(34, 0)} Z`
}
</script>

<style scoped>
.greeting--morning { background: linear-gradient(120deg, #ffe9d6 0%, #ffd9c2 45%, #ffc9a8 100%); }
.greeting--afternoon { background: linear-gradient(120deg, #e3f2ff 0%, #c4e3ff 50%, #9fd0ff 100%); }
.greeting--evening { background: linear-gradient(160deg, #3b1d5a 0%, #a23f6b 55%, #f08a5d 100%); }
.greeting--night { background: linear-gradient(160deg, #0b1030 0%, #1b2350 60%, #2e2a6b 100%); }
/* Stars behind the words fade, so none sits on a letter like an accent */
.greeting--night > svg { mask-image: linear-gradient(to right, rgb(0 0 0 / 0.18), rgb(0 0 0 / 0.18) 50%, #000 82%); }

.spin { animation: spin 40s linear infinite; }
.pulse { animation: pulse 5s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.rise { animation: rise 2.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
.set { animation: set 2.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
.drift { animation: drift 26s ease-in-out infinite alternate; }
.drift--slow { animation-duration: 38s; }
.drift--fast { animation-duration: 18s; }
.shimmer { animation: shimmer 3s ease-in-out infinite; }
.fly { animation: fly 22s linear infinite; }
.twinkle { animation: twinkle 3.2s ease-in-out infinite; }
.shoot { opacity: 0; animation: shoot 7s ease-in 2s infinite; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.9; } 50% { transform: scale(1.08); opacity: 1; } }
@keyframes rise { from { transform: translateY(36px); opacity: 0.4; } to { transform: translateY(0); opacity: 1; } }
@keyframes set { from { transform: translateY(-18px); } to { transform: translateY(0); } }
@keyframes drift { from { transform: translateX(-26px); } to { transform: translateX(22px); } }
@keyframes shimmer { 0%, 100% { opacity: 1; transform: translateX(0); } 50% { opacity: 0.55; transform: translateX(4px); } }
@keyframes fly { from { transform: translate(60px, 8px); } to { transform: translate(-260px, -14px); } }
@keyframes twinkle { 0%, 100% { opacity: 0.9; } 50% { opacity: 0.25; } }
@keyframes shoot {
  0% { opacity: 0; transform: translate(0, 0); }
  4% { opacity: 1; }
  12% { opacity: 0; transform: translate(-90px, 38px); }
  100% { opacity: 0; transform: translate(-90px, 38px); }
}
@media (prefers-reduced-motion: reduce) {
  .spin, .pulse, .rise, .set, .drift, .shimmer, .fly, .twinkle, .shoot { animation: none; }
}
</style>
