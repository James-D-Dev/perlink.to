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
import type { LegalLang } from '~/data/legal/types'

definePageMeta({ layout: 'default', colorMode: 'light' })
const lang = useLegalLang()
const doc = computed(() => COOKIES[lang.value])

const { consent, setConsent } = useAnalytics()
const allowed = computed(() => consent.value === 'granted')

const COPY: Record<LegalLang, { title: string; on: string; off: string; turnOn: string; turnOff: string }> = {
  en: { title: 'Analytics cookies', on: 'On: Google Analytics may set cookies on Perlink’s pages.', off: 'Off: no analytics cookies are set.', turnOn: 'Allow', turnOff: 'Turn off' },
  vi: { title: 'Cookie thống kê', on: 'Đang bật: Google Analytics có thể đặt cookie trên trang của Perlink.', off: 'Đang tắt: không đặt cookie thống kê.', turnOn: 'Cho phép', turnOff: 'Tắt' },
  zh: { title: '分析类 Cookie', on: '已开启：Google Analytics 可能会在 Perlink 的页面上设置 Cookie。', off: '已关闭：不会设置分析类 Cookie。', turnOn: '允许', turnOff: '关闭' },
  ja: { title: 'アクセス解析用 Cookie', on: 'オン：Google Analytics が Perlink のページで Cookie を設定することがあります。', off: 'オフ：アクセス解析用の Cookie は設定されません。', turnOn: '許可する', turnOff: 'オフにする' },
  ko: { title: '분석 쿠키', on: '사용 중: Google Analytics가 Perlink 페이지에 쿠키를 설정할 수 있습니다.', off: '사용 안 함: 분석 쿠키를 설정하지 않습니다.', turnOn: '허용', turnOff: '끄기' },
}
const copy = computed(() => COPY[lang.value])
</script>
