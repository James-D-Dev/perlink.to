<template>
  <!-- A private site: its name and photo, then a password or a countdown -->
  <div class="flex min-h-dvh items-center justify-center px-5 py-16" :style="{ background: bg, color: fg }">
    <div class="w-full max-w-sm text-center">
      <img v-if="avatarUrl" :src="avatarUrl" alt="" class="mx-auto mb-5 size-20 rounded-full object-cover shadow-lg ring-4 ring-white/20">
      <div v-else class="mx-auto mb-5 flex size-20 items-center justify-center rounded-full bg-white/10">
        <UIcon :name="gate.kind === 'password' ? 'i-lucide-lock' : 'i-lucide-hourglass'" class="size-8" />
      </div>
      <p class="text-sm opacity-70">{{ title }}</p>

      <!-- Password -->
      <template v-if="gate.kind === 'password'">
        <h1 class="mt-1 text-2xl font-semibold">{{ siteT(lang, 'gateTitle') }}</h1>
        <p class="mt-2 text-sm opacity-70">{{ siteT(lang, 'gateText') }}</p>
        <form class="mt-6 flex gap-2" @submit.prevent="unlock">
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            :placeholder="siteT(lang, 'gatePassword')"
            :aria-label="siteT(lang, 'gatePassword')"
            class="min-w-0 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-base outline-none placeholder:opacity-60 focus:border-white/50"
            :style="{ color: fg }"
            autofocus
          >
          <button
            type="submit"
            :disabled="busy || !password"
            class="shrink-0 rounded-xl px-5 py-3 font-semibold transition disabled:opacity-50"
            :style="{ background: accent, color: accentFg }"
          >
            {{ siteT(lang, 'gateUnlock') }}
          </button>
        </form>
        <p v-if="error" class="mt-3 text-sm text-red-300" role="alert">{{ error }}</p>
      </template>

      <!-- Opening time -->
      <template v-else>
        <h1 class="mt-1 text-2xl font-semibold">{{ siteT(lang, 'gateSoon') }}</h1>
        <p class="mt-2 text-sm opacity-70">{{ siteT(lang, 'gateOpensOn', { date: opensLabel }) }}</p>
        <ClientOnly>
        <div class="mt-6 grid grid-cols-4 gap-2" aria-live="polite">
          <div v-for="part in countdown" :key="part.key" class="rounded-xl bg-white/10 py-3">
            <p class="text-2xl font-semibold tabular-nums">{{ part.value }}</p>
            <p class="text-[11px] uppercase tracking-wide opacity-60">{{ siteT(lang, part.key) }}</p>
          </div>
        </div>
        </ClientOnly>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SiteLanguage, SiteMessageKey } from '~/utils/siteI18n'

const props = defineProps<{
  username: string
  title: string
  avatarUrl?: string | null
  lang: SiteLanguage
  gate: { kind: 'password' } | { kind: 'schedule'; opensAt: string }
  colors?: { primary?: string; secondary?: string; third?: string }
}>()

// The site's own colours: its dark one as the backdrop, its accent for the button
const bg = computed(() => props.colors?.third || '#111111')
const fg = computed(() => (isLight(bg.value) ? '#111111' : '#ffffff'))
const accent = computed(() => props.colors?.primary || '#ffffff')
const accentFg = computed(() => (isLight(accent.value) ? '#111111' : '#ffffff'))

function isLight(hex: string) {
  const m = hex.replace('#', '').match(/^([\da-f]{2})([\da-f]{2})([\da-f]{2})/i)
  if (!m) return false
  const [r, g, b] = [m[1], m[2], m[3]].map(x => parseInt(x!, 16))
  return 0.299 * r! + 0.587 * g! + 0.114 * b! > 160
}

// Password
const password = ref('')
const busy = ref(false)
const error = ref('')
async function unlock() {
  busy.value = true
  error.value = ''
  try {
    await $fetch(`/api/bio/${props.username}/unlock`, { method: 'POST', body: { password: password.value } })
    // The cookie is set: load the site for real
    window.location.reload()
  } catch (e: any) {
    error.value = e?.statusCode === 401 ? siteT(props.lang, 'gateWrong') : (e?.data?.statusMessage || siteT(props.lang, 'gateWrong'))
    busy.value = false
  }
}

// Countdown, ticking in the browser; the page reloads when it opens
const now = ref(Date.now())
const opensAt = computed(() => (props.gate.kind === 'schedule' ? Date.parse(props.gate.opensAt) : 0))
const opensLabel = computed(() =>
  opensAt.value ? new Intl.DateTimeFormat(props.lang, { dateStyle: 'long', timeStyle: 'short' }).format(opensAt.value) : '',
)
const countdown = computed(() => {
  const left = Math.max(0, Math.floor((opensAt.value - now.value) / 1000))
  const parts: { key: SiteMessageKey; value: string }[] = [
    { key: 'gateDays', value: String(Math.floor(left / 86400)) },
    { key: 'gateHours', value: String(Math.floor(left / 3600) % 24).padStart(2, '0') },
    { key: 'gateMinutes', value: String(Math.floor(left / 60) % 60).padStart(2, '0') },
    { key: 'gateSeconds', value: String(left % 60).padStart(2, '0') },
  ]
  return parts
})
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  if (props.gate.kind !== 'schedule') return
  timer = setInterval(() => {
    now.value = Date.now()
    if (now.value >= opensAt.value) {
      clearInterval(timer)
      // A moment's grace for clocks that run a little ahead of the server's
      setTimeout(() => window.location.reload(), 1500)
    }
  }, 1000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>
