<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to"
    class="group rounded-3xl bg-paper p-5 ring-1 ring-line transition-colors"
    :class="to && 'hover:bg-sand/40'"
  >
    <div class="flex items-center justify-between gap-2">
      <p class="text-sm text-ink-muted">{{ label }}</p>
      <span class="flex size-8 items-center justify-center rounded-full bg-sand text-ink-soft transition-colors group-hover:text-ink">
        <UIcon :name="icon" class="size-4" />
      </span>
    </div>
    <div class="mt-2 text-[28px] font-semibold leading-tight tracking-tight tabular-nums text-ink">
      <USkeleton v-if="loading" class="h-8 w-20" />
      <template v-else>{{ formatted }}</template>
    </div>
    <p v-if="hint && !loading" class="mt-1 text-xs text-ink-muted">{{ hint }}</p>
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
