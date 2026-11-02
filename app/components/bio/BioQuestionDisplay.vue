<template>
  <!-- "Will you be my Valentine?": the "no" button slips away from the
       finger and the "yes" button grows each time; yes fills the card with
       hearts and shows the answer -->
  <section ref="card" class="relative overflow-hidden px-5 py-8 text-center sm:px-6" :style="cardStyle">
    <div v-if="!saidYes">
      <UIcon name="i-lucide-heart" class="question-heart mx-auto size-10" :style="accentText" />
      <p class="mt-3 text-2xl leading-snug" :style="titleStyle">{{ data.question }}</p>

      <div ref="arena" class="relative mt-6 flex min-h-[112px] items-center justify-center gap-3">
        <button
          type="button"
          class="relative z-10 px-6 py-2.5 text-base font-semibold transition-transform duration-200"
          :style="[buttonStyle, { transform: `scale(${yesScale})` }]"
          @click="sayYes"
        >
          {{ data.yesLabel || t('questionYes') }}
        </button>
        <button
          type="button"
          class="px-6 py-2.5 text-base font-semibold"
          :class="dodged ? 'absolute transition-[left,top] duration-200' : ''"
          :style="[outlineStyle, dodged ? { left: `${noPosition.x}px`, top: `${noPosition.y}px` } : {}]"
          @pointerenter="playful && dodge($event)"
          @pointerdown="playful && dodge($event)"
          @click="playful ? undefined : (noClicked = true)"
        >
          {{ noText }}
        </button>
      </div>
      <p v-if="noClicked && !playful" class="mt-3 text-sm opacity-75">{{ t('questionNoReply') }}</p>
    </div>

    <div v-else class="relative z-10 py-4">
      <UIcon name="i-lucide-heart-handshake" class="mx-auto size-12" :style="accentText" />
      <p class="mt-3 whitespace-pre-line text-2xl leading-snug" :style="titleStyle">{{ data.answer || t('questionDone') }}</p>
    </div>

    <!-- Hearts floating up after yes -->
    <span
      v-for="heart in hearts"
      :key="heart.id"
      class="question-float pointer-events-none absolute bottom-0"
      :style="{ left: `${heart.x}%`, animationDelay: `${heart.delay}ms`, fontSize: `${heart.size}px`, color: accent }"
      aria-hidden="true"
    >♥</span>
  </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { QuestionBlock } from '~/types/bio'

const props = defineProps<{
  data: QuestionBlock['data']
  cardStyle?: CSSProperties
  accentStyle?: CSSProperties
  headingStyle?: CSSProperties
}>()

const { t } = useSiteI18n()
const playful = computed(() => props.data.playful !== false)

const arena = ref<HTMLElement>()
const dodged = ref(false)
const tries = ref(0)
const noPosition = reactive({ x: 0, y: 0 })
const noClicked = ref(false)
const saidYes = ref(false)

// Each escape makes "yes" a little bigger and "no" a little less sure
const yesScale = computed(() => Math.min(1.6, 1 + tries.value * 0.08))
const TEASES = ['questionNo1', 'questionNo2', 'questionNo3', 'questionNo4'] as const
const noText = computed(() => (tries.value === 0 ? props.data.noLabel || t('questionNo') : t(TEASES[(tries.value - 1) % TEASES.length]!)))

function dodge(event: PointerEvent) {
  const box = arena.value
  const button = event.currentTarget as HTMLElement
  if (!box || !button) return
  event.preventDefault()
  tries.value += 1
  // Anywhere in the button area, away from where it was
  const maxX = Math.max(0, box.clientWidth - button.offsetWidth)
  const maxY = Math.max(0, box.clientHeight - button.offsetHeight)
  let x = 0
  let y = 0
  for (let i = 0; i < 6; i += 1) {
    x = Math.random() * maxX
    y = Math.random() * maxY
    if (Math.abs(x - noPosition.x) > button.offsetWidth * 0.8 || Math.abs(y - noPosition.y) > button.offsetHeight) break
  }
  noPosition.x = Math.round(x)
  noPosition.y = Math.round(y)
  dodged.value = true
}

const hearts = ref<{ id: number; x: number; delay: number; size: number }[]>([])
function sayYes() {
  saidYes.value = true
  hearts.value = Array.from({ length: 18 }, (_, id) => ({ id, x: Math.random() * 92, delay: Math.random() * 900, size: 14 + Math.random() * 18 }))
}

// ---------- Looks ----------
const accent = computed(() => String(props.accentStyle?.backgroundColor || '#e8457a'))
const accentText = computed<CSSProperties>(() => ({ color: accent.value }))
const titleStyle = computed<CSSProperties>(() => ({ fontFamily: props.headingStyle?.fontFamily }))
const radius = computed(() => `calc(${String(props.cardStyle?.borderRadius || '16px')} * 0.8)`)
const buttonStyle = computed<CSSProperties>(() => ({ ...props.accentStyle, borderRadius: radius.value }))
const outlineStyle = computed<CSSProperties>(() => ({ border: `1.5px solid currentColor`, borderRadius: radius.value, opacity: 0.8 }))
</script>

<style scoped>
.question-heart {
  animation: question-beat 1.4s ease-in-out infinite;
}
@keyframes question-beat {
  0%, 100% { transform: scale(1); }
  15% { transform: scale(1.18); }
  30% { transform: scale(1); }
  45% { transform: scale(1.12); }
}
.question-float {
  opacity: 0;
  animation: question-rise 2.4s ease-out forwards;
}
@keyframes question-rise {
  0% { transform: translateY(0) scale(0.6); opacity: 0; }
  15% { opacity: 1; }
  100% { transform: translateY(-260px) scale(1.1) rotate(12deg); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .question-heart, .question-float { animation: none; }
}
</style>
