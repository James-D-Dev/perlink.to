<template>
  <div class="space-y-4">
    <!-- No Data State -->
    <div v-if="!bioPageId" class="rounded-xl bg-paper py-16 text-center ring-1 ring-line">
      <UIcon name="i-lucide-chart-column" class="mx-auto mb-3 size-8 text-ink-faint" />
      <p class="text-sm text-ink-muted">{{ t('analytics.unpublished') }}</p>
    </div>

    <UTabs
      v-else
      :items="tabs"
      default-value="page"
      class="w-full"
      variant="link"
      color="neutral"
      size="md"
      :ui="{ list: 'border-b border-line', trigger: 'px-2.5 sm:px-3' }"
    >
      <template #content="{ item }">
        <div v-if="item.value === 'page'" class="pt-4">
          <FeaturesLinkAnalytics :link-id="bioPageId" />
        </div>

        <div v-else-if="item.value === 'links'" class="pt-4">
          <div
            v-if="!bioLinks?.length && !socialLinks?.length"
            class="rounded-xl bg-paper py-12 text-center text-sm text-ink-muted ring-1 ring-line"
          >
            {{ t('analytics.links.empty') }}
          </div>

          <div v-else class="space-y-4">
            <section v-if="bioLinks?.length" class="overflow-hidden rounded-xl bg-paper ring-1 ring-line">
              <h4 class="border-b border-line px-4 py-3 text-sm font-medium text-ink">{{ t('analytics.links.linksTitle') }}</h4>
              <ul class="divide-y divide-line">
                <li v-for="link in bioLinks" :key="link.id" class="flex items-center gap-3 px-4 py-3">
                  <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-sand">
                    <UIcon :name="getIconForLink(link)" class="size-4 text-ink-soft" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-ink">{{ link.title }}</p>
                    <p class="truncate text-xs text-ink-muted">{{ link.url }}</p>
                  </div>
                  <div class="shrink-0 text-right">
                    <p class="text-lg font-semibold tabular-nums text-ink">{{ getLinkClickCount(link.id) }}</p>
                    <p class="text-[11px] text-ink-muted">{{ t('analytics.links.clicks', getLinkClickCount(link.id)) }}</p>
                  </div>
                </li>
              </ul>
            </section>

            <section v-if="socialLinks?.length" class="overflow-hidden rounded-xl bg-paper ring-1 ring-line">
              <h4 class="border-b border-line px-4 py-3 text-sm font-medium text-ink">{{ t('analytics.links.socialTitle') }}</h4>
              <ul class="divide-y divide-line">
                <li v-for="social in socialLinks" :key="social.id" class="flex items-center gap-3 px-4 py-3">
                  <span class="flex size-8 shrink-0 items-center justify-center rounded-md bg-sand">
                    <UIcon :name="getSocialIcon(social.provider)" class="size-4" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium capitalize text-ink">{{ social.provider }}</p>
                    <p class="truncate text-xs text-ink-muted">{{ getSocialUrl(social) || t('analytics.links.noLink') }}</p>
                  </div>
                  <div class="shrink-0 text-right">
                    <p class="text-lg font-semibold tabular-nums text-ink">{{ getSocialClickCount(social.id) }}</p>
                    <p class="text-[11px] text-ink-muted">{{ t('analytics.links.clicks', getSocialClickCount(social.id)) }}</p>
                  </div>
                </li>
              </ul>
            </section>
          </div>
        </div>
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

const { t } = useI18n();

const tabs = computed(() => [
  { value: "page", label: t("analytics.tabs.overview") },
  { value: "links", label: t("analytics.tabs.links") },
]);

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
