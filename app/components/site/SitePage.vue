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

      <Link v-if="!error" rel="canonical" :href="metaUrl" />
      <!-- An address nobody uses, or a private site: not for search results -->
      <Meta v-if="error || gate?.kind === 'password' || bioPage?.indexable === false" name="robots" content="noindex" />
      <!-- Google Search Console ownership check (paid plans) -->
      <Meta v-if="tracking?.gsc" name="google-site-verification" :content="tracking.gsc" />
      <Meta name="mobile-web-app-capable" content="yes" />
      <Meta name="apple-mobile-web-app-title" content="Perlink" />
      <Meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <Meta name="theme-color" content="#000000" />

      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:site" content="@perlinkto" />
      <Meta name="twitter:title" :content="metaTitle" />
      <Meta name="twitter:description" :content="metaDesc" />
      <Meta name="twitter:image" :content="metaImg" />
      <Meta property="profile:username" :content="bioPage?.username" />
    </Head>
    <div
      v-if="bioPage?.adminPreview"
      class="pointer-events-none fixed inset-x-0 top-3 z-[100] flex justify-center px-4"
    >
      <span class="rounded-full bg-amber-400 px-3 py-1 text-xs font-semibold text-black shadow-lg">
        Draft · not published · visible to superadmin only
      </span>
    </div>

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

      <!-- Missing: an invitation to claim the address -->
      <LazySiteNotFound v-else-if="error" :name="username" />

      <!-- Private: a password, or a countdown to the opening time -->
      <LazySiteGate
        v-else-if="bioPage && gate"
        :username="bioPage.username"
        :title="bioPage.title || bioPage.username"
        :avatar-url="bioPage.avatarUrl"
        :lang="siteLang"
        :gate="gate"
        :colors="bioPage.themeConfig?.colors"
      />

      <!-- 3D room. The loader covers it from the first paint (it's in the
           server HTML) until the viewer has mounted and the loader's intro
           has played out. The room is drawn in the browser only, so the
           page's name and intro are also in the HTML as text, for search
           engines and screen readers -->
      <template v-else-if="bioPage && room && !show2d">
      <div class="sr-only">
        <h1>{{ bioPage.title || bioPage.username }}</h1>
        <p v-if="bioPage.bio">{{ bioPage.bio }}</p>
      </div>
      <ClientOnly>
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
      </template>

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
        @click="open3d"
      />
      <!-- The 3D room's loader (outside the branches above, so it can fade
           out over the room) -->
      <Transition leave-active-class="transition-opacity duration-300" leave-to-class="opacity-0">
        <RoomLoadingShell v-if="!pending && !error && bioPage && room && !show2d && roomLoading" progress />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, BioData, ThemeConfig } from "~/types/bio";
import { cleanTracking } from "#shared/tracking";
import { DEFAULT_THEME } from "~/types/bio";
import { normalizeRoom, type RoomConfig } from "~/types/room";
import { resetRoomLoadStep } from "~/utils/room/loadProgress";
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
  /** False for thin or untouched-template sites: noindex (server/utils/siteIndexing) */
  indexable?: boolean;
  /** A draft shown to the superadmin (not published, nobody else sees it) */
  adminPreview?: boolean;
  /** Set when the site is private right now: only name, photo and colours come with it */
  gate?: { kind: "password" } | { kind: "schedule"; opensAt: string };
}

const username = props.username;

const { data, pending, error } = await useFetch<{ bioPage: ApiBioPage }>(
  `/api/bio/${username}`,
  { key: `bio-${username}`, server: true },
);

const bioPage = computed(() => data.value?.bioPage);
const gate = computed(() => bioPage.value?.gate);

// Owner's own title/description/image, or sensible defaults (utils/siteSeo)
const seo = computed(() => siteSeo(bioPage.value ?? {}, bioPage.value?.username ?? username, props.domain));
const metaTitle = computed(() => (error.value ? "Page not found — Perlink" : seo.value.title));
const metaDesc = computed(() =>
  error.value ? "This Perlink address isn't in use yet. Claim it for your own link in bio page or personal website." : seo.value.description,
);

// No such site (or not published): a real 404, not a "not found" page sent
// as 200 that search engines would index as a page of its own
if (import.meta.server && error.value) {
  const event = useRequestEvent();
  if (event) setResponseStatus(event, 404);
}
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
// Back from the 2D page: the room is built again, so the loader shows again
function open3d() {
  resetRoomLoadStep();
  roomLoading.value = true;
  show2d.value = false;
}
function onViewerMounted() {
  setTimeout(() => (roomLoading.value = false), loaderWaitMs());
}

// Opened as the 2D page: once the browser is idle, fetch the 3D viewer's
// code (three.js and the room), so tapping "3D room" doesn't wait for the
// download on top of building the room
onMounted(() => {
  if (!room.value || !show2d.value) return;
  const prefetch = () => import("~/components/room/RoomViewer.vue").catch(() => {});
  const idle = (window as Window & { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
  if (idle) idle(prefetch, { timeout: 4000 });
  else setTimeout(prefetch, 2500);
});

// Bio page view tracking is now handled server-side in /api/bio/[username].get.ts

// The owner's pixels and Google Analytics (paid plans). The server only sends
// IDs in each provider's format, and they're checked again here, so the
// snippets below never carry anything else
const tracking = computed(() => (gate.value ? null : cleanTracking(bioPage.value?.themeConfig?.tracking)));
useHead({
  script: computed(() => {
    const t = tracking.value;
    if (!t) return [];
    const tags: { key: string; src?: string; async?: boolean; innerHTML?: string }[] = [];
    if (t.ga4) {
      tags.push({ key: "ga4-src", src: `https://www.googletagmanager.com/gtag/js?id=${t.ga4}`, async: true });
      tags.push({ key: "ga4", innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${t.ga4}');` });
    }
    if (t.metaPixel) {
      tags.push({ key: "meta-pixel", innerHTML: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${t.metaPixel}');fbq('track','PageView');` });
    }
    if (t.tiktokPixel) {
      tags.push({ key: "tiktok-pixel", innerHTML: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${t.tiktokPixel}');ttq.page()}(window,document,'ttq');` });
    }
    return tags;
  }),
});
</script>
