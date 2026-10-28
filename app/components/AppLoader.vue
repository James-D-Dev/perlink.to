<template>
  <!-- The Perlink mark, alive: the room builds itself (floor, then walls,
       then the window) and the pearl drops in and keeps bouncing on the
       floor, while a sheen crosses the tile. Pure CSS, so it plays from the
       server-rendered HTML before any script runs. -->
  <div class="pl-loader" role="status" :aria-label="label" :style="{ '--s': `${size}px` }">
    <svg :width="size" :height="size" viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="pl-loader-tile" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2f8fff" />
          <stop offset="1" stop-color="#005fd6" />
        </linearGradient>
        <radialGradient id="pl-loader-pearl" cx=".36" cy=".3" r=".75">
          <stop offset="0" stop-color="#fff" />
          <stop offset=".45" stop-color="#eef3ff" />
          <stop offset=".8" stop-color="#cfd9f3" />
          <stop offset="1" stop-color="#a9b8de" />
        </radialGradient>
        <linearGradient id="pl-loader-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#fff" stop-opacity="0" />
          <stop offset=".5" stop-color="#fff" stop-opacity=".35" />
          <stop offset="1" stop-color="#fff" stop-opacity="0" />
        </linearGradient>
        <clipPath id="pl-loader-clip">
          <rect width="64" height="64" rx="14.5" />
        </clipPath>
      </defs>

      <g class="pl-tile">
        <rect width="64" height="64" rx="14.5" fill="url(#pl-loader-tile)" />
        <rect x=".75" y=".75" width="62.5" height="62.5" rx="13.8" stroke="#fff" stroke-opacity=".28" stroke-width="1.5" />
        <path d="M14.5 0h35A14.5 14.5 0 0 1 64 14.5V24C44 34 20 34 0 24v-9.5A14.5 14.5 0 0 1 14.5 0z" fill="#fff" opacity=".12" />

        <!-- The room builds: floor, walls, window -->
        <path class="pl-floor" d="M12 47 32 37l20 10-20 10z" fill="#fff" />
        <path class="pl-wall pl-wall-l" d="M12 25 32 15v22L12 47z" fill="#d9e6ff" />
        <path class="pl-wall pl-wall-r" d="M52 25 32 15v22L52 47z" fill="#bcd3ff" />
        <g class="pl-window">
          <path d="M17 29.5 26 25v8l-9 4.5z" fill="#5aa6ff" />
          <path d="M17 29.5 26 25v1.8l-9 4.5z" fill="#fff" opacity=".5" />
        </g>

        <!-- The pearl bounces on the floor; its shadow follows -->
        <ellipse class="pl-shadow" cx="32" cy="50.6" rx="6.3" ry="2.3" fill="#003a8c" opacity=".35" />
        <g class="pl-pearl">
          <circle cx="32" cy="45.5" r="6" fill="url(#pl-loader-pearl)" />
          <ellipse cx="29.9" cy="43" rx="1.9" ry="1.2" fill="#fff" opacity=".9" transform="rotate(-30 29.9 43)" />
        </g>

        <rect class="pl-sheen" x="-40" y="0" width="28" height="64" fill="url(#pl-loader-sheen)" clip-path="url(#pl-loader-clip)" />
      </g>
    </svg>
    <p v-if="text" class="pl-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  /** Logo size in px */
  size?: number
  /** Optional line under the logo */
  text?: string
  /** For screen readers */
  label?: string
}>(), {
  size: 72,
  label: 'Loading',
})
</script>

<style>
.pl-loader {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.pl-loader svg { overflow: visible; filter: drop-shadow(0 10px 24px rgb(0 95 214 / 0.28)); }
.pl-loader .pl-tile { transform-origin: 32px 32px; animation: pl-tile-in 520ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }

/* The room builds itself once */
.pl-loader .pl-floor { transform-origin: 32px 47px; animation: pl-floor-in 420ms 140ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.pl-loader .pl-wall { transform-box: fill-box; transform-origin: bottom; animation: pl-wall-up 460ms cubic-bezier(0.22, 1.2, 0.36, 1) both; }
.pl-loader .pl-wall-l { animation-delay: 300ms; }
.pl-loader .pl-wall-r { animation-delay: 380ms; }
.pl-loader .pl-window { animation: pl-fade 300ms 640ms ease-out both; }

/* Then the pearl drops in and bounces for as long as it's loading */
.pl-loader .pl-pearl { animation: pl-drop 560ms 700ms cubic-bezier(0.5, 0, 0.75, 0) both, pl-bounce 900ms 1260ms infinite; }
.pl-loader .pl-shadow { transform-box: fill-box; transform-origin: center; animation: pl-shadow-in 360ms 900ms ease-out both, pl-squash 900ms 1260ms infinite; }
.pl-loader .pl-sheen { animation: pl-sheen 2400ms 900ms ease-in-out infinite; }

.pl-loader .pl-text { font-size: 13px; font-weight: 500; color: var(--ui-text-muted, #6b655e); letter-spacing: -0.01em; animation: pl-fade 400ms 500ms ease-out both; }

@keyframes pl-tile-in { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes pl-floor-in { from { transform: scale(0.2); opacity: 0; } to { transform: scale(1); opacity: 1; } }
@keyframes pl-wall-up { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes pl-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes pl-shadow-in { from { opacity: 0; transform: scale(0.4); } to { opacity: 0.35; transform: scale(1); } }
/* Drops from inside the tile, fading in, so it never pokes out of it */
@keyframes pl-drop { from { transform: translateY(-22px); opacity: 0; } 35% { opacity: 1; } to { transform: translateY(0); opacity: 1; } }
/* Up slowing down, down speeding up, like a real ball */
@keyframes pl-bounce {
  0% { transform: translateY(0); animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); }
  50% { transform: translateY(-13px); animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); }
  100% { transform: translateY(0); }
}
@keyframes pl-squash {
  0% { transform: scale(1); opacity: 0.35; animation-timing-function: cubic-bezier(0.2, 0.6, 0.4, 1); }
  50% { transform: scale(0.55); opacity: 0.16; animation-timing-function: cubic-bezier(0.6, 0, 0.8, 0.4); }
  100% { transform: scale(1); opacity: 0.35; }
}
@keyframes pl-sheen {
  0% { transform: translateX(0) skewX(-18deg); }
  45%, 100% { transform: translateX(120px) skewX(-18deg); }
}

@media (prefers-reduced-motion: reduce) {
  .pl-loader *, .pl-loader .pl-tile { animation: none !important; }
}
</style>
