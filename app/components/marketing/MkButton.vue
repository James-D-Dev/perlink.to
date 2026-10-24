<template>
  <component
    :is="to ? NuxtLink : href ? 'a' : 'button'"
    :to="to"
    :href="href"
    :type="!to && !href ? type : undefined"
    :class="classes"
  >
    <UIcon v-if="icon" :name="icon" class="size-4 shrink-0" />
    <slot />
    <UIcon v-if="trailingIcon" :name="trailingIcon" class="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
  </component>
</template>

<script setup lang="ts">
// Pill button for the public site. Solid is ink on paper, outline is paper
// with a hairline, ghost is text only.
const props = withDefaults(defineProps<{
  to?: string
  href?: string
  type?: 'button' | 'submit'
  variant?: 'solid' | 'outline' | 'ghost' | 'inverse'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  trailingIcon?: string
  block?: boolean
}>(), {
  type: 'button',
  variant: 'solid',
  size: 'md',
})

const NuxtLink = resolveComponent('NuxtLink')

const classes = computed(() => [
  'group inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-50 disabled:pointer-events-none',
  {
    sm: 'h-8 px-3.5 text-[13px]',
    md: 'h-10 px-5 text-sm',
    lg: 'h-12 px-6 text-[15px]',
  }[props.size],
  {
    solid: 'bg-ink text-paper hover:bg-ink-soft',
    outline: 'bg-paper text-ink ring-1 ring-inset ring-line hover:bg-sand',
    ghost: 'text-ink-soft hover:text-ink hover:bg-sand',
    inverse: 'bg-paper text-ink hover:bg-sand',
  }[props.variant],
  props.block && 'w-full',
])
</script>
