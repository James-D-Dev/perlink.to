<template>
  <!-- A pack's items on its colour, as rendered 3D thumbnails -->
  <div class="relative isolate overflow-hidden bg-gradient-to-br p-4" :class="pack.gradient">
    <div class="pointer-events-none absolute -right-10 -top-10 -z-10 size-40 rounded-full bg-white/25 blur-2xl" />
    <div class="pointer-events-none absolute -bottom-12 -left-8 -z-10 size-40 rounded-full bg-black/10 blur-2xl" />
    <div class="grid grid-cols-3 gap-2">
      <div v-for="type in pack.items" :key="type" class="flex aspect-square items-center justify-center rounded-2xl bg-white/20 p-1.5 ring-1 ring-white/30 backdrop-blur-sm">
        <img v-if="thumbnails[type]" :src="thumbnails[type]" :alt="itemName(type)" class="size-full object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.25)]" loading="lazy">
        <USkeleton v-else class="size-2/3 rounded-xl bg-white/30" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RoomPack } from '#shared/roomPacks'

const props = defineProps<{ pack: RoomPack }>()
const { t, te } = useI18n()
const thumbnails = useRoomThumbnails(props.pack.items)
const itemName = (type: string) => (te(`room.objects.${type}`) ? t(`room.objects.${type}`) : type)
</script>
