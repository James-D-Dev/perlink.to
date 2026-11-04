<template>
  <!-- A product picture for a room pack (Lemon Squeezy product image), 1200 x 800 -->
  <div v-if="pack" class="cover relative isolate overflow-hidden text-white" :style="{ backgroundImage: `linear-gradient(135deg, ${pack.colors.join(', ')})` }">
    <div class="pointer-events-none absolute -right-40 -top-40 -z-10 size-[560px] rounded-full bg-white/25 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-48 -left-32 -z-10 size-[520px] rounded-full bg-black/20 blur-3xl" />
    <div class="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:radial-gradient(#fff_1.5px,transparent_1.5px)] [background-size:28px_28px]" />

    <div class="flex h-full">
      <!-- Name and what's inside -->
      <div class="flex w-[430px] shrink-0 flex-col justify-between py-16 pl-16 pr-6">
        <div>
          <p class="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-[17px] font-semibold ring-1 ring-white/30 backdrop-blur">
            <UIcon name="i-lucide-crown" class="size-5" />Premium room pack
          </p>
          <h1 class="mt-7 font-extrabold leading-[0.95] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.25)]" :class="name.length > 7 ? 'text-[62px]' : 'text-[76px]'">{{ name }}</h1>
          <p class="mt-5 text-[26px] font-medium text-white/90">6 animated 3D items</p>
          <ul class="mt-6 space-y-1.5 text-[19px] text-white/85">
            <li v-for="type in pack.items" :key="type" class="flex items-center gap-2">
              <span class="size-1.5 rounded-full bg-white/80" />{{ itemName(type) }}
            </li>
          </ul>
        </div>
        <p class="flex items-center gap-2 text-[22px] font-semibold">
          <img src="/favicon.svg" alt="" class="size-8 rounded-lg">perlink.to
        </p>
      </div>

      <!-- The items -->
      <div class="grid flex-1 grid-cols-3 content-center gap-5 py-14 pr-14">
        <div v-for="type in pack.items" :key="type" class="flex aspect-square items-center justify-center rounded-[28px] bg-white/20 p-3 ring-1 ring-white/35 backdrop-blur-sm">
          <img v-if="thumbnails[type]" :src="thumbnails[type]" :alt="itemName(type)" class="size-full object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.3)]">
        </div>
      </div>
    </div>
    <span v-if="ready" id="cover-ready" class="hidden" />
  </div>
</template>

<script setup lang="ts">
import { ROOM_PACK_BY_ID, isRoomPackId } from '#shared/roomPacks'

definePageMeta({ layout: false, colorMode: 'light' })
useSeoMeta({ robots: 'noindex, nofollow', title: 'Pack cover' })

const route = useRoute()
const { t, te } = useI18n()
const id = String(route.query.pack ?? '')
const pack = isRoomPackId(id) ? ROOM_PACK_BY_ID[id] : null
if (!pack) throw createError({ statusCode: 404, statusMessage: 'Not found' })

// Always in English: these go on the Lemon Squeezy store
const name = computed(() => (pack!.id === 'tet' ? 'Tết' : t(`room.packs.${pack!.id}.name`, {}, { locale: 'en' })))
const itemName = (type: string) => (te(`room.objects.${type}`, 'en') ? t(`room.objects.${type}`, {}, { locale: 'en' }) : type)
// Rendered big so the picture stays sharp
const thumbnails = useRoomThumbnails(pack.items, 512)
const ready = computed(() => pack!.items.every(type => thumbnails[type]))
</script>

<style scoped>
.cover {
  width: 1200px;
  height: 800px;
}
</style>
