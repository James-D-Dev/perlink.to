<template>
  <UDashboardPanel id="upgrade">
    <template #header>
      <UDashboardNavbar :title="t('dashboard.upgrade.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-6xl py-2 sm:py-6">
        <div class="mb-10 max-w-xl">
          <h1 class="mk-display text-4xl sm:text-5xl">{{ t('dashboard.upgrade.heading') }}</h1>
          <p class="mt-3 text-muted">{{ t('dashboard.upgrade.intro') }}</p>
        </div>
        <MarketingMkPricing />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth',
  colorMode: 'light',
})
const { t } = useI18n()
useSeoMeta({ title: () => t('dashboard.upgrade.seoTitle'), robots: 'noindex' })
</script>
