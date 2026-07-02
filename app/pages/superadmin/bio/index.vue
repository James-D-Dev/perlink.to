<template>
  <UDashboardPanel id="superadmin-bio">
    <template #header>
      <UDashboardNavbar title="Bio Pages Management">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-7xl mx-auto w-full px-2 md:px-4 py-4 space-y-6">
        <p class="text-gray-500">Coming soon...</p>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
});
</script>
