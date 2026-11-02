<template>
  <!-- Dated steps along a line: how two people met, a wedding day's plan,
       a business's milestones. Dots in the page's accent. Steps rise into
       view as the visitor scrolls and the line draws down to the next one;
       photos open full size -->
  <section>
    <h2 v-if="data.title" class="mb-3 text-[17px]" :style="headingStyle">{{ data.title }}</h2>
    <div class="px-5 py-6 sm:px-6" :style="cardStyle">
      <ol ref="list" class="relative" :class="{ 'tl--ready': ready }">
        <li
          v-for="(item, i) in items"
          :key="item.id"
          :data-index="i"
          class="tl-item relative pl-8"
          :class="[i < items.length - 1 && 'pb-7', shown.has(i) && 'tl-item--in', instant.has(i) && 'tl-item--instant']"
          :style="{ '--stagger': `${staggerOf(i)}ms` }"
        >
          <!-- The line, from this dot down to the next -->
          <span v-if="i < items.length - 1" class="tl-line absolute left-[7px] top-4 bottom-0 w-px bg-current opacity-20" aria-hidden="true" />
          <span class="tl-dot absolute left-0 top-1 size-[15px] rounded-full ring-4 ring-current/10" :style="dotStyle" aria-hidden="true" />
          <div class="tl-body">
            <p v-if="item.date" class="text-xs font-semibold uppercase tracking-[0.14em]" :style="accentText">{{ item.date }}</p>
            <h3 class="mt-0.5 text-base font-semibold leading-snug" :style="titleStyle">{{ item.title }}</h3>
            <p v-if="item.text" class="mt-1 whitespace-pre-line text-[15px] leading-relaxed opacity-80">{{ item.text }}</p>
            <button
              v-if="item.imageUrl"
              type="button"
              class="tl-photo mt-3 block w-full overflow-hidden"
              :style="{ borderRadius: imageRadius }"
              :aria-label="`${t('viewPhoto')}: ${item.title}`"
              @click="photo = item"
            >
              <img :src="item.imageUrl" :alt="item.title" class="aspect-[4/3] w-full object-cover" loading="lazy" decoding="async">
            </button>
          </div>
        </li>
      </ol>
    </div>

    <!-- The photo, full size -->
    <UModal :open="!!photo" :close="{ color: 'neutral', variant: 'ghost' }" class="max-w-4xl" @update:open="!$event && (photo = null)">
      <template #content>
        <figure v-if="photo" class="bg-black p-3">
          <img :src="photo.imageUrl" :alt="photo.title" class="mx-auto max-h-[78vh] w-auto rounded-lg object-contain">
          <figcaption class="px-1 pt-3 text-sm text-white/85">
            <span v-if="photo.date" class="mr-2 text-white/60">{{ photo.date }}</span>{{ photo.title }}
          </figcaption>
        </figure>
      </template>
    </UModal>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { TimelineBlock, TimelineItem } from '~/types/bio'

const props = defineProps<{
  data: TimelineBlock['data']
  cardStyle?: CSSProperties
  accentStyle?: CSSProperties
  headingStyle?: CSSProperties
}>()

const { t } = useSiteI18n()
const items = computed(() => (props.data.items ?? []).filter(item => item.title))
const accent = computed(() => String(props.accentStyle?.backgroundColor || 'currentColor'))
const dotStyle = computed<CSSProperties>(() => ({ backgroundColor: accent.value }))
const accentText = computed<CSSProperties>(() => ({ color: accent.value }))
// Step titles in the page's heading face, at body size
const titleStyle = computed<CSSProperties>(() => ({ fontFamily: props.headingStyle?.fontFamily }))
const imageRadius = computed(() => `calc(${String(props.cardStyle?.borderRadius || '16px')} * 0.6)`)

const photo = ref<TimelineItem | null>(null)

// ---------- Rising into view ----------
// The server draws every step; once in the browser, steps below the fold
// wait and rise in as they're scrolled to. Steps already on screen stay put
const list = ref<HTMLElement>()
const ready = ref(false)
const shown = reactive(new Set<number>())
const instant = reactive(new Set<number>())
// Steps that come into view together rise one after another
const staggers = new Map<number, number>()
const staggerOf = (i: number) => staggers.get(i) ?? 0
let observer: IntersectionObserver | null = null

onMounted(() => {
  const el = list.value
  if (!el || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return
  const children = [...el.querySelectorAll<HTMLElement>('.tl-item')]
  children.forEach((child, i) => {
    if (child.getBoundingClientRect().top < window.innerHeight * 0.92) {
      shown.add(i)
      instant.add(i)
    }
  })
  observer = new IntersectionObserver((entries) => {
    let order = 0
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      const i = Number((entry.target as HTMLElement).dataset.index)
      if (shown.has(i)) continue
      staggers.set(i, order * 140)
      order += 1
      shown.add(i)
      observer?.unobserve(entry.target)
    }
  }, { threshold: 0.25, rootMargin: '0px 0px -8% 0px' })
  children.forEach((child, i) => !shown.has(i) && observer!.observe(child))
  ready.value = true
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.tl--ready .tl-item:not(.tl-item--in) .tl-body { opacity: 0; transform: translateY(14px); }
.tl--ready .tl-item:not(.tl-item--in) .tl-dot { transform: scale(0); }
.tl--ready .tl-item:not(.tl-item--in) .tl-line { transform: scaleY(0); }
.tl-body {
  transition: opacity 0.6s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--stagger) + 120ms);
}
.tl-dot {
  transition: transform 0.45s cubic-bezier(0.3, 1.6, 0.5, 1);
  transition-delay: var(--stagger);
}
/* The line draws down from the dot to the next step */
.tl-line {
  transform-origin: top;
  transition: transform 0.9s cubic-bezier(0.65, 0, 0.35, 1);
  transition-delay: calc(var(--stagger) + 250ms);
}
.tl-item--instant .tl-body,
.tl-item--instant .tl-dot,
.tl-item--instant .tl-line { transition: none; }
.tl-photo img { transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.tl-photo:hover img { transform: scale(1.03); }
.tl-photo:active img { transform: scale(0.99); }
@media (prefers-reduced-motion: reduce) {
  .tl-body, .tl-dot, .tl-line, .tl-photo img { transition: none; }
}
</style>
