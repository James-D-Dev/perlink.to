<template>
  <!-- A real 3D room set with a pack's items, moving: what you get, live -->
  <div class="relative h-full w-full overflow-hidden bg-[#0e0c14]">
    <ClientOnly>
      <RoomCanvas
        :room="room"
        :force-mode="mode"
        :products="pack.id === 'showroom' ? demoProducts : undefined"
        shop-accent="#be185d"
        :sold-out-label="t('room.shop.soldOut')"
        :buy-label="t('room.shop.buy')"
        @activate="onActivate"
      />
    </ClientOnly>
    <div class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
      <p class="pointer-events-auto rounded-full bg-black/45 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">
        {{ t(`room.packs.${pack.id}.name`) }}
      </p>
      <div class="pointer-events-auto flex rounded-full bg-black/45 p-1 backdrop-blur">
        <button
          v-for="m in (['day', 'night'] as const)"
          :key="m"
          type="button"
          class="flex size-8 items-center justify-center rounded-full text-white transition"
          :class="mode === m ? 'bg-white/25' : 'opacity-60 hover:opacity-100'"
          :aria-label="m"
          @click="mode = m"
        >
          <UIcon :name="m === 'day' ? 'i-lucide-sun' : 'i-lucide-moon'" class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RoomPack, RoomPackId } from '#shared/roomPacks'
import { createDefaultRoom, type LandId, type RoomConfig, type RoomObject } from '~/types/room'
import { CATALOG_BY_TYPE } from '~/utils/room/catalog'
import type { ShopProduct } from '~/utils/room/productCard'

const props = defineProps<{ pack: RoomPack }>()
const { t } = useI18n()

type Spot = [type: string, x: number, y: number, z: number, rotation?: number, scale?: number, productId?: string, text?: string]
const TABLE = 'coffee-table'
const TOP = 0.43
const BACK = -2.5

// Where each pack's items stand in a 5 x 5 m room (back wall at z = -2.5)
const LAYOUTS: Record<RoomPackId, { spots: Spot[]; land: LandId; mode: 'day' | 'night'; wall: string; floor: string }> = {
  proposal: {
    land: 'sakura', mode: 'night', wall: '#2b1a24', floor: '#5a3a32',
    spots: [
      ['vip-marry-me', 0, 0, -2.25], ['vip-rose-heart', 0, 0, -1.2], ['vip-petal-aisle', 0, 0, 1.0],
      ['vip-grand-piano', -1.45, 0, -0.6, 35, 0.95], ['vip-fireworks', 1.9, 0, -1.9],
      [TABLE, 1.4, 0, -0.2], ['vip-ring-box', 1.4, TOP, -0.2, 0, 1.6],
    ],
  },
  showroom: {
    land: 'city', mode: 'night', wall: '#f4f2ee', floor: '#d8d2c8',
    spots: [
      ['vip-neon-open', -0.9, 1.95, BACK, 0, 1, undefined, 'Perlink Shop'], ['vip-ad-screen', 1.1, 1.65, BACK], ['vip-sale-banner', 1.1, 2.72, BACK],
      ['vip-glass-cabinet', -2.27, 0, -1.4, 90], ['vip-glass-cabinet', -2.27, 0, -0.4, 90],
      ['vip-display-podium', 0, 0, -0.6, 0, 1, 'demo-0'], ['vip-checkout-counter', -1.4, 0, 1.2, 90],
    ],
  },
  valentine: {
    land: 'sakura', mode: 'night', wall: '#fbe4ea', floor: '#c99a7a',
    spots: [
      ['vip-rose-arch', 0, 0, -2.0], ['vip-neon-heart', 1.55, 1.7, BACK], ['vip-candle-heart', 0, 0, -0.4],
      ['vip-heart-balloons', -1.7, 0, -1.6], ['vip-love-bear', 1.4, 0, -1.2, -25, 1.3],
      [TABLE, -1.3, 0, 0.7], ['vip-rose-bouquet', -1.3, TOP, 0.7],
    ],
  },
  wedding: {
    land: 'fairy', mode: 'night', wall: '#f6f1ea', floor: '#d8c3a5',
    spots: [
      ['vip-wedding-arch', 0, 0, -2.0], ['vip-sparkler-fountain', -0.55, 0, -1.4], ['vip-sparkler-fountain', 0.55, 0, -1.4],
      ['vip-love-marquee', -1.2, 0, 0.5, 25, 0.7], ['vip-candle-lanterns', -1.75, 0, -1.7],
      [TABLE, 1.45, 0, -1.45], ['vip-wedding-cake', 1.45, TOP, -1.45],
      [TABLE, 1.3, 0, 0.6], ['vip-champagne-tower', 1.3, TOP, 0.6, 0, 1.3],
    ],
  },
  birthday: {
    land: 'tropical', mode: 'day', wall: '#eaf2ff', floor: '#e2c49c',
    spots: [
      ['vip-birthday-bunting', 0, 2.2, BACK], ['vip-disco-ball', 0, 0, -1.9], ['vip-balloon-bunch', -1.7, 0, -1.6],
      ['vip-gift-tower', 1.6, 0, -1.6, -20], ['vip-confetti-popper', 1.3, 0, 0.6, -30, 1.4],
      [TABLE, -0.4, 0, -0.1], ['vip-birthday-cake', -0.4, TOP, -0.1],
    ],
  },
  galaxy: {
    land: 'mars', mode: 'night', wall: '#2a2547', floor: '#3b3352',
    spots: [
      ['vip-nebula-painting', 0, 1.75, BACK], ['vip-floating-planet', 0, 0, -1.3, 0, 1.2], ['vip-jellyfish-lamp', -1.7, 0, -1.7],
      ['vip-moon-lamp', 1.7, 0, -1.6, -20], ['vip-star-projector', -1.1, 0, 0.6, 0, 1.3],
      [TABLE, 1.2, 0, 0.5], ['vip-snow-globe', 1.2, TOP, 0.5],
    ],
  },
  tet: {
    land: 'zen', mode: 'day', wall: '#fff3e0', floor: '#b5835a',
    spots: [
      ['vip-red-lanterns', 0, 2.25, BACK], ['vip-firecrackers', -1.6, 2.2, BACK], ['vip-firecrackers', 1.6, 2.2, BACK],
      ['vip-peach-blossom', -1.6, 0, -1.6], ['vip-apricot-blossom', 1.6, 0, -1.6], ['vip-kumquat-tree', 0, 0, -1.8],
      [TABLE, 0, 0, 0.1], ['vip-five-fruit-tray', 0, TOP, 0.1, 0, 1.4],
    ],
  },
}

const layout = computed(() => LAYOUTS[props.pack.id])

// Showroom: a sample shop, so the cabinet, screen and podium show real-looking products
const { locale } = useI18n()
const DEMO: [en: string, vi: string, price: number, photo: string, comparePrice?: number, tag?: [string, string]][] = [
  ['Linen wrap dress', 'Đầm lanh quấn', 590000, 'boutique-2', undefined, ['New', 'Mới']],
  ['Calm serum', 'Serum dịu da', 390000, 'skin-cover', undefined, ['Best seller', 'Bán chạy']],
  ['Plaid mini skirt', 'Chân váy kẻ caro', 390000, 'boutique-3', 490000],
  ['Glow routine set', 'Bộ chu trình Glow', 890000, 'skin-3', 970000],
  ['Everyday shirt', 'Sơ mi hằng ngày', 450000, 'boutique-1'],
  ['Daily sunscreen SPF 50', 'Kem chống nắng SPF 50', 320000, 'skin-2'],
  ['Speckled mug', 'Cốc men lấm tấm', 220000, 'craft-avatar'],
]
const demoProducts = computed<ShopProduct[]>(() => DEMO.map(([en, vi, price, photo, comparePrice, tag], i) => ({
  id: `demo-${i}`,
  name: locale.value === 'vi' ? vi : en,
  price,
  comparePrice,
  imageUrl: `/images/templates/photos/${photo}-md.webp`,
  tag: tag ? (locale.value === 'vi' ? tag[1] : tag[0]) : undefined,
})))

// Clicking the piano plays it, here too
const piano = useRoomPiano()
function onActivate(id: string) {
  const type = room.value.objects.find(o => o.id === id)?.type
  const music = type ? CATALOG_BY_TYPE[type]?.music : undefined
  if (music) piano.toggle(music)
}
const mode = ref<'day' | 'night'>(layout.value.mode)

const room = computed<RoomConfig>(() => {
  const base = createDefaultRoom()
  const objects: RoomObject[] = layout.value.spots.map(([type, x, y, z, rotation = 0, scale = 1, productId, text], i) => ({
    id: `${type}-${i}`,
    type,
    position: [x, y, z],
    rotation,
    scale,
    ...(productId && { productId }),
    ...(text && { text }),
    ...(z === BACK && { wall: 'back' as const }),
  }))
  return {
    ...base,
    style: { ...base.style, width: 5, depth: 5, height: 3, wallColor: layout.value.wall, floorColor: layout.value.floor },
    environment: { ...base.environment, mode: layout.value.mode },
    land: layout.value.land,
    guestbook: false,
    objects,
  }
})
</script>
