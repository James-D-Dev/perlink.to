<template>
  <!-- A letter on ruled paper. Sealed, it waits in an envelope with a wax
       seal in the page's accent. A tap cracks the seal, the flap swings
       open, the letter slides out and unfolds, and its lines appear one by
       one, as if being read. The page music starts with that same tap -->
  <section ref="root" class="letter relative" :class="[`letter--${paper}`, { 'letter--opening': phase !== 'sealed' }]">
    <!-- The letter itself -->
    <article v-if="!sealed || phase === 'open'" class="paper relative px-6 pb-7 pt-8 sm:px-8" :class="{ 'paper--reveal': revealing }">
      <p v-if="to" class="line mb-4 text-2xl leading-tight" :style="[scriptStyle, delay(0)]">{{ t('letterFor', { name: to }) }}</p>
      <p v-for="(line, i) in lines" :key="i" class="line whitespace-pre-line text-[16px] leading-[1.9]" :style="delay(i + 1)">{{ line || ' ' }}</p>
      <p v-if="data.from" class="line signature mt-6 text-right text-xl" :style="[scriptStyle, delay(lines.length + 1)]">
        <span class="relative inline-block">
          {{ data.from }}
          <!-- A pen flourish drawn under the name -->
          <svg class="flourish" viewBox="0 0 120 14" preserveAspectRatio="none" aria-hidden="true" :style="delay(lines.length + 2)">
            <path d="M2 9 C 24 2, 42 14, 62 8 S 100 3, 118 7" fill="none" :stroke="accent" stroke-width="1.6" stroke-linecap="round" />
          </svg>
        </span>
      </p>
      <button
        v-if="sealed"
        type="button"
        class="fold mt-5 inline-flex items-center gap-1.5 text-xs opacity-60 transition-opacity hover:opacity-100"
        :style="delay(lines.length + 3)"
        @click="foldBack"
      >
        <UIcon name="i-lucide-mail" class="size-3.5" />
        {{ t('letterFoldBack') }}
      </button>
    </article>

    <!-- The envelope -->
    <Transition name="envelope-out">
      <button
        v-if="sealed && phase !== 'open'"
        type="button"
        class="stage group block w-full text-center"
        :class="`stage--${phase}`"
        :aria-label="envelopeText || t('letterOpen')"
        :aria-expanded="false"
        :disabled="phase !== 'sealed'"
        @click="openLetter"
      >
        <span class="env-back" aria-hidden="true" />
        <!-- The letter inside, rising out once the flap is open -->
        <span class="peek" aria-hidden="true">
          <span v-for="n in 4" :key="n" class="peek-line" :style="{ width: `${[78, 64, 82, 46][n - 1]}%` }" />
        </span>
        <span class="env-front" aria-hidden="true" />
        <span class="env-flap" aria-hidden="true" />
        <!-- Wax seal, in two halves that break apart -->
        <span class="seal" aria-hidden="true">
          <span class="seal-half seal-half--left" :style="sealStyle"><UIcon name="i-lucide-heart" class="seal-icon" /></span>
          <span class="seal-half seal-half--right" :style="sealStyle"><UIcon name="i-lucide-heart" class="seal-icon" /></span>
        </span>
        <span class="label">
          <span v-if="envelopeText" class="block truncate px-6 text-xl leading-tight sm:text-2xl" :style="scriptStyle">{{ envelopeText }}</span>
          <span class="mt-2 inline-flex items-center gap-1.5 text-sm opacity-75 transition-opacity group-hover:opacity-100">
            <UIcon name="i-lucide-mail-open" class="size-4" />
            {{ t('letterOpen') }}
          </span>
        </span>
      </button>
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
const lines = computed(() => (props.data.body || '').split('\n'))

// A link like perlink.to/linh-nam?to=Minh greets that guest by name
const route = useRoute()
const guest = computed(() => {
  if (props.data.personal === false) return ''
  const value = route.query.to
  return (Array.isArray(value) ? value[0] : value)?.trim().slice(0, 60) ?? ''
})
const to = computed(() => guest.value || props.data.to)
// The envelope: its own words, or who it's for
const envelopeText = computed(() => props.data.cover?.trim() || (to.value ? t('letterFor', { name: to.value }) : ''))

// Greeting and signature in the page's heading face (often a script)
const scriptStyle = computed<CSSProperties>(() => ({ fontFamily: props.headingStyle?.fontFamily }))
const accent = computed(() => String(props.accentStyle?.backgroundColor || '#c2185b'))
const sealStyle = computed<CSSProperties>(() => ({
  backgroundColor: accent.value,
  color: String(props.accentStyle?.color || '#ffffff'),
}))

// ---------- Opening ----------
// sealed → cracking (seal breaks) → flap (swings open) → rising (letter
// slides out) → open (envelope drops away, lines appear)
type Phase = 'sealed' | 'cracking' | 'flap' | 'rising' | 'open'
const phase = ref<Phase>('sealed')
// Lines fade in one after another once the letter is out
const revealing = ref(false)
const root = ref<HTMLElement>()
const timers: ReturnType<typeof setTimeout>[] = []
const later = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms))
onBeforeUnmount(() => timers.forEach(clearTimeout))

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function openLetter() {
  if (phase.value !== 'sealed') return
  if (reducedMotion()) {
    phase.value = 'open'
    return
  }
  phase.value = 'cracking'
  later(380, () => (phase.value = 'flap'))
  later(1000, () => (phase.value = 'rising'))
  later(1700, () => growTo(() => {
    revealing.value = true
    phase.value = 'open'
  }))
}

function foldBack() {
  timers.forEach(clearTimeout)
  revealing.value = false
  growTo(() => (phase.value = 'sealed'))
}

/** Changes what's shown, easing the block's height from the old size to the new one */
async function growTo(change: () => void) {
  const el = root.value
  if (!el || reducedMotion()) {
    change()
    return
  }
  const from = el.offsetHeight
  change()
  await nextTick()
  const to = el.scrollHeight
  if (Math.abs(to - from) < 2) return
  el.style.height = `${from}px`
  el.style.overflow = 'hidden'
  void el.offsetHeight
  el.style.transition = 'height 0.7s cubic-bezier(0.22, 1, 0.36, 1)'
  el.style.height = `${to}px`
  const done = () => {
    el.style.height = ''
    el.style.overflow = ''
    el.style.transition = ''
    el.removeEventListener('transitionend', done)
  }
  el.addEventListener('transitionend', done)
  later(900, done)
}

/** Staggered start for the n-th line of the letter */
const delay = (n: number): CSSProperties => ({ animationDelay: `${150 + n * 230}ms` })
</script>

<style scoped>
.letter {
  --paper: #fbf6ec;
  --ink: #3b2f2a;
  --rule: rgb(59 47 42 / 0.09);
  --env: #f1e4cc;
  --env-dark: #e2cfab;
  --env-inside: #d9c29a;
  color: var(--ink);
}
.letter--blush {
  --paper: #fff3f6;
  --ink: #5b1a33;
  --rule: rgb(91 26 51 / 0.08);
  --env: #ffd9e3;
  --env-dark: #f6bfcf;
  --env-inside: #eba9bd;
}
.letter--night {
  --paper: #231a33;
  --ink: #f6e9f1;
  --rule: rgb(246 233 241 / 0.08);
  --env: #2f2244;
  --env-dark: #251a37;
  --env-inside: #1b1229;
}

/* ---------- Envelope ---------- */
.stage {
  position: relative;
  min-height: 15.5rem;
  aspect-ratio: 16 / 10;
  max-height: 20rem;
  perspective: 1100px;
  color: var(--ink);
  -webkit-tap-highlight-color: transparent;
}
.stage:focus-visible { outline: 2px solid currentColor; outline-offset: 4px; border-radius: 22px; }
.env-back {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  z-index: 0;
  background: var(--env-inside);
  box-shadow: 0 22px 44px -22px rgb(0 0 0 / 0.45);
}
.peek {
  position: absolute;
  left: 7%;
  right: 7%;
  top: 9%;
  bottom: 8%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 26px 22px;
  border-radius: 10px;
  background: var(--paper);
  box-shadow: 0 6px 18px -8px rgb(0 0 0 / 0.3);
  transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
}
.peek-line { height: 6px; border-radius: 3px; background: currentColor; opacity: 0.13; }
.env-front {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  /* The pocket: side and bottom flaps meeting below the middle */
  background:
    linear-gradient(to top right, transparent 49.6%, rgb(0 0 0 / 0.05) 50%, transparent 50.4%) left bottom / 50% 100% no-repeat,
    linear-gradient(to top left, transparent 49.6%, rgb(0 0 0 / 0.05) 50%, transparent 50.4%) right bottom / 50% 100% no-repeat,
    var(--env);
  z-index: 2;
  clip-path: polygon(0 30%, 50% 64%, 100% 30%, 100% 100%, 0 100%);
}
.env-flap {
  position: absolute;
  inset: 0 0 auto 0;
  height: 52%;
  border-radius: 20px 20px 0 0;
  background: linear-gradient(to bottom, var(--env-dark), color-mix(in srgb, var(--env-dark) 88%, black));
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transform-origin: top;
  z-index: 3;
  /* Goes behind the letter halfway through its swing */
  transition: transform 0.6s cubic-bezier(0.55, 0, 0.3, 1), filter 0.6s ease, z-index 0s linear 0.3s;
}
.stage--sealed:hover .env-flap { transform: rotateX(-12deg); }
.seal {
  position: absolute;
  top: 52%;
  left: 50%;
  z-index: 4;
  width: 58px;
  height: 58px;
  transform: translate(-50%, -50%);
  transition: transform 0.3s ease;
}
.stage--sealed:hover .seal { transform: translate(-50%, -50%) scale(1.06) rotate(-6deg); }
.seal-half {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  box-shadow: inset 0 -3px 6px rgb(0 0 0 / 0.2), inset 0 2px 4px rgb(255 255 255 / 0.25), 0 6px 14px -4px rgb(0 0 0 / 0.4);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.6, 1), opacity 0.45s ease;
}
/* A jagged crack down the middle */
.seal-half--left { clip-path: polygon(0 0, 52% 0, 46% 22%, 55% 40%, 45% 60%, 54% 78%, 48% 100%, 0 100%); }
.seal-half--right { clip-path: polygon(52% 0, 100% 0, 100% 100%, 48% 100%, 54% 78%, 45% 60%, 55% 40%, 46% 22%); }
.seal-icon { width: 24px; height: 24px; }
.label {
  position: absolute;
  inset: auto 0 7% 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 0.3s ease;
}

/* Cracking: the halves fall apart */
.stage:not(.stage--sealed) .seal-half--left { transform: translate(-14px, 26px) rotate(-28deg); opacity: 0; }
.stage:not(.stage--sealed) .seal-half--right { transform: translate(14px, 30px) rotate(24deg); opacity: 0; }
.stage:not(.stage--sealed) .label { opacity: 0; }
/* Flap: swings up and over, behind the letter */
.stage--flap .env-flap,
.stage--rising .env-flap { transform: rotateX(180deg); filter: brightness(0.92); z-index: 0; }
/* Rising: the letter slides up out of the pocket */
.stage--rising .peek { transform: translateY(-46%); }

/* Leaving: the envelope drops away below the unfolding letter */
.envelope-out-leave-active {
  position: absolute;
  inset: auto 0 0 0;
  transition: transform 0.7s cubic-bezier(0.55, 0, 0.3, 1), opacity 0.55s ease;
}
.envelope-out-leave-to { transform: translateY(40%) scale(0.92); opacity: 0; }
.envelope-out-enter-active { transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
.envelope-out-enter-from { opacity: 0; transform: translateY(12px) scale(0.98); }

/* ---------- The letter ---------- */
.paper {
  border-radius: 20px;
  background-color: var(--paper);
  /* Faint ruled lines the height of a line of text, on a light paper grain */
  background-image:
    repeating-linear-gradient(to bottom, transparent 0, transparent calc(1.9em - 1px), var(--rule) calc(1.9em - 1px), var(--rule) 1.9em),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-position: 0 2.1rem, 0 0;
  box-shadow: 0 1px 0 rgb(255 255 255 / 0.5) inset, 0 18px 40px -20px rgb(0 0 0 / 0.4);
}
.letter--opening .paper { animation: unfold 0.8s cubic-bezier(0.22, 1, 0.36, 1) both; transform-origin: top center; }
@keyframes unfold {
  from { opacity: 0; transform: perspective(900px) rotateX(-14deg) translateY(-18px) scale(0.94); }
  to { opacity: 1; transform: none; }
}
.paper--reveal .line,
.paper--reveal .fold { animation: line-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both; }
@keyframes line-in {
  from { opacity: 0; transform: translateY(8px); filter: blur(2px); }
  to { opacity: 1; transform: none; filter: none; }
}
.flourish {
  position: absolute;
  left: -4%;
  right: -4%;
  bottom: -10px;
  width: 108%;
  height: 12px;
}
@keyframes draw { from { stroke-dashoffset: 160; } to { stroke-dashoffset: 0; } }
.flourish path { stroke-dasharray: 160; }
.paper--reveal .flourish path { animation: draw 1s ease both; animation-delay: inherit; }

@media (prefers-reduced-motion: reduce) {
  .env-flap, .seal, .seal-half, .peek, .label { transition: none; }
  .letter--opening .paper, .paper--reveal .line, .paper--reveal .fold, .paper--reveal .flourish path { animation: none; }
  .envelope-out-leave-active, .envelope-out-enter-active { transition: none; }
}
</style>
