<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden" />
</template>

<script setup lang="ts">
import type { RoomConfig, WallSide } from '~/types/room'
import { RoomScene, type ObjectPatch, type RoomSceneStats } from '~/utils/room/RoomScene'
import { daylightAtHour, getDaylight } from '~/utils/room/daylight'

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
  })
  scene.setRoom(props.room)
  scene.select(props.selectedId)
  applyPreview()
})

onBeforeUnmount(() => {
  scene?.dispose()
  scene = null
})

watch(() => props.room, room => scene?.setRoom(room), { deep: true })
watch(() => props.selectedId, id => scene?.select(id))
watch(() => [props.previewHour, props.forceMode], applyPreview)

function applyPreview() {
  if (props.forceMode) {
    scene?.setDaylightOverride(getDaylight({ ...props.room.environment, mode: props.forceMode }))
  } else {
    scene?.setDaylightOverride(props.previewHour === null ? null : daylightAtHour(props.previewHour))
  }
}

defineExpose({
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
  getDropTarget(clientX: number, clientY: number, wallMounted: boolean): { position: [number, number, number]; wall?: WallSide } | null {
    return scene?.getDropTarget(clientX, clientY, wallMounted) ?? null
  },
})
</script>
