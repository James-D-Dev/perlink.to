<template>
  <UDashboardPanel id="earn">
    <template #header>
      <DashboardNavbar :title="t('dashboard.earn.title')" />
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-3xl space-y-4 py-2 sm:py-4">
        <!-- The offer -->
        <div class="relative isolate overflow-hidden rounded-3xl bg-ink p-6 text-paper sm:p-8">
          <p class="text-sm font-medium text-paper/60">{{ t('dashboard.earn.eyebrow') }}</p>
          <h1 class="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {{ t('dashboard.earn.headline', { percent: AFFILIATE_COMMISSION }) }}
          </h1>
          <p class="mt-3 max-w-xl text-sm leading-relaxed text-paper/70">{{ t('dashboard.earn.intro', { days: AFFILIATE_COOKIE_DAYS }) }}</p>
          <div class="mt-5 grid gap-3 sm:grid-cols-3">
            <div v-for="stat in stats" :key="stat.label" class="rounded-2xl bg-paper/10 px-4 py-3">
              <p class="text-xl font-semibold tabular-nums">{{ stat.value }}</p>
              <p class="text-xs text-paper/60">{{ stat.label }}</p>
            </div>
          </div>
        </div>

        <!-- 1. Join on Lemon Squeezy -->
        <div class="rounded-3xl bg-paper p-5 ring-1 ring-line sm:p-6">
          <p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ t('dashboard.earn.step', { n: 1 }) }}</p>
          <h2 class="mt-1 font-semibold text-ink">{{ t('dashboard.earn.joinTitle') }}</h2>
          <p class="mt-1 text-sm text-ink-muted">{{ t('dashboard.earn.joinText') }}</p>
          <UButton class="mt-4" :to="signupUrl" target="_blank" icon="i-lucide-handshake" trailing-icon="i-lucide-external-link" :label="t('dashboard.earn.join')" />
        </div>

        <!-- 2. Their code -->
        <div class="rounded-3xl bg-paper p-5 ring-1 ring-line sm:p-6">
          <p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ t('dashboard.earn.step', { n: 2 }) }}</p>
          <h2 class="mt-1 font-semibold text-ink">{{ t('dashboard.earn.codeTitle') }}</h2>
          <p class="mt-1 text-sm text-ink-muted">{{ t('dashboard.earn.codeText') }}</p>
          <form class="mt-4 flex flex-col gap-2 sm:flex-row" @submit.prevent="save">
            <UInput v-model="codeInput" :placeholder="t('dashboard.earn.codePlaceholder')" icon="i-lucide-ticket" autocomplete="off" class="min-w-0 flex-1" />
            <UButton type="submit" class="justify-center" :loading="saving" :disabled="codeInput.trim() === (code ?? '')" :label="t('common.save')" />
          </form>
        </div>

        <!-- 3. Share -->
        <div class="rounded-3xl bg-paper p-5 ring-1 ring-line sm:p-6" :class="!code && 'opacity-60'">
          <p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ t('dashboard.earn.step', { n: 3 }) }}</p>
          <h2 class="mt-1 font-semibold text-ink">{{ t('dashboard.earn.shareTitle') }}</h2>
          <p class="mt-1 text-sm text-ink-muted">{{ code ? t('dashboard.earn.shareText') : t('dashboard.earn.shareLocked') }}</p>
          <ul v-if="code" class="mt-4 space-y-2">
            <li v-for="link in links" :key="link.url" class="flex items-center gap-2 rounded-xl bg-sand/60 px-3 py-2">
              <div class="min-w-0 flex-1">
                <p class="text-xs text-ink-muted">{{ link.label }}</p>
                <p class="truncate font-mono text-sm text-ink">{{ link.url }}</p>
              </div>
              <UButton size="sm" color="neutral" variant="ghost" icon="i-lucide-copy" :aria-label="t('common.copy')" @click="copy(link.url)" />
            </li>
          </ul>
          <p v-if="code" class="mt-3 flex items-start gap-2 text-sm text-ink-muted">
            <UIcon name="i-lucide-badge-check" class="mt-0.5 size-4 shrink-0 text-emerald-600" />
            {{ t('dashboard.earn.badge') }}
          </p>
          <UButton v-if="code" class="mt-4" to="https://app.lemonsqueezy.com/affiliate" target="_blank" color="neutral" variant="outline" icon="i-lucide-chart-line" trailing-icon="i-lucide-external-link" :label="t('dashboard.earn.dashboard')" />
        </div>

        <p class="px-1 text-xs text-ink-faint">
          {{ t('dashboard.earn.rules') }}
          <NuxtLink to="/affiliates" class="underline">{{ t('dashboard.earn.rulesLink') }}</NuxtLink>
        </p>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { AFFILIATE_COMMISSION, AFFILIATE_COOKIE_DAYS, affiliateLink } from '#shared/affiliate'

definePageMeta({ colorMode: 'light', layout: 'admin', middleware: 'auth', ssr: false })

const { t } = useI18n()
const toast = useToast()
useSeoMeta({ title: () => `${t('dashboard.earn.title')} — Perlink`, robots: 'noindex, nofollow' })

const signupUrl = useRuntimeConfig().public.affiliateSignupUrl as string

const code = ref<string | null>(null)
const signups = ref(0)
const codeInput = ref('')
const saving = ref(false)

onMounted(async () => {
  try {
    const me = await $fetch<{ code: string | null; signups: number }>('/api/affiliate/me')
    code.value = me.code
    signups.value = me.signups
    codeInput.value = me.code ?? ''
  } catch {}
})

async function save() {
  saving.value = true
  try {
    const res = await $fetch<{ code: string | null }>('/api/affiliate/me', { method: 'PUT', body: { code: codeInput.value.trim() || null } })
    code.value = res.code
    codeInput.value = res.code ?? ''
    toast.add({ title: res.code ? t('dashboard.earn.saved') : t('dashboard.earn.cleared'), color: 'success' })
  } catch (error: any) {
    toast.add({ title: t('common.error'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    saving.value = false
  }
}

const stats = computed(() => [
  { label: t('dashboard.earn.statCommission'), value: `${AFFILIATE_COMMISSION}%` },
  { label: t('dashboard.earn.statMonths'), value: t('dashboard.earn.forever') },
  { label: t('dashboard.earn.statSignups'), value: String(signups.value) },
])

const links = computed(() => (code.value
  ? [
      { label: t('dashboard.earn.linkHome'), url: affiliateLink(code.value) },
      { label: t('dashboard.earn.linkPricing'), url: affiliateLink(code.value, '/pricing') },
      { label: t('dashboard.earn.linkTemplates'), url: affiliateLink(code.value, '/templates') },
    ]
  : []))

function copy(text: string) {
  navigator.clipboard.writeText(text)
  toast.add({ title: t('common.copied') })
}
</script>
