<template>
  <div class="fixed inset-0 select-none overflow-hidden bg-slate-900">
    <!-- Scene -->
    <div class="absolute inset-0">
      <RoomCanvas
        ref="canvasRef"
        :room="room"
        editable
        :selected-id="selectedId"
        :transform-mode="transformMode"
        :force-mode="previewMode === 'live' ? null : previewMode"
        @select="selectedId = $event"
        @object-change="onObjectChange"
      />
    </div>

    <!-- Top bar -->
    <div class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2 sm:p-3">
      <div class="pointer-events-auto flex min-w-0 items-center gap-1 rounded-2xl bg-default/70 ring-1 ring-white/10 p-1 pr-3 shadow-lg backdrop-blur-xl">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" aria-label="Back to page editor" @click="emit('back')" />
        <div class="min-w-0">
          <p class="truncate text-sm font-semibold text-highlighted">3D Room</p>
          <p class="truncate text-xs text-muted">perlink.to/{{ username }}</p>
        </div>
        <span v-if="dirty" class="ml-1 size-2 shrink-0 rounded-full bg-amber-500" title="Unsaved changes" />
      </div>

      <div class="pointer-events-auto flex items-center gap-1 rounded-2xl bg-default/70 ring-1 ring-white/10 p-1 shadow-lg backdrop-blur-xl">
        <UTooltip text="Undo (Ctrl+Z)">
          <UButton icon="i-lucide-undo-2" color="neutral" variant="ghost" :disabled="!canUndo" @click="undo" />
        </UTooltip>
        <UTooltip text="Redo (Ctrl+Shift+Z)">
          <UButton icon="i-lucide-redo-2" color="neutral" variant="ghost" :disabled="!canRedo" @click="redo" />
        </UTooltip>
        <UTooltip :text="previewLabel">
          <UButton :icon="previewIcon" color="neutral" variant="ghost" @click="cyclePreview" />
        </UTooltip>
        <UTooltip text="Reset view">
          <UButton icon="i-lucide-scan" color="neutral" variant="ghost" class="hidden sm:inline-flex" @click="canvasRef?.resetView()" />
        </UTooltip>
        <UButton icon="i-lucide-save" :loading="saving" color="neutral" variant="soft" @click="emit('save')">
          <span class="hidden sm:inline">Save</span>
        </UButton>
        <UButton icon="i-lucide-globe" :loading="publishing" @click="emit('publish')">
          <span class="hidden sm:inline">Publish</span>
        </UButton>
      </div>
    </div>

    <!-- Bottom area: selected object panel + inventory bar -->
    <div ref="barRef" class="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-2 sm:p-3">
      <!-- Selected object -->
      <div v-if="selectedObject && selectedItem" class="w-full max-w-3xl rounded-2xl bg-default/75 ring-1 ring-white/10 p-3 shadow-xl backdrop-blur-xl">
        <div class="flex flex-wrap items-center gap-2">
          <img v-if="thumbnails[selectedItem.type]" :src="thumbnails[selectedItem.type]" :alt="selectedItem.name" class="size-9 object-contain">
          <p class="mr-auto font-semibold text-highlighted">{{ selectedItem.name }}</p>

          <div class="flex items-center rounded-xl bg-elevated p-0.5">
            <UButton
              size="sm"
              icon="i-lucide-move"
              :color="transformMode === 'translate' ? 'primary' : 'neutral'"
              :variant="transformMode === 'translate' ? 'solid' : 'ghost'"
              aria-label="Move"
              @click="transformMode = 'translate'"
            />
            <UButton
              v-if="!selectedItem.wallMounted"
              size="sm"
              icon="i-lucide-rotate-3d"
              :color="transformMode === 'rotate' ? 'primary' : 'neutral'"
              :variant="transformMode === 'rotate' ? 'solid' : 'ghost'"
              aria-label="Rotate freely"
              @click="transformMode = 'rotate'"
            />
          </div>
          <template v-if="!selectedItem.wallMounted">
            <UButton size="sm" icon="i-lucide-rotate-ccw" color="neutral" variant="soft" aria-label="Rotate left" @click="rotateBy(-45)" />
            <UButton size="sm" icon="i-lucide-rotate-cw" color="neutral" variant="soft" aria-label="Rotate right" @click="rotateBy(45)" />
          </template>
          <USelect
            v-else
            size="sm"
            :model-value="selectedObject.wall || 'back'"
            :items="wallOptions"
            class="w-32"
            @update:model-value="moveToWall($event as WallSide)"
          />
          <div class="flex items-center rounded-xl bg-elevated">
            <UButton size="sm" icon="i-lucide-minus" color="neutral" variant="ghost" aria-label="Smaller" @click="scaleBy(-0.1)" />
            <span class="w-11 text-center text-xs tabular-nums text-default">{{ Math.round(selectedObject.scale * 100) }}%</span>
            <UButton size="sm" icon="i-lucide-plus" color="neutral" variant="ghost" aria-label="Bigger" @click="scaleBy(0.1)" />
          </div>
          <UPopover>
            <UButton size="sm" icon="i-lucide-link" :color="selectedObject.link?.url ? 'primary' : 'neutral'" variant="soft" aria-label="Link">
              <span class="hidden sm:inline">{{ selectedObject.link?.url ? 'Linked' : 'Link' }}</span>
            </UButton>
            <template #content>
              <div class="w-72 space-y-2 p-3">
                <p class="text-sm font-medium text-highlighted">Link</p>
                <p class="text-xs text-muted">Visitors click this object to open the link.</p>
                <UInput :model-value="selectedObject.link?.label || ''" placeholder="Label, e.g. My Instagram" class="w-full" @update:model-value="updateLink({ label: String($event) })" />
                <UInput :model-value="selectedObject.link?.url || ''" placeholder="https://..." icon="i-lucide-link" class="w-full" @update:model-value="updateLink({ url: String($event) })" />
              </div>
            </template>
          </UPopover>
          <UButton size="sm" icon="i-lucide-copy" color="neutral" variant="soft" aria-label="Duplicate" @click="duplicateSelected" />
          <UButton size="sm" icon="i-lucide-trash-2" color="error" variant="soft" aria-label="Delete" @click="removeSelected" />
          <UButton size="sm" icon="i-lucide-check" aria-label="Done" @click="selectedId = null" />
        </div>

        <div class="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            v-for="color in palette"
            :key="color"
            type="button"
            class="size-7 shrink-0 rounded-full border-2 transition hover:scale-110"
            :class="(selectedObject.color || selectedItem.defaultColor).toLowerCase() === color ? 'border-perlink-blue ring-2 ring-perlink-blue/30' : 'border-white shadow'"
            :style="{ background: color }"
            :aria-label="`Color ${color}`"
            @click="updateSelected({ color })"
          />
          <label class="relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)] shadow" aria-label="Custom color">
            <input type="color" class="absolute inset-0 cursor-pointer opacity-0" :value="selectedObject.color || selectedItem.defaultColor" @input="updateSelected({ color: ($event.target as HTMLInputElement).value })">
          </label>
          <button
            type="button"
            class="ml-1 shrink-0 rounded-full px-2 py-1 text-xs text-muted hover:bg-elevated"
            @click="updateSelected({ color: undefined })"
          >
            Reset color
          </button>
        </div>
      </div>

      <!-- Inventory bar -->
      <div class="w-full max-w-5xl overflow-hidden rounded-2xl bg-default/75 ring-1 ring-white/10 shadow-xl backdrop-blur-xl">
        <!-- Tray -->
        <div v-show="trayOpen" class="border-b border-default">
          <!-- Catalog items -->
          <div v-if="activeCategory" class="flex gap-2 overflow-x-auto p-3">
            <button
              v-for="item in activeItems"
              :key="item.type"
              type="button"
              class="group flex w-20 shrink-0 touch-pan-x flex-col items-center gap-1 rounded-xl border border-default bg-elevated/50 p-1.5 transition hover:-translate-y-0.5 hover:border-perlink-blue hover:shadow-md sm:w-24"
              :title="`Drag into the room or tap to add`"
              @pointerdown="onItemPointerDown($event, item.type)"
              @click.prevent
            >
              <div class="flex aspect-square w-full items-center justify-center">
                <img v-if="thumbnails[item.type]" :src="thumbnails[item.type]" :alt="item.name" class="size-full object-contain transition group-hover:scale-105" draggable="false">
                <USkeleton v-else class="size-3/4 rounded-lg" />
              </div>
              <span class="w-full truncate text-center text-[11px] font-medium text-default">{{ item.name }}</span>
            </button>
          </div>

          <!-- Room style -->
          <div v-else-if="activeTab === 'room'" class="flex items-stretch gap-4 overflow-x-auto p-3">
            <div class="shrink-0">
              <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Style</p>
              <div class="flex gap-2">
                <button
                  v-for="preset in ROOM_STYLE_PRESETS"
                  :key="preset.name"
                  type="button"
                  class="w-20 overflow-hidden rounded-xl border border-default text-left transition hover:border-perlink-blue"
                  @click="updateStyle(preset.style)"
                >
                  <div class="relative h-12" :style="{ background: preset.style.wallColor }">
                    <div class="absolute inset-x-0 bottom-0 h-4" :style="{ background: preset.style.floorColor }" />
                  </div>
                  <p class="truncate px-1.5 py-1 text-[11px] text-default">{{ preset.name }}</p>
                </button>
              </div>
            </div>

            <div class="shrink-0">
              <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Floor</p>
              <div class="flex gap-2">
                <button
                  v-for="floor in floorOptions"
                  :key="floor.value"
                  type="button"
                  class="w-16 overflow-hidden rounded-xl border-2 text-left transition"
                  :class="room.style.floorMaterial === floor.value ? 'border-perlink-blue' : 'border-default hover:border-accented'"
                  @click="updateStyle({ floorMaterial: floor.value })"
                >
                  <div class="h-12" :style="{ backgroundColor: room.style.floorColor, backgroundImage: floorPreviews[floor.value] ? `url(${floorPreviews[floor.value]})` : undefined, backgroundSize: 'cover', backgroundBlendMode: 'multiply' }" />
                  <p class="px-1.5 py-1 text-[11px] text-default">{{ floor.label }}</p>
                </button>
              </div>
            </div>

            <div class="shrink-0">
              <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Colors</p>
              <div class="flex gap-3">
                <label v-for="field in colorFields" :key="field.key" class="flex cursor-pointer flex-col items-center gap-1">
                  <span class="relative size-11 rounded-full border-2 border-white shadow" :style="{ background: room.style[field.key] }">
                    <input type="color" class="absolute inset-0 cursor-pointer opacity-0" :value="room.style[field.key]" @input="updateStyle({ [field.key]: ($event.target as HTMLInputElement).value })">
                  </span>
                  <span class="text-[11px] text-default">{{ field.label }}</span>
                </label>
              </div>
            </div>

            <div class="shrink-0">
              <p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">Size</p>
              <div class="space-y-1">
                <div v-for="dim in sizeFields" :key="dim.key" class="flex items-center gap-1">
                  <span class="w-12 text-[11px] text-muted">{{ dim.label }}</span>
                  <UButton size="xs" icon="i-lucide-minus" color="neutral" variant="soft" @click="stepSize(dim, -1)" />
                  <span class="w-12 text-center text-xs tabular-nums text-highlighted">{{ room.style[dim.key] }} m</span>
                  <UButton size="xs" icon="i-lucide-plus" color="neutral" variant="soft" @click="stepSize(dim, 1)" />
                </div>
              </div>
            </div>
          </div>

          <!-- Day & night -->
          <div v-else-if="activeTab === 'time'" class="flex items-stretch gap-3 overflow-x-auto p-3">
            <button
              v-for="mode in dayNightModes"
              :key="mode.value"
              type="button"
              class="flex w-32 shrink-0 flex-col gap-1 rounded-xl border-2 p-2.5 text-left transition"
              :class="room.environment.mode === mode.value ? 'border-perlink-blue bg-perlink-blue/5' : 'border-default hover:border-accented'"
              @click="updateEnvironment({ mode: mode.value })"
            >
              <UIcon :name="mode.icon" class="size-6" :class="mode.iconClass" />
              <span class="text-sm font-semibold text-highlighted">{{ mode.label }}</span>
              <span class="text-[11px] leading-snug text-muted">{{ mode.description }}</span>
            </button>

            <div v-if="room.environment.mode === 'cycle'" class="flex shrink-0 flex-col justify-center gap-2 rounded-xl bg-elevated/60 px-3">
              <div v-for="phase in cycleFields" :key="phase.key" class="flex items-center gap-1">
                <UIcon :name="phase.icon" class="size-4 text-muted" />
                <span class="w-10 text-xs text-muted">{{ phase.label }}</span>
                <UButton size="xs" icon="i-lucide-minus" color="neutral" variant="soft" @click="stepCycle(phase.key, -0.5)" />
                <span class="w-14 text-center text-xs tabular-nums text-highlighted">{{ room.environment[phase.key] }} min</span>
                <UButton size="xs" icon="i-lucide-plus" color="neutral" variant="soft" @click="stepCycle(phase.key, 0.5)" />
              </div>
            </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex items-center gap-1 overflow-x-auto p-1.5">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            type="button"
            class="flex shrink-0 flex-col items-center gap-0.5 rounded-xl px-3 py-1.5 text-[11px] font-medium transition sm:flex-row sm:gap-1.5 sm:text-sm"
            :class="activeTab === tab.value && trayOpen ? 'bg-perlink-blue text-white shadow' : 'text-muted hover:bg-elevated'"
            @click="selectTab(tab.value)"
          >
            <UIcon :name="tab.icon" class="size-5 sm:size-4" />
            {{ tab.label }}
          </button>
          <UButton
            class="ml-auto shrink-0"
            :icon="trayOpen ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
            color="neutral"
            variant="ghost"
            :aria-label="trayOpen ? 'Hide tray' : 'Show tray'"
            @click="trayOpen = !trayOpen"
          />
        </div>
      </div>
    </div>

    <!-- Drag ghost -->
    <div
      v-if="drag.active && drag.type"
      class="pointer-events-none fixed z-50 size-20 -translate-x-1/2 -translate-y-1/2 transition-opacity"
      :class="drag.overStage ? 'opacity-100' : 'opacity-50'"
      :style="{ left: `${drag.x}px`, top: `${drag.y}px` }"
    >
      <img v-if="thumbnails[drag.type]" :src="thumbnails[drag.type]" alt="" class="size-full object-contain drop-shadow-xl">
    </div>

    <!-- First-run hint -->
    <p
      v-if="room.objects.length === 0"
      class="pointer-events-none absolute inset-x-0 top-1/3 text-center text-sm font-medium text-white drop-shadow"
    >
      Drag furniture from the bar below into your room
    </p>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { DayNightMode, FloorMaterial, RoomConfig, RoomObject, RoomObjectLink, RoomStyle, WallSide } from '~/types/room'
import { ROOM_CATALOG, CATALOG_BY_TYPE, CATEGORY_LABELS, type CatalogCategory } from '~/utils/room/catalog'
import type { TransformMode } from '~/utils/room/RoomScene'
import { createFloorTexture } from '~/utils/room/RoomScene'
import { getDaylight } from '~/utils/room/daylight'
import { ROOM_STYLE_PRESETS } from '~/data/roomPresets'

defineProps<{
  username: string
  saving?: boolean
  publishing?: boolean
  dirty?: boolean
}>()

const emit = defineEmits<{
  back: []
  save: []
  publish: []
}>()

const room = defineModel<RoomConfig>('room', { required: true })

type Tab = CatalogCategory | 'room' | 'time'

const canvasRef = ref<{ resetView: () => void; getDropTarget: (x: number, y: number, wall: boolean) => { position: [number, number, number]; wall?: WallSide } | null } | null>(null)
const barRef = ref<HTMLElement | null>(null)
const selectedId = ref<string | null>(null)
const transformMode = ref<TransformMode>('translate')
const activeTab = ref<Tab>('furniture')
const trayOpen = ref(true)
const previewMode = ref<'live' | 'day' | 'night'>('live')
const thumbnails = useRoomThumbnails()

const CATEGORY_ICONS: Record<CatalogCategory, string> = {
  furniture: 'i-lucide-sofa',
  lighting: 'i-lucide-lamp',
  decor: 'i-lucide-sprout',
  wall: 'i-lucide-frame',
  tech: 'i-lucide-monitor',
}

const tabs = computed<{ value: Tab; label: string; icon: string }[]>(() => [
  ...(Object.keys(CATEGORY_LABELS) as CatalogCategory[]).map(c => ({ value: c, label: CATEGORY_LABELS[c], icon: CATEGORY_ICONS[c] })),
  { value: 'room', label: 'Room', icon: 'i-lucide-paint-roller' },
  { value: 'time', label: 'Day & night', icon: 'i-lucide-sun-moon' },
])

const activeCategory = computed(() => (activeTab.value in CATEGORY_LABELS ? (activeTab.value as CatalogCategory) : null))
const activeItems = computed(() => ROOM_CATALOG.filter(i => i.category === activeCategory.value))

const palette = ['#f5f5f2', '#2f2f36', '#8b5e3c', '#d9b382', '#c0605a', '#e76f51', '#e9c46a', '#4f8a4b', '#2a9d8f', '#6c8ebf', '#8338ec', '#ff4fd8']

const wallOptions = [
  { label: 'Back wall', value: 'back' },
  { label: 'Left wall', value: 'left' },
]

const floorOptions: { label: string; value: FloorMaterial }[] = [
  { label: 'Wood', value: 'wood' },
  { label: 'Tile', value: 'tile' },
  { label: 'Carpet', value: 'carpet' },
  { label: 'Concrete', value: 'concrete' },
]

const colorFields: { key: 'wallColor' | 'floorColor' | 'trimColor'; label: string }[] = [
  { key: 'wallColor', label: 'Walls' },
  { key: 'floorColor', label: 'Floor' },
  { key: 'trimColor', label: 'Trim' },
]

const sizeFields: { key: 'width' | 'depth' | 'height'; label: string; min: number; max: number; step: number }[] = [
  { key: 'width', label: 'Width', min: 4, max: 10, step: 0.5 },
  { key: 'depth', label: 'Depth', min: 4, max: 10, step: 0.5 },
  { key: 'height', label: 'Height', min: 2.6, max: 4, step: 0.2 },
]

const dayNightModes: { value: DayNightMode; label: string; description: string; icon: string; iconClass: string }[] = [
  { value: 'auto', label: 'Real time', description: "Follows each visitor's local clock", icon: 'i-lucide-clock', iconClass: 'text-perlink-blue' },
  { value: 'cycle', label: 'Custom cycle', description: 'Loop day and night, e.g. 1 min each', icon: 'i-lucide-refresh-cw', iconClass: 'text-violet-500' },
  { value: 'day', label: 'Always day', description: 'Sunny all the time', icon: 'i-lucide-sun', iconClass: 'text-amber-500' },
  { value: 'night', label: 'Always night', description: 'Lamps always on', icon: 'i-lucide-moon', iconClass: 'text-indigo-500' },
]

const cycleFields: { key: 'dayMinutes' | 'nightMinutes'; label: string; icon: string }[] = [
  { key: 'dayMinutes', label: 'Day', icon: 'i-lucide-sun' },
  { key: 'nightMinutes', label: 'Night', icon: 'i-lucide-moon' },
]

// Floor texture swatches, tinted with the floor color via CSS multiply
const floorPreviews = reactive<Partial<Record<FloorMaterial, string>>>({})
onMounted(() => {
  for (const floor of floorOptions) {
    const texture = createFloorTexture(floor.value, 3, 3)
    floorPreviews[floor.value] = (texture.image as HTMLCanvasElement).toDataURL('image/png')
    texture.dispose()
  }
})

const selectedObject = computed(() => room.value.objects.find(o => o.id === selectedId.value) || null)
const selectedItem = computed(() => (selectedObject.value ? CATALOG_BY_TYPE[selectedObject.value.type] : undefined))

// ---------- Day/night preview ----------

const now = ref(new Date())
let clock: ReturnType<typeof setInterval> | undefined

const previewIcon = computed(() => {
  if (previewMode.value === 'day') return 'i-lucide-sun'
  if (previewMode.value === 'night') return 'i-lucide-moon'
  return getDaylight(room.value.environment, now.value).isDay ? 'i-lucide-sun-dim' : 'i-lucide-moon-star'
})

const previewLabel = computed(() => ({
  live: 'Preview: live (click for day)',
  day: 'Preview: day (click for night)',
  night: 'Preview: night (click for live)',
})[previewMode.value])

function cyclePreview() {
  previewMode.value = previewMode.value === 'live' ? 'day' : previewMode.value === 'day' ? 'night' : 'live'
}

// On small screens give the room more space while an object is being edited
watch(selectedId, (id) => {
  if (id && window.innerWidth < 640) trayOpen.value = false
})

function selectTab(tab: Tab) {
  if (activeTab.value === tab) trayOpen.value = !trayOpen.value
  else {
    activeTab.value = tab
    trayOpen.value = true
  }
}

// ---------- History (undo / redo) ----------

const history = ref<string[]>([JSON.stringify(room.value)])
const historyIndex = ref(0)
let restoring = false
let historyTimer: ReturnType<typeof setTimeout> | undefined

watch(room, (value) => {
  if (restoring) return
  clearTimeout(historyTimer)
  // Group rapid changes (color drags, typing) into one undo step
  historyTimer = setTimeout(() => {
    const snapshot = JSON.stringify(value)
    if (snapshot === history.value[historyIndex.value]) return
    history.value = [...history.value.slice(0, historyIndex.value + 1), snapshot].slice(-60)
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
  if (!CATALOG_BY_TYPE[type]) return
  const object: RoomObject = { id: nanoid(8), type, position, rotation: 0, scale: 1, ...(wall && { wall }) }
  setObjects([...room.value.objects, object])
  selectedId.value = object.id
  transformMode.value = 'translate'
}

function addAtDefault(type: string) {
  const item = CATALOG_BY_TYPE[type]
  if (!item) return
  const { depth, height } = room.value.style
  // Nudge repeated taps so new objects don't stack exactly on top of each other
  const offset = (room.value.objects.length % 5) * 0.3 - 0.6
  if (item.wallMounted) addObject(type, [offset, Math.min(1.7, height - 0.6), -depth / 2], 'back')
  else addObject(type, [offset, 0, offset])
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

function rotateBy(degrees: number) {
  const obj = selectedObject.value
  if (!obj) return
  updateSelected({ rotation: (((obj.rotation + degrees) % 360) + 360) % 360 })
}

function scaleBy(delta: number) {
  const obj = selectedObject.value
  if (!obj) return
  updateSelected({ scale: Math.round(Math.min(2, Math.max(0.5, obj.scale + delta)) * 100) / 100 })
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
  const [x, y, z] = obj.position
  const offset: [number, number, number] = CATALOG_BY_TYPE[obj.type]?.wallMounted
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

function updateStyle(patch: Partial<RoomStyle>) {
  room.value = { ...room.value, style: { ...room.value.style, ...patch } }
}

function stepSize(dim: (typeof sizeFields)[number], direction: number) {
  const value = Math.round((room.value.style[dim.key] + dim.step * direction) * 10) / 10
  updateStyle({ [dim.key]: Math.min(dim.max, Math.max(dim.min, value)) })
}

function updateEnvironment(patch: Partial<RoomConfig['environment']>) {
  room.value = { ...room.value, environment: { ...room.value.environment, ...patch } }
}

function stepCycle(key: 'dayMinutes' | 'nightMinutes', delta: number) {
  updateEnvironment({ [key]: Math.min(60, Math.max(0.5, room.value.environment[key] + delta)) })
}

// ---------- Drag from the inventory (mouse and touch) ----------

const drag = reactive({ type: null as string | null, active: false, x: 0, y: 0, overStage: false })
let dragStart = { x: 0, y: 0 }

function onItemPointerDown(event: PointerEvent, type: string) {
  if (event.button !== 0) return
  drag.type = type
  drag.active = false
  dragStart = { x: event.clientX, y: event.clientY }
  window.addEventListener('pointermove', onDragMove, { passive: false })
  window.addEventListener('pointerup', onDragEnd)
  window.addEventListener('pointercancel', cancelDrag)
}

function onDragMove(event: PointerEvent) {
  const dx = event.clientX - dragStart.x
  const dy = event.clientY - dragStart.y
  if (!drag.active) {
    // Pulling up out of the tray starts a drag; sideways movement scrolls the tray
    if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx)) drag.active = true
    else if (Math.abs(dx) > 8) return cancelDrag()
    else return
  }
  event.preventDefault()
  drag.x = event.clientX
  drag.y = event.clientY
  const target = document.elementFromPoint(event.clientX, event.clientY)
  drag.overStage = !!target && !barRef.value?.contains(target)
}

function onDragEnd(event: PointerEvent) {
  const type = drag.type
  if (type) {
    if (!drag.active) addAtDefault(type)
    else if (drag.overStage) {
      const item = CATALOG_BY_TYPE[type]
      const target = canvasRef.value?.getDropTarget(event.clientX, event.clientY, !!item?.wallMounted)
      if (target) addObject(type, target.position, target.wall)
      else addAtDefault(type)
    }
  }
  cancelDrag()
}

function cancelDrag() {
  drag.type = null
  drag.active = false
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', onDragEnd)
  window.removeEventListener('pointercancel', cancelDrag)
}

// ---------- Keyboard ----------

function onKeydown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest('input, textarea, select, [contenteditable="true"]')) return
  const mod = event.metaKey || event.ctrlKey
  const key = event.key.toLowerCase()

  if (mod && key === 's') {
    event.preventDefault()
    emit('save')
  } else if (mod && key === 'z') {
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
  } else if (key === 'r' && selectedId.value) {
    if (event.shiftKey) transformMode.value = 'rotate'
    else rotateBy(45)
  }
}

onMounted(() => {
  clock = setInterval(() => (now.value = new Date()), 1000)
  window.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  clearInterval(clock)
  window.removeEventListener('keydown', onKeydown)
  cancelDrag()
})
</script>
