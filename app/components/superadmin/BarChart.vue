<template>
  <div class="relative" @mouseleave="hovered = null">
    <!-- Plot -->
    <div class="relative" :style="{ height: `${height}px` }">
      <!-- Recessive grid: max + midpoint -->
      <div class="absolute inset-x-0 top-0 border-t border-dashed border-line" />
      <div class="absolute inset-x-0 top-1/2 border-t border-dashed border-line/60" />
      <span class="absolute -top-2.5 right-0 bg-paper pl-1 text-[10px] tabular-nums text-dimmed">
        {{ niceMax.toLocaleString() }}
      </span>

      <div class="absolute inset-0 flex items-end gap-0.5">
        <div
          v-for="(point, i) in data"
          :key="point.date"
          class="relative flex h-full flex-1 items-end"
          @mouseenter="hovered = i"
        >
          <div
            class="w-full rounded-t-[4px] transition-opacity"
            :class="hovered === null || hovered === i ? 'opacity-100' : 'opacity-40'"
            :style="{
              height: point.value > 0 ? `max(2px, ${(point.value / niceMax) * 100}%)` : '0',
              backgroundColor: 'var(--ui-primary)',
            }"
          />
        </div>
      </div>

      <!-- Tooltip -->
      <div
        v-if="hovered !== null && data[hovered]"
        class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-xl bg-neutral-900/85 px-2.5 py-1.5 text-white backdrop-blur-xl text-xs shadow-lg whitespace-nowrap"
        :style="{ left: `${((hovered + 0.5) / data.length) * 100}%`, top: '-4px' }"
      >
        <p class="text-white/60">{{ formatDay(data[hovered]!.date, true) }}</p>
        <p class="font-semibold tabular-nums text-white">
          {{ data[hovered]!.value.toLocaleString() }} {{ unit }}
        </p>
      </div>
    </div>

    <!-- Baseline + x labels -->
    <div class="border-t border-line" />
    <div class="mt-1.5 flex justify-between text-[10px] text-dimmed">
      <span>{{ formatDay(data[0]?.date) }}</span>
      <span>{{ formatDay(data[Math.floor(data.length / 2)]?.date) }}</span>
      <span>{{ formatDay(data[data.length - 1]?.date) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  data: { date: string; value: number }[]
  unit?: string
  height?: number
}>(), {
  unit: '',
  height: 160,
})

const hovered = ref<number | null>(null)

// Round the axis max up to a readable number
const niceMax = computed(() => {
  const max = Math.max(...props.data.map(d => d.value), 0)
  if (max <= 4) return 4
  const magnitude = 10 ** Math.floor(Math.log10(max))
  const steps = [1, 2, 2.5, 5, 10]
  const step = steps.find(s => s * magnitude >= max) ?? 10
  return step * magnitude
})

const formatDay = (date?: string, withWeekday = false): string => {
  if (!date) return ''
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(withWeekday && { weekday: 'short' }),
  })
}
</script>
