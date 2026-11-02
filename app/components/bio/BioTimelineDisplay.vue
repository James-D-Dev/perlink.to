<template>
  <!-- Dated steps along a line: how two people met, a wedding day's plan,
       a business's milestones. Dots in the page's accent -->
  <section>
    <h2 v-if="data.title" class="mb-3 text-[17px]" :style="headingStyle">{{ data.title }}</h2>
    <div class="px-5 py-6 sm:px-6" :style="cardStyle">
      <ol class="relative">
        <li v-for="(item, i) in items" :key="item.id" class="relative pl-8" :class="i < items.length - 1 && 'pb-7'">
          <!-- The line, from this dot down to the next -->
          <span v-if="i < items.length - 1" class="absolute left-[7px] top-4 bottom-0 w-px bg-current opacity-20" aria-hidden="true" />
          <span class="absolute left-0 top-1 size-[15px] rounded-full ring-4 ring-current/10" :style="dotStyle" aria-hidden="true" />
          <p v-if="item.date" class="text-xs font-semibold uppercase tracking-[0.14em]" :style="accentText">{{ item.date }}</p>
          <h3 class="mt-0.5 text-base font-semibold leading-snug" :style="titleStyle">{{ item.title }}</h3>
          <p v-if="item.text" class="mt-1 whitespace-pre-line text-[15px] leading-relaxed opacity-80">{{ item.text }}</p>
          <img
            v-if="item.imageUrl"
            :src="item.imageUrl"
            :alt="item.title"
            class="mt-3 aspect-[4/3] w-full object-cover"
            :style="{ borderRadius: imageRadius }"
            loading="lazy"
            decoding="async"
          >
        </li>
      </ol>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { TimelineBlock } from '~/types/bio'

const props = defineProps<{
  data: TimelineBlock['data']
  cardStyle?: CSSProperties
  accentStyle?: CSSProperties
  headingStyle?: CSSProperties
}>()

const items = computed(() => (props.data.items ?? []).filter(item => item.title))
const accent = computed(() => String(props.accentStyle?.backgroundColor || 'currentColor'))
const dotStyle = computed<CSSProperties>(() => ({ backgroundColor: accent.value }))
const accentText = computed<CSSProperties>(() => ({ color: accent.value }))
// Step titles in the page's heading face, at body size
const titleStyle = computed<CSSProperties>(() => ({ fontFamily: props.headingStyle?.fontFamily }))
const imageRadius = computed(() => `calc(${String(props.cardStyle?.borderRadius || '16px')} * 0.6)`)
</script>
