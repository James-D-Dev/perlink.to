<template>
  <LegalShell :title="t('report.title')" :intro="t('report.intro')">
    <section>
      <div class="mx-auto max-w-6xl border-x border-line px-5 py-10 sm:px-8 md:py-16">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
          <!-- Sent -->
          <div v-if="sent" class="flex flex-col items-center rounded-2xl bg-sand px-6 py-14 text-center">
            <div class="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <UIcon name="i-lucide-check" class="size-7" />
            </div>
            <p class="mt-5 text-xl font-semibold text-ink">{{ t('report.sent') }}</p>
            <p class="mt-2 max-w-sm text-[15px] leading-relaxed text-ink-muted">{{ t('report.sentText') }}</p>
          </div>

          <form v-else class="min-w-0 space-y-8" @submit.prevent="submit">
            <!-- Site -->
            <div>
              <label for="report-site" class="text-[15px] font-medium text-ink">{{ t('report.site') }} <span class="text-red-500">*</span></label>
              <div class="mt-2.5 flex h-12 items-center rounded-xl bg-paper ring-1 ring-line transition focus-within:ring-2 focus-within:ring-ink">
                <span class="pl-4 text-[15px] text-ink-faint">perlink.to/</span>
                <input
                  id="report-site"
                  v-model="site"
                  type="text"
                  autocomplete="off"
                  :placeholder="t('report.sitePlaceholder')"
                  class="h-full min-w-0 flex-1 bg-transparent pr-4 text-[15px] text-ink outline-none placeholder:text-ink-faint"
                >
              </div>
            </div>

            <!-- Reason -->
            <fieldset>
              <legend class="text-[15px] font-medium text-ink">{{ t('report.reason') }} <span class="text-red-500">*</span></legend>
              <div class="mt-2.5 grid gap-2 sm:grid-cols-2">
                <label
                  v-for="value in REPORT_REASONS"
                  :key="value"
                  class="flex cursor-pointer items-start gap-3 rounded-xl px-4 py-3 text-sm ring-1 transition"
                  :class="reason === value ? 'bg-sand ring-2 ring-ink' : 'bg-paper ring-line hover:bg-sand/60'"
                >
                  <input v-model="reason" type="radio" name="reason" :value="value" class="sr-only">
                  <span
                    class="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ring-1"
                    :class="reason === value ? 'bg-ink ring-ink' : 'ring-ink-faint'"
                  >
                    <span v-if="reason === value" class="size-1.5 rounded-full bg-paper" />
                  </span>
                  <span class="leading-snug text-ink">{{ t(`report.reasons.${value}`) }}</span>
                </label>
              </div>
            </fieldset>

            <!-- Details -->
            <div>
              <label for="report-details" class="text-[15px] font-medium text-ink">{{ t('report.details') }}</label>
              <textarea
                id="report-details"
                v-model="details"
                rows="4"
                maxlength="2000"
                :placeholder="t('report.detailsPlaceholder')"
                class="mt-2.5 block w-full resize-y rounded-xl bg-paper px-4 py-3 text-[15px] leading-relaxed text-ink outline-none ring-1 ring-line transition placeholder:text-ink-faint focus:ring-2 focus:ring-ink"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="report-email" class="text-[15px] font-medium text-ink">{{ t('report.email') }}</label>
              <input
                id="report-email"
                v-model="email"
                type="email"
                autocomplete="email"
                class="mt-2.5 block h-12 w-full rounded-xl bg-paper px-4 text-[15px] text-ink outline-none ring-1 ring-line transition focus:ring-2 focus:ring-ink"
              >
              <p class="mt-2 text-sm text-ink-muted">{{ t('report.emailHelp') }}</p>
            </div>

            <MarketingMkButton type="submit" size="lg" :disabled="!site.trim() || !reason || sending" class="w-full sm:w-auto">
              <UIcon v-if="sending" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              {{ t('report.submit') }}
            </MarketingMkButton>
          </form>

          <!-- What happens next -->
          <aside class="space-y-3 lg:pt-1">
            <div v-for="step in steps" :key="step.title" class="rounded-2xl bg-sand p-5">
              <UIcon :name="step.icon" class="size-5 text-ink" />
              <p class="mt-3 text-[15px] font-medium text-ink">{{ step.title }}</p>
              <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ step.text }}</p>
            </div>
            <NuxtLink to="/terms#acceptable-use" class="inline-flex items-center gap-1.5 px-1 pt-1 text-sm font-medium text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-ink">
              {{ t('report.terms') }}
              <UIcon name="i-lucide-arrow-right" class="size-3.5" />
            </NuxtLink>
          </aside>
        </div>
      </div>
    </section>
  </LegalShell>
</template>

<script setup lang="ts">
import { REPORT_REASONS, type ReportReason } from '#shared/reports'

// Anyone can report a site; it lands in Superadmin → Reports
definePageMeta({ layout: 'default', colorMode: 'light' })
const { t } = useI18n()
const toast = useToast()
const route = useRoute()
const lang = useLegalLang()

useHead({ meta: [{ name: 'robots', content: 'noindex' }] })

// Opened from a site's "Report" link with ?site=<address>
const site = ref(typeof route.query.site === 'string' ? route.query.site : '')
const reason = ref<ReportReason | undefined>()
const details = ref('')
const email = ref('')
const sending = ref(false)
const sent = ref(false)

const steps = computed(() =>
  lang.value === 'vi'
    ? [
        { icon: 'i-lucide-eye', title: 'Chúng tôi xem xét', text: 'Mỗi báo cáo đều được người thật kiểm tra, thường trong 1–2 ngày.' },
        { icon: 'i-lucide-ban', title: 'Gỡ nếu vi phạm', text: 'Trang vi phạm bị gỡ và chủ trang không thể tự đăng lại.' },
        { icon: 'i-lucide-lock', title: 'Bạn được ẩn danh', text: 'Chủ trang không biết ai đã báo cáo.' },
      ]
    : [
        { icon: 'i-lucide-eye', title: 'We review it', text: 'A person checks every report, usually within 1–2 days.' },
        { icon: 'i-lucide-ban', title: 'Taken down if it breaks the rules', text: 'The site is removed and its owner can’t publish it again.' },
        { icon: 'i-lucide-lock', title: 'You stay anonymous', text: 'The site owner never learns who reported it.' },
      ],
)

async function submit() {
  if (!site.value.trim() || !reason.value || sending.value) return
  sending.value = true
  try {
    const username = site.value.trim().replace(/^https?:\/\//, '').replace(/^(www\.)?perlink\.to\//, '').split(/[/?#]/)[0]!
    await $fetch('/api/report', { method: 'POST', body: { username, reason: reason.value, details: details.value, email: email.value } })
    sent.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error: any) {
    toast.add({ title: t('report.failed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    sending.value = false
  }
}
</script>
