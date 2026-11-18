<template>
  <LegalShell :title="doc.title" :intro="doc.intro" :description="doc.description" updated>
    <!-- The visitor's analytics choice, changeable here at any time -->
    <div class="mx-auto max-w-6xl border-x border-line px-5 pt-10 sm:px-8 md:pt-16">
    <div class="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-sand p-5">
      <div class="flex min-w-0 items-center gap-3">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-full" :class="allowed ? 'bg-green-500/10 text-green-600' : 'bg-paper text-ink-muted ring-1 ring-line'">
          <UIcon :name="allowed ? 'i-lucide-chart-no-axes-column' : 'i-lucide-chart-no-axes-column-decreasing'" class="size-5" />
        </span>
        <div class="min-w-0">
          <p class="font-medium text-ink">{{ copy.title }}</p>
          <p class="text-sm text-ink-muted">{{ allowed ? copy.on : copy.off }}</p>
        </div>
      </div>
      <ClientOnly>
        <button
          type="button"
          class="h-10 rounded-full px-5 text-sm font-medium transition-colors"
          :class="allowed ? 'bg-paper text-ink ring-1 ring-line hover:bg-paper/70' : 'bg-blue-600 text-white hover:bg-blue-700'"
          @click="setConsent(allowed ? 'denied' : 'granted')"
        >
          {{ allowed ? copy.turnOff : copy.turnOn }}
        </button>
      </ClientOnly>
    </div>
    </div>
    <LegalDoc :doc="doc" />
  </LegalShell>
</template>

<script setup lang="ts">
import { COOKIES } from '~/data/legal/cookies'

definePageMeta({ layout: 'default', colorMode: 'light' })
const lang = useLegalLang()
const doc = computed(() => COOKIES[lang.value])

const { consent, setConsent } = useAnalytics()
const allowed = computed(() => consent.value === 'granted')

const COPY = {
  en: { title: 'Analytics cookies', on: 'On: Google Analytics may set cookies on Perlink’s pages.', off: 'Off: no analytics cookies are set.', turnOn: 'Allow', turnOff: 'Turn off' },
  vi: { title: 'Cookie thống kê', on: 'Đang bật: Google Analytics có thể đặt cookie trên trang của Perlink.', off: 'Đang tắt: không đặt cookie thống kê.', turnOn: 'Cho phép', turnOff: 'Tắt' },
}
const copy = computed(() => COPY[lang.value])
</script>
