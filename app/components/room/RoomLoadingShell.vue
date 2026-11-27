<template>
  <!-- While a 3D room loads (the room editor, and sites' 3D views): the
       animated Perlink mark on the room's dark screen, with how far it has
       got on live pages -->
  <div class="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-5 overflow-hidden bg-[#0a0a0a]" aria-busy="true">
    <!-- The room as it was last pictured, at once (it's in the page's HTML),
         softened and dimmed, so visitors see their way in while it builds -->
    <template v-if="poster">
      <img :src="poster" alt="" fetchpriority="high" decoding="async" class="absolute inset-0 size-full scale-110 object-cover blur-[6px]">
      <div class="absolute inset-0 bg-black/45" />
    </template>
    <AppLoader :size="76" class="relative" />
    <div
      v-if="progress"
      class="relative flex w-28 flex-col items-center gap-2 transition-opacity duration-300"
      :class="shown === null ? 'opacity-0' : 'opacity-100'"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      :aria-valuenow="shown ?? 0"
    >
      <span class="text-[13px] font-semibold tabular-nums text-white/75">{{ shown ?? 0 }}%</span>
      <span class="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
        <span class="block h-full origin-left rounded-full bg-[#2f8fff]" :style="{ transform: `scaleX(${(shown ?? 0) / 100})` }" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { roomLoadStep } from '~/utils/room/loadProgress'

const props = defineProps<{
  /** Show the percentage (live pages, where the room's steps report in) */
  progress?: boolean
  /** A picture of the room, shown behind while it loads */
  poster?: string | null
}>()

// Not rendered on the server (the number is the browser's): it fades in
const shown = ref<number | null>(null)
let value = 0
let frame = 0
let last = 0
function tick(now: number) {
  const dt = Math.min(0.1, (now - (last || now)) / 1000)
  last = now
  const { floor, ceiling } = roomLoadStep.value
  // Quick up to the step reached, then a slow creep towards its ceiling
  if (value < floor) value += Math.max(0.5, (floor - value) * Math.min(1, dt * 8))
  else if (value < ceiling) value += (ceiling - value) * dt * 0.6
  value = Math.min(value, Math.max(floor, ceiling))
  shown.value = Math.floor(value)
  frame = requestAnimationFrame(tick)
}
onMounted(() => {
  if (props.progress) frame = requestAnimationFrame(tick)
})
onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>
