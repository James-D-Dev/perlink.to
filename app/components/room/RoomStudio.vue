<template>
  <div class="fixed inset-0 select-none overflow-hidden bg-slate-900 [touch-action:pan-x_pan-y] max-sm:[&_input]:text-base max-sm:[&_textarea]:text-base">
    <!-- Scene -->
    <div class="absolute inset-0">
      <RoomCanvas
        ref="canvasRef"
        :room="room"
        editable
        :selected-id="selectedId"
        :force-mode="previewMode === 'live' ? null : previewMode"
        @select="selectedId = $event"
        @object-change="onObjectChange"
      />
    </div>

    <!-- Top bar -->
    <div class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-2 sm:p-3">
      <div class="pointer-events-auto rounded-2xl bg-default/70 p-1 shadow-lg ring-1 ring-white/10 backdrop-blur-xl">
        <UTooltip text="Back to page editor" :content="{ side: 'right' }">
          <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" aria-label="Back to page editor" @click="emit('back')" />
        </UTooltip>
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
        <UTooltip :text="dirty ? 'Unsaved changes (Ctrl+S)' : 'All changes saved'">
          <UButton icon="i-lucide-save" :loading="saving" color="neutral" variant="soft" class="relative" @click="emit('save')">
            <span class="hidden sm:inline">Save</span>
            <span v-if="dirty" class="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-amber-500 ring-2 ring-default" />
          </UButton>
        </UTooltip>
        <UButton icon="i-lucide-globe" :loading="publishing" @click="emit('publish')">
          <span class="hidden sm:inline">Publish</span>
        </UButton>
      </div>
    </div>

    <!-- Object list: pick small or overlapping objects -->
    <div
      v-if="listOpen && !detailOpen"
      class="absolute left-2 top-16 flex max-h-[min(60vh,34rem)] w-[calc(100%-5rem)] max-w-80 flex-col overflow-hidden rounded-2xl bg-default/80 shadow-xl ring-1 ring-white/10 backdrop-blur-xl sm:left-3"
    >
      <div class="flex items-center gap-2 border-b border-white/[0.08] px-3 py-2.5">
        <UIcon name="i-lucide-layers" class="size-4 text-muted" />
        <p class="flex-1 text-sm font-semibold text-highlighted">Objects <span class="font-normal text-muted">· {{ room.objects.length }}</span></p>
        <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" aria-label="Close list" @click="listOpen = false" />
      </div>
      <div class="border-b border-white/[0.08] p-2">
        <UInput v-model="listQuery" size="sm" icon="i-lucide-search" placeholder="Search objects" class="w-full" />
      </div>
      <ul class="flex-1 overflow-y-auto p-1.5">
        <li v-for="row in objectRows" :key="row.id">
          <div
            class="group flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 transition"
            :class="row.id === selectedId ? 'bg-perlink-blue/15 ring-1 ring-perlink-blue/40' : 'hover:bg-elevated'"
            role="button"
            tabindex="0"
            @click="focusFromList(row.id)"
            @keydown.enter="focusFromList(row.id)"
          >
            <div class="flex size-9 shrink-0 items-center justify-center rounded-md bg-elevated">
              <img v-if="thumbnails[row.type]" :src="thumbnails[row.type]" :alt="row.name" class="size-8 object-contain">
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-highlighted">{{ row.name }}</p>
              <p class="flex items-center gap-1 truncate text-xs text-muted">
                {{ row.place }}
                <UIcon v-if="row.linked" name="i-lucide-link" class="size-3 text-perlink-blue" />
              </p>
            </div>
            <UButton
              icon="i-lucide-trash-2"
              size="xs"
              color="error"
              variant="ghost"
              class="opacity-60 group-hover:opacity-100"
              :aria-label="`Delete ${row.name}`"
              @click.stop="removeObject(row.id)"
            />
          </div>
        </li>
        <li v-if="objectRows.length === 0" class="px-3 py-8 text-center text-sm text-muted">
          {{ room.objects.length ? 'No objects match your search.' : 'No objects yet. Add some from the bar below.' }}
        </li>
      </ul>
    </div>

    <!-- Selected object details: opened from the chip under the right dock -->
    <div
      v-if="detailOpen && selectedObject && selectedItem"
      class="absolute left-2 top-16 flex max-h-[min(60vh,34rem)] w-[calc(100%-5rem)] max-w-80 flex-col overflow-hidden rounded-2xl bg-default/80 shadow-xl ring-1 ring-white/10 backdrop-blur-xl sm:left-3"
    >
      <div class="flex items-center gap-2.5 border-b border-white/[0.08] px-3 py-2.5">
        <div class="flex size-9 shrink-0 items-center justify-center rounded-md bg-elevated">
          <img v-if="thumbnails[selectedItem.type]" :src="thumbnails[selectedItem.type]" :alt="selectedItem.name" class="size-8 object-contain">
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold text-highlighted">{{ selectedItem.name }}</p>
          <p class="truncate text-xs text-muted">
            {{ selectedItem.wallMounted ? 'Drag along the walls to move' : 'Drag to move · drop on furniture to stack' }}
          </p>
        </div>
        <UButton icon="i-lucide-x" size="xs" color="neutral" variant="ghost" aria-label="Close details" @click="detailOpen = false" />
      </div>

      <div class="flex-1 space-y-4 overflow-y-auto p-3">
        <div v-if="!selectedItem.wallMounted" class="flex items-center justify-between gap-2">
          <span class="text-xs font-medium text-muted">Rotate</span>
          <div class="flex items-center rounded-lg bg-elevated">
            <UButton size="sm" icon="i-lucide-rotate-ccw" color="neutral" variant="ghost" aria-label="Rotate left" @click="rotateBy(-45)" />
            <span class="w-10 text-center text-xs tabular-nums text-default">{{ selectedObject.rotation }}°</span>
            <UButton size="sm" icon="i-lucide-rotate-cw" color="neutral" variant="ghost" aria-label="Rotate right" @click="rotateBy(45)" />
          </div>
        </div>
        <div v-else class="flex items-center justify-between gap-2">
          <span class="text-xs font-medium text-muted">Wall</span>
          <USelect
            size="sm"
            :model-value="selectedObject.wall || 'back'"
            :items="wallOptions"
            class="w-32"
            @update:model-value="moveToWall($event as WallSide)"
          />
        </div>

        <div class="flex items-center justify-between gap-2">
          <span class="text-xs font-medium text-muted">Size</span>
          <div class="flex items-center rounded-lg bg-elevated">
            <UButton size="sm" icon="i-lucide-minus" color="neutral" variant="ghost" aria-label="Smaller" @click="scaleBy(-0.1)" />
            <span class="w-11 text-center text-xs tabular-nums text-default">{{ Math.round(selectedObject.scale * 100) }}%</span>
            <UButton size="sm" icon="i-lucide-plus" color="neutral" variant="ghost" aria-label="Bigger" @click="scaleBy(0.1)" />
          </div>
        </div>

        <div v-if="selectedItem.photo" class="space-y-2">
          <span class="flex items-center gap-1.5 text-xs font-medium text-muted">
            <UIcon name="i-lucide-image" class="size-3.5" />
            Photo
          </span>
          <div class="flex items-center gap-3">
            <div class="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-elevated ring-1 ring-white/10">
              <img v-if="selectedObject.image" :src="selectedObject.image" alt="Photo" class="size-full object-cover">
              <UIcon v-else name="i-lucide-image-plus" class="size-6 text-dimmed" />
            </div>
            <div class="flex min-w-0 flex-1 flex-col gap-1.5">
              <UButton size="sm" color="neutral" variant="soft" icon="i-lucide-upload" :loading="photoUploading" class="justify-center" @click="photoInput?.click()">
                {{ selectedObject.image ? 'Replace photo' : 'Upload photo' }}
              </UButton>
              <UButton v-if="selectedObject.image" size="sm" color="neutral" variant="ghost" icon="i-lucide-x" class="justify-center" @click="updateSelected({ image: undefined })">
                Remove
              </UButton>
            </div>
          </div>
          <p class="text-xs text-muted">Visitors click the frame to see the photo full size.</p>
          <input ref="photoInput" type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="onPhotoPicked">
        </div>

        <div v-if="!selectedItem.fromModel && !(selectedItem.photo && selectedObject.image)" class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-muted">Color</span>
            <UTooltip text="Reset to default color">
              <UButton size="xs" icon="i-lucide-rotate-ccw" color="neutral" variant="ghost" aria-label="Reset color" @click="updateSelected({ color: undefined })" />
            </UTooltip>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="color in palette"
              :key="color"
              type="button"
              class="size-7 shrink-0 rounded-full border-2 transition hover:scale-110"
              :class="(selectedObject.color || selectedItem.defaultColor).toLowerCase() === color ? 'border-perlink-blue ring-2 ring-perlink-blue/30' : 'border-white/80 shadow'"
              :style="{ background: color }"
              :aria-label="`Color ${color}`"
              @click="updateSelected({ color })"
            />
            <label class="relative flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-white/80 bg-[conic-gradient(red,yellow,lime,aqua,blue,magenta,red)] shadow" aria-label="Custom color">
              <input type="color" class="absolute inset-0 cursor-pointer opacity-0" :value="selectedObject.color || selectedItem.defaultColor" @input="updateSelected({ color: ($event.target as HTMLInputElement).value })">
            </label>
          </div>
        </div>

        <div class="space-y-2">
          <span class="flex items-center gap-1.5 text-xs font-medium text-muted">
            <UIcon name="i-lucide-link" class="size-3.5" />
            Link
          </span>
          <p class="text-xs text-muted">Visitors click this object to open the link.</p>
          <UInput :model-value="selectedObject.link?.label || ''" size="sm" placeholder="Label, e.g. My Instagram" class="w-full" @update:model-value="updateLink({ label: String($event) })" />
          <UInput :model-value="selectedObject.link?.url || ''" size="sm" placeholder="https://..." icon="i-lucide-link" class="w-full" @update:model-value="updateLink({ url: String($event) })" />
        </div>
      </div>

      <div class="flex gap-2 border-t border-white/[0.08] p-2">
        <UButton icon="i-lucide-copy" color="neutral" variant="soft" size="sm" class="flex-1 justify-center" @click="duplicateSelected">
          Duplicate
        </UButton>
        <UButton icon="i-lucide-trash-2" color="error" variant="soft" size="sm" class="flex-1 justify-center" @click="removeSelected">
          Delete
        </UButton>
      </div>
    </div>

    <!-- Camera controls -->
    <div class="absolute right-2 top-16 flex flex-col items-center gap-2 sm:right-3">
      <div class="flex flex-col items-center gap-1 rounded-2xl bg-default/70 p-1 shadow-lg ring-1 ring-white/10 backdrop-blur-xl">
        <UTooltip text="All objects in the room" :content="{ side: 'left' }">
          <button
            type="button"
            class="flex w-10 flex-col items-center gap-0.5 rounded-xl py-1.5 transition"
            :class="listOpen && !detailOpen ? 'bg-perlink-blue/15 text-perlink-blue' : 'text-default hover:bg-elevated'"
            aria-label="Objects"
            @click="toggleList"
          >
            <UIcon name="i-lucide-layers" class="size-5" />
            <span class="text-[11px] font-semibold tabular-nums leading-none">{{ room.objects.length }}</span>
          </button>
        </UTooltip>
        <div class="my-0.5 h-px w-6 bg-white/10" />
        <UTooltip text="Zoom in" :content="{ side: 'left' }">
          <UButton icon="i-lucide-plus" color="neutral" variant="ghost" aria-label="Zoom in" @click="canvasRef?.zoomBy(0.8)" />
        </UTooltip>
        <UTooltip text="Zoom out" :content="{ side: 'left' }">
          <UButton icon="i-lucide-minus" color="neutral" variant="ghost" aria-label="Zoom out" @click="canvasRef?.zoomBy(1.25)" />
        </UTooltip>
        <UTooltip text="Reset view" :content="{ side: 'left' }">
          <UButton icon="i-lucide-scan" color="neutral" variant="ghost" aria-label="Reset view" @click="canvasRef?.resetView()" />
        </UTooltip>
      </div>

      <!-- Selected object: tap to open its details -->
      <UTooltip v-if="selectedObject && selectedItem" :text="detailOpen ? 'Hide details' : `Edit ${selectedItem.name}`" :content="{ side: 'left' }">
        <button
          type="button"
          class="relative flex size-12 items-center justify-center rounded-2xl bg-default/70 shadow-lg ring-1 backdrop-blur-xl transition"
          :class="detailOpen ? 'ring-perlink-blue/60 bg-perlink-blue/15' : 'ring-white/10 hover:bg-elevated'"
          :aria-label="`Edit ${selectedItem.name}`"
          @click="detailOpen = !detailOpen"
        >
          <img v-if="thumbnails[selectedItem.type]" :src="thumbnails[selectedItem.type]" :alt="selectedItem.name" class="size-9 object-contain">
          <UIcon v-else name="i-lucide-box" class="size-5" />
          <span v-if="!detailOpen" class="absolute -right-0.5 -top-0.5 flex size-3">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-perlink-blue opacity-75" />
            <span class="relative inline-flex size-3 rounded-full bg-perlink-blue shadow-[0_0_8px_2px] shadow-perlink-blue/70 ring-2 ring-default" />
          </span>
        </button>
      </UTooltip>
    </div>

    <!-- Navigation hint -->
    <p class="pointer-events-none absolute left-1/2 top-16 hidden -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/80 backdrop-blur sm:block">
      Drag to rotate · Right-drag to pan · Scroll to zoom
    </p>

    <!-- Bottom area: inventory bar -->
    <div ref="barRef" class="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-2 sm:p-3">
      <!-- Inventory bar -->
      <div class="pointer-events-auto w-full max-w-5xl overflow-hidden rounded-2xl bg-default/75 ring-1 ring-white/10 shadow-xl backdrop-blur-xl">
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
                  class="w-28 overflow-hidden rounded-xl border-2 text-left transition"
                  :class="isActivePreset(preset.style) ? 'border-perlink-blue' : 'border-default hover:border-accented'"
                  @click="updateStyle(preset.style)"
                >
                  <div class="flex h-20 items-center justify-center bg-elevated/60">
                    <img v-if="styleThumbnails[preset.name]" :src="styleThumbnails[preset.name]" :alt="preset.name" class="size-full object-contain">
                    <USkeleton v-else class="size-3/4 rounded-lg" />
                  </div>
                  <p class="truncate px-2 py-1 text-[11px] font-medium text-default">{{ preset.name }}</p>
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

          <!-- Land (scenery outside the room) -->
          <div v-else-if="activeTab === 'land'" class="flex items-stretch gap-3 overflow-x-auto p-3">
            <button
              v-for="land in LANDS"
              :key="land.id"
              type="button"
              class="w-40 shrink-0 overflow-hidden rounded-xl border-2 text-left transition"
              :class="(room.land ?? 'island') === land.id ? 'border-perlink-blue' : 'border-default hover:border-accented'"
              @click="room = { ...room, land: land.id }"
            >
              <div class="relative flex h-16 items-center justify-center" :style="{ background: land.preview }">
                <UIcon :name="land.icon" class="size-7 text-white drop-shadow" />
                <UIcon v-if="(room.land ?? 'island') === land.id" name="i-lucide-circle-check" class="absolute right-1.5 top-1.5 size-4 text-white drop-shadow" />
              </div>
              <div class="p-2">
                <p class="text-sm font-semibold text-highlighted">{{ land.name }}</p>
                <p class="line-clamp-2 text-[11px] leading-snug text-muted">{{ land.description }}</p>
              </div>
            </button>
          </div>

          <!-- Music -->
          <div v-else-if="activeTab === 'music'" class="flex items-stretch gap-2 overflow-x-auto p-3">
            <button
              type="button"
              class="flex w-28 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-2 text-center transition"
              :class="!musicTrackId ? 'border-perlink-blue bg-perlink-blue/5' : 'border-default hover:border-accented'"
              @click="selectTrack(null)"
            >
              <UIcon name="i-lucide-volume-x" class="size-6 text-muted" />
              <span class="text-sm font-semibold text-highlighted">No music</span>
            </button>

            <div
              v-for="track in ROOM_MUSIC"
              :key="track.id"
              class="flex w-52 shrink-0 cursor-pointer items-center gap-3 rounded-xl border-2 p-2.5 transition"
              :class="musicTrackId === track.id ? 'border-perlink-blue bg-perlink-blue/5' : 'border-default hover:border-accented'"
              role="button"
              tabindex="0"
              @click="selectTrack(track.id)"
              @keydown.enter="selectTrack(track.id)"
            >
              <UButton
                :icon="previewingId === track.id && previewPlaying ? 'i-lucide-pause' : 'i-lucide-play'"
                :color="musicTrackId === track.id ? 'primary' : 'neutral'"
                :variant="musicTrackId === track.id ? 'solid' : 'soft'"
                class="shrink-0 rounded-full"
                :aria-label="`Preview ${track.title}`"
                :disabled="missingTracks.has(track.id)"
                @click.stop="togglePreview(track.id)"
              />
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-highlighted">{{ track.title }}</p>
                <p class="truncate text-xs text-muted">
                  {{ missingTracks.has(track.id) ? 'File missing' : `${track.mood} · ${track.duration}` }}
                </p>
                <p class="truncate text-[11px] text-dimmed">{{ track.artist }}</p>
              </div>
            </div>

            <div class="flex w-44 shrink-0 flex-col justify-center gap-2 rounded-xl bg-elevated/60 px-3">
              <div class="flex items-center gap-2">
                <UIcon name="i-lucide-volume-2" class="size-4 text-muted" />
                <USlider :model-value="Math.round(musicVolume * 100)" :min="0" :max="100" :step="5" class="flex-1" @update:model-value="setVolume(Number($event) / 100)" />
              </div>
              <USwitch
                :model-value="musicAutoplay"
                :disabled="!musicTrackId"
                size="sm"
                label="Autoplay"
                @update:model-value="setMusic({ autoplay: $event })"
              />
              <p class="text-[11px] leading-snug text-dimmed">
                {{ musicAutoplay ? 'Starts when visitors open the room, or on their first tap if the browser blocks sound.' : 'Visitors start muted and can turn the music on.' }} Music from
                <a href="https://pixabay.com/music/" target="_blank" rel="noopener noreferrer" class="underline hover:text-default">Pixabay</a>.
              </p>
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
import type { ObjectPatch } from '~/utils/room/RoomScene'
import { createFloorTexture } from '~/utils/room/RoomScene'
import { getDaylight } from '~/utils/room/daylight'
import { ROOM_STYLE_PRESETS } from '~/data/roomPresets'
import { ROOM_MUSIC, MUSIC_BY_ID, ROOM_MUSIC_ENABLED } from '~/data/roomMusic'
import { LANDS } from '~/utils/room/lands'

// Pinch zooms the camera, never the page
usePreventPageZoom()

defineProps<{
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

type Tab = CatalogCategory | 'room' | 'land' | 'time' | 'music'

const canvasRef = ref<{ resetView: () => void; zoomBy: (factor: number) => void; focusObject: (id: string) => void; getDropTarget: (x: number, y: number, wall: boolean) => { position: [number, number, number]; wall?: WallSide } | null } | null>(null)
const barRef = ref<HTMLElement | null>(null)
const selectedId = ref<string | null>(null)
const activeTab = ref<Tab>('furniture')
const trayOpen = ref(true)
const previewMode = ref<'live' | 'day' | 'night'>('live')
const listOpen = ref(false)
/** Left panel with the selected object's settings */
const detailOpen = ref(false)
const listQuery = ref('')
const thumbnails = useRoomThumbnails()
const styleThumbnails = useRoomStyleThumbnails()

function isActivePreset(style: Partial<RoomStyle>) {
  const current = room.value.style
  return (current.theme ?? 'classic') === (style.theme ?? 'classic') && current.wallColor === style.wallColor && current.floorColor === style.floorColor
}

const CATEGORY_ICONS: Record<CatalogCategory, string> = {
  furniture: 'i-lucide-sofa',
  lighting: 'i-lucide-lamp',
  decor: 'i-lucide-sprout',
  wall: 'i-lucide-frame',
  tech: 'i-lucide-monitor',
  dungeon: 'i-lucide-castle',
}

const tabs = computed<{ value: Tab; label: string; icon: string }[]>(() => [
  ...(Object.keys(CATEGORY_LABELS) as CatalogCategory[]).map(c => ({ value: c, label: CATEGORY_LABELS[c], icon: CATEGORY_ICONS[c] })),
  { value: 'room', label: 'Room', icon: 'i-lucide-paint-roller' },
  { value: 'land', label: 'Land', icon: 'i-lucide-mountain-snow' },
  { value: 'time', label: 'Day & night', icon: 'i-lucide-sun-moon' },
  ...(ROOM_MUSIC_ENABLED ? [{ value: 'music' as const, label: 'Music', icon: 'i-lucide-music' }] : []),
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

// Numbered names (Chair 1, Chair 2) and where each object sits, for the object list
const objectRows = computed(() => {
  const totals: Record<string, number> = {}
  for (const o of room.value.objects) totals[o.type] = (totals[o.type] || 0) + 1
  const seen: Record<string, number> = {}
  const rows = room.value.objects.map((o) => {
    const item = CATALOG_BY_TYPE[o.type]
    seen[o.type] = (seen[o.type] || 0) + 1
    const base = item?.name ?? o.type
    const name = totals[o.type]! > 1 ? `${base} ${seen[o.type]}` : base
    const place = item?.wallMounted
      ? (o.wall === 'left' ? 'Left wall' : 'Back wall')
      : (o.position[1] > 0.05 ? 'On furniture' : 'Floor')
    return { id: o.id, type: o.type, name, place, linked: !!o.link?.url }
  })
  const query = listQuery.value.trim().toLowerCase()
  return query ? rows.filter(r => r.name.toLowerCase().includes(query) || r.place.toLowerCase().includes(query)) : rows
})

function toggleList() {
  // Both panels share the left side; the list takes over from the details
  if (detailOpen.value) {
    detailOpen.value = false
    listOpen.value = true
  } else {
    listOpen.value = !listOpen.value
  }
}

function focusFromList(id: string) {
  selectedId.value = id
  canvasRef.value?.focusObject(id)
  // Small screens: close the list so the room and the object panel are visible
  if (window.innerWidth < 640) listOpen.value = false
}

function removeObject(id: string) {
  setObjects(room.value.objects.filter(o => o.id !== id))
  if (selectedId.value === id) selectedId.value = null
}

const selectedObject = computed(() => room.value.objects.find(o => o.id === selectedId.value) || null)
const selectedItem = computed(() => (selectedObject.value ? CATALOG_BY_TYPE[selectedObject.value.type] : undefined))
watch(selectedObject, (object) => {
  if (!object) detailOpen.value = false
})

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

// ---------- Background music ----------

const musicTrackId = computed(() => room.value.music?.trackId ?? null)
const musicVolume = computed(() => room.value.music?.volume ?? 0.5)
const musicAutoplay = computed(() => room.value.music?.autoplay ?? false)
const previewingId = ref<string | null>(null)
const previewPlaying = ref(false)
const missingTracks = reactive(new Set<string>())
let previewAudio: HTMLAudioElement | null = null

function setMusic(patch: Partial<NonNullable<RoomConfig['music']>>) {
  room.value = { ...room.value, music: { trackId: musicTrackId.value, volume: musicVolume.value, autoplay: musicAutoplay.value, ...patch } }
}

function selectTrack(trackId: string | null) {
  setMusic({ trackId })
  if (trackId) playPreview(trackId)
  else stopPreview()
}

function setVolume(volume: number) {
  setMusic({ volume })
  if (previewAudio) previewAudio.volume = volume
}

function playPreview(trackId: string) {
  const track = MUSIC_BY_ID[trackId]
  if (!track || missingTracks.has(trackId)) return
  stopPreview()
  previewAudio = new Audio(track.src)
  previewAudio.volume = musicVolume.value
  previewAudio.loop = true
  previewAudio.addEventListener('error', () => {
    missingTracks.add(trackId)
    if (previewingId.value === trackId) stopPreview()
  })
  previewAudio.play().then(() => (previewPlaying.value = true)).catch(() => (previewPlaying.value = false))
  previewingId.value = trackId
}

function stopPreview() {
  previewAudio?.pause()
  previewAudio = null
  previewingId.value = null
  previewPlaying.value = false
}

function togglePreview(trackId: string) {
  if (previewingId.value === trackId && previewPlaying.value) stopPreview()
  else playPreview(trackId)
}

let checkedTracks = false

// Stop previews when leaving the Music tab; flag tracks whose file is missing
watch(activeTab, (tab) => {
  if (tab !== 'music') return stopPreview()
  if (checkedTracks) return
  checkedTracks = true
  for (const track of ROOM_MUSIC) {
    fetch(track.src, { method: 'HEAD' })
      .then((res) => { if (!res.ok) missingTracks.add(track.id) })
      .catch(() => missingTracks.add(track.id))
  }
})

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

function onObjectChange(id: string, patch: ObjectPatch) {
  setObjects(room.value.objects.map(o => (o.id === id ? { ...o, ...patch } : o)))
}

function updateSelected(patch: Partial<RoomObject>) {
  if (!selectedId.value) return
  setObjects(room.value.objects.map(o => (o.id === selectedId.value ? { ...o, ...patch } : o)))
}

// ---------- Picture frame photos ----------

const toast = useToast()
const photoInput = ref<HTMLInputElement | null>(null)
const photoUploading = ref(false)

/** Downscale to at most 1600px on the long side and re-encode as JPEG */
function resizePhoto(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const src = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(src)
      const scale = Math.min(1, 1600 / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error('Could not process image'))), 'image/jpeg', 0.88)
    }
    img.onerror = () => {
      URL.revokeObjectURL(src)
      reject(new Error('Could not read image'))
    }
    img.src = src
  })
}

async function onPhotoPicked(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  const targetId = selectedId.value
  if (!file || !targetId) return
  photoUploading.value = true
  try {
    const blob = await resizePhoto(file)
    const body = new FormData()
    body.append('file', new File([blob], 'photo.jpg', { type: 'image/jpeg' }))
    const { url } = await $fetch<{ url: string }>('/api/upload/room-image', { method: 'POST', body })
    // Apply to the frame that was selected when the upload started
    setObjects(room.value.objects.map(o => (o.id === targetId ? { ...o, image: url } : o)))
  } catch (error) {
    const message = (error as { data?: { statusMessage?: string } })?.data?.statusMessage || (error as Error).message
    toast.add({ title: 'Photo upload failed', description: message, color: 'error' })
  } finally {
    photoUploading.value = false
  }
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
  if (selectedId.value) removeObject(selectedId.value)
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
  } else if (key === 'r' && selectedId.value) {
    rotateBy(event.shiftKey ? -45 : 45)
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
  stopPreview()
})
</script>
