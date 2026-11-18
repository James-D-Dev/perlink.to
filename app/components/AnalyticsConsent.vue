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
const { consent, measured, setConsent } = useAnalytics()
const lang = useLegalLang()

const COPY = {
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
}
const copy = computed(() => COPY[lang.value])
</script>
