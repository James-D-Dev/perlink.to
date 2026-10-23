<template>
  <UDashboardPanel id="superadmin-settings">
    <template #header>
      <UDashboardNavbar title="System Settings">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-7xl">
        <UEmpty icon="i-lucide-settings" title="Settings" description="Coming soon." class="py-16" />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
  colorMode: 'dark',
});
</script>
