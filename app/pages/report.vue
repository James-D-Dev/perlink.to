<template>
  <div class="min-h-screen bg-gray-50 pt-16">
    <main class="mx-auto max-w-xl px-4 py-12">
      <div class="flex size-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
        <UIcon name="i-lucide-flag" class="size-5" />
      </div>
      <h1 class="mt-4 text-3xl font-bold text-gray-900">{{ t('report.title') }}</h1>
      <p class="mt-2 text-gray-600">{{ t('report.intro') }}</p>

      <!-- Sent -->
      <div v-if="sent" class="mt-8 rounded-2xl bg-white p-6 text-center ring-1 ring-gray-200">
        <UIcon name="i-lucide-circle-check" class="size-10 text-emerald-500" />
        <p class="mt-3 text-lg font-semibold text-gray-900">{{ t('report.sent') }}</p>
        <p class="mt-1 text-sm text-gray-600">{{ t('report.sentText') }}</p>
      </div>

      <form v-else class="mt-8 space-y-5 rounded-2xl bg-white p-6 ring-1 ring-gray-200" @submit.prevent="submit">
        <UFormField :label="t('report.site')" required>
          <UInput v-model="site" size="lg" class="w-full" :placeholder="t('report.sitePlaceholder')" :ui="{ leading: 'pointer-events-none', base: 'ps-[6.25rem]' }">
            <template #leading>
              <span class="text-gray-500">perlink.to/</span>
            </template>
          </UInput>
        </UFormField>

        <UFormField :label="t('report.reason')" required>
          <URadioGroup v-model="reason" :items="reasonItems" :ui="{ fieldset: 'gap-2' }" />
        </UFormField>

        <UFormField :label="t('report.details')">
          <UTextarea v-model="details" :rows="3" :maxlength="2000" autoresize class="w-full" :placeholder="t('report.detailsPlaceholder')" />
        </UFormField>

        <UFormField :label="t('report.email')" :help="t('report.emailHelp')">
          <UInput v-model="email" type="email" class="w-full" autocomplete="email" />
        </UFormField>

        <UButton type="submit" block size="lg" color="error" :loading="sending" :disabled="!site.trim() || !reason" :label="t('report.submit')" />
      </form>

      <p class="mt-6 text-center text-sm">
        <NuxtLink to="/terms#acceptable-use" class="text-gray-500 underline-offset-2 hover:underline">{{ t('report.terms') }}</NuxtLink>
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
import { REPORT_REASONS, type ReportReason } from '#shared/reports'

// Anyone can report a site; it lands in Superadmin → Reports
const { t } = useI18n()
const toast = useToast()
const route = useRoute()

useHead({ title: () => `${t('report.title')} - Perlink`, meta: [{ name: 'robots', content: 'noindex' }] })

// Opened from a site's "Report" link with ?site=<address>
const site = ref(typeof route.query.site === 'string' ? route.query.site : '')
const reason = ref<ReportReason | undefined>()
const details = ref('')
const email = ref('')
const sending = ref(false)
const sent = ref(false)

const reasonItems = computed(() => REPORT_REASONS.map(value => ({ value, label: t(`report.reasons.${value}`) })))

async function submit() {
  if (!site.value.trim() || !reason.value || sending.value) return
  sending.value = true
  try {
    const username = site.value.trim().replace(/^https?:\/\//, '').replace(/^(www\.)?perlink\.to\//, '').split(/[/?#]/)[0]!
    await $fetch('/api/report', { method: 'POST', body: { username, reason: reason.value, details: details.value, email: email.value } })
    sent.value = true
  } catch (error: any) {
    toast.add({ title: t('report.failed'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    sending.value = false
  }
}
</script>
