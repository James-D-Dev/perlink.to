<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden" />
</template>

<script setup lang="ts">
import type { RoomConfig, WallSide } from '~/types/room'
import { RoomScene, type ObjectPatch, type RoomSceneStats } from '~/utils/room/RoomScene'
import { daylightAtHour, getDaylight } from '~/utils/room/daylight'
import type { GuestGiftType } from '#shared/guestbook'
import type { ShopProduct } from '~/utils/room/productCard'

const props = withDefaults(defineProps<{
  room: RoomConfig
  editable?: boolean
  selectedId?: string | null
  /** Preview a fixed hour (0-24) instead of the configured day/night mode */
  previewHour?: number | null
  /** Force day or night regardless of the configured mode */
  forceMode?: 'day' | 'night' | null
  /** Small thumbnail-style preview: renders at a low frame rate and quality */
  preview?: boolean
  /** Fly-in opening shot (live page) */
  intro?: boolean
  /** Guestbook gifts in front of the room, newest first */
  guests?: { id: string; gift: GuestGiftType }[]
  /** Products the product stands show; accent colour for prices */
  products?: ShopProduct[]
  shopAccent?: string
  soldOutLabel?: string
}>(), {
  editable: false,
  preview: false,
  intro: false,
  selectedId: null,
  previewHour: null,
  forceMode: null,
})

const emit = defineEmits<{
  select: [id: string | null]
  objectChange: [changes: { id: string; patch: ObjectPatch }[]]
  hover: [id: string | null, x: number, y: number]
  activate: [id: string]
  stats: [stats: RoomSceneStats]
  guestActivate: [id: string]
  guestHover: [id: string | null, x: number, y: number]
}>()

const containerRef = ref<HTMLElement | null>(null)
let scene: RoomScene | null = null

onMounted(() => {
  if (!containerRef.value) return
  scene = new RoomScene(containerRef.value, {
    editable: props.editable,
    preview: props.preview,
    intro: props.intro,
    onSelect: id => emit('select', id),
    onObjectChange: changes => emit('objectChange', changes),
    onHover: (id, x, y) => emit('hover', id, x, y),
    onActivate: id => emit('activate', id),
    onStats: stats => emit('stats', stats),
    onGuestActivate: id => emit('guestActivate', id),
    onGuestHover: (id, x, y) => emit('guestHover', id, x, y),
  })
  if (props.products) scene.setProducts(props.products, props.shopAccent, props.soldOutLabel)
  scene.setRoom(props.room)
  if (props.guests) scene.setGuests(props.guests)
  scene.select(props.selectedId)
  applyPreview()
})

onBeforeUnmount(() => {
  scene?.dispose()
  scene = null
})

watch(() => props.room, room => scene?.setRoom(room), { deep: true })
watch(() => props.selectedId, id => scene?.select(id))
// Gifts added after the room opened pop in
watch(() => props.guests, guests => scene?.setGuests(guests ?? [], true))
watch(() => [props.products, props.shopAccent] as const, ([products, accent]) => scene?.setProducts(products ?? [], accent, props.soldOutLabel), { deep: true })
watch(() => [props.previewHour, props.forceMode], applyPreview)

function applyPreview() {
  if (props.forceMode) {
    scene?.setDaylightOverride(getDaylight({ ...props.room.environment, mode: props.forceMode }))
  } else {
    scene?.setDaylightOverride(props.previewHour === null ? null : daylightAtHour(props.previewHour))
  }
}

defineExpose({
  snapshot() {
    return scene?.snapshot() ?? Promise.resolve(null)
  },
  resetView() {
    scene?.resetView()
  },
  zoomBy(factor: number) {
    scene?.zoomBy(factor)
  },
  ridersOf(id: string) {
    return scene?.ridersOf(id) ?? []
  },
  focusObject(id: string) {
    scene?.focusObject(id)
  },
  focusGuest(id: string) {
    scene?.focusGuest(id)
  },
  getDropTarget(clientX: number, clientY: number, wallMounted: boolean): { position: [number, number, number]; wall?: WallSide } | null {
    return scene?.getDropTarget(clientX, clientY, wallMounted) ?? null
  },
})
</script>
