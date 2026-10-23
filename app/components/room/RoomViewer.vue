<template>
  <div class="fixed inset-0 bg-slate-900">
    <RoomCanvas
      :room="room"
      :force-mode="forceMode"
      @hover="onHover"
      @activate="onActivate"
    />

    <!-- Profile -->
    <div class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
      <div class="pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl bg-white/80 p-3 pr-4 shadow-lg backdrop-blur-md">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="size-12 shrink-0 rounded-full object-cover"
        >
        <div class="min-w-0">
          <h1 class="truncate font-semibold text-gray-900">{{ title }}</h1>
          <p v-if="bio" class="line-clamp-2 text-xs text-gray-600">{{ bio }}</p>
        </div>
      </div>

      <div class="pointer-events-auto flex items-center gap-2">
        <UTooltip :text="isDayShown ? 'Switch to night' : 'Switch to day'">
          <UButton
            class="shadow-lg"
            color="neutral"
            variant="solid"
            :icon="isDayShown ? 'i-lucide-moon' : 'i-lucide-sun'"
            :aria-label="isDayShown ? 'Switch to night' : 'Switch to day'"
            @click="toggleDayNight"
          />
        </UTooltip>
        <UButton
          class="shadow-lg"
          color="neutral"
          variant="solid"
          icon="i-lucide-layout-list"
          label="2D page"
          @click="emit('switch2d')"
        />
      </div>
    </div>

    <!-- Hover tooltip -->
    <div
      v-if="hovered"
      class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg bg-gray-900/90 px-3 py-1.5 text-sm text-white shadow-lg"
      :style="{ left: `${hovered.x}px`, top: `${hovered.y}px` }"
    >
      {{ hovered.label }}
      <UIcon name="i-lucide-arrow-up-right" class="ml-1 inline size-3.5 align-[-2px]" />
    </div>

    <!-- Links in the room (also keyboard / screen-reader friendly) -->
    <div class="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-4">
      <div v-if="linkedObjects.length" class="flex max-w-full gap-2 overflow-x-auto pb-1">
        <a
          v-for="obj in linkedObjects"
          :key="obj.id"
          :href="safeUrl(obj.link!.url)"
          target="_blank"
          rel="noopener noreferrer"
          class="flex shrink-0 items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-sm font-medium text-gray-800 shadow backdrop-blur transition hover:bg-white"
        >
          <UIcon :name="iconFor(obj.type)" class="size-4" />
          {{ obj.link!.label || hostOf(obj.link!.url) }}
        </a>
      </div>
      <p class="rounded-full bg-black/30 px-3 py-1 text-xs text-white/90 backdrop-blur">
        Drag to look around · click objects to open
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RoomConfig } from '~/types/room'
import { CATALOG_BY_TYPE } from '~/utils/room/catalog'
import { getDaylight } from '~/utils/room/daylight'

const props = defineProps<{
  room: RoomConfig
  title: string
  bio?: string
  avatarUrl?: string
}>()

const emit = defineEmits<{ switch2d: [] }>()

const hovered = ref<{ label: string; x: number; y: number } | null>(null)

// Visitors can flip between day and night; until they do, the room follows its own setting
const forceMode = ref<'day' | 'night' | null>(null)
const now = ref(new Date())
let clock: ReturnType<typeof setInterval> | undefined
onMounted(() => (clock = setInterval(() => (now.value = new Date()), 2000)))
onBeforeUnmount(() => clearInterval(clock))

const isDayShown = computed(() =>
  forceMode.value ? forceMode.value === 'day' : getDaylight(props.room.environment, now.value).daylight >= 0.5,
)

function toggleDayNight() {
  forceMode.value = isDayShown.value ? 'night' : 'day'
}

const linkedObjects = computed(() => props.room.objects.filter(o => o.link?.url))

function iconFor(type: string) {
  return CATALOG_BY_TYPE[type]?.icon || 'i-lucide-link'
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function safeUrl(url: string) {
  // Only open web, mail and phone links
  return /^(https?:|mailto:|tel:)/i.test(url) ? url : `https://${url}`
}

function onHover(id: string | null, x: number, y: number) {
  const obj = id ? props.room.objects.find(o => o.id === id) : undefined
  hovered.value = obj?.link?.url ? { label: obj.link.label || hostOf(obj.link.url), x, y } : null
}

function onActivate(id: string) {
  const url = props.room.objects.find(o => o.id === id)?.link?.url
  if (url) window.open(safeUrl(url), '_blank', 'noopener,noreferrer')
}
</script>
