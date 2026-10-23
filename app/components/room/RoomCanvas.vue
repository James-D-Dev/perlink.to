<template>
  <div ref="containerRef" class="absolute inset-0 overflow-hidden" />
</template>

<script setup lang="ts">
import type { RoomConfig, RoomObject, WallSide } from '~/types/room'
import { RoomScene, type TransformMode } from '~/utils/room/RoomScene'
import { daylightAtHour, getDaylight } from '~/utils/room/daylight'

const props = withDefaults(defineProps<{
  room: RoomConfig
  editable?: boolean
  selectedId?: string | null
  transformMode?: TransformMode
  /** Preview a fixed hour (0-24) instead of the configured day/night mode */
  previewHour?: number | null
  /** Force day or night regardless of the configured mode */
  forceMode?: 'day' | 'night' | null
}>(), {
  editable: false,
  selectedId: null,
  transformMode: 'translate',
  previewHour: null,
  forceMode: null,
})

const emit = defineEmits<{
  select: [id: string | null]
  objectChange: [id: string, patch: Pick<RoomObject, 'position' | 'rotation'>]
  hover: [id: string | null, x: number, y: number]
  activate: [id: string]
}>()

const containerRef = ref<HTMLElement | null>(null)
let scene: RoomScene | null = null

onMounted(() => {
  if (!containerRef.value) return
  scene = new RoomScene(containerRef.value, {
    editable: props.editable,
    onSelect: id => emit('select', id),
    onObjectChange: (id, patch) => emit('objectChange', id, patch),
    onHover: (id, x, y) => emit('hover', id, x, y),
    onActivate: id => emit('activate', id),
  })
  scene.setRoom(props.room)
  scene.setTransformMode(props.transformMode)
  scene.select(props.selectedId)
  applyPreview()
})

onBeforeUnmount(() => {
  scene?.dispose()
  scene = null
})

watch(() => props.room, room => scene?.setRoom(room), { deep: true })
watch(() => props.selectedId, id => scene?.select(id))
watch(() => props.transformMode, mode => scene?.setTransformMode(mode))
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
  getDropTarget(clientX: number, clientY: number, wallMounted: boolean): { position: [number, number, number]; wall?: WallSide } | null {
    return scene?.getDropTarget(clientX, clientY, wallMounted) ?? null
  },
})
</script>
