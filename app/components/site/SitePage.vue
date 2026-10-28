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
      <!-- A bio page's outline: photo, name, intro and a few buttons -->
      <div v-if="pending" class="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-14" aria-busy="true">
        <div class="shimmer size-24 rounded-full" />
        <div class="shimmer mt-2 h-6 w-48 rounded-md" />
        <div class="shimmer h-3.5 w-64 max-w-full rounded-md" />
        <div class="shimmer h-3.5 w-52 max-w-full rounded-md" />
        <div class="mt-6 w-full space-y-3">
          <div v-for="i in 4" :key="i" class="shimmer h-14 w-full rounded-2xl" />
        </div>
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

      <!-- 3D room. The loader covers it from the first paint (it's in the
           server HTML) until the viewer has mounted and the loader's intro
           has played out -->
      <ClientOnly v-else-if="bioPage && room && !show2d">
        <LazyRoomViewer
          :room="room"
          :username="bioPage.username"
          :title="bioPage.title || bioPage.username"
          :bio="bioPage.bio || undefined"
          :avatar-url="bioPage.avatarUrl || undefined"
          :lang="siteLang"
          :blocks="bioPage.blocks"
          :accent="bioPage.themeConfig?.colors?.primary"
          :branding="bioPage.showBranding !== false"
          @switch2d="show2d = true"
          @ready="onViewerMounted"
        />
      </ClientOnly>

      <!-- Bio Content -->
      <BioPageView
        v-else-if="bioPage && bioPageAsBioData"
        :bio-data="bioPageAsBioData"
        :username="bioPage.username"
        mode="view"
        :footer-space="!!room && show2d"
      />
      <!-- Back to the 3D room: a floating glass capsule (iOS 26 style, like
           the dashboard's buttons), bottom right -->
      <UButton
        v-if="room && show2d"
        class="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 px-4 font-semibold text-[#1c1a17] shadow-[inset_0_1px_0_rgb(255_255_255/0.85),0_10px_30px_-8px_rgb(0_0_0/0.3)]"
        color="neutral"
        variant="outline"
        size="xl"
        icon="i-lucide-box"
        :label="siteT(siteLang, 'room3d')"
        @click="show2d = false"
      />
      <!-- The 3D room's loader (outside the branches above, so it can fade
           out over the room) -->
      <Transition leave-active-class="transition-opacity duration-300" leave-to-class="opacity-0">
        <RoomLoadingShell v-if="!pending && !error && bioPage && room && !show2d && roomLoading" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, BioData, ThemeConfig } from "~/types/bio";
import { DEFAULT_THEME } from "~/types/bio";
import { normalizeRoom, type RoomConfig } from "~/types/room";
const props = defineProps<{
  username: string;
  /** Set when the site is shown on its own domain (canonical links point there) */
  domain?: string;
}>();

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
  showBranding?: boolean;
}

const username = props.username;

const { data, pending, error } = await useFetch<{ bioPage: ApiBioPage }>(
  `/api/bio/${username}`,
  { key: `bio-${username}`, server: true },
);

const bioPage = computed(() => data.value?.bioPage);

// Owner's own title/description/image, or sensible defaults (utils/siteSeo)
const seo = computed(() => siteSeo(bioPage.value ?? {}, bioPage.value?.username ?? username, props.domain));
const metaTitle = computed(() => seo.value.title);
const metaDesc = computed(() => seo.value.description);
const metaUrl = computed(() => seo.value.url);
const metaImg = computed(() => seo.value.image);

// Address, phone and opening hours for search engines
const businessJsonLd = computed(() => (bioPage.value ? localBusinessJsonLd(bioPage.value, bioPage.value.username, props.domain) : null));
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
    showBranding: p.showBranding,
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

// Pages in 3D mode open as a room, and visitors can switch to the 2D page;
// pages in 2D mode can offer the room with a "3D room" button (roomButton)
const room = computed<RoomConfig | null>(() => {
  const theme = bioPage.value?.themeConfig;
  if (theme?.pageMode === "3d") return normalizeRoom(theme.room);
  return theme?.roomButton && theme.room ? normalizeRoom(theme.room) : null;
});
const show2d = ref(bioPage.value?.themeConfig?.pageMode !== "3d");

// The 3D room's loader stays until the viewer is mounted and the loader has
// finished its intro (the pearl on the floor)
const roomLoading = ref(true);
function onViewerMounted() {
  setTimeout(() => (roomLoading.value = false), loaderWaitMs());
}

// Bio page view tracking is now handled server-side in /api/bio/[username].get.ts
</script>
