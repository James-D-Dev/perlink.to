<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      title="Links"
      icon="i-lucide-link"
      :hidden="linksBlock?.hidden"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('links')"
    >
      <template #actions>
        <UButton
          variant="ghost"
          color="neutral"
          size="xs"
          icon="i-lucide-more-vertical"
        />
      </template>
    </BioBlockItemHeader>

    <!-- Links Edit Form -->
    <div v-if="isActive" class="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03]">
      <div class="space-y-4">
        <draggable
          v-model="localLinks"
          item-key="id"
          handle=".drag-handle"
          @end="onDragEnd"
        >
          <template #item="{ element: link, index }">
            <div
              class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden mb-4 last:mb-0"
            >
              <!-- Main Content -->
              <div class="flex gap-3 p-4">
                <!-- Left: Drag handle -->
                <div class="drag-handle cursor-move text-gray-400 dark:text-neutral-500 pt-1">
                  <UIcon name="i-lucide-grip-vertical" class="w-5 h-5" />
                </div>

                <!-- Middle: Form fields -->
                <div class="flex-1 space-y-2">
                  <UInput
                    :model-value="link.title"
                    placeholder="Title (required)"
                    variant="soft"
                    size="sm"
                    class="font-medium block"
                    @update:model-value="
                      $emit('updateLink', index, 'title', $event)
                    "
                  />

                  <UInput
                    :model-value="link.subtitle"
                    placeholder="Subtitle (optional)"
                    variant="soft"
                    size="sm"
                    class="block"
                    @update:model-value="
                      $emit('updateLink', index, 'subtitle', $event)
                    "
                  />

                  <UInput
                    :model-value="link.url"
                    placeholder="URL or email (required)"
                    variant="soft"
                    size="sm"
                    class="block"
                    @update:model-value="
                      $emit('updateLink', index, 'url', $event)
                    "
                  />
                </div>

                <!-- Right: Icon picker -->
                <button
                  class="w-16 h-16 rounded-xl bg-gray-100 dark:bg-white/[0.06] border-0 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
                  @click="openIconModal(index)"
                >
                  <UIcon
                    :name="getIconForLink(link)"
                    class="w-8 h-8"
                    :class="getIconColorClass(link.icon)"
                  />
                </button>
              </div>

              <!-- Bottom Action Bar -->
              <div
                class="flex items-center justify-between px-4 py-2 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03]"
              >
                <!-- Left: Action Icons -->
                <div class="flex items-center gap-1">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-star"
                  />
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-calendar"
                  />
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-clock"
                  />
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-share"
                  />
                </div>

                <!-- Right: More + Delete -->
                <div class="flex items-center gap-1">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-bar-chart-2"
                  />
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-more-horizontal"
                  />
                  <div class="w-px h-4 bg-gray-300 mx-1" />
                  <UButton
                    color="error"
                    variant="ghost"
                    size="xs"
                    icon="i-lucide-trash-2"
                    @click="$emit('remove', index)"
                  />
                </div>
              </div>
            </div>
          </template>
        </draggable>

        <!-- Add Link Input -->
        <div class="flex gap-2">
          <UInput
            v-model="newLinkUrl"
            placeholder="https://..."
            variant="soft"
            class="flex-1"
          />
          <UButton
            color="primary"
            :loading="crawling"
            :disabled="!newLinkUrl"
            @click="addLinkFromUrl"
          >
            <UIcon name="i-lucide-plus" class="w-4 h-4" />
            Add
          </UButton>
        </div>
      </div>
    </div>

    <!-- Icon Selection Modal -->
    <ModalsLinkIconSelectionModal
      v-model:open="iconModalOpen"
      :selected-icon="
        selectedLinkIndex !== null ? links[selectedLinkIndex]?.icon : undefined
      "
      @select="onIconSelected"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, toRef } from "vue";
import draggable from "vuedraggable";
import type { BioLink, BioBlock } from "~/types/bio";
import { useBioBlock } from "~/composables/useBioBlock";

const props = defineProps<{
  isActive: boolean;
  blocks: BioBlock[];
}>();

const emit = defineEmits<{
  toggle: [];
  add: [link: Partial<BioLink>];
  remove: [index: number];
  updateLink: [
    index: number,
    field: "title" | "subtitle" | "url" | "icon",
    value: string,
  ];
  selectImage: [index: number];
  update: [links: BioLink[]];
}>();

// Use composable
const {
  links,
  linksBlock,
  addLink,
  removeLink,
  updateLink,
  toggleBlockHidden,
} = useBioBlock({
  blocks: toRef(props, "blocks"),
});

// Local copy for drag-and-drop
const localLinks = ref<BioLink[]>([]);
let isUpdatingFromParent = false;

// Sync with parent (one-way)
watch(
  () => links.value,
  (newVal) => {
    isUpdatingFromParent = true;
    localLinks.value = [...(newVal || [])].sort(
      (a, b) => (a.order || 0) - (b.order || 0),
    );
    nextTick(() => {
      isUpdatingFromParent = false;
    });
  },
  { immediate: true, deep: true },
);

// Handle drag end - emit updated order
function onDragEnd() {
  if (isUpdatingFromParent) return;
  const sorted = localLinks.value.map((link, i) => ({ ...link, order: i }));
  emit("update", sorted);
}

const newLinkUrl = ref("");
const crawling = ref(false);
const iconModalOpen = ref(false);
const selectedLinkIndex = ref<number | null>(null);

// Icon mapping for URL detection
const urlIconMap: Record<string, string> = {
  "facebook.com": "facebook",
  "fb.com": "facebook",
  "twitter.com": "twitter",
  "x.com": "twitter",
  "instagram.com": "instagram",
  "linkedin.com": "linkedin",
  "youtube.com": "youtube",
  "youtu.be": "youtube",
  "tiktok.com": "tiktok",
};

const iconToUiIcon: Record<string, string> = {
  facebook: "i-fa-facebook",
  twitter: "i-prime-twitter",
  instagram: "i-fa-instagram",
  linkedin: "i-fa-linkedin",
  youtube: "i-fa-youtube-play",
  tiktok: "i-prime-tiktok",
  globe: "i-prime-globe",
};

const iconColorClasses: Record<string, string> = {
  facebook: "text-blue-600",
  twitter: "text-sky-500",
  instagram: "text-pink-600",
  linkedin: "text-blue-700",
  youtube: "text-red-600",
  tiktok: "text-black",
  globe: "text-gray-600",
};

function detectIconFromUrl(url: string): string {
  const lowerUrl = url.toLowerCase();
  for (const [domain, icon] of Object.entries(urlIconMap)) {
    if (lowerUrl.includes(domain)) {
      return icon;
    }
  }
  return "globe";
}

function getIconForLink(link: BioLink): string {
  const iconId = link.icon;
  if (iconId && iconToUiIcon[iconId]) {
    return iconToUiIcon[iconId];
  }
  // Auto detect from URL if no icon set
  const detected = detectIconFromUrl(link.url);
  return iconToUiIcon[detected] ?? "i-lucide-link";
}

function getIconColorClass(iconId?: string): string {
  if (iconId && iconColorClasses[iconId]) {
    return iconColorClasses[iconId];
  }
  return "text-gray-500";
}

function openIconModal(index: number) {
  selectedLinkIndex.value = index;
  iconModalOpen.value = true;
}

function onIconSelected(iconId: string) {
  if (selectedLinkIndex.value !== null) {
    emit("updateLink", selectedLinkIndex.value, "icon", iconId);
  }
}

function normalizeUrl(url: string): string {
  url = url.trim();
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

async function addLinkFromUrl() {
  if (!newLinkUrl.value) return;

  // Normalize URL - add https:// if missing
  const normalizedUrl = normalizeUrl(newLinkUrl.value);
  console.log("[BioBlockLinks] Crawling URL:", normalizedUrl);

  crawling.value = true;

  try {
    // Call API to crawl metadata
    const { data, error } = await useFetch("/api/crawl-link", {
      method: "POST",
      body: { url: normalizedUrl },
    });

    if (error.value) {
      console.error("[BioBlockLinks] Crawl error:", error.value);
    }

    console.log("[BioBlockLinks] Crawl result:", data.value);

    const metadata = data.value as {
      title?: string;
      description?: string;
      image?: string;
      favicon?: string;
    } | null;

    // Detect icon from URL
    const detectedIcon = detectIconFromUrl(normalizedUrl);

    // Add new link with crawled data (use normalized URL with https://)
    emit("add", {
      title: metadata?.title || normalizedUrl,
      subtitle: metadata?.description || "",
      url: normalizedUrl,
      icon: detectedIcon,
      imageUrl: metadata?.image || metadata?.favicon || "",
    });

    newLinkUrl.value = "";
  } catch (error) {
    console.error("Failed to crawl link:", error);
    // Fallback: add with just URL (use normalized URL with https://)
    const detectedIcon = detectIconFromUrl(normalizedUrl);
    emit("add", {
      title: normalizedUrl,
      url: normalizedUrl,
      icon: detectedIcon,
    });
    newLinkUrl.value = "";
  } finally {
    crawling.value = false;
  }
}
</script>
