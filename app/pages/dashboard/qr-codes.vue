<template>
  <UDashboardPanel id="qr-codes">
    <template #header>
      <UDashboardNavbar title="QR Codes">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-4xl mx-auto py-12 px-4">
        <UCard class="text-center py-16">
          <div class="flex flex-col items-center gap-6">
            <!-- Icon -->
            <div
              class="w-[68px] h-[68px] rounded-2xl bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center"
            >
              <UIcon name="i-lucide-qr-code" class="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>

            <!-- Title -->
            <h1 class="text-2xl font-bold text-highlighted dark:text-white">QR Codes Management</h1>

            <!-- Coming Soon Message -->
            <p class="text-muted dark:text-neutral-300 max-w-md">
              This feature is currently under development. Soon you'll be able to
              create, customize, and manage all your QR codes in one place.
            </p>

            <!-- Features Preview -->
            <div class="flex flex-wrap justify-center gap-3 mt-4">
              <UBadge color="neutral" variant="soft" size="lg" class="gap-2">
                <UIcon name="i-lucide-palette" class="w-4 h-4" />
                Custom Designs
              </UBadge>
              <UBadge color="neutral" variant="soft" size="lg" class="gap-2">
                <UIcon name="i-lucide-bar-chart-3" class="w-4 h-4" />
                Analytics
              </UBadge>
              <UBadge color="neutral" variant="soft" size="lg" class="gap-2">
                <UIcon name="i-lucide-download" class="w-4 h-4" />
                Bulk Export
              </UBadge>
            </div>

            <!-- Coming Soon Badge -->
            <UBadge
              color="primary"
              variant="subtle"
              size="xl"
              class="mt-6 px-6 py-2"
            >
              <UIcon name="i-lucide-clock" class="w-4 h-4 mr-2" />
              Coming Soon
            </UBadge>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
  layout: "admin",
  middleware: "auth",
});
</script>
