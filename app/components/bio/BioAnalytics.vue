<template>
  <div class="space-y-4">
    <!-- No Data State -->
    <div v-if="!bioPageId" class="text-center py-16 text-gray-500 dark:text-neutral-400">
      <UIcon
        name="i-lucide-bar-chart-2"
        class="w-12 h-12 mx-auto mb-3 opacity-50"
      />
      <p class="text-sm">Publish your bio page to start tracking analytics</p>
    </div>

    <UTabs
      v-else
      :items="tabs"
      default-value="page"
      class="w-full"
      variant="link"
      :ui="{
        indicator: 'h-[3px]'
      }"
      size="xl"
    >
      <template #content="{ item }">
        <template v-if="item.value === 'page'">
          <div class="space-y-4 pt-2">
            <FeaturesLinkAnalytics :link-id="bioPageId" />
          </div>
        </template>

        <template v-else-if="item.value === 'links'">
          <div class="space-y-4 pt-2">
            <p class="text-sm text-gray-600 dark:text-neutral-300">
              Analytics for individual links and social media clicks
            </p>

            <div
              v-if="!bioLinks?.length && !socialLinks?.length"
              class="text-center py-8 text-gray-400 dark:text-neutral-500 text-sm"
            >
              No links to display
            </div>

            <div class="grid gap-3">
              <!-- Individual Link Click Count -->
              <div
                v-for="link in bioLinks"
                :key="link.id"
                class="border border-gray-200 dark:border-white/10 rounded-lg p-4"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3 min-w-0">
                    <UIcon
                      :name="getIconForLink(link)"
                      class="w-5 h-5 text-gray-600 dark:text-neutral-300 shrink-0"
                    />
                    <div class="min-w-0">
                      <h4 class="font-medium text-gray-900 dark:text-white truncate">
                        {{ link.title }}
                      </h4>
                      <p class="text-sm text-gray-500 dark:text-neutral-400 truncate max-w-xs">
                        {{ link.url }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right shrink-0 ml-4">
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{ getLinkClickCount(link.id) }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-neutral-400">clicks</div>
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
                  <div class="flex items-center gap-3 min-w-0">
                    <UIcon
                      :name="getSocialIcon(social.provider)"
                      class="w-5 h-5 text-gray-600 dark:text-neutral-300 shrink-0"
                    />
                    <div class="min-w-0">
                      <h4 class="font-medium text-gray-900 dark:text-white capitalize">
                        {{ social.provider }}
                      </h4>
                      <p class="text-sm text-gray-500 dark:text-neutral-400 truncate max-w-xs">
                        {{ getSocialUrl(social) }}
                      </p>
                    </div>
                  </div>
                  <div class="text-right shrink-0 ml-4">
                    <div class="text-2xl font-bold text-gray-900 dark:text-white">
                      {{ getSocialClickCount(social.id) }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-neutral-400">clicks</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import type { BioLink, SocialLink } from "~/types/bio";
import { SOCIAL_PROVIDERS } from "~/types/bio";

const props = defineProps<{
  bioPageId: string;
  username?: string;
  bioLinks?: BioLink[];
  socialLinks?: SocialLink[];
}>();

const tabs = [
  { value: "page", label: "Page Analytics" },
  { value: "links", label: "Link Analytics" },
];

const getIconForLink = (link: BioLink) => {
  if (link.icon) return link.icon;
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

const getLinkClickCount = (linkId: string) =>
  linkClickCounts.value[linkId] ?? 0;
const getSocialClickCount = (socialId: string) =>
  socialClickCounts.value[socialId] ?? 0;

const getSocialIcon = (provider: string) => {
  const found = SOCIAL_PROVIDERS.find(p => p.key === provider);
  return found?.icon || 'i-lucide-link';
};

const getSocialUrl = (social: SocialLink): string => {
  const provider = SOCIAL_PROVIDERS.find(p => p.key === social.provider);
  if (provider?.prefix && !social.url.startsWith('http')) {
    return provider.prefix + social.url;
  }
  return social.url;
};

const fetchClickCounts = async () => {
  if (!props.username) return;
  try {
    const data = await $fetch<{
      links: Record<string, number>;
      social: Record<string, number>;
    }>(`/api/bio/${props.username}/analytics`);
    linkClickCounts.value = data.links ?? {};
    socialClickCounts.value = data.social ?? {};
  } catch (error) {
    console.error("Failed to fetch click counts:", error);
  }
};

onMounted(() => {
  fetchClickCounts();
});
</script>
