<template>
  <UDashboardPanel id="qr-list">
    <template #header>
      <UDashboardNavbar title="My QR Codes">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            to="/dashboard/qr/create"
            color="primary"
            icon="i-lucide-plus"
            label="Create QR Code"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-5xl mx-auto w-full px-2 md:px-4 py-4 space-y-6">
        <div class="flex flex-wrap items-center gap-4">
          <!-- Search -->
          <UInput
            v-model="searchQuery"
            placeholder="Search QR codes..."
            icon="i-lucide-search"
            class="max-w-md w-full"
          />
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="space-y-3">
          <UCard
            v-for="i in 3"
            :key="i"
            class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl border border-gray-100 dark:border-white/5"
            :ui="{ body: 'p-4 sm:p-4', root: 'rounded-xl' }"
          >
            <div class="flex items-start gap-4">
              <!-- QR Skeleton -->
              <USkeleton class="h-16 w-16 rounded-lg" />

              <!-- Content Skeleton -->
              <div class="flex-1 min-w-0 space-y-2">
                <div class="flex items-center gap-2">
                  <USkeleton class="h-5 w-32" />
                  <USkeleton class="h-4 w-16" />
                </div>
                <USkeleton class="h-4 w-48" />
                <div class="flex items-center gap-4 pt-1">
                  <USkeleton class="h-3 w-20" />
                  <USkeleton class="h-3 w-16" />
                </div>
              </div>

              <!-- Actions Skeleton -->
              <div class="flex flex-col gap-2">
                <USkeleton class="h-8 w-8" />
                <USkeleton class="h-8 w-8" />
              </div>
            </div>
          </UCard>
        </div>

        <!-- QR Codes List -->
        <div v-else-if="filteredQRCodes.length > 0" class="space-y-3">
          <UCard
            v-for="qr in filteredQRCodes"
            :key="qr.id"
            class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl border border-gray-100 dark:border-white/5 hover:border-primary/80 hover:bg-primary/5 transition-colors group cursor-pointer hover:shadow-md"
            @click="navigateTo(`/dashboard/qr/${qr.shortCode}`)"
            :ui="{ body: 'p-4 sm:p-4', root: 'rounded-xl' }"
          >
            <div class="flex items-start gap-4">
              <!-- QR Preview -->
              <div class="h-16 w-16 rounded-lg bg-gray-50 dark:bg-white/[0.03] flex items-center justify-center overflow-hidden shrink-0">
                <QRCodeRender
                  :value="qr.destinationUrl"
                  :dots-type="qr.styleConfig?.dotsType || 'rounded'"
                  :corners-square-type="qr.styleConfig?.cornersSquareType || 'square'"
                  :corners-dot-type="qr.styleConfig?.cornersDotType || 'square'"
                  :foreground="qr.styleConfig?.foregroundColor || '#000000'"
                  :background="qr.styleConfig?.backgroundColor || '#ffffff'"
                  :size="64"
                  class="w-full h-full"
                />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold truncate">
                    {{ qr.name || qr.title || 'Untitled QR Code' }}
                  </h3>
                  <UBadge
                    :color="qr.isActive ? 'success' : 'neutral'"
                    variant="soft"
                    size="xs"
                    :label="qr.isActive ? 'Active' : 'Inactive'"
                  />
                </div>

                <div class="flex items-center gap-1 text-sm text-gray-500 dark:text-neutral-400 mt-1 truncate">
                  <UIcon name="i-lucide-link" class="w-3.5 h-3.5 shrink-0" />
                  <span class="truncate">{{ qr.destinationUrl }}</span>
                </div>

                <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-neutral-500 mt-2">
                  <span class="flex items-center gap-1 whitespace-nowrap">
                    <UIcon name="i-lucide-qr-code" class="w-3.5 h-3.5" />
                    perlink.to/qr/{{ qr.shortCode }}
                  </span>
                  <span class="flex items-center gap-1 whitespace-nowrap">
                    <UIcon name="i-lucide-scan-line" class="w-3.5 h-3.5" />
                    {{ qr.scanCount || 0 }} scans
                  </span>
                  <span class="flex items-center gap-1 whitespace-nowrap">
                    <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                    {{ formatDate(qr.createdAt) }}
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div
                class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <UTooltip text="View">
                  <UButton
                    @click.stop=""
                    :to="`/qr/${qr.shortCode}`"
                    target="_blank"
                    color="neutral"
                    variant="subtle"
                    size="md"
                    icon="i-lucide-external-link"
                  />
                </UTooltip>

                <UTooltip text="Copy URL">
                  <UButton
                    color="neutral"
                    variant="subtle"
                    size="md"
                    icon="i-lucide-copy"
                    @click.stop="copyUrl(qr.shortCode)"
                  />
                </UTooltip>

                <UTooltip text="Delete">
                  <UButton
                    color="error"
                    variant="subtle"
                    size="md"
                    icon="i-lucide-trash"
                    @click.stop="deleteQR(qr.id)"
                  />
                </UTooltip>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-white/[0.06] mb-4"
          >
            <UIcon name="i-lucide-qr-code" class="w-8 h-8 text-gray-400 dark:text-neutral-500" />
          </div>
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">No QR codes yet</h3>
          <p class="text-gray-500 dark:text-neutral-400 mt-1 mb-4">Create your first QR code to get started</p>
          <UButton
            to="/dashboard/qr/create"
            color="primary"
            icon="i-lucide-plus"
            size="xl"
            label="Create QR Code"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import QRCodeRender from '~/components/features/QRCodeRender.vue'
import type { User } from '#auth-utils'

definePageMeta({
  colorMode: "dark",
  layout: "admin",
  middleware: "auth",
  ssr: false,
});


const { user: sessionUser } = useUserSession()
const user = sessionUser as Ref<User | null>

const isProUser = computed(() => {
  return user.value?.plan !== 'free'
})


const toast = useToast();

// State
const loading = ref(true);
const qrCodes = ref<any[]>([]);
const searchQuery = ref("");

// Fetch QR codes
const fetchQRCodes = async () => {
  try {
    loading.value = true;
    const response = await $fetch("/api/qr");
    if (response.success && response.data) {
      qrCodes.value = response.data;
    }
  } catch (error) {
    console.error("Failed to fetch QR codes:", error);
    toast.add({
      title: "Error",
      description: "Failed to load QR codes",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Filtered QR codes
const filteredQRCodes = computed(() => {
  if (!searchQuery.value) return qrCodes.value;
  const query = searchQuery.value.toLowerCase();
  return qrCodes.value.filter(
    (qr) =>
      qr.name?.toLowerCase().includes(query) ||
      qr.title?.toLowerCase().includes(query) ||
      qr.destinationUrl?.toLowerCase().includes(query) ||
      qr.shortCode?.toLowerCase().includes(query)
  );
});

// Format date
const formatDate = (date: string) => {
  if (!date) return "N/A";
  return format(new Date(date), "MMM d, yyyy");
};

// Copy URL
const copyUrl = async (shortCode: string) => {
  try {
    const url = `https://perlink.to/qr/${shortCode}`;
    await navigator.clipboard.writeText(url);
    toast.add({
      title: "Copied!",
      description: url,
    });
  } catch {
    toast.add({
      title: "Failed to copy",
      color: "error",
    });
  }
};

// Delete QR code
const deleteQR = async (id: string) => {
  try {
    await $fetch(`/api/qr/${id}`, {
      method: "DELETE",
    });
    toast.add({
      title: "Deleted",
      description: "QR code has been deleted",
    });
    await fetchQRCodes();
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to delete QR code",
      color: "error",
    });
  }
};

// Initial fetch
onMounted(() => {
  fetchQRCodes();
});
</script>
