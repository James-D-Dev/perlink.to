<template>
  <!-- Default text color matches the light site, so previews inside the dark dashboard read the same -->
  <div class="min-h-full relative" :style="[{ color: '#334155' }, pageStyle]">
    <!-- Share Button (Fixed Top Right) -->
    <UButton
      v-if="theme.showShare"
      @click="sharePage"
      class="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200"
:aria-label="siteT(siteLang, 'sharePage')"
      variant="soft"
    >
      <UIcon name="i-uil-share" class="w-5 h-5 text-gray-700" />
    </UButton>

    <!-- Background layer (separate element so backdrop-filter on cards works) -->
    <!-- <div class="absolute inset-0" :style="bgLayerStyle" /> -->
    <!-- Video background -->
    <video
      v-if="theme.background.type === 'video' && theme.background.videoUrl"
      :src="theme.background.videoUrl"
      class="fixed inset-0 w-full h-full object-cover"
      autoplay
      loop
      muted
      playsinline
    />
    <!-- Effect background -->
    <component
      :is="bgEffectComponent"
      v-if="theme.background.type === 'effect' && bgEffectComponent"
      class="fixed inset-0 w-full h-full"
      :class="getEffectBgClass(theme.background.effectId)"
    />
    <div
      class="relative z-10 max-w-md md:max-w-xl mx-auto"
      :style="{ paddingTop: headerSpacing, paddingBottom: headerSpacing }"
    >
      <!-- Header -->
      <div id="header-block">
        <!-- layout: cover — full-width avatar with gradient overlay -->
      <template v-if="headerLayout === 'cover'">
        <div
          class="relative w-full mb-6"
          style="margin-top: calc(-1 * var(--header-pt, 0px))"
        >
          <img
            :src="avatarSrc"
            :alt="bioData.title || username"
            class="w-full object-cover"
            style="height: 480px"
            @error="onAvatarError"
          />
          <div
            class="absolute inset-0"
            :style="{
              background: `linear-gradient(to top, ${pageStyle.backgroundColor} 0%, transparent 40%, transparent 100%)`,
            }"
          />
          <div
            class="absolute bottom-0 left-0 right-0 flex flex-col items-center"
          >
            <h1 :style="{ ...nameStyle, textAlign: 'center' }" class="mb-1">
              {{ bioData.title || username }}
            </h1>
          </div>
        </div>
      </template>

      <!-- layout: banner-circle / banner-square — banner + overlapping avatar -->
      <template
        v-else-if="
          headerLayout === 'banner-circle' || headerLayout === 'banner-square'
        "
      >
        <div
          class="relative w-full"
          style="aspect-ratio: 2/1; background: rgba(0, 0, 0, 0.68)"
        >
          <img
            v-if="theme.header?.bannerUrl"
            :src="theme.header.bannerUrl"
            alt="Banner"
            class="absolute inset-0 w-full h-full object-cover"
          />
          <div
            class="absolute bottom-0 left-1/2 translate-x-[-50%] translate-y-[50%]"
          >
            <img
              :src="avatarSrc"
              :alt="bioData.title || username"
              :style="{
                ...avatarStyle,
                borderRadius:
                  headerLayout === 'banner-circle' ? '9999px' : '8px',
              }"
              :class="avatarAppearClasses"
              class="cursor-pointer border-4"
              style="border-color: rgba(255, 255, 255, 0.85)"
              @mouseenter="onAvatarMouseEnter"
              @mouseleave="onAvatarMouseLeave"
              @error="onAvatarError"
            />
          </div>
        </div>
        <div
          class="relative flex flex-col items-center mb-4"
          :style="{
            paddingTop: avatarStyle.width
              ? 'calc(' + avatarStyle.width + ' / 2 + 12px)'
              : '56px',
          }"
        >
          <h1 :style="{ ...nameStyle, textAlign: 'center' }" class="mb-2">
            {{ bioData.title || username }}
          </h1>
        </div>
      </template>

      <!-- layout: image-overlay — square avatar with name overlaid in center -->
      <template v-else-if="headerLayout === 'image-overlay'">
        <div class="relative px-4">
          <div
            class="relative w-full mb-6 overflow-hidden"
            :style="{ borderRadius: '8px' }"
          >
            <img
              :src="avatarSrc"
              :alt="bioData.title || username"
              class="w-full object-cover"
              style="aspect-ratio: 1/1"
              @error="onAvatarError"
            />
            <div
              class="absolute inset-0 flex flex-col items-center justify-center"
              style="background: rgba(0, 0, 0, 0.35)"
            >
              <h1 :style="{ ...nameStyle, textAlign: 'center' }" class="mb-1">
                {{ bioData.title || username }}
              </h1>
            </div>
          </div>
        </div>
      </template>

      <!-- layout: left — avatar + name in a row -->
      <template v-else-if="headerLayout === 'left'">
        <div class="flex flex-row items-center gap-3 mb-6 px-4">
          <img
            :src="avatarSrc"
            :alt="bioData.title || username"
            :style="avatarStyle"
            :class="avatarAppearClasses"
            class="cursor-pointer shrink-0"
            @mouseenter="onAvatarMouseEnter"
            @mouseleave="onAvatarMouseLeave"
            @error="onAvatarError"
          />
          <div class="flex flex-col min-w-0">
            <h1 :style="{ ...nameStyle, textAlign: 'left' }" class="mb-1">
              {{ bioData.title || username }}
            </h1>
          </div>
        </div>
      </template>

      <!-- layout: centered (default) -->
      <template v-else>
        <div
          class="mb-6 flex flex-col items-center"
          :style="{
            alignItems:
              headerAlignment === 'left'
                ? 'flex-start'
                : headerAlignment === 'right'
                  ? 'flex-end'
                  : 'center',
          }"
        >
          <img
            :src="avatarSrc"
            :alt="bioData.title || username"
            :style="avatarStyle"
            :class="avatarAppearClasses"
            class="mb-4 cursor-pointer"
            @mouseenter="onAvatarMouseEnter"
            @mouseleave="onAvatarMouseLeave"
            @error="onAvatarError"
          />
          <h1
            :style="{ ...nameStyle, textAlign: headerAlignment }"
            class="mb-2"
          >
            {{ bioData.title || username }}
          </h1>
        </div>
      </template>

      <p
        v-if="bioData.bio"
        :style="{
          ...paragraphStyle,
          textAlign: bioAlign,
          opacity: '0.8',
        }"
        class="leading-relaxed text-sm px-4 mb-6"
        :class="bioAlign === 'center' ? 'mx-auto max-w-sm' : 'max-w-md'"
      >
        {{ bioData.bio }}
      </p>
      </div>

      <!-- Blocks, evenly spaced -->
      <div class="flex flex-col px-4" :style="{ gap: blockGap }">
        <template v-for="block in sortedBlocks" :key="block.id ?? block.name">
          <!-- Social Links Block -->
          <BioSocialLinks
            v-if="block.name === 'social' && socialsOf(block).length > 0"
            :id="blockDomId(block)"
            :socials="socialsOf(block)"
            :social-button-style="socialButtonStyle"
            :monochrome="theme.social?.style !== 'soft'"
            :align="bioAlign === 'left' ? 'left' : 'center'"
            :card-appear-classes="cardAppearClasses"
            :card-hover-classes="cardHoverClasses"
            :username="username"
            :mode="mode"
          />

          <!-- Links Block -->
          <section v-if="block.name === 'links' && linksOf(block).length" :id="blockDomId(block)">
            <h2 v-if="block.data?.title" class="mb-3 text-[17px]" :style="headingStyle">{{ block.data.title }}</h2>
            <div class="space-y-2.5">
              <BioLinkCard
                v-for="(link, index) in linksOf(block)"
                :key="link.id"
                :link="link"
                :animation-delay="`${index * 80}ms`"
                :layout="linkLayout"
                :card-style="cardStyle"
                :transparency="cardTransparency"
                :button-style="buttonStyle"
                :card-appear-classes="cardAppearClasses"
                :card-hover-classes="cardHoverClasses"
                :button-appear-classes="buttonAppearClasses"
                :button-hover-classes="buttonHoverClasses"
                :username="username"
                :mode="mode"
              />
            </div>
          </section>

          <!-- Text Block -->
          <section
            v-if="block.name === 'text' && (block.data?.content || block.data?.title)"
:id="blockDomId(block)"
            :class="block.data.style === 'card' && 'p-5'"
            :style="[{ textAlign: block.data.align || 'left' }, block.data.style === 'card' ? cardStyle : {}]"
          >
            <h2 v-if="block.data.title" class="mb-2 text-[17px]" :style="{ ...headingStyle, textAlign: block.data.align || 'left' }">{{ block.data.title }}</h2>
            <p v-if="block.data.content" class="whitespace-pre-line text-[15px] leading-relaxed opacity-85">{{ block.data.content }}</p>
          </section>

          <!-- Image Album Block -->
          <section v-if="block.name === 'image-album' && block.data?.images?.length" :id="blockDomId(block)">
            <h2 v-if="block.data?.title" class="mb-3 text-[17px]" :style="headingStyle">{{ block.data.title }}</h2>
            <BioImageAlbum
              :data="{ images: block.data.images, layout: block.data.layout || 'vertical' } as any"
              :radius="cardStyle.borderRadius"
            />
          </section>

          <!-- VietQR Block -->
          <div
            v-if="block.name === 'vietqr' && block.data?.qrString"
            :id="blockDomId(block)"
            class="flex flex-col items-center gap-4"
          >
            <ClientOnly>
              <QRCodeWithTheme
                :qr-string="block.data.qrString"
                :bank-name="block.data.bankName"
                :account-number="block.data.accountNumber"
                :account-name="block.data.accountName"
                :amount="parseFloat(block.data.amount || '0')"
                :theme-id="block.data.theme || 'vietnam'"
                class="w-full"
              />
            </ClientOnly>
          </div>
          <!-- Birthday Countdown Block -->
          <BioBlockBirthdayCountdownDisplay
            v-if="block.name === 'birthday-countdown' && block.data?.birthDate"
            :id="blockDomId(block)"
            :data="block.data"
          />
          <!-- Menu Block -->
          <BioMenuDisplay
            v-if="block.name === 'menu' && block.data?.sections?.length"
:id="blockDomId(block)"
            :data="block.data"
            :card-style="cardStyle"
            :heading-style="headingStyle"
          />
          <!-- Opening Hours Block -->
          <BioHoursDisplay
            v-if="block.name === 'hours' && block.data?.days?.length"
:id="blockDomId(block)"
            :data="block.data"
            :card-style="cardStyle"
            :heading-style="headingStyle"
          />
          <!-- Contact Block -->
          <BioContactDisplay
            v-if="block.name === 'contact' && (block.data?.address || block.data?.phone || block.data?.email || block.data?.bookingUrl)"
:id="blockDomId(block)"
            :data="block.data"
            :card-style="cardStyle"
            :button-style="buttonStyle"
            :heading-style="headingStyle"
          />
          <!-- more block -->
        </template>
      </div>

      <!-- Footer -->
      <div v-if="mode !== 'preview'" class="mt-14 flex justify-center px-4">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 rounded-full bg-white/90 py-2 pl-3 pr-4 text-xs font-medium text-[#0c0b0a] shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:bg-white"
        >
          <AppLogo variant="mark" :size="16" />
          {{ siteT(siteLang, 'madeWith') }}
        </NuxtLink>
      </div>

      <!-- Quick contact buttons, stuck to the bottom of the screen -->
      <div v-if="quickActions.length" class="sticky bottom-0 z-40 mt-8 px-4 pb-4 pt-2">
        <div class="mx-auto flex max-w-md gap-2 rounded-2xl bg-white/85 p-1.5 shadow-lg ring-1 ring-black/5 backdrop-blur">
          <a
            v-for="action in quickActions"
            :key="action.key"
            :href="action.href"
            :target="action.external ? '_blank' : undefined"
            :rel="action.external ? 'noopener noreferrer' : undefined"
            class="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-[11px] font-medium transition active:scale-95"
            :style="action.primary ? buttonStyle : { color: '#0c0b0a' }"
          >
            <UIcon :name="action.icon" class="size-5" />
            <span class="truncate">{{ action.label }}</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch, onMounted } from "vue";
import type { BioData, BioLink, SocialLink, ThemeConfig, BioBlock } from "~/types/bio";
import { SOCIAL_PROVIDERS } from "~/types/bio";
import { useBioTheme } from "~/composables/useBioTheme";
import { getEffectBgClass } from "~/utils/effectUtils";
import { useGoogleFonts } from "~/composables/useGoogleFonts";

const bgEffectMap: Record<string, ReturnType<typeof defineAsyncComponent>> = {
  particles: defineAsyncComponent(
    () => import("~/components/background-effects/ParticlesBg.vue"),
  ),
  "falling-stars": defineAsyncComponent(
    () => import("~/components/background-effects/FallingStarsBg.vue"),
  ),
  stars: defineAsyncComponent(
    () => import("~/components/background-effects/StarsBackground.vue"),
  ),
  snow: defineAsyncComponent(
    () => import("~/components/background-effects/SnowfallBg.vue"),
  ),
  "flickering-grid": defineAsyncComponent(
    () => import("~/components/background-effects/FlickeringGrid.vue"),
  ),
  "interactive-grid": defineAsyncComponent(
    () => import("~/components/background-effects/InteractiveGridPattern.vue"),
  ),
  neural: defineAsyncComponent(
    () => import("~/components/background-effects/NeuralBg.vue"),
  ),
  silk: defineAsyncComponent(
    () => import("~/components/background-effects/SilkBackground.vue"),
  ),
  "black-hole": defineAsyncComponent(
    () => import("~/components/background-effects/BlackHoleBackground.vue"),
  ),
  thunderstorm: defineAsyncComponent(
    () => import("~/components/background-effects/ThunderstormBackground.vue"),
  ),
  rose: defineAsyncComponent(
    () => import("~/components/background-effects/RosefallBg.vue"),
  ),
};

const props = defineProps<{
  bioData: BioData;
  username: string;
  themeOverride?: Partial<ThemeConfig>;
  mode: string;
}>();

const themeSource = computed(
  () => props.themeOverride ?? props.bioData?.themeConfig,
);

const {
  theme,
  bgLayerStyle,
  pageStyle,
  cardStyle,
  cardTransparency,
  buttonStyle,
  linkLayout,
  headerAlignment,
  headerSpacing,
  headerLayout,
  avatarStyle,
  nameStyle,
  headingStyle,
  blockGap,
  paragraphStyle,
  socialButtonStyle,
  cardAppearClasses,
  cardHoverClasses,
  buttonAppearClasses,
  buttonHoverClasses,
  avatarAppearClasses,
  avatarHoverClasses,
} = useBioTheme(themeSource);

// Words visitors see follow the site's language
const siteLang = computed(() => normalizeSiteLanguage(theme.value.language));
provide(SITE_LANG_KEY, siteLang);

// The bio follows the header: left-aligned next to a left avatar
const bioAlign = computed(() =>
  headerLayout.value === 'left' ? 'left' : headerLayout.value === 'centered' ? headerAlignment.value : 'center',
);

const bgEffectComponent = computed(() => {
  if (theme.value.background.type !== "effect") return null;
  const id = theme.value.background.effectId;
  return id ? (bgEffectMap[id] ?? null) : null;
});

function onAvatarMouseEnter(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement;
  if (!avatarHoverClasses.value.length) return;
  el.classList.add(...avatarHoverClasses.value);
  const handler = () => {
    el.classList.remove(...avatarHoverClasses.value);
    el.removeEventListener("animationend", handler);
  };
  el.addEventListener("animationend", handler);
}

function onAvatarMouseLeave(e: MouseEvent) {
  const el = e.currentTarget as HTMLElement;
  el.classList.remove(...avatarHoverClasses.value);
}

// Without a photo, show the first letter of the name in the theme's colours
// (the stock avatar clashes with most themes)
const placeholderAvatar = computed(() => {
  const t = theme.value;
  const bg = t.card.backgroundColor || t.colors.secondary || "#f3f4f6";
  const fg = t.header.textColor || t.colors.primary || "#111827";
  // Images can't use the page's web fonts, so pick a matching system family
  const family = t.header.fontFamily || t.typography.nameFont || "";
  const font = /serif/.test(family) && !/sans-serif/.test(family) ? "Georgia, serif" : "Helvetica, Arial, sans-serif";
  const initial = Array.from((props.bioData.title || props.username || "?").trim())[0]?.toUpperCase() || "?";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice"><rect width="200" height="200" fill="${bg}"/><text x="100" y="100" dy="0.35em" text-anchor="middle" font-family="${font}" font-size="88" font-weight="${t.header.fontWeight || 500}" fill="${fg}">${initial.replace(/[<>&"']/g, "")}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
});

const avatarFailed = ref(false);
const avatarSrc = computed(() =>
  props.bioData.avatarUrl && !avatarFailed.value ? props.bioData.avatarUrl : placeholderAvatar.value,
);

watch(
  () => props.bioData.avatarUrl,
  () => {
    avatarFailed.value = false;
  },
);

function onAvatarError() {
  avatarFailed.value = true;
}

const avatarFallbackStyle = computed(() => ({
  ...avatarStyle.value,
  backgroundColor: "#f3f4f6",
}));

// Previews (editor, template thumbnails) also show items that still need a
// URL, so a fresh template looks complete; the public page hides them
const isPreview = computed(() => props.mode === "preview");

// Each block renders from its own data, so a page can hold several of one type
function linksOf(block: BioBlock): BioLink[] {
  if (block.name !== "links") return [];
  return (block.data?.items ?? [])
    .filter((l) => l.isActive && l.title && (l.url || isPreview.value))
    .map((l) => (l.url ? l : { ...l, url: "#" }))
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

function socialsOf(block: BioBlock): SocialLink[] {
  if (block.name !== "social") return [];
  return (block.data?.links ?? [])
    .filter((s) => s.url?.trim() || isPreview.value)
    .sort((a, b) => (a.index || 0) - (b.index || 0));
}

// Sticky Call / Directions / chat buttons, switched on in the contact block
const quickActions = computed(() => {
  const contact = sortedBlocks.value.find((b) => b.name === "contact" && b.data?.quickBar);
  if (!contact || contact.name !== "contact") return [];
  const data = contact.data;
  const actions: { key: string; label: string; icon: string; href: string; external: boolean; primary?: boolean }[] = [];
  if (data.phone) {
    actions.push({ key: "call", label: siteT(siteLang.value, "call"), icon: "i-lucide-phone", href: `tel:${data.phone.replace(/\s+/g, "")}`, external: false, primary: true });
  }
  const map = contactMapHref(data);
  if (map) actions.push({ key: "map", label: siteT(siteLang.value, "directions"), icon: "i-lucide-navigation", href: map, external: true });
  // Chat apps from the social icons block
  const socials = sortedBlocks.value.flatMap((b) => (b.name === "social" ? b.data?.links ?? [] : []));
  const chats = [
    { provider: "zalo", label: "Zalo", icon: "i-lucide-message-circle" },
    { provider: "whatsapp", label: "WhatsApp", icon: "i-simple-icons-whatsapp" },
    { provider: "telegram", label: "Telegram", icon: "i-simple-icons-telegram" },
  ];
  for (const chat of chats) {
    const social = socials.find((s) => s.provider === chat.provider && s.url?.trim());
    if (!social) continue;
    const prefix = SOCIAL_PROVIDERS.find((p) => p.key === chat.provider)?.prefix;
    const href = prefix && !/^https?:/i.test(social.url) ? prefix + social.url : safeWebUrl(social.url);
    actions.push({ key: chat.provider, label: chat.label, icon: chat.icon, href, external: true });
  }
  if (data.bookingUrl) {
    actions.push({ key: "book", label: data.bookingLabel || siteT(siteLang.value, "bookNow"), icon: "i-lucide-calendar-check", href: safeWebUrl(data.bookingUrl), external: true, primary: !data.phone });
  }
  return actions.slice(0, 4);
});

// DOM id the editor scrolls the preview to
function blockDomId(block: BioBlock) {
  return `block-${block.id ?? block.name}`;
}

// Sort blocks by index for rendering
const sortedBlocks = computed(() => {
  return (props.bioData?.blocks || []).sort((a, b) => (a.index || 0) - (b.index || 0)).filter((item)=>!item.hidden);
});

// Share page function
async function sharePage() {
  const url = `${window.location.origin}/${props.username}`;
  const title = props.bioData.title || `${props.username}'s Bio Page`;

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        url,
      });
    } catch (err) {
      // User cancelled or share failed
      console.log("Share cancelled:", err);
    }
  } else {
    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(url);
      // Could add toast notification here
      useToast().add({ title: siteT(siteLang.value, "linkCopied") });
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }
}

// Preload Google Fonts
const { preloadBioFonts } = useGoogleFonts();
onMounted(() => {
  preloadBioFonts();
});
</script>
