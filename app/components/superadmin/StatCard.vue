<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to"
    class="group rounded-lg border border-default bg-elevated/40 p-4 transition-colors"
    :class="to && 'hover:bg-elevated hover:border-accented'"
  >
    <div class="flex items-center justify-between gap-2">
      <p class="text-sm text-muted">{{ label }}</p>
      <UIcon :name="icon" class="size-4 text-dimmed group-hover:text-primary transition-colors" />
    </div>
    <div class="mt-2 text-2xl font-semibold tabular-nums text-highlighted">
      <USkeleton v-if="loading" class="h-8 w-20" />
      <template v-else>{{ formatted }}</template>
    </div>
    <p v-if="hint && !loading" class="mt-1 text-xs text-dimmed">{{ hint }}</p>
  </component>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components'

const props = defineProps<{
  label: string
  value: number
  icon: string
  hint?: string
  to?: string
  loading?: boolean
}>()

const formatted = computed(() => props.value.toLocaleString())
</script>
