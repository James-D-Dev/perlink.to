<template>
  <!-- A letter on ruled paper. Sealed, it waits in an envelope closed with
       a heart-shaped wax seal in the page's accent. A tap makes the heart
       beat and lift off in a little burst of hearts, the flap swings open,
       the letter slides out and opens up, and its lines appear one by one,
       as if being read, while a few hearts float up. The page music starts
       with that same tap -->
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

    <!-- A few hearts drifting up as the letter opens -->
    <span v-if="floating" class="float-layer" aria-hidden="true">
      <svg v-for="h in FLOAT" :key="h.x" class="float-heart" viewBox="0 0 24 24" :style="{ left: `${h.x}%`, width: `${h.size}px`, animationDelay: `${h.delay}ms`, color: accent, '--drift': `${h.drift}px` }">
        <path :d="HEART" fill="currentColor" />
      </svg>
    </span>

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
        <!-- Wax seal: a heart that beats, then lifts off in a burst of small hearts -->
        <span class="seal" aria-hidden="true">
          <span class="seal-wax" :style="sealStyle">
            <svg viewBox="0 0 24 24" class="seal-icon"><path :d="HEART" fill="currentColor" /></svg>
          </span>
          <span class="burst">
            <svg v-for="(b, i) in BURST" :key="i" class="burst-heart" viewBox="0 0 24 24" :style="{ '--x': `${b.x}px`, '--y': `${b.y}px`, '--r': `${b.r}deg`, width: `${b.size}px`, color: accent }">
              <path :d="HEART" fill="currentColor" />
            </svg>
          </span>
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

const HEART = 'M12 21s-7.5-4.6-10-9.2C.3 8.6 2.1 4.5 6 4.5c2.3 0 3.7 1.3 6 3.6 2.3-2.3 3.7-3.6 6-3.6 3.9 0 5.7 4.1 4 7.3C19.5 16.4 12 21 12 21z'
// Small hearts flying out of the seal, and drifting up over the open letter
const BURST = [
  { x: -46, y: -38, r: -24, size: 12 }, { x: 44, y: -42, r: 20, size: 14 }, { x: -58, y: 6, r: -12, size: 10 },
  { x: 60, y: 2, r: 16, size: 11 }, { x: -26, y: -64, r: -8, size: 9 }, { x: 24, y: -66, r: 10, size: 10 },
  { x: -36, y: 40, r: -30, size: 8 }, { x: 38, y: 36, r: 26, size: 9 },
]
const FLOAT = [
  { x: 8, size: 14, delay: 0, drift: 18 }, { x: 22, size: 10, delay: 500, drift: -12 }, { x: 40, size: 16, delay: 250, drift: 10 },
  { x: 58, size: 11, delay: 800, drift: -16 }, { x: 74, size: 15, delay: 350, drift: 14 }, { x: 90, size: 10, delay: 650, drift: -10 },
]

// ---------- Opening ----------
// sealed → popping (the heart beats and lifts off) → flap (swings open) →
// rising (letter slides out) → open (envelope drops away, lines appear)
type Phase = 'sealed' | 'popping' | 'flap' | 'rising' | 'open'
const floating = ref(false)
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
  phase.value = 'popping'
  later(650, () => (phase.value = 'flap'))
  later(1250, () => (phase.value = 'rising'))
  later(2050, () => growTo(() => {
    revealing.value = true
    floating.value = true
    phase.value = 'open'
  }))
  later(6500, () => (floating.value = false))
}

function foldBack() {
  timers.forEach(clearTimeout)
  revealing.value = false
  floating.value = false
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
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.8s ease;
}
.peek-line { height: 6px; border-radius: 3px; background: currentColor; opacity: 0.13; }
.env-front {
  position: absolute;
  inset: 0;
  border-radius: 20px;
  /* The pocket: side and bottom flaps meeting below the middle */
  background:
    linear-gradient(to top right, transparent 49.6%, rgb(0 0 0 / 0.06) 50%, transparent 50.6%) left bottom / 50% 60% no-repeat,
    linear-gradient(to top left, transparent 49.6%, rgb(0 0 0 / 0.06) 50%, transparent 50.6%) right bottom / 50% 60% no-repeat,
    linear-gradient(to bottom, color-mix(in srgb, var(--env) 92%, white), var(--env));
  z-index: 2;
  clip-path: polygon(0 0, 50% 56%, 100% 0, 100% 100%, 0 100%);
}
.env-flap {
  position: absolute;
  inset: 0 0 auto 0;
  /* Reaches past the pocket's V so the two always overlap: no gap along the seams */
  height: 62%;
  transform-origin: top;
  z-index: 3;
  /* The shadow sits on this wrapper, since a clipped element can't cast one */
  filter: drop-shadow(0 3px 4px rgb(0 0 0 / 0.14));
  /* Goes behind the letter halfway through its swing */
  transition: transform 0.65s cubic-bezier(0.55, 0, 0.3, 1), filter 0.65s ease, z-index 0s linear 0.32s;
}
.env-flap::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px 20px 0 0;
  background: linear-gradient(to bottom, var(--env-dark), color-mix(in srgb, var(--env-dark) 88%, black));
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}
/* Hover lifts the whole envelope a touch; the flap stays shut */
.stage--sealed { transition: transform 0.3s ease; }
@media (hover: hover) {
  .stage--sealed:hover { transform: translateY(-3px); }
}
.seal {
  position: absolute;
  top: 59%;
  left: 50%;
  z-index: 4;
  width: 60px;
  height: 60px;
  transform: translate(-50%, -50%);
}
.seal-wax {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /* A wax blob: slightly uneven edge, glossy top, soft shadow */
  border-radius: 48% 52% 50% 50% / 52% 48% 52% 48%;
  box-shadow:
    inset 0 -4px 7px rgb(0 0 0 / 0.22),
    inset 0 3px 5px rgb(255 255 255 / 0.3),
    0 0 0 3px color-mix(in srgb, currentColor 0%, rgb(0 0 0 / 0.06)),
    0 8px 16px -6px rgb(0 0 0 / 0.45);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.seal-icon { width: 26px; height: 26px; filter: drop-shadow(0 1px 0 rgb(0 0 0 / 0.18)); }
.stage--sealed .seal-wax { animation: heartbeat 2.4s ease-in-out infinite; }
@media (hover: hover) { .stage--sealed:hover .seal-wax { animation-duration: 1.2s; } }
@keyframes heartbeat {
  0%, 40%, 100% { transform: scale(1); }
  10% { transform: scale(1.09); }
  20% { transform: scale(0.98); }
  30% { transform: scale(1.06); }
}
/* Popping: one strong beat, then the seal lifts off and fades */
.stage:not(.stage--sealed) .seal-wax { animation: seal-off 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
@keyframes seal-off {
  0% { transform: scale(1); opacity: 1; }
  35% { transform: scale(1.22); opacity: 1; }
  100% { transform: translateY(-34px) scale(0.6) rotate(-10deg); opacity: 0; }
}
.burst { position: absolute; inset: 0; pointer-events: none; }
.burst-heart {
  position: absolute;
  left: 50%;
  top: 50%;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.2);
  filter: drop-shadow(0 2px 3px rgb(0 0 0 / 0.15));
}
.stage:not(.stage--sealed) .burst-heart { animation: burst 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.18s forwards; }
@keyframes burst {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
  25% { opacity: 1; }
  100% { opacity: 0; transform: translate(calc(-50% + var(--x)), calc(-50% + var(--y))) scale(1) rotate(var(--r)); }
}
.label {
  position: absolute;
  inset: auto 0 7% 0;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: opacity 0.3s ease;
}

/* Once tapped: the label fades */
.stage:not(.stage--sealed) .label { opacity: 0; }
/* Flap: swings up and over, behind the letter */
.stage--flap .env-flap,
.stage--rising .env-flap { transform: rotateX(180deg); filter: brightness(0.94) drop-shadow(0 -2px 3px rgb(0 0 0 / 0.08)); z-index: 0; }
/* Rising: the letter slides up out of the pocket, lifting towards the reader */
.stage--rising .peek { transform: translateY(-42%) scale(1.03); box-shadow: 0 18px 30px -12px rgb(0 0 0 / 0.35); }

/* Leaving: the envelope drops away below the unfolding letter */
.envelope-out-leave-active {
  position: absolute;
  inset: auto 0 0 0;
  transition: transform 0.7s cubic-bezier(0.55, 0, 0.3, 1), opacity 0.55s ease;
}
.envelope-out-leave-to { transform: translateY(30%) scale(0.94); opacity: 0; }
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
  0% { opacity: 0.6; transform: perspective(1000px) rotateX(-24deg) translateY(-10px) scale(0.9); }
  60% { opacity: 1; transform: perspective(1000px) rotateX(3deg) scale(1.01); }
  100% { opacity: 1; transform: none; }
}

/* Hearts drifting up over the opened letter */
.float-layer { position: absolute; inset: 0; z-index: 5; overflow: visible; pointer-events: none; }
.float-heart {
  position: absolute;
  bottom: 12%;
  opacity: 0;
  animation: float-up 3.6s ease-out forwards;
  filter: drop-shadow(0 2px 3px rgb(0 0 0 / 0.12));
}
@keyframes float-up {
  0% { opacity: 0; transform: translate(0, 0) scale(0.5); }
  15% { opacity: 0.85; }
  50% { transform: translate(var(--drift), -140px) scale(1) rotate(8deg); }
  100% { opacity: 0; transform: translate(calc(var(--drift) * -0.5), -300px) scale(0.9) rotate(-6deg); }
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
  .env-flap, .seal, .seal-wax, .peek, .label { transition: none; animation: none !important; }
  .float-layer, .burst { display: none; }
  .letter--opening .paper, .paper--reveal .line, .paper--reveal .fold, .paper--reveal .flourish path { animation: none; }
  .envelope-out-leave-active, .envelope-out-enter-active { transition: none; }
}
</style>
