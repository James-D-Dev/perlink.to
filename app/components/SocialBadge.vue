<template>
  <!-- A social network as an app icon: its brand colour, filled edge to edge,
       with its mark in white (one look for every network, in both themes) -->
  <span
    class="social-badge inline-flex shrink-0 items-center justify-center"
    :class="shape === 'circle' ? 'rounded-full' : 'rounded-[28%]'"
    :style="{ width: `${size}px`, height: `${size}px`, background: look.background, color: look.glyph }"
  >
    <UIcon :name="look.icon" :style="{ width: `${size * 0.56}px`, height: `${size * 0.56}px` }" />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  provider: string
  size?: number
  shape?: 'square' | 'circle'
}>(), { size: 32, shape: 'square' })

// Marks from simple-icons (single colour, so they all sit the same way);
// links that aren't networks use a stone tile
const LOOKS: Record<string, { icon: string; background: string; glyph?: string }> = {
  facebook: { icon: 'i-simple-icons-facebook', background: '#1877F2' },
  twitter: { icon: 'i-simple-icons-x', background: '#000000' },
  instagram: { icon: 'i-simple-icons-instagram', background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285aeb 90%)' },
  linkedin: { icon: 'i-simple-icons-linkedin', background: '#0A66C2' },
  youtube: { icon: 'i-simple-icons-youtube', background: '#FF0000' },
  tiktok: { icon: 'i-simple-icons-tiktok', background: '#000000' },
  github: { icon: 'i-simple-icons-github', background: '#181717' },
  telegram: { icon: 'i-simple-icons-telegram', background: '#26A5E4' },
  whatsapp: { icon: 'i-simple-icons-whatsapp', background: '#25D366' },
  discord: { icon: 'i-simple-icons-discord', background: '#5865F2' },
  spotify: { icon: 'i-simple-icons-spotify', background: '#1DB954' },
  threads: { icon: 'i-simple-icons-threads', background: '#000000' },
  snapchat: { icon: 'i-simple-icons-snapchat', background: '#FFFC00', glyph: '#000000' },
  twitch: { icon: 'i-simple-icons-twitch', background: '#9146FF' },
  pinterest: { icon: 'i-simple-icons-pinterest', background: '#E60023' },
  reddit: { icon: 'i-simple-icons-reddit', background: '#FF4500' },
  zalo: { icon: 'i-simple-icons-zalo', background: '#0068FF' },
  messenger: { icon: 'i-simple-icons-messenger', background: 'linear-gradient(135deg, #00B2FF 0%, #006AFF 50%, #A033FF 100%)' },
  behance: { icon: 'i-simple-icons-behance', background: '#1769FF' },
  // Stores, food delivery and maps
  shopee: { icon: 'i-simple-icons-shopee', background: '#EE4D2D' },
  lazada: { icon: 'i-lucide-shopping-bag', background: 'linear-gradient(135deg, #FFA800 0%, #F53D6B 55%, #6F3CF6 100%)' },
  tiktokshop: { icon: 'i-simple-icons-tiktok', background: '#000000' },
  grabfood: { icon: 'i-simple-icons-grab', background: '#00B14F' },
  shopeefood: { icon: 'i-lucide-utensils', background: '#EE4D2D' },
  googlemaps: { icon: 'i-simple-icons-googlemaps', background: '#ffffff', glyph: '#EA4335' },
  website: { icon: 'i-lucide-globe', background: '#78716c' },
  email: { icon: 'i-lucide-mail', background: '#78716c' },
  phone: { icon: 'i-lucide-phone', background: '#16a34a' },
}

const look = computed(() => {
  const found = LOOKS[props.provider] ?? { icon: 'i-lucide-link', background: '#78716c' }
  return { ...found, glyph: found.glyph ?? '#ffffff' }
})
</script>

<style scoped>
/* Black tiles (X, TikTok, GitHub, Threads) keep an edge on the dark theme */
:global(.dark) .social-badge {
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.14);
}
</style>
