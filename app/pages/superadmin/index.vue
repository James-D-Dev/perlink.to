<template>
  <UDashboardPanel id="superadmin-dashboard">
    <template #header>
      <UDashboardNavbar title="Super Admin Dashboard">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-7xl mx-auto w-full px-2 md:px-4 py-4 space-y-6">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Super Admin Dashboard</h1>
        <p class="text-sm text-gray-500 mt-1">System overview and management</p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <UCard class="bg-white">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-50 rounded-lg">
              <UIcon name="i-lucide-users" class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Users</p>
              <p class="text-2xl font-semibold">1,234</p>
            </div>
          </div>
        </UCard>
        <UCard class="bg-white">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-50 rounded-lg">
              <UIcon name="i-lucide-link" class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Short Links</p>
              <p class="text-2xl font-semibold">5,678</p>
            </div>
          </div>
        </UCard>
        <UCard class="bg-white">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-purple-50 rounded-lg">
              <UIcon name="i-lucide-qr-code" class="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">QR Codes</p>
              <p class="text-2xl font-semibold">890</p>
            </div>
          </div>
        </UCard>
        <UCard class="bg-white">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-amber-50 rounded-lg">
              <UIcon name="i-lucide-credit-card" class="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Revenue</p>
              <p class="text-2xl font-semibold">$12.4k</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Quick Links -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UCard class="bg-white">
          <template #header>
            <h3 class="text-lg font-medium text-gray-900">User Management</h3>
          </template>
          <div class="space-y-2">
            <UButton
              to="/superadmin/users"
              variant="ghost"
              color="neutral"
              block
              class="justify-start"
            >
              <UIcon name="i-lucide-users" class="mr-2" />
              View All Users
            </UButton>
            <UButton
              to="/superadmin/users/create"
              variant="ghost"
              color="neutral"
              block
              class="justify-start"
            >
              <UIcon name="i-lucide-user-plus" class="mr-2" />
              Create User
            </UButton>
          </div>
        </UCard>

        <UCard class="bg-white">
          <template #header>
            <h3 class="text-lg font-medium text-gray-900">Content</h3>
          </template>
          <div class="space-y-2">
            <UButton
              to="/superadmin/bio"
              variant="ghost"
              color="neutral"
              block
              class="justify-start"
            >
              <UIcon name="i-lucide-file-text" class="mr-2" />
              Bio Pages
            </UButton>
            <UButton
              to="/superadmin/links"
              variant="ghost"
              color="neutral"
              block
              class="justify-start"
            >
              <UIcon name="i-lucide-link" class="mr-2" />
              Short Links
            </UButton>
            <UButton
              to="/superadmin/qr-codes"
              variant="ghost"
              color="neutral"
              block
              class="justify-start"
            >
              <UIcon name="i-lucide-qr-code" class="mr-2" />
              QR Codes
            </UButton>
          </div>
        </UCard>

        <UCard class="bg-white">
          <template #header>
            <h3 class="text-lg font-medium text-gray-900">System</h3>
          </template>
          <div class="space-y-2">
            <UButton
              to="/superadmin/settings"
              variant="ghost"
              color="neutral"
              block
              class="justify-start"
            >
              <UIcon name="i-lucide-settings" class="mr-2" />
              Settings
            </UButton>
            <UButton
              to="/admin"
              variant="ghost"
              color="neutral"
              block
              class="justify-start"
            >
              <UIcon name="i-lucide-arrow-left" class="mr-2" />
              Back to Admin
            </UButton>
          </div>
        </UCard>
      </div>
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
