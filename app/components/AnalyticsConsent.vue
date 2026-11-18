<template>
  <!-- Asks before Perlink's analytics cookies (EEA, UK, Switzerland, or from
       "Cookie settings" in the footer); see plugins/analytics.client.ts -->
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="translate-y-4 opacity-0"
    leave-active-class="transition duration-200 ease-in"
    leave-to-class="translate-y-4 opacity-0"
  >
    <div
      v-if="consent === 'ask' && measured"
      role="dialog"
      aria-live="polite"
      :aria-label="copy.title"
      class="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-md rounded-3xl bg-white p-4 text-neutral-900 shadow-2xl ring-1 ring-black/10 sm:inset-x-auto sm:left-4 sm:bottom-4 sm:p-5 dark:bg-neutral-900 dark:text-white dark:ring-white/10"
    >
      <div class="flex gap-3">
        <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
          <UIcon name="i-lucide-cookie" class="size-5" />
        </span>
        <div class="min-w-0">
          <p class="font-semibold">{{ copy.title }}</p>
          <p class="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
            {{ copy.text }}
            <NuxtLink to="/cookie-notice" class="underline underline-offset-2 hover:text-blue-600">{{ copy.more }}</NuxtLink>
          </p>
        </div>
      </div>
      <div class="mt-4 flex gap-2">
        <button type="button" class="h-10 flex-1 rounded-full bg-neutral-100 text-sm font-medium hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/15" @click="setConsent('denied')">
          {{ copy.decline }}
        </button>
        <button type="button" class="h-10 flex-1 rounded-full bg-blue-600 text-sm font-medium text-white hover:bg-blue-700" @click="setConsent('granted')">
          {{ copy.accept }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { LegalLang } from '~/data/legal/types'

const { consent, measured, setConsent } = useAnalytics()
const lang = useLegalLang()

const COPY: Record<LegalLang, { title: string; text: string; more: string; decline: string; accept: string }> = {
  en: {
    title: 'Cookies for analytics',
    text: 'With your OK, Google Analytics cookies help us see how people find and use Perlink. No ads, and people’s sites are never tracked.',
    more: 'Cookie notice',
    decline: 'No thanks',
    accept: 'Allow',
  },
  vi: {
    title: 'Cookie thống kê',
    text: 'Nếu bạn đồng ý, cookie Google Analytics giúp chúng tôi biết mọi người tìm thấy và dùng Perlink thế nào. Không quảng cáo, và không theo dõi trang của người dùng.',
    more: 'Thông báo cookie',
    decline: 'Không, cảm ơn',
    accept: 'Đồng ý',
  },
  zh: {
    title: '分析类 Cookie',
    text: '经您同意后，Google Analytics Cookie 可帮助我们了解用户如何找到并使用 Perlink。我们不投放广告，也绝不追踪用户的网站。',
    more: 'Cookie 声明',
    decline: '不用了，谢谢',
    accept: '允许',
  },
  ja: {
    title: 'アクセス解析用 Cookie',
    text: 'ご同意いただける場合、Google Analytics の Cookie を使って、Perlink がどのように見つけられ、利用されているかを把握します。広告は表示せず、ユーザーのサイトを追跡することもありません。',
    more: 'Cookieに関するお知らせ',
    decline: '同意しない',
    accept: '許可する',
  },
  ko: {
    title: '분석 쿠키',
    text: '동의하시면 Google Analytics 쿠키를 통해 사람들이 Perlink를 어떻게 찾고 이용하는지 파악합니다. 광고는 없으며, 사용자의 사이트는 절대 추적하지 않습니다.',
    more: '쿠키 안내',
    decline: '거부',
    accept: '허용',
  },
}
const copy = computed(() => COPY[lang.value])
</script>
