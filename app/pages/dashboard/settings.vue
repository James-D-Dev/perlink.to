<template>
  <UDashboardPanel id="settings">
    <template #header>
      <UDashboardNavbar :title="t('common.settings')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-2xl space-y-6 py-2 sm:py-4">
        <h1 class="mk-display text-3xl text-ink sm:text-4xl">{{ t('dashboard.account.title') }}</h1>

        <div v-if="loading" class="space-y-3">
          <USkeleton v-for="i in 3" :key="i" class="h-28 w-full rounded-xl" />
        </div>

        <template v-else-if="account">
          <!-- Profile -->
          <section class="rounded-3xl bg-paper ring-1 ring-line p-5">
            <h2 class="text-sm font-medium text-ink">{{ t('dashboard.account.profile') }}</h2>
            <div class="mt-4 flex items-center gap-4">
              <img v-if="account.avatar" :src="account.avatar" alt="" class="size-14 rounded-full object-cover ring-1 ring-line">
              <span v-else class="flex size-14 items-center justify-center rounded-full bg-sand text-xl font-medium text-ink-soft">
                {{ (account.name || account.email || '?').charAt(0).toUpperCase() }}
              </span>
              <div class="min-w-0 flex-1 space-y-1">
                <div class="flex gap-2">
                  <UInput v-model="name" :placeholder="t('dashboard.account.namePlaceholder')" maxlength="80" class="min-w-0 flex-1" />
                  <UButton :disabled="name === (account.name || '')" :loading="savingName" :label="t('common.save')" @click="saveName" />
                </div>
                <p class="truncate text-sm text-ink-muted">{{ account.email }}</p>
              </div>
            </div>
            <p class="mt-3 text-xs text-ink-faint">{{ t('dashboard.account.memberSince', { date: formatDate(account.createdAt) }) }}</p>
          </section>

          <!-- Language and plan -->
          <section class="grid gap-px overflow-hidden rounded-3xl bg-line ring-1 ring-line sm:grid-cols-2">
            <div class="bg-paper p-5">
              <h2 class="text-sm font-medium text-ink">{{ t('dashboard.account.language') }}</h2>
              <p class="mt-1 text-xs text-ink-muted">{{ t('dashboard.account.languageText') }}</p>
              <USelect
                :model-value="locale"
                :items="locales.map((l) => ({ label: l.name, value: l.code }))"
                class="mt-3 w-full"
                @update:model-value="setLocale($event as any)"
              />
            </div>
            <div class="bg-paper p-5">
              <h2 class="text-sm font-medium text-ink">{{ t('dashboard.account.plan') }}</h2>
              <p class="mt-1 text-xs text-ink-muted">{{ t('dashboard.account.sites', { n: account.sites }, account.sites) }}</p>
              <div class="mt-3 flex items-center justify-between gap-3">
                <span class="text-lg font-semibold text-ink">{{ t(`dashboard.billing.plans.${account.plan}.name`) }}</span>
                <UButton to="/dashboard/upgrade" size="sm" color="neutral" variant="outline" :label="t('dashboard.account.seePlans')" />
              </div>
            </div>
          </section>

          <!-- Notifications (shown once Telegram is set up) -->
          <TelegramConnect />

          <!-- Security and data -->
          <section class="divide-y divide-line overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
            <div class="flex flex-wrap items-center justify-between gap-3 p-5">
              <div class="min-w-0">
                <h2 class="text-sm font-medium text-ink">{{ t('dashboard.account.signOutAll') }}</h2>
                <p class="mt-1 text-xs text-ink-muted">{{ t('dashboard.account.signOutAllText') }}</p>
              </div>
              <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-log-out" :loading="signingOut" :label="t('dashboard.account.signOutAllAction')" @click="signOutEverywhere" />
            </div>
            <div class="flex flex-wrap items-center justify-between gap-3 p-5">
              <div class="min-w-0">
                <h2 class="text-sm font-medium text-ink">{{ t('dashboard.account.export') }}</h2>
                <p class="mt-1 text-xs text-ink-muted">{{ t('dashboard.account.exportText') }}</p>
              </div>
              <UButton color="neutral" variant="outline" size="sm" icon="i-lucide-download" to="/api/account/export" external download :label="t('dashboard.account.exportAction')" />
            </div>
          </section>

          <!-- Delete account -->
          <section class="rounded-xl border border-red-200 bg-red-50/40 p-5">
            <h2 class="text-sm font-medium text-red-700">{{ t('dashboard.account.delete') }}</h2>
            <p class="mt-1 text-xs text-red-700/80">{{ t('dashboard.account.deleteText') }}</p>
            <UButton class="mt-3" color="error" variant="outline" size="sm" icon="i-lucide-trash-2" :label="t('dashboard.account.deleteAction')" @click="deleteOpen = true" />
          </section>
        </template>
      </div>

      <!-- Type the email to confirm deletion -->
      <AppSheet v-model:open="deleteOpen" :title="t('dashboard.account.deleteTitle')" :description="t('dashboard.account.deleteConfirmText')">
        <template #body>
          <div class="space-y-3">
            <p class="text-sm text-muted">{{ t('dashboard.account.deleteTypeEmail', { email: account?.email ?? '' }) }}</p>
            <UInput v-model="confirmEmail" type="email" autocomplete="off" :placeholder="account?.email ?? ''" class="w-full" />
          </div>
        </template>
        <template #footer>
          <div class="flex w-full justify-end gap-2">
            <UButton color="neutral" variant="ghost" :label="t('common.cancel')" @click="deleteOpen = false" />
            <UButton
              color="error"
              :disabled="confirmEmail.trim().toLowerCase() !== (account?.email ?? '').toLowerCase()"
              :loading="deleting"
              :label="t('dashboard.account.deleteForever')"
              @click="deleteAccount"
            />
          </div>
        </template>
      </AppSheet>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
  layout: 'admin',
  middleware: 'auth',
  ssr: false,
})

interface Account {
  email: string | null
  name: string | null
  avatar: string | null
  plan: string
  createdAt: string
  sites: number
}

const { t, locale, locales, setLocale } = useI18n()
const toast = useToast()
const confirm = useConfirm()
const { clear } = useUserSession()

useSeoMeta({ title: () => `${t('dashboard.account.title')} — Perlink`, robots: 'noindex, nofollow' })

const loading = ref(true)
const account = ref<Account | null>(null)
const name = ref('')

onMounted(async () => {
  try {
    const response = await $fetch<{ account: Account }>('/api/account')
    account.value = response.account
    name.value = response.account.name ?? ''
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    loading.value = false
  }
})

function formatDate(value: string) {
  const date = new Date(value.includes('T') ? value : `${value.replace(' ', 'T')}Z`)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(locale.value === 'vi' ? 'vi-VN' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

const savingName = ref(false)
async function saveName() {
  savingName.value = true
  try {
    await $fetch('/api/account', { method: 'PATCH', body: { name: name.value } })
    if (account.value) account.value.name = name.value
    toast.add({ title: t('dashboard.account.nameSaved'), color: 'success' })
  } catch {
    toast.add({ title: t('common.error'), color: 'error' })
  } finally {
    savingName.value = false
  }
}

const signingOut = ref(false)
async function signOutEverywhere() {
  const ok = await confirm({
    title: t('dashboard.account.signOutAllTitle'),
    description: t('dashboard.account.signOutAllConfirm'),
    confirmLabel: t('dashboard.account.signOutAllAction'),
    color: 'warning',
  })
  if (!ok) return
  signingOut.value = true
  try {
    await $fetch('/api/auth/logout-all', { method: 'POST' })
    await clear()
    await navigateTo('/login')
  } finally {
    signingOut.value = false
  }
}

const deleteOpen = ref(false)
const confirmEmail = ref('')
const deleting = ref(false)
async function deleteAccount() {
  deleting.value = true
  try {
    await $fetch('/api/account', { method: 'DELETE', body: { confirm: confirmEmail.value } })
    await clear()
    await navigateTo('/')
  } catch (error: any) {
    toast.add({ title: t('common.error'), description: error?.data?.statusMessage, color: 'error' })
  } finally {
    deleting.value = false
  }
}
</script>
