<template>
  <section :id="id" class="relative scroll-mt-24" :class="ruled && 'border-t border-line'">
    <div class="relative mx-auto max-w-6xl" :class="framed && 'border-x border-line'">
      <!-- Corner marks where the frame meets the rule above -->
      <template v-if="framed && ruled">
        <span class="absolute -left-[3px] -top-[3px] hidden size-[5px] rounded-full bg-ink-faint/60 xl:block" aria-hidden="true" />
        <span class="absolute -right-[3px] -top-[3px] hidden size-[5px] rounded-full bg-ink-faint/60 xl:block" aria-hidden="true" />
      </template>
      <div :class="padded && 'px-5 py-16 sm:px-8 md:py-24'">
        <header v-if="title || eyebrow" class="mb-10 max-w-2xl md:mb-14" :class="center && 'mx-auto text-center'">
          <p v-if="eyebrow" class="mk-eyebrow mb-4">{{ eyebrow }}</p>
          <h2 v-if="title" class="mk-display text-3xl sm:text-4xl md:text-[44px]">{{ title }}</h2>
          <p v-if="description" class="mt-4 text-base leading-relaxed text-ink-muted md:text-lg">{{ description }}</p>
        </header>
        <slot />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// A page band: optional hairline rule on top, a framed column with corner
// marks, and an optional heading. Bands stack to form the page grid.
withDefaults(defineProps<{
  id?: string
  eyebrow?: string
  title?: string
  description?: string
  center?: boolean
  framed?: boolean
  ruled?: boolean
  padded?: boolean
}>(), {
  framed: true,
  ruled: true,
  padded: true,
})
</script>
