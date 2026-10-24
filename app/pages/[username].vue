<template>
  <div
    class="min-h-screen"
    :style="{
      backgroundColor: bioPageAsBioData?.themeConfig?.colors?.third || '#000000',
    }"
  >
    <Head>
      <Meta charSet="utf-8" />
      <Meta name="emotion-insertion-point" content="" />
      <Meta
        name="viewport"
        content="width=device-width, initial-scale=1, viewport-fit=contain"
      />
      <Title>{{ metaTitle }}</Title>
      <Meta name="description" :content="metaDesc" />
      <Meta property="og:title" :content="metaTitle" />
      <Meta property="og:description" :content="metaDesc" />
      <Meta property="og:url" :content="metaUrl" />
      <Meta property="og:site_name" content="Perlink" />
      <Meta property="og:image" :content="metaImg" />
      <Meta property="og:type" content="website" />

      <Link rel="canonical" :href="metaUrl" />
      <Meta name="mobile-web-app-capable" content="yes" />
      <Meta name="apple-mobile-web-app-title" content="Perlink" />
      <Meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <Meta name="theme-color" content="#000000" />
      <Meta name="fb:app_id" content="" />

      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:site" content="@perlinkto" />
      <Meta name="twitter:creator" :content="`@${bioPage?.username}`" />
      <Meta name="twitter:title" :content="metaTitle" />
      <Meta name="twitter:description" :content="metaDesc" />
      <Meta name="twitter:image" :content="metaImg" />
      <Meta property="profile:username" :content="bioPage?.username" />
    </Head>

    <div class="mx-auto">
      <!-- Loading -->
      <div v-if="pending" class="flex justify-center py-20">
        <UIcon
          name="i-lucide-loader-circle"
          class="w-12 h-12 text-white animate-spin"
        />
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-20">
        <UIcon
          name="i-lucide-alert-circle"
          class="w-16 h-16 text-gray-400 mx-auto mb-4"
        />
        <h1 class="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p class="text-gray-500">
          This bio page doesn't exist or isn't published yet.
        </p>
        <UButton to="/" class="mt-6" color="primary"> Go Home </UButton>
      </div>

      <!-- 3D room -->
      <ClientOnly v-else-if="bioPage && room && !show2d">
        <LazyRoomViewer
          :room="room"
          :title="bioPage.title || bioPage.username"
          :bio="bioPage.bio || undefined"
          :avatar-url="bioPage.avatarUrl || undefined"
          :lang="siteLang"
          @switch2d="show2d = true"
        />
        <template #fallback>
          <div class="fixed inset-0 flex items-center justify-center bg-slate-900">
            <UIcon name="i-lucide-loader-circle" class="size-10 animate-spin text-white" />
          </div>
        </template>
      </ClientOnly>

      <!-- Bio Content -->
      <BioPageView
        v-else-if="bioPage && bioPageAsBioData"
        :bio-data="bioPageAsBioData"
        :username="bioPage.username"
        mode="view"
      />
      <UButton
        v-if="room && show2d"
        class="fixed bottom-4 left-4 z-50 shadow-lg"
        color="neutral"
        icon="i-lucide-box"
        :label="siteT(siteLang, 'room3d')"
        @click="show2d = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, BioData, ThemeConfig } from "~/types/bio";
import { DEFAULT_THEME } from "~/types/bio";
import { normalizeRoom, type RoomConfig } from "~/types/room";
definePageMeta({
  layout: "blank",
});

interface ApiBioPage {
  id: string;
  username: string;
  title: string | null;
  bio: string | null;
  avatarUrl: string | null;
  templateId: string;
  themeConfig: Partial<ThemeConfig> | null;
  isPublished: boolean;
  viewCount: number;
  blocks?: BioBlock[];
}

const route = useRoute();
const username = route.params.username as string;

const { data, pending, error } = await useFetch<{ bioPage: ApiBioPage }>(
  `/api/bio/${username}`,
  { key: `bio-${username}`, server: true },
);

const bioPage = computed(() => data.value?.bioPage);

// Owner's own title/description/image, or sensible defaults (utils/siteSeo)
const seo = computed(() => siteSeo(bioPage.value ?? {}, bioPage.value?.username ?? username));
const metaTitle = computed(() => seo.value.title);
const metaDesc = computed(() => seo.value.description);
const metaUrl = computed(() => seo.value.url);
const metaImg = computed(() => seo.value.image);

// Address, phone and opening hours for search engines
const businessJsonLd = computed(() => (bioPage.value ? localBusinessJsonLd(bioPage.value, bioPage.value.username) : null));
useHead({
  script: computed(() =>
    businessJsonLd.value
      ? [{ type: "application/ld+json", innerHTML: JSON.stringify(businessJsonLd.value).replace(/</g, "\\u003c") }]
      : [],
  ),
});

const bioPageAsBioData = computed<BioData | undefined>(() => {
  const p = bioPage.value;
  if (!p) return undefined;
  return {
    title: p.title || p.username,
    bio: p.bio || "",
    avatarUrl: p.avatarUrl || "",
    templateId: p.templateId,
    themeConfig: {
      // Keep every saved setting (social, page, language, showShare...),
      // then merge the nested groups over their defaults
      ...DEFAULT_THEME,
      ...(p.themeConfig || {}),
      colors: { ...DEFAULT_THEME.colors, ...(p.themeConfig?.colors || {}) },
      background: {
        ...DEFAULT_THEME.background,
        ...(p.themeConfig?.background || {}),
      },
      card: { ...DEFAULT_THEME.card, ...(p.themeConfig?.card || {}) },
      button: { ...DEFAULT_THEME.button, ...(p.themeConfig?.button || {}) },
      header: { ...DEFAULT_THEME.header, ...(p.themeConfig?.header || {}) },
      avatar: { ...DEFAULT_THEME.avatar, ...(p.themeConfig?.avatar || {}) },
      link: { ...DEFAULT_THEME.link, ...(p.themeConfig?.link || {}) },
      typography: {
        ...DEFAULT_THEME.typography,
        ...(p.themeConfig?.typography || {}),
      },
    } as ThemeConfig,
    blocks: p.blocks || [],
  };
});

const siteLang = computed(() => normalizeSiteLanguage(bioPage.value?.themeConfig?.language));
useHead({ htmlAttrs: { lang: siteLang } });

// Pages in 3D mode open as a room; visitors can switch to the 2D page
const room = computed<RoomConfig | null>(() => {
  const theme = bioPage.value?.themeConfig;
  return theme?.pageMode === "3d" ? normalizeRoom(theme.room) : null;
});
const show2d = ref(false);

// Bio page view tracking is now handled server-side in /api/bio/[username].get.ts
</script>
