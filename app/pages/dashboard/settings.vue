<template>
  <UDashboardPanel id="settings">
    <template #header>
      <UDashboardNavbar title="Settings">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
        <div>
            Settings
        </div>

    </template>
  </UDashboardPanel>
</template>
<script setup lang="ts">
definePageMeta({
    layout: "admin",
    middleware: "auth",
    ssr: false,
});
</script>