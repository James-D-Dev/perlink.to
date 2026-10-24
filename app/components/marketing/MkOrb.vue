<template>
  <span
    class="mk-orb relative inline-block shrink-0 rounded-full"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      background: palettes[palette],
      animation: still ? undefined : `mk-orb-drift ${9 + (size % 5)}s ease-in-out infinite`,
    }"
    aria-hidden="true"
  >
    <!-- Soft highlight and grain so the sphere reads as a lit, physical object -->
    <span class="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgba(255,255,255,0.65),transparent_42%)]" />
    <span class="absolute inset-0 rounded-full opacity-[0.18] mix-blend-overlay" :style="{ backgroundImage: grain }" />
  </span>
</template>

<script setup lang="ts">
// Gradient sphere: the public site's visual signature, echoing the floating
// 3D lands. Palettes are drawn from the lands themselves.
withDefaults(defineProps<{
  palette?: 'sunset' | 'sakura' | 'lagoon' | 'mars' | 'night' | 'mint'
  size?: number
  still?: boolean
}>(), {
  palette: 'sunset',
  size: 160,
})

const palettes = {
  sunset: 'radial-gradient(circle at 30% 30%, #ffd9a8 0%, #ff9a5a 38%, #e4572e 70%, #8f2d1a 100%)',
  sakura: 'radial-gradient(circle at 30% 30%, #fff1f6 0%, #ffc4dc 35%, #d98cd6 68%, #7b6ad8 100%)',
  lagoon: 'radial-gradient(circle at 30% 30%, #e9fbff 0%, #9fdcf0 35%, #4ba3d9 68%, #1d4f8f 100%)',
  mars: 'radial-gradient(circle at 30% 30%, #ffd0b0 0%, #e0814f 40%, #a6431f 72%, #3e1a10 100%)',
  night: 'radial-gradient(circle at 30% 30%, #ffe2a6 0%, #c58b4a 30%, #3b3f6b 62%, #0d1029 100%)',
  mint: 'radial-gradient(circle at 30% 30%, #f3fff6 0%, #bfeccc 38%, #7cc59a 68%, #2f6e57 100%)',
}

const grain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E")`
</script>
