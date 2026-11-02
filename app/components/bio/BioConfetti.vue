<template>
  <!-- A one-off burst of confetti or hearts from the middle of its parent
       (which should be position: relative). Drawn in the browser only;
       nothing when the visitor prefers less motion -->
  <div class="confetti pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <span
      v-for="piece in pieces"
      :key="piece.id"
      class="piece"
      :class="shape === 'hearts' ? 'piece--heart' : 'piece--paper'"
      :style="{
        '--dx': `${piece.dx}px`,
        '--dy': `${piece.dy}px`,
        '--rot': `${piece.rot}deg`,
        left: `${originX}%`,
        top: `${originY}%`,
        width: `${piece.size}px`,
        height: shape === 'hearts' ? `${piece.size}px` : `${piece.size * 0.45}px`,
        color: piece.color,
        fontSize: shape === 'hearts' ? `${piece.size}px` : undefined,
        backgroundColor: shape === 'hearts' ? undefined : piece.color,
        animationDelay: `${piece.delay}ms`,
        animationDuration: `${piece.duration}ms`,
      }"
    >{{ shape === 'hearts' ? '♥' : '' }}</span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  shape?: 'confetti' | 'hearts'
  colors?: string[]
  count?: number
  /** Where the burst starts, in % of the parent */
  originX?: number
  originY?: number
}>(), {
  shape: 'confetti',
  colors: () => ['#ff5c8a', '#ffd166', '#06d6a0', '#4cc9f0', '#b388ff', '#ff9f1c'],
  count: 46,
  originX: 50,
  originY: 55,
})

interface Piece { id: number; dx: number; dy: number; rot: number; size: number; color: string; delay: number; duration: number }
const pieces = ref<Piece[]>([])

onMounted(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  pieces.value = Array.from({ length: props.count }, (_, id) => {
    // Out and up in a fan, then down with gravity
    const angle = (-90 + (Math.random() - 0.5) * 150) * (Math.PI / 180)
    const speed = 120 + Math.random() * 170
    return {
      id,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      rot: (Math.random() - 0.5) * 900,
      size: props.shape === 'hearts' ? 12 + Math.random() * 14 : 7 + Math.random() * 7,
      color: props.colors[id % props.colors.length]!,
      delay: Math.random() * 160,
      duration: 1500 + Math.random() * 900,
    }
  })
})
</script>

<style scoped>
.piece {
  position: absolute;
  display: block;
  margin: -6px 0 0 -6px;
  border-radius: 2px;
  line-height: 1;
  opacity: 0;
  animation-name: burst;
  animation-timing-function: cubic-bezier(0.2, 0.7, 0.4, 1);
  animation-fill-mode: both;
  will-change: transform, opacity;
}
.piece--heart { display: flex; align-items: center; justify-content: center; }
@keyframes burst {
  0% { opacity: 0; transform: translate(0, 0) rotate(0) scale(0.4); }
  8% { opacity: 1; }
  45% { transform: translate(var(--dx), var(--dy)) rotate(calc(var(--rot) * 0.5)) scale(1); }
  100% { opacity: 0; transform: translate(calc(var(--dx) * 1.35), calc(var(--dy) + 260px)) rotate(var(--rot)) scale(0.9); }
}
</style>
