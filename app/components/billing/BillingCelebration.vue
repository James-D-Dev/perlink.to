<template>
  <!-- "You're upgraded!": once per approved payment, the next time the payer
       is in the dashboard (or right away, if they're here when it's approved) -->
  <AppSheet v-model:open="open" :title="t('dashboard.billing.celebrate.title')" :ui="{ content: 'max-w-sm overflow-hidden' }" @after:leave="markSeen">
    <template #content>
      <div v-if="shown" class="relative overflow-hidden text-center">
        <!-- Confetti -->
        <div class="pointer-events-none absolute inset-x-0 top-0 h-full" aria-hidden="true">
          <span
            v-for="piece in confetti"
            :key="piece.id"
            class="confetti absolute top-0 block rounded-[2px]"
            :style="{ left: `${piece.x}%`, width: `${piece.w}px`, height: `${piece.h}px`, background: piece.color, animationDelay: `${piece.delay}ms`, animationDuration: `${piece.duration}ms`, '--spin': `${piece.spin}deg`, '--drift': `${piece.drift}px` }"
          />
        </div>

        <div class="relative px-6 pb-6 pt-10">
          <div class="pop mx-auto flex size-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-amber-300 via-orange-400 to-pink-500 text-white shadow-[0_16px_40px_-10px_rgb(236_72_153/0.6)]">
            <UIcon name="i-lucide-crown" class="size-10" />
          </div>
          <h2 class="mt-5 text-[26px] font-bold tracking-tight text-ink">{{ t('dashboard.billing.celebrate.title') }}</h2>
          <p class="mt-1.5 text-[15px] text-ink-soft">
            {{ t('dashboard.billing.celebrate.text', { plan: planName }) }}
          </p>
          <p v-if="info?.expiresAt" class="mt-1 text-sm text-ink-muted">{{ t('dashboard.billing.celebrate.until', { date: formatDate(info.expiresAt) }) }}</p>

          <div class="mt-5 rounded-2xl bg-sand/60 p-4 text-left ring-1 ring-line">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ t('dashboard.billing.celebrate.unlocked') }}</p>
            <ul class="space-y-1.5">
              <li v-for="feature in features" :key="feature" class="flex items-start gap-2 text-sm text-ink">
                <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-emerald-600" />
                {{ feature }}
              </li>
            </ul>
          </div>

          <UButton block size="xl" class="mt-5 justify-center" :label="t('dashboard.billing.celebrate.start')" @click="open = false" />
        </div>
      </div>
    </template>
  </AppSheet>
</template>

<script setup lang="ts">
import type { PlanId } from '#shared/plans'

const { t, locale } = useI18n()
const { loggedIn } = useUserSession()
const { info, ensure, refresh } = useBilling()

const open = ref(false)
/** The payment being celebrated (kept while the sheet closes) */
const shown = ref<{ paymentId: string; plan: PlanId } | null>(null)

const planName = computed(() => (shown.value ? t(`dashboard.billing.plans.${shown.value.plan}.name`) : ''))
const features = computed(() => (shown.value ? planFeatures(shown.value.plan, t) : []))
const formatDate = (iso: string) => new Date(iso).toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-GB')

// Show it when the billing info says there's one to celebrate
watch(() => info.value?.celebrate?.paymentId, (id) => {
  if (!id || shown.value?.paymentId === id) return
  shown.value = info.value!.celebrate!
  open.value = true
})

async function markSeen() {
  const id = shown.value?.paymentId
  if (!id) return
  await $fetch(`/api/billing/payments/${id}/celebrated`, { method: 'POST' }).catch(() => {})
  if (info.value?.celebrate?.paymentId === id) info.value = { ...info.value, celebrate: null }
}

// While a payment waits for review, look again every 5 s so the screen
// appears soon after it's approved
let timer: ReturnType<typeof setInterval> | null = null
const waiting = computed(() => !!info.value?.payments.some(p => p.status === 'submitted'))
watch(waiting, (isWaiting) => {
  if (timer) clearInterval(timer)
  timer = isWaiting ? setInterval(() => refresh(), 5000) : null
}, { immediate: true })
onMounted(() => {
  if (loggedIn.value) ensure()
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

// Confetti pieces, made once
const COLORS = ['#f59e0b', '#ec4899', '#10b981', '#3b82f6', '#8b5cf6', '#f43f5e', '#facc15']
const confetti = Array.from({ length: 44 }, (_, id) => ({
  id,
  x: Math.random() * 100,
  w: 6 + Math.random() * 5,
  h: 9 + Math.random() * 7,
  color: COLORS[id % COLORS.length],
  delay: Math.random() * 900,
  duration: 2200 + Math.random() * 1600,
  spin: 360 + Math.random() * 720,
  drift: (Math.random() - 0.5) * 120,
}))
</script>

<style scoped>
.confetti {
  transform: translateY(-20px);
  animation-name: confetti-fall;
  animation-timing-function: cubic-bezier(0.25, 0.6, 0.45, 1);
  animation-fill-mode: both;
}
@keyframes confetti-fall {
  0% { transform: translate(0, -20px) rotate(0); opacity: 1; }
  85% { opacity: 1; }
  100% { transform: translate(var(--drift), 560px) rotate(var(--spin)); opacity: 0; }
}
.pop {
  animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  animation-delay: 0.1s;
}
@keyframes pop {
  from { transform: scale(0.3) rotate(-12deg); opacity: 0; }
  to { transform: scale(1) rotate(0); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .confetti { display: none; }
  .pop { animation: none; }
}
</style>
