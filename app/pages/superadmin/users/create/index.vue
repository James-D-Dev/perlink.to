<template>
  <UDashboardPanel id="users-create">
    <template #header>
      <UDashboardNavbar title="Create User">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            to="/superadmin/users"
            color="neutral"
            icon="i-lucide-arrow-left"
            label="Back to Users"
          />
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
