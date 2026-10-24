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
        <div>
            {{ t('dashboard.settings.placeholder') }}
        </div>

    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
definePageMeta({
    colorMode: 'light',
    layout: "admin",
    middleware: "auth",
    ssr: false,
});

const { t } = useI18n();
</script>