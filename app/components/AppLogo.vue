<template>
  <span class="inline-flex items-center" :style="{ height: `${size}px` }">
    <!-- Wordmark: "perlink" in Geist; "per" (perfect) and the dot of the i,
         a perfect circle, in the tint colour -->
    <span
      v-if="variant === 'full'"
      class="whitespace-nowrap leading-none"
      :style="{ fontFamily: 'Geist, var(--font-display)', fontWeight: 600, letterSpacing: '-0.045em', fontSize: `${size * 0.82}px`, color: ink }"
      role="img"
      aria-label="Perlink"
    ><span aria-hidden="true"><span class="text-tint">per</span>l<span class="relative inline-block">ı<span class="absolute rounded-full bg-tint" :style="dotStyle" /></span>nk</span></span>

    <!-- Mark (favicons, folded sidebar): an open isometric room, the 3D
         world every site gets, with a pearl on its floor ("pearl link", per =
         perfect) on a glossy tint tile. Same drawing as public/favicon.svg -->
    <svg v-else :width="size" :height="size" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Perlink">
      <defs>
        <linearGradient :id="`${uid}-tile`" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" :stop-color="inverted ? '#3a9bff' : '#2f8fff'" />
          <stop offset="1" :stop-color="inverted ? '#0066e0' : '#005fd6'" />
        </linearGradient>
        <radialGradient :id="`${uid}-pearl`" cx=".36" cy=".3" r=".75">
          <stop offset="0" stop-color="#fff" />
          <stop offset=".45" stop-color="#eef3ff" />
          <stop offset=".8" stop-color="#cfd9f3" />
          <stop offset="1" stop-color="#a9b8de" />
        </radialGradient>
      </defs>
      <rect width="64" height="64" rx="14.5" :fill="`url(#${uid}-tile)`" />
      <rect x=".75" y=".75" width="62.5" height="62.5" rx="13.8" stroke="#fff" stroke-opacity=".28" stroke-width="1.5" />
      <path d="M14.5 0h35A14.5 14.5 0 0 1 64 14.5V24C44 34 20 34 0 24v-9.5A14.5 14.5 0 0 1 14.5 0z" fill="#fff" opacity=".12" />
      <!-- The room seen from above: two back walls on a floor, a window -->
      <path d="M12 25 32 15v22L12 47z" fill="#d9e6ff" />
      <path d="M52 25 32 15v22L52 47z" fill="#bcd3ff" />
      <path d="M12 47 32 37l20 10-20 10z" fill="#fff" />
      <path d="M17 29.5 26 25v8l-9 4.5z" fill="#5aa6ff" />
      <path d="M17 29.5 26 25v1.8l-9 4.5z" fill="#fff" opacity=".5" />
      <!-- The pearl, resting on the floor -->
      <ellipse cx="32" cy="50.6" rx="6.3" ry="2.3" fill="#003a8c" opacity=".35" />
      <circle cx="32" cy="45.5" r="6" :fill="`url(#${uid}-pearl)`" />
      <ellipse cx="29.9" cy="43" rx="1.9" ry="1.2" fill="#fff" opacity=".9" transform="rotate(-30 29.9 43)" />
    </svg>
  </span>
</template>

<script setup lang="ts">
// Perlink logo: the wordmark (ink on light surfaces, paper on dark ones), or
// the mark alone (a glossy tint tile, a touch brighter on dark surfaces).
const props = withDefaults(defineProps<{
  variant?: 'full' | 'mark'
  size?: number
  inverted?: boolean
}>(), {
  variant: 'full',
  size: 28,
})

const ink = computed(() => (props.inverted ? '#fdfcfb' : '#0c0b0a'))
// Gradient ids must be unique on the page
const uid = `pl-${useId()}`

// Where Geist draws the dot of an i (measured): centred on the stem,
// 0.65em above the baseline; a touch larger so it reads as round
const dotStyle = { width: '0.15em', height: '0.15em', left: '0.1325em', top: '0.1275em', transform: 'translateX(-50%)' }
</script>
