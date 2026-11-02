<template>
  <section class="space-y-3">
    <div v-if="data.title || summary" class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
      <h2 v-if="data.title" class="text-[17px]" :style="headingStyle">{{ data.title }}</h2>
      <!-- "★ 4.9 · 12 reviews" when there are several ratings -->
      <p v-if="summary" class="flex items-center gap-1 text-sm font-semibold">
        <span class="text-[#f5a524]" aria-hidden="true">★</span>
        {{ summary }}
      </p>
    </div>

    <!-- Two or fewer: stacked. More: a row to swipe, a card at a time -->
    <div
      ref="track"
      :class="carousel ? 'testimonials-track -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-1' : 'space-y-2.5'"
      @scroll.passive="onScroll"
    >
      <figure
        v-for="item in items"
        :key="item.id"
        class="relative flex flex-col p-5"
        :class="carousel && 'w-[85%] max-w-[340px] shrink-0 snap-start'"
        :style="cardStyle"
      >
        <!-- A big soft quote mark behind the words -->
        <span class="pointer-events-none absolute right-4 top-1 select-none font-serif text-6xl leading-none opacity-[0.08]" aria-hidden="true">”</span>
        <div v-if="item.rating" class="mb-2 flex gap-0.5" role="img" :aria-label="`${item.rating}/5`">
          <svg v-for="n in 5" :key="n" viewBox="0 0 20 20" class="size-4" :class="n > item.rating ? 'opacity-20' : 'text-[#f5a524]'" fill="currentColor" aria-hidden="true">
            <path d="M10 1.6l2.47 5.2 5.7.68-4.2 3.9 1.1 5.64L10 14.3l-5.07 2.72 1.1-5.64-4.2-3.9 5.7-.68z" />
          </svg>
        </div>
        <blockquote class="flex-1 text-[15px] leading-relaxed">{{ item.quote }}</blockquote>
        <figcaption v-if="item.author" class="mt-4 flex items-center gap-2.5">
          <span class="flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold" :style="initialStyle">{{ initial(item.author) }}</span>
          <span class="min-w-0 text-sm leading-tight">
            <span class="block truncate font-semibold">{{ item.author }}</span>
            <span v-if="item.detail" class="block truncate opacity-65">{{ item.detail }}</span>
          </span>
        </figcaption>
      </figure>
    </div>

    <!-- Where you are in the row -->
    <div v-if="carousel" class="flex justify-center gap-1.5" aria-hidden="true">
      <span
        v-for="(item, i) in items"
        :key="item.id"
        class="h-1.5 rounded-full bg-current transition-all duration-300"
        :class="i === active ? 'w-4 opacity-70' : 'w-1.5 opacity-20'"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { TestimonialsBlock } from '~/types/bio'

const props = defineProps<{
  data: TestimonialsBlock['data']
  cardStyle?: CSSProperties
  headingStyle?: CSSProperties
  /** The page's filled button, for the initials */
  accentStyle?: CSSProperties
}>()

const { t, lang } = useSiteI18n()

const items = computed(() => (props.data.items ?? []).filter(i => i.quote))
const carousel = computed(() => items.value.length > 2)

const summary = computed(() => {
  const rated = items.value.filter(i => i.rating)
  if (rated.length < 2) return ''
  const average = rated.reduce((sum, i) => sum + (i.rating ?? 0), 0) / rated.length
  return t('reviewsSummary', { rating: average.toLocaleString(lang.value, { minimumFractionDigits: 1, maximumFractionDigits: 1 }), n: rated.length })
})

const initial = (name: string) => name.trim().charAt(0).toUpperCase()
const initialStyle = computed<CSSProperties>(() => {
  const accent = props.accentStyle?.backgroundColor
  return accent
    ? { backgroundColor: `color-mix(in srgb, ${String(accent)} 18%, transparent)`, color: 'inherit' }
    : { backgroundColor: 'color-mix(in srgb, currentColor 10%, transparent)' }
})

// The card most in view, for the dots
const track = ref<HTMLElement>()
const active = ref(0)
function onScroll() {
  const el = track.value
  if (!el || !el.firstElementChild) return
  const card = el.firstElementChild as HTMLElement
  const step = card.offsetWidth + 12
  active.value = Math.min(items.value.length - 1, Math.max(0, Math.round(el.scrollLeft / step)))
}
</script>

<style scoped>
.testimonials-track {
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.testimonials-track::-webkit-scrollbar {
  display: none;
}
</style>
