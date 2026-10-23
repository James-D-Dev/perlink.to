<template>
  <div class="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white lg:h-[calc(100vh-14rem)] lg:min-h-[560px] lg:flex-row">
    <!-- Canvas -->
    <div
      class="relative h-[60vh] min-h-[380px] lg:h-auto lg:flex-1"
      :class="isDragOver && 'ring-2 ring-inset ring-perlink-blue'"
      @dragover.prevent="isDragOver = true"
      @dragleave="isDragOver = false"
      @drop.prevent="onDrop"
    >
      <RoomCanvas
        ref="canvasRef"
        :room="room"
        editable
        :selected-id="selectedId"
        :transform-mode="transformMode"
        :preview-hour="previewEnabled ? previewHour : null"
        @select="selectedId = $event"
        @object-change="onObjectChange"
      />

      <!-- Toolbar -->
      <div class="absolute left-3 top-3 flex flex-wrap items-center gap-1 rounded-lg bg-white/90 p-1 shadow-md backdrop-blur">
        <UTooltip text="Move (G)">
          <UButton
            icon="i-lucide-move"
            size="sm"
            :color="transformMode === 'translate' ? 'primary' : 'neutral'"
            :variant="transformMode === 'translate' ? 'solid' : 'ghost'"
            @click="transformMode = 'translate'"
          />
        </UTooltip>
        <UTooltip text="Rotate (R)">
          <UButton
            icon="i-lucide-rotate-cw"
            size="sm"
            :color="transformMode === 'rotate' ? 'primary' : 'neutral'"
            :variant="transformMode === 'rotate' ? 'solid' : 'ghost'"
            @click="transformMode = 'rotate'"
          />
        </UTooltip>
        <USeparator orientation="vertical" class="h-6" />
        <UTooltip text="Undo (Ctrl+Z)">
          <UButton icon="i-lucide-undo-2" size="sm" color="neutral" variant="ghost" :disabled="!canUndo" @click="undo" />
        </UTooltip>
        <UTooltip text="Redo (Ctrl+Shift+Z)">
          <UButton icon="i-lucide-redo-2" size="sm" color="neutral" variant="ghost" :disabled="!canRedo" @click="redo" />
        </UTooltip>
        <template v-if="selectedObject">
          <USeparator orientation="vertical" class="h-6" />
          <UTooltip text="Duplicate (Ctrl+D)">
            <UButton icon="i-lucide-copy" size="sm" color="neutral" variant="ghost" @click="duplicateSelected" />
          </UTooltip>
          <UTooltip text="Delete (Del)">
            <UButton icon="i-lucide-trash-2" size="sm" color="error" variant="ghost" @click="removeSelected" />
          </UTooltip>
        </template>
      </div>

      <!-- Time of day preview -->
      <div class="absolute bottom-3 left-3 right-3 mx-auto flex max-w-md items-center gap-3 rounded-lg bg-white/90 px-3 py-2 shadow-md backdrop-blur">
        <USwitch v-model="previewEnabled" size="sm" />
        <UIcon :name="previewIcon" class="size-4 shrink-0 text-gray-600" />
        <USlider v-model="previewHour" :min="0" :max="24" :step="0.25" :disabled="!previewEnabled" class="flex-1" />
        <span class="w-24 text-right text-xs tabular-nums text-gray-600">
          {{ previewEnabled ? formatHour(previewHour) : liveLabel }}
        </span>
      </div>

      <p v-if="room.objects.length === 0" class="pointer-events-none absolute inset-x-0 top-1/3 text-center text-sm text-gray-500">
        Drag objects from the right panel into the room
      </p>
    </div>

    <!-- Right bar -->
    <aside class="flex w-full flex-col border-t border-gray-200 lg:w-80 lg:border-l lg:border-t-0">
      <!-- Inspector -->
      <div v-if="selectedObject && selectedItem" class="space-y-4 border-b border-gray-200 p-4">
        <div class="flex items-center gap-2">
          <UIcon :name="selectedItem.icon" class="size-5 text-perlink-blue" />
          <h3 class="flex-1 font-semibold text-gray-900">{{ selectedItem.name }}</h3>
          <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" @click="selectedId = null" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <UFormField label="Color">
            <input
              type="color"
              :value="selectedObject.color || selectedItem.defaultColor"
              class="h-9 w-full cursor-pointer rounded-md border border-gray-200"
              @input="updateSelected({ color: ($event.target as HTMLInputElement).value })"
            >
          </UFormField>
          <UFormField v-if="selectedItem.wallMounted" label="Wall">
            <USelect
              :model-value="selectedObject.wall || 'back'"
              :items="wallOptions"
              @update:model-value="moveToWall($event as WallSide)"
            />
          </UFormField>
        </div>

        <UFormField v-if="!selectedItem.wallMounted" :label="`Rotation · ${selectedObject.rotation}°`">
          <USlider
            :model-value="selectedObject.rotation"
            :min="0"
            :max="345"
            :step="15"
            @update:model-value="updateSelected({ rotation: $event as number })"
          />
        </UFormField>

        <UFormField :label="`Size · ${Math.round(selectedObject.scale * 100)}%`">
          <USlider
            :model-value="selectedObject.scale"
            :min="0.5"
            :max="2"
            :step="0.05"
            @update:model-value="updateSelected({ scale: $event as number })"
          />
        </UFormField>

        <div class="space-y-2">
          <p class="text-sm font-medium text-gray-700">Link</p>
          <p class="text-xs text-gray-500">Visitors can click this object to open the link.</p>
          <UInput
            :model-value="selectedObject.link?.label || ''"
            placeholder="Label, e.g. My Instagram"
            class="w-full"
            @update:model-value="updateLink({ label: String($event) })"
          />
          <UInput
            :model-value="selectedObject.link?.url || ''"
            placeholder="https://..."
            icon="i-lucide-link"
            class="w-full"
            @update:model-value="updateLink({ url: String($event) })"
          />
        </div>
      </div>

      <UTabs v-model="activeTab" :items="tabs" variant="link" class="flex min-h-0 flex-1 flex-col gap-0" :ui="{ list: 'px-2', content: 'min-h-0 flex-1 overflow-y-auto' }">
        <!-- Objects -->
        <template #objects>
          <div class="space-y-4 p-4">
            <div v-for="group in catalogGroups" :key="group.category">
              <p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">{{ group.label }}</p>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="item in group.items"
                  :key="item.type"
                  type="button"
                  draggable="true"
                  class="flex cursor-grab flex-col items-center gap-1 rounded-lg border border-gray-200 p-2 text-gray-700 transition hover:border-perlink-blue hover:bg-perlink-blue/5 active:cursor-grabbing"
                  :title="`Drag into the room, or click to add`"
                  @dragstart="onDragStart($event, item.type)"
                  @dragend="isDragOver = false"
                  @click="addAtDefault(item.type)"
                >
                  <UIcon :name="item.icon" class="size-6" />
                  <span class="text-[11px] leading-tight">{{ item.name }}</span>
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- Room style -->
        <template #room>
          <div class="space-y-5 p-4">
            <div>
              <p class="mb-2 text-sm font-medium text-gray-700">Presets</p>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="preset in ROOM_STYLE_PRESETS"
                  :key="preset.name"
                  type="button"
                  class="overflow-hidden rounded-lg border border-gray-200 text-left transition hover:border-perlink-blue"
                  @click="applyStylePreset(preset.style)"
                >
                  <div class="flex h-10">
                    <div class="flex-1" :style="{ background: preset.style.wallColor }" />
                    <div class="flex-1" :style="{ background: preset.style.floorColor }" />
                  </div>
                  <p class="px-2 py-1 text-xs text-gray-700">{{ preset.name }}</p>
                </button>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <UFormField label="Wall">
                <input type="color" :value="room.style.wallColor" class="h-9 w-full cursor-pointer rounded-md border border-gray-200" @input="updateStyle({ wallColor: ($event.target as HTMLInputElement).value })">
              </UFormField>
              <UFormField label="Trim">
                <input type="color" :value="room.style.trimColor" class="h-9 w-full cursor-pointer rounded-md border border-gray-200" @input="updateStyle({ trimColor: ($event.target as HTMLInputElement).value })">
              </UFormField>
              <UFormField label="Floor">
                <input type="color" :value="room.style.floorColor" class="h-9 w-full cursor-pointer rounded-md border border-gray-200" @input="updateStyle({ floorColor: ($event.target as HTMLInputElement).value })">
              </UFormField>
              <UFormField label="Floor type">
                <USelect :model-value="room.style.floorMaterial" :items="floorOptions" @update:model-value="updateStyle({ floorMaterial: $event as FloorMaterial })" />
              </UFormField>
            </div>

            <UFormField :label="`Width · ${room.style.width} m`">
              <USlider :model-value="room.style.width" :min="4" :max="10" :step="0.5" @update:model-value="updateStyle({ width: $event as number })" />
            </UFormField>
            <UFormField :label="`Depth · ${room.style.depth} m`">
              <USlider :model-value="room.style.depth" :min="4" :max="10" :step="0.5" @update:model-value="updateStyle({ depth: $event as number })" />
            </UFormField>
            <UFormField :label="`Wall height · ${room.style.height} m`">
              <USlider :model-value="room.style.height" :min="2.6" :max="4" :step="0.1" @update:model-value="updateStyle({ height: $event as number })" />
            </UFormField>
          </div>
        </template>

        <!-- Day & night -->
        <template #lighting>
          <div class="space-y-5 p-4">
            <URadioGroup
              :model-value="room.environment.mode"
              :items="dayNightOptions"
              @update:model-value="updateEnvironment({ mode: $event as DayNightMode })"
            />

            <div v-if="room.environment.mode === 'cycle'" class="grid grid-cols-2 gap-3">
              <UFormField label="Day (minutes)">
                <UInputNumber :model-value="room.environment.dayMinutes" :min="0.5" :max="60" :step="0.5" @update:model-value="updateEnvironment({ dayMinutes: Number($event) || 1 })" />
              </UFormField>
              <UFormField label="Night (minutes)">
                <UInputNumber :model-value="room.environment.nightMinutes" :min="0.5" :max="60" :step="0.5" @update:model-value="updateEnvironment({ nightMinutes: Number($event) || 1 })" />
              </UFormField>
            </div>

            <div class="rounded-lg bg-gray-50 p-3 text-xs leading-relaxed text-gray-600">
              <UIcon name="i-lucide-lightbulb" class="mr-1 inline size-3.5 align-[-2px] text-amber-500" />
              At night the sky darkens, stars come out and every lamp, candle, neon sign and string light in the room turns on.
              Use the time slider under the room to preview any hour.
            </div>
          </div>
        </template>
      </UTabs>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { TabsItem } from '@nuxt/ui'
import type { DayNightMode, FloorMaterial, RoomConfig, RoomObject, RoomObjectLink, RoomStyle, WallSide } from '~/types/room'
import { ROOM_CATALOG, CATALOG_BY_TYPE, CATEGORY_LABELS, type CatalogCategory } from '~/utils/room/catalog'
import type { TransformMode } from '~/utils/room/RoomScene'
import { getDaylight } from '~/utils/room/daylight'
import { ROOM_STYLE_PRESETS } from '~/data/roomPresets'

const room = defineModel<RoomConfig>('room', { required: true })

const canvasRef = ref<{ getDropTarget: (x: number, y: number, wall: boolean) => { position: [number, number, number]; wall?: WallSide } | null } | null>(null)
const selectedId = ref<string | null>(null)
const transformMode = ref<TransformMode>('translate')
const activeTab = ref('objects')
const isDragOver = ref(false)
const previewEnabled = ref(false)
const previewHour = ref(20)
const now = ref(new Date())

const tabs: TabsItem[] = [
  { label: 'Objects', value: 'objects', slot: 'objects' as const, icon: 'i-lucide-box' },
  { label: 'Room', value: 'room', slot: 'room' as const, icon: 'i-lucide-paint-roller' },
  { label: 'Day & night', value: 'lighting', slot: 'lighting' as const, icon: 'i-lucide-sun-moon' },
]

const wallOptions = [
  { label: 'Back wall', value: 'back' },
  { label: 'Left wall', value: 'left' },
]

const floorOptions = [
  { label: 'Wood', value: 'wood' },
  { label: 'Tile', value: 'tile' },
  { label: 'Carpet', value: 'carpet' },
  { label: 'Concrete', value: 'concrete' },
]

const dayNightOptions = [
  { label: "Visitor's local time", description: 'Day and night follow the clock of whoever is viewing.', value: 'auto' },
  { label: 'Custom cycle', description: 'Loop day and night, e.g. 1 minute each.', value: 'cycle' },
  { label: 'Always day', value: 'day' },
  { label: 'Always night', value: 'night' },
]

const catalogGroups = computed(() =>
  (Object.keys(CATEGORY_LABELS) as CatalogCategory[]).map(category => ({
    category,
    label: CATEGORY_LABELS[category],
    items: ROOM_CATALOG.filter(i => i.category === category),
  })),
)

const selectedObject = computed(() => room.value.objects.find(o => o.id === selectedId.value) || null)
const selectedItem = computed(() => (selectedObject.value ? CATALOG_BY_TYPE[selectedObject.value.type] : undefined))

const previewIcon = computed(() => {
  const hour = previewEnabled.value ? previewHour.value : null
  const isDay = hour === null ? getDaylight(room.value.environment, now.value).isDay : hour >= 6 && hour < 18
  return isDay ? 'i-lucide-sun' : 'i-lucide-moon'
})

const liveLabel = computed(() => {
  const { daylight } = getDaylight(room.value.environment, now.value)
  const mode = { auto: 'Live', cycle: 'Cycle', day: 'Day', night: 'Night' }[room.value.environment.mode]
  return `${mode} · ${Math.round(daylight * 100)}%`
})

let clock: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  clock = setInterval(() => (now.value = new Date()), 1000)
  window.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  clearInterval(clock)
  window.removeEventListener('keydown', onKeydown)
})

// ---------- History (undo / redo) ----------

const history = ref<string[]>([JSON.stringify(room.value)])
const historyIndex = ref(0)
let restoring = false
let historyTimer: ReturnType<typeof setTimeout> | undefined

watch(room, (value) => {
  if (restoring) return
  clearTimeout(historyTimer)
  // Group rapid changes (slider drags, typing) into one undo step
  historyTimer = setTimeout(() => {
    const snapshot = JSON.stringify(value)
    if (snapshot === history.value[historyIndex.value]) return
    history.value = [...history.value.slice(0, historyIndex.value + 1), snapshot].slice(-50)
    historyIndex.value = history.value.length - 1
  }, 300)
}, { deep: true })

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

function restore(index: number) {
  restoring = true
  historyIndex.value = index
  room.value = JSON.parse(history.value[index]!)
  if (selectedId.value && !room.value.objects.some(o => o.id === selectedId.value)) selectedId.value = null
  nextTick(() => (restoring = false))
}

function undo() {
  if (canUndo.value) restore(historyIndex.value - 1)
}

function redo() {
  if (canRedo.value) restore(historyIndex.value + 1)
}

// ---------- Editing ----------

function setObjects(objects: RoomObject[]) {
  room.value = { ...room.value, objects }
}

function addObject(type: string, position: [number, number, number], wall?: WallSide) {
  const item = CATALOG_BY_TYPE[type]
  if (!item) return
  const object: RoomObject = { id: nanoid(8), type, position, rotation: 0, scale: 1, ...(wall && { wall }) }
  setObjects([...room.value.objects, object])
  selectedId.value = object.id
}

function addAtDefault(type: string) {
  const item = CATALOG_BY_TYPE[type]
  if (!item) return
  const { depth, height } = room.value.style
  if (item.wallMounted) addObject(type, [0, Math.min(1.7, height - 0.6), -depth / 2], 'back')
  else addObject(type, [0, 0, 0])
}

function onDragStart(event: DragEvent, type: string) {
  event.dataTransfer?.setData('application/x-room-item', type)
  if (event.dataTransfer) event.dataTransfer.effectAllowed = 'copy'
}

function onDrop(event: DragEvent) {
  isDragOver.value = false
  const type = event.dataTransfer?.getData('application/x-room-item')
  const item = type ? CATALOG_BY_TYPE[type] : undefined
  if (!item) return
  const target = canvasRef.value?.getDropTarget(event.clientX, event.clientY, !!item.wallMounted)
  if (target) addObject(item.type, target.position, target.wall)
  else addAtDefault(item.type)
}

function onObjectChange(id: string, patch: Pick<RoomObject, 'position' | 'rotation'>) {
  setObjects(room.value.objects.map(o => (o.id === id ? { ...o, ...patch } : o)))
}

function updateSelected(patch: Partial<RoomObject>) {
  if (!selectedId.value) return
  setObjects(room.value.objects.map(o => (o.id === selectedId.value ? { ...o, ...patch } : o)))
}

function updateLink(patch: Partial<RoomObjectLink>) {
  const current = selectedObject.value?.link || { label: '', url: '' }
  const link = { ...current, ...patch }
  updateSelected({ link: link.label || link.url ? link : undefined })
}

function moveToWall(wall: WallSide) {
  const obj = selectedObject.value
  if (!obj) return
  const { width, depth } = room.value.style
  const [, y] = obj.position
  updateSelected({ wall, position: wall === 'back' ? [0, y, -depth / 2] : [-width / 2, y, 0] })
}

function duplicateSelected() {
  const obj = selectedObject.value
  if (!obj) return
  const item = CATALOG_BY_TYPE[obj.type]
  const [x, y, z] = obj.position
  const offset: [number, number, number] = item?.wallMounted
    ? (obj.wall === 'left' ? [x, y, z + 0.6] : [x + 0.6, y, z])
    : [x + 0.5, y, z + 0.5]
  const copy: RoomObject = { ...obj, id: nanoid(8), position: offset, link: obj.link ? { ...obj.link } : undefined }
  setObjects([...room.value.objects, copy])
  selectedId.value = copy.id
}

function removeSelected() {
  if (!selectedId.value) return
  setObjects(room.value.objects.filter(o => o.id !== selectedId.value))
  selectedId.value = null
}

function rotateSelected() {
  const obj = selectedObject.value
  if (!obj || CATALOG_BY_TYPE[obj.type]?.wallMounted) return
  updateSelected({ rotation: (obj.rotation + 90) % 360 })
}

function updateStyle(patch: Partial<RoomStyle>) {
  room.value = { ...room.value, style: { ...room.value.style, ...patch } }
}

function applyStylePreset(style: Partial<RoomStyle>) {
  updateStyle(style)
}

function updateEnvironment(patch: Partial<RoomConfig['environment']>) {
  room.value = { ...room.value, environment: { ...room.value.environment, ...patch } }
}

function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (target && (target.closest('input, textarea, select, [contenteditable="true"]'))) return
  const mod = event.metaKey || event.ctrlKey
  const key = event.key.toLowerCase()

  if (mod && key === 'z') {
    event.preventDefault()
    if (event.shiftKey) redo()
    else undo()
  } else if (mod && key === 'y') {
    event.preventDefault()
    redo()
  } else if (mod && key === 'd') {
    event.preventDefault()
    duplicateSelected()
  } else if ((key === 'delete' || key === 'backspace') && selectedId.value) {
    event.preventDefault()
    removeSelected()
  } else if (key === 'escape') {
    selectedId.value = null
  } else if (key === 'g') {
    transformMode.value = 'translate'
  } else if (key === 'r') {
    if (event.shiftKey) rotateSelected()
    else transformMode.value = 'rotate'
  }
}

function formatHour(hour: number) {
  const h = Math.floor(hour) % 24
  const m = Math.round((hour % 1) * 60)
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}
</script>
