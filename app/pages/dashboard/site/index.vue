<template>
  <UDashboardPanel id="bio-list">
    <template #header>
      <UDashboardNavbar title="My sites">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            to="/dashboard/create?domain=perlink.to"
            color="primary"
            icon="i-lucide-plus"
            label="Create a site"
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
            placeholder="Search sites…"
            icon="i-lucide-search"
            class="max-w-md w-full"
          />
        </div>

        <!-- Loading Skeleton -->
        <div v-if="loading" class="space-y-3">
          <UCard
            v-for="i in 3"
            :key="i"
            class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl border border-muted dark:border-white/5"
            :ui="{ body: 'p-4 sm:p-4', root: 'rounded-xl' }"
          >
            <div class="flex items-start gap-4">
              <!-- Avatar Skeleton -->
              <USkeleton class="h-12 w-12 rounded-full" />

              <!-- Content Skeleton -->
              <div class="flex-1 min-w-0 space-y-2">
                <div class="flex items-center gap-2">
                  <USkeleton class="h-5 w-32" />
                  <USkeleton class="h-4 w-16" />
                </div>
                <USkeleton class="h-4 w-40" />
                <div class="flex items-center gap-4 pt-1">
                  <USkeleton class="h-3 w-16" />
                  <USkeleton class="h-3 w-16" />
                </div>
              </div>

              <!-- Actions Skeleton -->
              <div class="flex flex-col gap-2">
                <USkeleton class="h-8 w-8" />
                <USkeleton class="h-8 w-8" />
              </div>
            </div>

            <!-- Footer Skeleton -->
            <div class="mt-3 pt-3 border-t border-muted dark:border-white/5">
              <div class="flex items-center justify-between">
                <USkeleton class="h-5 w-20" />
                <USkeleton class="h-6 w-16" />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Bio Pages List -->
        <div v-else-if="filteredBioPages.length > 0" class="space-y-3">
          <UCard
            v-for="bio in filteredBioPages"
            :key="bio.id"
            class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl border border-muted dark:border-white/5 hover:border-primary/80 hover:bg-primary/5 transition-colors group cursor-pointer hover:shadow-md"
            @click="navigateTo(`/dashboard/site/${bio.username}`)"
            :ui="{ body: 'p-4 sm:p-4', root: 'rounded-xl' }"
          >
            <div class="flex items-start gap-4">
              <!-- Avatar -->
              <UAvatar
                :src="bio.avatarUrl || '/images/avatar-default-1.jpg'"
                :alt="bio.username"
                size="3xl"
                color="primary"
              />

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="font-semibold truncate">
                    {{ bio.title || bio.username }}
                  </h3>
                  <UBadge
                    :color="bio.isPublished ? 'success' : 'neutral'"
                    variant="soft"
                    size="xs"
                    :label="bio.isPublished ? 'Published' : 'Draft'"
                  />
                </div>

                <div class="flex items-center gap-1 text-sm text-muted dark:text-neutral-400 mt-1">
                  <UIcon name="i-lucide-link" class="w-3.5 h-3.5" />
                  <span>perlink.to/{{ bio.username }}</span>
                </div>

                <div class="flex items-center gap-4 text-xs text-dimmed dark:text-neutral-500 mt-2">
                  <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-eye" class="w-3.5 h-3.5" />
                    {{ bio.viewCount || 0 }} views
                  </span>
                  <!-- <span class="flex items-center gap-1">
                    <UIcon name="i-lucide-calendar" class="w-3.5 h-3.5" />
                    {{ formatDate(bio.createdAt) }}
                  </span> -->

                  <!-- Links count -->
                  <span
                    v-if="bio.links"
                    class="flex items-center gap-1 text-xs text-dimmed dark:text-neutral-500"
                  >
                    <UIcon name="i-lucide-list" class="w-3.5 h-3.5" />
                    {{ getLinksCount(bio.links) }} links
                  </span>
                </div>
              </div>

              <!-- Actions -->
              <div
                class="flex flex-col gap-2 transition-opacity lg:opacity-0 lg:group-hover:opacity-100"
              >
                <UTooltip text="View">
                  <UButton
                    @click.stop=""
                    :to="`/${bio.username}`"
                    target="_blank"
                    color="neutral"
                    variant="subtle"
                    size="md"
                    icon="i-lucide-external-link"
                  />
                </UTooltip>

                <UTooltip text="Analytics">
                  <UButton
                    :to="`/dashboard/site/${bio.username}/analytics`"
                    color="neutral"
                    variant="subtle"
                    size="md"
                    icon="i-lucide-chart-column"
                    aria-label="Analytics"
                    @click.stop
                  />
                </UTooltip>

                <UTooltip text="Copy URL">
                  <UButton
                    color="neutral"
                    variant="subtle"
                    size="md"
                    icon="i-lucide-copy"
                    @click.stop="copyUrl(bio.username)"
                  />
                </UTooltip>
              </div>
            </div>

            <!-- Template badge -->
            <div class="mt-3 pt-3 border-t border-muted dark:border-white/5">
              <div class="flex items-center justify-between">
                <UBadge
                  color="neutral"
                  variant="soft"
                  size="xs"
                  :label="bio.templateId || 'modern'"
                />

                <div class="flex gap-1">
                  <UButton
                    v-if="!bio.isPublished"
                    color="primary"
                    variant="soft"
                    size="xs"
                    label="Publish"
                    @click="publishBio(bio.username)"
                  />
                  <UButton
                    v-else
                    color="neutral"
                    variant="soft"
                    size="xs"
                    label="Unpublish"
                    @click="unpublishBio(bio.username)"
                  />
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <div
            class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-elevated dark:bg-white/[0.06] mb-4"
          >
            <UIcon name="i-lucide-user-circle" class="w-8 h-8 text-dimmed dark:text-neutral-500" />
          </div>
          <h3 class="text-lg font-medium text-highlighted dark:text-white">No sites yet</h3>
          <p class="text-muted dark:text-neutral-400 mt-1 mb-4">Create your first bio link page</p>
          <UButton
            to="/dashboard/create?domain=perlink.to"
            color="primary"
            icon="i-lucide-plus"
            size="xl"
            label="Create a site"
          />
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { format } from "date-fns";

definePageMeta({
  colorMode: 'light',
  layout: "admin",
  middleware: "auth",
  ssr: false,
});

const toast = useToast();

// State
const loading = ref(true);
const bioPages = ref<any[]>([]);
const searchQuery = ref("");

// Fetch bio pages
const fetchBioPages = async () => {
  try {
    loading.value = true;
    const response = await $fetch("/api/admin/bios");
    if (response.success && response.bioPages) {
      bioPages.value = response.bioPages;
    }
  } catch (error) {
    console.error("Failed to fetch bio pages:", error);
    toast.add({
      title: "Error",
      description: "Failed to load sites",
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

// Filtered bio pages
const filteredBioPages = computed(() => {
  if (!searchQuery.value) return bioPages.value;
  const query = searchQuery.value.toLowerCase();
  return bioPages.value.filter(
    (bio) =>
      bio.username?.toLowerCase().includes(query) ||
      bio.title?.toLowerCase().includes(query),
  );
});

// Get links count from JSON
const getLinksCount = (links: string | any[]) => {
  if (!links) return 0;
  if (typeof links === "string") {
    try {
      const parsed = JSON.parse(links);
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  }
  return Array.isArray(links) ? links.length : 0;
};

// Format date
const formatDate = (date: string) => {
  if (!date) return "N/A";
  return format(new Date(date), "MMM d, yyyy");
};

// Copy URL
const copyUrl = async (username: string) => {
  try {
    const url = `https://perlink.to/${username}`;
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

// Publish bio
const publishBio = async (username: string) => {
  try {
    await $fetch(`/api/admin/bio/${username}/publish`, {
      method: "POST" as const,
    });
    toast.add({
      title: "Published!",
      description: "Your site is now live",
    });
    await fetchBioPages();
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to publish site",
      color: "error",
    });
  }
};

// Unpublish bio
const unpublishBio = async (username: string) => {
  try {
    await $fetch(`/api/admin/bio/${username}/unpublish`, {
      method: "POST" as const,
    });
    toast.add({
      title: "Unpublished",
      description: "Your site is now hidden",
    });
    await fetchBioPages();
  } catch (error) {
    toast.add({
      title: "Error",
      description: "Failed to unpublish site",
      color: "error",
    });
  }
};

// Initial fetch
onMounted(() => {
  fetchBioPages();
});
</script>
