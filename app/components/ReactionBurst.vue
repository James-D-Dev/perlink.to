<template>
  <!-- Likes and hearts float up from what's inside, like reactions on a live
       video; faster while the pointer is over it -->
  <span class="relative inline-flex" @pointerenter="eager = true" @pointerleave="eager = false">
    <slot />
    <span class="pointer-events-none absolute inset-0" aria-hidden="true">
      <span
        v-for="r in reactions"
        :key="r.id"
        class="reaction-rise absolute bottom-full"
        :style="{ left: `${r.x}%`, '--rise': `${r.rise}px`, '--drift': `${r.drift}px`, animationDuration: `${r.duration}ms` }"
        @animationend="remove(r.id)"
      >
        <span
          class="reaction-sway flex items-center justify-center rounded-full shadow-[0_2px_6px_rgb(0_0_0/0.2)] ring-[1.5px] ring-white"
          :style="{ width: `${r.size}px`, height: `${r.size}px`, background: KINDS[r.kind].background, animationDuration: `${r.duration / 2}ms` }"
        >
          <svg viewBox="0 0 24 24" class="size-[58%] fill-white"><path :d="KINDS[r.kind].path" /></svg>
        </span>
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { useDocumentVisibility, usePreferredReducedMotion } from '@vueuse/core'

// Facebook's reaction colours, with filled glyphs
const KINDS = {
  like: {
    background: 'linear-gradient(180deg, #18afff, #0062df)',
    path: 'M2 21h3V9H2v12zm20-11c0-1.1-.9-2-2-2h-6.3l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L13.17 1 6.59 7.59C6.22 7.95 6 8.45 6 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z',
  },
  love: {
    background: 'linear-gradient(180deg, #ff6680, #e61739)',
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  },
} as const

interface Reaction { id: number; kind: keyof typeof KINDS; x: number; size: number; rise: number; drift: number; duration: number }

const reactions = ref<Reaction[]>([])
const eager = ref(false)
const visible = useDocumentVisibility()
const motion = usePreferredReducedMotion()
let nextId = 0
let timer: ReturnType<typeof setTimeout> | undefined

const random = (min: number, max: number) => min + Math.random() * (max - min)

function spawn() {
  if (visible.value === 'visible' && motion.value !== 'reduce' && reactions.value.length < 9) {
    // Now and then a little burst of two or three
    const count = Math.random() < 0.2 ? 2 + Math.round(Math.random()) : 1
    for (let i = 0; i < count; i++) {
      reactions.value.push({
        id: nextId++,
        kind: Math.random() < 0.55 ? 'love' : 'like',
        x: random(55, 92),
        size: Math.round(random(18, 24)),
        rise: Math.round(random(48, 78)),
        drift: Math.round(random(-14, 14)),
        duration: Math.round(random(1500, 2200)),
      })
    }
  }
  timer = setTimeout(spawn, eager.value ? random(260, 460) : random(700, 1400))
}

function remove(id: number) {
  reactions.value = reactions.value.filter(r => r.id !== id)
}

onMounted(() => {
  timer = setTimeout(spawn, 600)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<style scoped>
/* Up and away: pops in, rises, fades near the top */
.reaction-rise {
  animation-name: reaction-rise;
  animation-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  animation-fill-mode: both;
  translate: -50% 60%;
}
@keyframes reaction-rise {
  0% { transform: translate(0, 0) scale(0.3); opacity: 0; }
  12% { transform: translate(0, -8px) scale(1.1); opacity: 1; }
  22% { transform: translate(0, -14px) scale(1); }
  70% { opacity: 1; }
  100% { transform: translate(var(--drift), calc(var(--rise) * -1)) scale(0.85); opacity: 0; }
}

/* A gentle side-to-side sway on the way up */
.reaction-sway {
  animation-name: reaction-sway;
  animation-timing-function: ease-in-out;
  animation-iteration-count: 2;
  animation-direction: alternate;
}
@keyframes reaction-sway {
  from { transform: translateX(-3px) rotate(-8deg); }
  to { transform: translateX(3px) rotate(8deg); }
}
</style>
