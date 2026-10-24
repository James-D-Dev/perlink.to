<template>
  <UDashboardPanel id="links-list">
    <template #header>
      <UDashboardNavbar title="My Short Links">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <UButton
            to="/dashboard/create?domain=s.perlink.to"
            color="primary"
            icon="i-lucide-plus"
            label="Create Short Link"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-5xl mx-auto w-full px-2 md:px-4 py-4 space-y-6">
        <!-- Search and filters -->
        <div class="flex flex-wrap items-center gap-4">
          <UInput
            v-model="searchQuery"
            icon="i-lucide-search"
            placeholder="Search links | Title | Short link"
            class="md:flex-1 md:w-auto w-full"
          />

          <UPopover>
            <UButton
              :color="isDateFilterActive ? 'primary' : 'neutral'"
              :variant="isDateFilterActive ? 'solid' : 'outline'"
              icon="i-lucide-calendar"
            >
              {{ isDateFilterActive ? "Date filter active" : "Filter by date" }}
            </UButton>
            <template #content>
              <div class="p-3 w-80">
                <!-- Date range picker would go here - using simple inputs for now -->
                <div class="space-y-3">
                  <UFormField label="From">
                    <UInput type="date" v-model="dateStartStr" />
                  </UFormField>
                  <UFormField label="To">
                    <UInput type="date" v-model="dateEndStr" />
                  </UFormField>
                </div>
                <div class="mt-4 flex justify-end gap-2">
                  <UButton variant="outline" size="sm" @click="clearDateFilter"
                    >Clear</UButton
                  >
                  <UButton size="sm" @click="applyDateFilter">Apply</UButton>
                </div>
              </div>
            </template>
          </UPopover>

          <UButton
            :color="activeFiltersCount > 0 ? 'primary' : 'neutral'"
            :variant="activeFiltersCount > 0 ? 'solid' : 'outline'"
            icon="i-lucide-filter"
            @click="showFilterModal = true"
          >
            Filters
            <UBadge
              v-if="activeFiltersCount > 0"
              color="primary"
              size="sm"
              class="ml-2"
              >{{ activeFiltersCount }}</UBadge
            >
          </UButton>

          <!-- Filter Modal -->
          <UModal v-model:open="showFilterModal">
            <template #content>
              <div class="p-6 space-y-6">
                <h2 class="text-xl font-bold">Filters</h2>

                <!-- Tags Filter -->
                <div class="space-y-2">
                  <h3 class="font-semibold">Tags</h3>
                  <div class="space-y-2">
                    <div class="flex flex-wrap gap-1">
                      <UBadge
                        v-for="tagId in filterOptions.tagIds"
                        :key="tagId"
                        color="primary"
                        variant="soft"
                        class="cursor-pointer"
                        @click="removeTagFromFilter(tagId)"
                      >
                        {{ tagId }}
                        <UIcon name="i-lucide-x" class="w-3 h-3 ml-1" />
                      </UBadge>
                    </div>
                    <USelectMenu
                      v-model="filterOptions.tagIds"
                      :items="tags.map((t) => t.id)"
                      multiple
                      class="w-full"
                      placeholder="Select tags..."
                      searchable
                    />
                  </div>
                </div>

                <!-- Link Type Filter -->
                <div class="space-y-2">
                  <h3 class="font-semibold">Link type</h3>
                  <USelect
                    v-model="filterOptions.linkType"
                    class="w-full"
                    :items="[
                      { label: 'All', value: 'all' },
                      { label: 'Custom back-halves', value: 'custom' },
                      { label: 'Random back-halves', value: 'random' },
                    ]"
                  />
                </div>

                <div class="flex justify-between pt-4 border-t">
                  <UButton
                    variant="ghost"
                    @click="clearAllFilters"
                    icon="i-lucide-x"
                    >Clear all</UButton
                  >
                  <div class="space-x-2">
                    <UButton variant="outline" @click="showFilterModal = false"
                      >Cancel</UButton
                    >
                    <UButton @click="applyFilters">Apply</UButton>
                  </div>
                </div>
              </div>
            </template>
          </UModal>
        </div>

        <!-- Selection bar -->
        <div
          class="flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-sm"
        >
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2 text-muted-foreground">
              <UCheckbox
                :model-value="selectedLinks.length === links.length"
                @update:model-value="toggleSelectAll"
              />
              <span>{{ selectedLinks.length }} selected</span>
            </div>
            <UButton variant="ghost" color="neutral">Export</UButton>
            <UButton variant="ghost" color="neutral" @click="updateLinksPublic">
              {{ activeFilter === "active" ? "Hide" : "Unhide" }}
            </UButton>

            <UPopover v-model:open="showTagModal">
              <UButton
                variant="ghost"
                color="neutral"
                :disabled="selectedLinks.length === 0"
              >
                Tag
              </UButton>
              <template #content>
                <div class="w-80 p-4 space-y-4">
                  <UInput
                    v-model="newTag"
                    placeholder="Search or create tag"
                    @keyup.enter="addTagNewGlobal"
                  />
                  <div v-if="tagsWithSearch.length > 0" class="space-y-2">
                    <div
                      v-for="tag in tagsWithSearch"
                      :key="tag.id"
                      class="flex items-center space-x-2 cursor-pointer hover:bg-elevated dark:hover:bg-white/10 p-2 rounded"
                      @click="tag.selected = !tag.selected"
                    >
                      <UCheckbox :model-value="tag.selected" />
                      <span>{{ tag.id }}</span>
                    </div>
                  </div>
                  <div v-else class="text-sm text-muted dark:text-neutral-400">
                    Press Enter to create new tag
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
          <USelect
            v-model="activeFilter"
            :items="[
              { label: 'Show: Active', value: 'active', color: 'primary' },
              { label: 'Show: Hidden', value: 'hidden', color: 'error' },
            ]"
            class="w-40"
          />
        </div>

        <!-- Loading Skeleton -->
        <div v-if="isLoading && links.length === 0" class="space-y-4">
          <UCard
            v-for="i in 5"
            :key="i"
            class="bg-default dark:bg-white/[0.04] dark:backdrop-blur-xl"
            :ui="{ body: 'p-4 sm:p-4' }"
          >
            <div class="flex md:flex-row flex-col gap-3 items-start justify-between">
              <div class="flex space-x-3">
                <USkeleton class="mt-2 h-4 w-4 rounded" />
                <div class="flex md:flex-row flex-col gap-2">
                  <USkeleton class="h-8 w-8 rounded md:mt-2" />
                  <div class="space-y-2">
                    <USkeleton class="h-6 w-40" />
                    <USkeleton class="h-4 w-56" />
                    <div class="flex items-center gap-4 pt-1">
                      <USkeleton class="h-4 w-24" />
                      <USkeleton class="h-4 w-20" />
                    </div>
                  </div>
                </div>
              </div>
              <div class="w-full md:w-auto flex items-center space-x-2 pt-2 md:pt-0">
                <div class="flex-1 md:hidden"></div>
                <USkeleton class="h-8 w-16 rounded" />
                <USkeleton class="h-8 w-16 rounded" />
              </div>
            </div>
          </UCard>
        </div>

        <!-- Links list -->
        <div v-else class="space-y-4">
          <UCard
            v-for="link in links"
            :key="link.id"
            class="hover:border-primary/50 transition-colors"
            :ui="{ body: 'p-4 sm:p-4' }"
          >
            <div
              class="flex md:flex-row flex-col gap-3 items-start justify-between"
            >
              <div class="flex space-x-3">
                <UCheckbox
                  class="mt-2"
                  :model-value="selectedLinks.includes(link.id)"
                  @update:model-value="toggleSelect(link)"
                />
                <div class="flex md:flex-row flex-col gap-2">
                  <div class="flex md:block items-center space-x-2">
                    <UAvatar
                      :src="getImageUrl(link.meta?.image)"
                      :alt="link.short_code"
                      :fallback="{
                        src: '/images/link.png',
                        alt: link.short_code,
                      }"
                      size="sm"
                      class="md:mt-2"
                    />
                    <div class="block md:hidden font-medium text-foreground/40">
                      {{ link.meta?.title || "Untitled" }}
                    </div>
                  </div>
                  <div>
                    <NuxtLink
                      :to="`/dashboard/links/${link.short_code}`"
                      class="font-bold text-lg hover:underline"
                    >
                      s.perlink.to/{{ link.short_code }}
                    </NuxtLink>
                    <div class="flex items-center">
                      <UIcon
                        name="i-lucide-arrow-right"
                        class="w-4 h-4 text-muted-foreground/40 mr-1"
                      />
                      <a
                        :href="link.content"
                        target="_blank"
                        class="flex-1 text-sm text-muted-foreground hover:underline hover:text-foreground line-clamp-1"
                      >
                        {{ link.content }}
                      </a>
                    </div>
                    <div class="py-1"></div>
                    <div
                      class="flex flex-col md:flex-row md:items-center md:gap-4 gap-2 text-sm text-muted-foreground"
                    >
                      <div
                        class="hidden md:block font-medium text-foreground/40"
                      >
                        {{ link.meta?.title || "Untitled" }}
                      </div>
                      <div class="flex items-center space-x-2">
                        <UIcon name="i-lucide-calendar" class="w-4 h-4" />
                        <span>{{ formatDate(link.created_at) }}</span>
                      </div>
                      <div class="flex items-center space-x-2 relative group">
                        <UIcon name="i-lucide-tag" class="w-4 h-4" />
                        <div
                          v-if="(link.tags?.length ?? 0) > 0"
                          class="flex gap-1"
                        >
                          <UBadge
                            v-for="tag in link.tags || []"
                            :key="tag"
                            color="neutral"
                            variant="soft"
                            size="xs"
                          >
                            {{ tag }}
                          </UBadge>
                        </div>
                        <span v-else class="text-xs">No tags</span>

                        <UPopover v-model:open="linkTagPopover[link.id]">
                          <UButton
                            variant="ghost"
                            color="primary"
                            size="xs"
                            icon="i-lucide-plus"
                            class="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Add
                          </UButton>
                          <template #content>
                            <div class="w-80 p-4 space-y-3">
                              <UInput
                                v-model="newTag"
                                placeholder="Search tags"
                                @keyup.enter="addTagNew([link])"
                              />
                              <div
                                v-if="tagsWithSearch.length > 0"
                                class="space-y-1"
                              >
                                <div
                                  v-for="tag in tagsWithSearch"
                                  :key="tag.id"
                                  class="flex items-center space-x-2 cursor-pointer hover:bg-elevated dark:hover:bg-white/10 p-2 rounded"
                                  @click="tag.selected = !tag.selected"
                                >
                                  <UCheckbox :model-value="tag.selected" />
                                  <span>{{ tag.id }}</span>
                                </div>
                              </div>
                              <div v-else class="text-sm text-muted dark:text-neutral-400">
                                Press Enter to create new tag
                              </div>
                            </div>
                          </template>
                        </UPopover>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="w-full md:w-auto flex items-center space-x-2 pt-2 md:pt-0"
              >
                <div class="flex-1 md:hidden"></div>
                <UButton
                  variant="outline"
                  size="sm"
                  icon="i-lucide-copy"
                  @click="copyLink(link.short_code)"
                >
                  Copy
                </UButton>
                <UButton
                  variant="outline"
                  size="sm"
                  icon="i-lucide-share-2"
                  @click="showShareModal(link)"
                >
                  Share
                </UButton>
              </div>
            </div>
          </UCard>

          <!-- Empty state -->
          <div
            v-if="links.length === 0 && !isLoading"
            class="text-center py-12 text-muted-foreground"
          >
            <UIcon
              name="i-lucide-link"
              class="w-12 h-12 mx-auto mb-4 opacity-50"
            />
            <p>No links found</p>
          </div>
        </div>

        <!-- Infinite scroll loading indicator -->
        <div class="pt-6 pb-4 text-center" v-if="links.length > 0">
          <div
            v-if="isLoading"
            class="flex items-center justify-center space-x-2"
          >
            <div
              class="h-4 w-4 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"
            ></div>
            <div
              class="h-4 w-4 rounded-full bg-primary/70 animate-bounce [animation-delay:-0.15s]"
            ></div>
            <div class="h-4 w-4 rounded-full bg-primary animate-bounce"></div>
          </div>
          <div v-else-if="hasMoreLinks" class="text-center">
            <UButton variant="outline" @click="loadMoreLinks" class="px-8"
              >Load more</UButton
            >
          </div>
          <div v-else class="text-sm text-muted-foreground">
            You've reached the end of your links
          </div>
          <div class="text-sm text-muted-foreground mt-2">
            Showing <span class="font-medium">{{ links.length }}</span> of
            <span class="font-medium">{{ totalItems }}</span> links
          </div>
        </div>
      </div>
      <LinkShareModal
        v-model:open="shareModalOpen"
        :short-code="selectedLink?.short_code || ''"
        @view-details="closeShareModal"
      />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import { debounce } from "lodash-es";
import LinkShareModal from "~/components/modals/LinkShareModal.vue";
import type { Link, Tag } from "../../../../types/link";
import type {
  ApiLinkListResponse,
  ApiResponse,
} from "../../../../types/response";

definePageMeta({
  colorMode: 'light',
  layout: "admin",
  middleware: "auth",
  ssr: false,
});

const router = useRouter();
const toast = useToast();

// Types
type DateRange = {
  start: Date | undefined;
  end: Date | undefined;
};

// UI State
const showTagModal = ref(false);
const showFilterModal = ref(false);
const newTag = ref<string>("");
const tags = ref<Array<{ id: string; selected: boolean }>>([]);
const linkTagPopover = ref<Record<string, boolean>>({});

// Computed helpers for date inputs
const dateStartStr = computed({
  get: () => createdDateFilter.value.start?.toISOString().split("T")[0] || "",
  set: (val: string) => {
    createdDateFilter.value.start = val ? new Date(val) : undefined;
  },
});

const dateEndStr = computed({
  get: () => createdDateFilter.value.end?.toISOString().split("T")[0] || "",
  set: (val: string) => {
    createdDateFilter.value.end = val ? new Date(val) : undefined;
  },
});

// Filter options
const filterOptions = ref({
  tagIds: [] as string[],
  linkType: "all",
  hasQrCode: "all",
});

// Tag filter
const tagSearchQuery = ref("");
const showTagDropdown = ref(false);
const filteredTags = computed(() => {
  if (!tagSearchQuery.value) return tags.value;
  return tags.value.filter(
    (tag) =>
      tag.id.toLowerCase().includes(tagSearchQuery.value.toLowerCase()) &&
      !filterOptions.value.tagIds.includes(tag.id),
  );
});

// Setup event listeners
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
  getTags();

  // Close tag dropdown when clicking outside
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".tag-filter-container")) {
      showTagDropdown.value = false;
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", handleScroll);
});

// Active filters count
const activeFiltersCount = computed(() => {
  let count = 0;
  if (filterOptions.value.tagIds.length > 0) count++;
  if (filterOptions.value.linkType !== "all") count++;
  if (filterOptions.value.hasQrCode !== "all") count++;
  return count;
});

const searchQuery = ref("");
const activeFilter = ref("active");
const links = ref<Link[]>([]);
const shareModalOpen = ref(false);
const selectedLink = ref<Link | null>(null);
const selectedLinks = ref<string[]>([]);

const createdDateFilter = ref({
  start: undefined as Date | undefined,
  end: undefined as Date | undefined,
}) as Ref<DateRange>;

// Computed property to check if date filter is active
const isDateFilterActive = computed(() => {
  return createdDateFilter.value.start || createdDateFilter.value.end;
});

const tagsWithSearch = computed(() => {
  return tags.value.filter((t) =>
    t.id.toLowerCase().includes(newTag.value.toLowerCase()),
  );
});

// Infinite scroll
const currentPage = ref(0);
const perPage = ref(10);
const totalItems = ref(0);
const hasMoreLinks = computed(() => links.value.length < totalItems.value);
const isLoading = ref(true);
const queryCache = ref("");

// Format date for API
function formatDateForApi(date: any) {
  if (!date) return undefined;
  return new Date(date).toISOString();
}

// Fetch links
async function fetchLinks(append = false) {
  isLoading.value = true;

  const query: any = {
    page: currentPage.value,
    q: searchQuery.value || undefined,
    start: createdDateFilter.value.start
      ? formatDateForApi(createdDateFilter.value.start)
      : undefined,
    end: createdDateFilter.value.end
      ? formatDateForApi(createdDateFilter.value.end)
      : undefined,
    is_public: activeFilter.value === "active" ? true : false,
  };

  // Add tag filter
  if (filterOptions.value.tagIds.length > 0) {
    query.tags = filterOptions.value.tagIds;
  }

  // Add link type filter
  if (filterOptions.value.linkType !== "all") {
    query.linkType = filterOptions.value.linkType;
  }

  // Add QR code filter
  if (filterOptions.value.hasQrCode !== "all") {
    query.hasQrCode = filterOptions.value.hasQrCode;
  }

  // If not appending, check cache to avoid duplicate requests
  if (!append && queryCache.value === JSON.stringify(query)) {
    isLoading.value = false;
    return;
  }

  queryCache.value = JSON.stringify(query);

  try {
    const res = await $fetch<ApiLinkListResponse>("/api/links", {
      query,
    });

    if (res.success && res.data) {
      const newLinks = Array.isArray(res.data) ? res.data : [res.data];

      // Get total from API pagination data
      if (res.pagination) {
        totalItems.value = res.pagination.total;
      }

      // If appending, add to existing links, otherwise replace
      if (append) {
        // Make sure we don't exceed the total number of items
        if (links.value.length < totalItems.value) {
          links.value = [...links.value, ...newLinks];
          // Ensure we don't exceed the total count
          if (links.value.length > totalItems.value) {
            links.value = links.value.slice(0, totalItems.value);
          }
        }
      } else {
        links.value = newLinks;
      }
    }
  } catch (error: any) {
    console.error("[fetchLinks] Error:", error);
    console.error("[fetchLinks] Error message:", error?.message);
    console.error("[fetchLinks] Error data:", error?.data);
    toast.add({
      title: "Error",
      description: error?.data?.message || error?.message || "Failed to load links. Please try again.",
      color: "error",
    });
  } finally {
    isLoading.value = false;
  }
}

// Fetch on client only
onMounted(() => {
  fetchLinks();
});

// Watch for search query changes
watch(
  searchQuery,
  debounce(async () => {
    currentPage.value = 0; // Reset to first page on new search
    await fetchLinks();
  }, 300),
);

watch(
  activeFilter,
  debounce(async () => {
    currentPage.value = 0; // Reset to first page on new search
    await fetchLinks();
  }, 300),
);

// Scroll handler for infinite loading
const handleScroll = debounce(() => {
  // Check if we're near the bottom of the page
  const bottomOfWindow =
    Math.max(
      window.pageYOffset,
      document.documentElement.scrollTop,
      document.body.scrollTop,
    ) +
      window.innerHeight >
    document.documentElement.offsetHeight - 500;

  if (bottomOfWindow && hasMoreLinks.value && !isLoading.value) {
    loadMoreLinks();
  }
}, 200);

// Date filter functions
const clearDateFilter = () => {
  console.log("clearDateFilter");

  createdDateFilter.value.start = undefined;
  createdDateFilter.value.end = undefined;
  currentPage.value = 0;
  links.value = [];
  fetchLinks();
};

const applyDateFilter = () => {
  console.log("applyDateFilter");

  currentPage.value = 0;
  links.value = [];
  fetchLinks();
};

// Utils
const getShortUrl = (shortCode: string) =>
  `https://s.perlink.to/${shortCode}`;
const formatDate = (date: string) =>
  format(new Date(date), "MMM d, yyyy h:mm a");

// Actions
const copyLink = async (shortCode: string) => {
  try {
    await navigator.clipboard.writeText(getShortUrl(shortCode));
    toast.add({
      title: "Copied to clipboard",
      description: getShortUrl(shortCode),
    });
  } catch (error) {
    toast.add({
      title: "Failed to copy",
      description: "Please try again",
      color: "error",
    });
  }
};

const showShareModal = (link: Link) => {
  selectedLink.value = link;
  shareModalOpen.value = true;
};

const closeShareModal = () => {
  shareModalOpen.value = false;
  selectedLink.value = null;
};

// Selection handling
const toggleSelect = (link: Link) => {
  const index = selectedLinks.value.indexOf(link.id);
  if (index === -1) {
    selectedLinks.value.push(link.id);
  } else {
    selectedLinks.value.splice(index, 1);
  }
};

const toggleSelectAll = (value: boolean | "indeterminate") => {
  if (value === true) {
    selectedLinks.value = links.value.map((link) => link.id);
  } else {
    selectedLinks.value = [];
  }
};

// Load more links for infinite scroll
const loadMoreLinks = async () => {
  if (isLoading.value || !hasMoreLinks.value) return;

  // Don't try to load more if we already have all items
  if (links.value.length >= totalItems.value) return;

  currentPage.value++;
  await fetchLinks(true);
};

const addTagNew = async (_links: Link[]) => {
  if (!newTag.value) return;
  if (tagsWithSearch.value.length) return;

  const res = await $fetch<ApiResponse>("/api/tags", {
    method: "POST",
    body: {
      links: _links.map((link) => link.id),
      text: newTag.value,
    },
  });

  if (res.success) {
    toast.add({
      title: "Success",
      description: "Tag added successfully",
    });
    _links.forEach((link) => {
      link.tags?.push(res.data?.id);
    });
    newTag.value = "";
    tags.value.push({
      ...res.data,
      selected: true,
    });
  } else {
    toast.add({
      title: "Error",
      description: res.message,
      color: "error",
    });
  }
};

const onTagModalOpen = (open: boolean, link: Link) => {
  if (!open) {
    if (link.tags?.length) {
      // remove unused tags
      const tagsUnSelected =
        tags.value.filter((t) => !t.selected)?.map((t) => t.id) || [];
      const removedTags = tagsUnSelected.filter((t) => link.tags?.includes(t));
      if (removedTags.length > 0) {
        removeTag([link], removedTags);
      }
    }

    // add tags
    const tagsSelected =
      tags.value.filter((t) => t.selected)?.map((t) => t.id) || [];
    const newTags = tagsSelected.filter((t) => !link.tags?.includes(t));
    if (newTags.length > 0) {
      addTags([link], newTags);
    }
  } else {
    tags.value.forEach((t) => {
      t.selected = link.tags?.includes(t.id) ?? false;
    });
  }
};

const removeTag = async (_links: Link[], tagIds: string[]) => {
  const res = await $fetch<ApiResponse>("/api/tags/remove", {
    method: "POST",
    body: {
      linkIds: _links.map((link) => link.id),
      tagIds,
    },
  });

  if (res.success) {
    toast.add({
      title: "Success",
      description: "Tag removed successfully",
    });
    _links.forEach((link) => {
      link.tags = link.tags?.filter((t) => !tagIds.includes(t)) ?? null;
    });
  } else {
    toast.add({
      title: "Error",
      description: res.message,
      color: "error",
    });
  }

  tags.value.forEach((t) => {
    t.selected = false;
  });
};

const addTags = async (_links: Link[], tagIds: string[]) => {
  const res = await $fetch<ApiResponse>("/api/tags/add", {
    method: "POST",
    body: {
      linkIds: _links.map((link) => link.id),
      tagIds,
    },
  });

  if (res.success) {
    toast.add({
      title: "Success",
      description: "Tag added successfully",
    });
    _links.forEach((link) => {
      link.tags = Array.from(new Set([...(link.tags || []), ...tagIds]));
    });
  } else {
    toast.add({
      title: "Error",
      description: res.message,
      color: "error",
    });
  }

  tags.value.forEach((t) => {
    t.selected = false;
  });
};

const getTags = async () => {
  const res = await $fetch<ApiResponse>("/api/tags");
  if (res.success) {
    tags.value = res.data.map((t: any) => ({
      id: t,
      selected: false,
    }));
    console.log("tags.value", tags.value);
  } else {
    // toast.add({
    //   title: "Error",
    //   description: res.message,
    //   color: "error",
    // });
  }
};

const onTagModalGlobalOpen = (open: boolean) => {
  //
  showTagModal.value = open;
  const linksItemSelected = links.value.filter((link) =>
    selectedLinks.value.includes(link.id),
  );
  if (open) {
    tags.value = tags.value.map((t) => {
      t.selected =
        linksItemSelected.filter((link) => link.tags?.includes(t.id)).length ===
        linksItemSelected.length;
      return t;
    });
  } else {
    if (linksItemSelected.length) {
      // add new to selected
      const oldSameTagIds = tags.value
        .filter((t) => {
          return (
            linksItemSelected.filter((link) => link.tags?.includes(t.id))
              .length === linksItemSelected.length
          );
        })
        .map((t) => t.id);

      const newSameTagIds = tags.value
        .filter((t) => {
          return t.selected && !oldSameTagIds.includes(t.id);
        })
        .map((t) => t.id);

      if (newSameTagIds.length) {
        addTags(linksItemSelected, newSameTagIds);
      }

      // remove
      const removeTags = tags.value
        .filter((t) => {
          return !t.selected && oldSameTagIds.includes(t.id);
        })
        .map((t) => t.id);

      if (removeTags.length) {
        removeTag(linksItemSelected, removeTags);
      }
    }

    // unselect
    tags.value = tags.value.map((t) => {
      t.selected = false;
      return t;
    });
  }
};

const addTagNewGlobal = async () => {
  if (!newTag.value) return;
  const linksItemSelected = links.value.filter((link) =>
    selectedLinks.value.includes(link.id),
  );

  addTagNew(linksItemSelected);
};

// Filter functions
const applyFilters = () => {
  currentPage.value = 0;
  links.value = [];
  showFilterModal.value = false;
  fetchLinks();
};

const clearAllFilters = () => {
  filterOptions.value = {
    tagIds: [],
    linkType: "all",
    hasQrCode: "all",
  };
  fetchLinks();
};

const toggleTagInFilter = (tagId: string) => {
  const index = filterOptions.value.tagIds.indexOf(tagId);
  if (index === -1) {
    filterOptions.value.tagIds.push(tagId);
  } else {
    filterOptions.value.tagIds.splice(index, 1);
  }
};

const removeTagFromFilter = (tagId: string) => {
  const index = filterOptions.value.tagIds.indexOf(tagId);
  if (index !== -1) {
    filterOptions.value.tagIds.splice(index, 1);
  }
};

const updateLinksPublic = async () => {
  const res = await $fetch<ApiResponse>("/api/update-links-public", {
    method: "POST",
    body: {
      linkIds: selectedLinks.value,
      isPublic: activeFilter.value !== "active",
    },
  });

  if (res.success) {
    toast.add({
      title: "Success",
      description: res.message,
    });
  } else {
    toast.add({
      title: "Error",
      description: res.message,
      color: "error",
    });
  }

  links.value = links.value.filter(
    (link) => !selectedLinks.value.includes(link.id),
  );
  selectedLinks.value = [];
};
</script>
