<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <!-- Block Header -->
    <div
      class="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
      @click="$emit('toggle')"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 bg-perlink-cyan/10 rounded-lg flex items-center justify-center"
        >
          <UIcon
            name="i-mingcute-bar-chart-2-line"
            class="w-5 h-5 text-perlink-cyan"
          />
        </div>
        <div>
          <h3 class="font-medium text-gray-900 dark:text-white">Analytics</h3>
          <p class="text-sm text-gray-500 dark:text-neutral-400">Track your bio page performance</p>
        </div>
      </div>
      <UIcon
        :name="isActive ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
        class="w-5 h-5 text-gray-400 dark:text-neutral-500 transition-transform"
      />
    </div>

    <!-- Block Content -->
    <div v-if="isActive" class="border-t border-gray-200 dark:border-white/10">
      <div class="p-4">
        <!-- No Data State -->
        <div v-if="!bioPageId" class="text-center py-8 text-gray-500 dark:text-neutral-400">
          <UIcon
            name="i-lucide-bar-chart-2"
            class="w-12 h-12 mx-auto mb-3 opacity-50"
          />
          <p class="text-sm">
            Publish your bio page to start tracking analytics
          </p>
        </div>

        <!-- Analytics Tabs -->
        <div v-else>
          <UTabs :items="tabs" default-value="page" class="w-full">
            <template #content="{ item }">
              <template v-if="item.value === 'page'">
                <div class="space-y-4">
                  <FeaturesLinkAnalytics :link-id="bioPageId" />
                </div>
              </template>

              <template v-else-if="item.value === 'links'">
                <div class="space-y-4">
                  <div class="text-sm text-gray-600 dark:text-neutral-300 mb-4">
                    Analytics for individual links and social media clicks
                  </div>

                  <!-- Links Click Counts -->
                  <div class="grid gap-4">
                    <!-- Individual Link Click Count -->
                    <div
                      v-for="link in bioLinks"
                      :key="link.id"
                      class="border border-gray-200 dark:border-white/10 rounded-lg p-4"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <UIcon
                            :name="getIconForLink(link)"
                            class="w-5 h-5 text-gray-600 dark:text-neutral-300"
                          />
                          <div>
                            <h4 class="font-medium text-gray-900 dark:text-white">
                              {{ link.title }}
                            </h4>
                            <p class="text-sm text-gray-500 dark:text-neutral-400 truncate max-w-xs">
                              {{ link.url }}
                            </p>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="text-2xl font-bold text-gray-900 dark:text-white">
                            {{ getLinkClickCount(link.id) }}
                          </div>
                          <div class="text-sm text-gray-600 dark:text-neutral-300">clicks</div>
                        </div>
                      </div>
                    </div>

                    <!-- Social Links Click Count -->
                    <div
                      v-for="social in socialLinks"
                      :key="social.id"
                      class="border border-gray-200 dark:border-white/10 rounded-lg p-4"
                    >
                      <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                          <UIcon
                            :name="getSocialIcon(social.provider)"
                            class="w-5 h-5 text-gray-600 dark:text-neutral-300"
                          />
                          <div>
                            <h4 class="font-medium text-gray-900 dark:text-white capitalize">
                              {{ social.provider }}
                            </h4>
                            <p class="text-sm text-gray-500 dark:text-neutral-400 truncate max-w-xs">
                              {{ social.url }}
                            </p>
                          </div>
                        </div>
                        <div class="text-right">
                          <div class="text-2xl font-bold text-gray-900 dark:text-white">
                            {{ getSocialClickCount(social.id) }}
                          </div>
                          <div class="text-sm text-gray-600 dark:text-neutral-300">clicks</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </template>
          </UTabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioLink, SocialLink } from "~/types/bio";
import { SOCIAL_PROVIDERS } from "~/types/bio";

const props = defineProps<{
  isActive: boolean;
  bioPageId: string;
  username?: string;
  bioLinks?: BioLink[];
  socialLinks?: SocialLink[];
}>();

defineEmits<{
  toggle: [];
}>();

// Tab state
const selectedTab = ref(1);

// Tab items
const tabs = [
  { value: "page", label: "Page Analytics" },
  { value: "links", label: "Link Analytics" },
];

// Get icon for link
const getIconForLink = (link: BioLink) => {
  if (link.icon) return link.icon;

  // Detect icon from URL
  const url = link.url.toLowerCase();
  if (url.includes("facebook.com")) return "i-fa-facebook";
  if (url.includes("twitter.com")) return "i-prime-twitter";
  if (url.includes("instagram.com")) return "i-fa-instagram";
  if (url.includes("linkedin.com")) return "i-fa-linkedin";
  if (url.includes("youtube.com")) return "i-fa-youtube-play";
  if (url.includes("tiktok.com")) return "i-prime-tiktok";
  if (url.includes("github.com")) return "i-fa-github";
  if (url.includes("spotify.com")) return "i-fa-spotify";
  if (url.includes("discord.com")) return "i-fa-discord";
  if (url.includes("telegram.org")) return "i-fa-telegram";

  return "i-lucide-link";
};

const linkClickCounts = ref<Record<string, number>>({});
const socialClickCounts = ref<Record<string, number>>({});

const getLinkClickCount = (linkId: string) => {
  return linkClickCounts.value[linkId] ?? 0;
};

const getSocialClickCount = (socialId: string) => {
  return socialClickCounts.value[socialId] ?? 0;
};

const getSocialIcon = (provider: string) => {
  const found = SOCIAL_PROVIDERS.find(p => p.key === provider);
  return found?.icon || 'i-lucide-link';
};

const fetchClickCounts = async () => {
  if (!props.username) return;
  try {
    const data = await $fetch<{ links: Record<string, number>; social: Record<string, number> }>(
      `/api/bio/${props.username}/analytics`
    );
    linkClickCounts.value = data.links ?? {};
    socialClickCounts.value = data.social ?? {};
  } catch (error) {
    console.error("Failed to fetch click counts:", error);
  }
};

watch(
  () => [props.username, props.isActive] as const,
  ([username, isActive]) => {
    if (username && isActive) fetchClickCounts();
  },
  { immediate: true }
);
</script>
