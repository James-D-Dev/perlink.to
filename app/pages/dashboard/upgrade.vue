<template>
  <UDashboardPanel id="upgrade">
    <template #header>
      <UDashboardNavbar title="Plans">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-6xl py-2 sm:py-6">
        <div class="mb-10 max-w-xl">
          <h1 class="mk-display text-4xl sm:text-5xl">Choose your plan</h1>
          <p class="mt-3 text-muted">Every plan includes templates, the editor and a 3D world for your page.</p>
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
useSeoMeta({ title: 'Plans — Perlink', robots: 'noindex' })
</script>
