<template>
  <UDashboardPanel id="bio-list">
    <template #header>
      <UDashboardNavbar title="My sites">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            to="/dashboard"
            color="primary"
            icon="i-lucide-plus"
            label="Create a site"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-4xl space-y-6 py-2 sm:py-4">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 class="mk-display text-3xl text-ink sm:text-4xl">Your sites</h1>
            <p v-if="!loading" class="mt-1 text-sm text-ink-muted">
              {{ bioPages.length }} {{ bioPages.length === 1 ? 'site' : 'sites' }} · {{ liveCount }} live
            </p>
          </div>
          <UInput
            v-if="bioPages.length > 1"
            v-model="searchQuery"
            placeholder="Search sites"
            icon="i-lucide-search"
            class="w-full sm:w-64"
          />
        </div>

        <!-- Loading -->
        <div v-if="loading" class="divide-y divide-line overflow-hidden rounded-xl bg-paper ring-1 ring-line">
          <div v-for="i in 3" :key="i" class="flex items-center gap-4 p-4">
            <USkeleton class="size-12 rounded-full" />
            <div class="flex-1 space-y-2">
              <USkeleton class="h-4 w-40" />
              <USkeleton class="h-3 w-56" />
            </div>
            <USkeleton class="hidden h-8 w-40 sm:block" />
          </div>
        </div>

        <!-- Sites -->
        <ul v-else-if="filteredBioPages.length > 0" class="divide-y divide-line overflow-hidden rounded-xl bg-paper ring-1 ring-line">
          <li
            v-for="bio in filteredBioPages"
            :key="bio.id"
            class="group flex cursor-pointer flex-col gap-3 p-4 transition-colors hover:bg-sand/50 sm:flex-row sm:items-center sm:gap-4"
            @click="navigateTo(`/dashboard/site/${bio.username}`)"
          >
            <div class="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
              <!-- Avatar, or the first letter of the name -->
              <img
                v-if="bio.avatarUrl"
                :src="bio.avatarUrl"
                :alt="bio.title || bio.username"
                class="size-12 shrink-0 rounded-full object-cover ring-1 ring-line"
              >
              <span v-else class="flex size-12 shrink-0 items-center justify-center rounded-full bg-sand text-lg font-medium text-ink-soft">
                {{ (bio.title || bio.username || '?').trim().charAt(0).toUpperCase() }}
              </span>

              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="truncate font-medium text-ink">{{ bio.title || bio.username }}</h3>
                  <span
                    class="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                    :class="bio.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-sand text-ink-muted'"
                  >
                    <span class="size-1.5 rounded-full" :class="bio.isPublished ? 'bg-emerald-500' : 'bg-ink-faint'" />
                    {{ bio.isPublished ? 'Live' : 'Draft' }}
                  </span>
                </div>
                <p class="truncate text-sm text-ink-muted">perlink.to/{{ bio.username }}</p>
                <p class="mt-0.5 text-xs text-ink-faint">
                  {{ (bio.viewCount || 0).toLocaleString() }} views
                  <template v-if="bio.updatedAt || bio.createdAt"> · Updated {{ formatDate(bio.updatedAt || bio.createdAt) }}</template>
                </p>
              </div>
            </div>

            <!-- Actions, in a row -->
            <div class="flex items-center gap-1 pl-15 sm:pl-0" @click.stop>
              <UTooltip text="Open site">
                <UButton :to="`/${bio.username}`" target="_blank" color="neutral" variant="ghost" icon="i-lucide-external-link" aria-label="Open site" />
              </UTooltip>
              <UTooltip text="Analytics">
                <UButton :to="`/dashboard/site/${bio.username}/analytics`" color="neutral" variant="ghost" icon="i-lucide-chart-column" aria-label="Analytics" />
              </UTooltip>
              <UTooltip text="Copy link">
                <UButton color="neutral" variant="ghost" icon="i-lucide-copy" aria-label="Copy link" @click="copyUrl(bio.username)" />
              </UTooltip>
              <UButton
                v-if="!bio.isPublished"
                color="neutral"
                variant="outline"
                size="sm"
                class="ml-1"
                label="Publish"
                @click="publishBio(bio.username)"
              />
              <UButton
                v-else
                color="neutral"
                variant="ghost"
                size="sm"
                class="ml-1 text-ink-muted"
                label="Unpublish"
                @click="unpublishBio(bio.username)"
              />
              <UButton
                :to="`/dashboard/site/${bio.username}`"
                size="sm"
                class="ml-1"
                icon="i-lucide-pencil"
                label="Edit"
              />
            </div>
          </li>
        </ul>

        <!-- No search results -->
        <div v-else-if="bioPages.length > 0" class="rounded-xl bg-paper py-12 text-center text-sm text-ink-muted ring-1 ring-line">
          No sites match “{{ searchQuery }}”.
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center rounded-xl bg-sand px-6 py-14 text-center">
          <MarketingMkOrb palette="sunset" :size="72" />
          <h3 class="mt-6 text-lg font-medium text-ink">No sites yet</h3>
          <p class="mt-1 max-w-sm text-sm text-ink-muted">Claim your perlink.to address and start from a template. It takes about a minute.</p>
          <UButton to="/dashboard" class="mt-6" icon="i-lucide-plus" label="Create a site" />
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

const liveCount = computed(() => bioPages.value.filter((bio) => bio.isPublished).length);

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
