<template>
  <!-- A letter on ruled paper. Sealed, it waits in an envelope with a wax
       seal in the page's accent; a tap lifts the flap and the letter slides
       out -->
  <section class="letter" :class="[`letter--${paper}`, { 'letter--open': open }]">
    <button
      v-if="sealed && !open"
      type="button"
      class="envelope group relative block w-full overflow-hidden text-center"
      :aria-label="data.to ? t('letterFor', { name: data.to }) : t('letterOpen')"
      :aria-expanded="open"
      @click="open = true"
    >
      <span class="envelope-flap" aria-hidden="true" />
      <span class="relative z-10 flex flex-col items-center gap-3 px-6 pb-8 pt-16">
        <span class="seal flex size-14 items-center justify-center rounded-full shadow-lg" :style="sealStyle" aria-hidden="true">
          <UIcon name="i-lucide-heart" class="size-6" />
        </span>
        <span v-if="data.to" class="text-2xl leading-tight" :style="scriptStyle">{{ t('letterFor', { name: data.to }) }}</span>
        <span class="inline-flex items-center gap-1.5 text-sm opacity-75 transition-opacity group-hover:opacity-100">
          <UIcon name="i-lucide-mail-open" class="size-4" />
          {{ t('letterOpen') }}
        </span>
      </span>
    </button>

    <Transition name="letter-out" appear>
      <article v-if="!sealed || open" class="paper relative px-6 py-8 sm:px-8">
        <p v-if="data.to" class="mb-4 text-2xl leading-tight" :style="scriptStyle">{{ t('letterFor', { name: data.to }) }}</p>
        <p class="whitespace-pre-line text-[16px] leading-[1.9]">{{ data.body }}</p>
        <p v-if="data.from" class="mt-6 text-right text-xl" :style="scriptStyle">{{ data.from }}</p>
      </article>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { LetterBlock } from '~/types/bio'

const props = defineProps<{
  data: LetterBlock['data']
  headingStyle?: CSSProperties
  accentStyle?: CSSProperties
}>()

const { t } = useSiteI18n()
const sealed = computed(() => props.data.sealed !== false)
const paper = computed(() => props.data.paper || 'cream')
const open = ref(false)

// Greeting and signature in the page's heading face (often a script)
const scriptStyle = computed<CSSProperties>(() => ({ fontFamily: props.headingStyle?.fontFamily }))
const sealStyle = computed<CSSProperties>(() => ({
  backgroundColor: String(props.accentStyle?.backgroundColor || '#c2185b'),
  color: String(props.accentStyle?.color || '#ffffff'),
}))
</script>

<style scoped>
.letter {
  --paper: #fbf6ec;
  --ink: #3b2f2a;
  --rule: rgb(59 47 42 / 0.09);
  --env: #f1e4cc;
  --env-dark: #e4d2b1;
  color: var(--ink);
}
.letter--blush {
  --paper: #fff3f6;
  --ink: #5b1a33;
  --rule: rgb(91 26 51 / 0.08);
  --env: #ffd9e3;
  --env-dark: #f7c1d0;
}
.letter--night {
  --paper: #231a33;
  --ink: #f6e9f1;
  --rule: rgb(246 233 241 / 0.08);
  --env: #2f2244;
  --env-dark: #251a37;
}

.envelope {
  border-radius: 20px;
  background: var(--env);
  box-shadow: 0 18px 40px -18px rgb(0 0 0 / 0.35);
  min-height: 15rem;
}
/* The flap: a triangle from the top corners to the middle */
.envelope-flap {
  position: absolute;
  inset: 0 0 auto 0;
  height: 62%;
  background: var(--env-dark);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: top;
  transition: transform 0.5s ease;
}
.envelope:hover .envelope-flap {
  transform: perspective(600px) rotateX(-14deg);
}
.seal {
  transition: transform 0.3s ease;
}
.envelope:hover .seal {
  transform: scale(1.06) rotate(-6deg);
}

.paper {
  border-radius: 20px;
  background-color: var(--paper);
  /* Faint ruled lines, the height of a line of text */
  background-image: repeating-linear-gradient(to bottom, transparent 0, transparent calc(1.9em - 1px), var(--rule) calc(1.9em - 1px), var(--rule) 1.9em);
  background-position: 0 2.1rem;
  box-shadow: 0 18px 40px -20px rgb(0 0 0 / 0.35);
}

.letter-out-enter-active {
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}
.letter--open .letter-out-enter-from {
  transform: translateY(24px) scale(0.97);
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .envelope-flap, .seal, .letter-out-enter-active { transition: none; }
}
</style>
