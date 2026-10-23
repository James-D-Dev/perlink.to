<template>
  <!-- Default text color matches the light site, so previews inside the dark dashboard read the same -->
  <div class="min-h-full relative" :style="[{ color: '#334155' }, pageStyle]">
    <!-- Share Button (Fixed Top Right) -->
    <UButton
      v-if="theme.showShare"
      @click="sharePage"
      class="fixed top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200"
      aria-label="Share page"
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
          textAlign: 'center',
          opacity: '0.8',
        }"
        class="leading-relaxed max-w-sm text-sm px-4 mx-auto mb-4"
      >
        {{ bioData.bio }}
      </p>
      </div>

      <!-- Render blocks dynamically -->
      <template v-for="block in sortedBlocks" :key="block.name">
        <!-- Social Links Block -->
        <BioSocialLinks
          v-if="block.name === 'social' && activeSocials.length > 0"
          :socials="activeSocials"
          :social-button-style="socialButtonStyle"
          :card-appear-classes="cardAppearClasses"
          :card-hover-classes="cardHoverClasses"
          :username="username"
          :mode="mode"
        />

        <!-- Links Block -->
        <div v-if="block.name === 'links'" id="links-block" class="px-4">
          <div class="space-y-3">
            <BioLinkCard
              v-for="(link, index) in activeLinks"
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
        </div>

        <!-- Image Album Block -->
        <BioImageAlbum
          v-if="block.name === 'image-album' && albumImages.length > 0"
          id="image-album-block"
          :data="{ images: albumImages, layout: albumLayout } as any"
          class="my-4 px-4"
        />

        <!-- VietQR Block -->
        <div
          v-if="block.name === 'vietqr' && vietQRData?.qrString"
          id="vietqr-block"
          class="flex flex-col items-center gap-4 my-4 px-4"
        >
          <ClientOnly>
            <QRCodeWithTheme
              :qr-string="vietQRData.qrString"
              :bank-name="vietQRData.bankName"
              :account-number="vietQRData.accountNumber"
              :account-name="vietQRData.accountName"
              :amount="parseFloat(vietQRData.amount || '0')"
              :theme-id="vietQRData.theme || 'vietnam'"
              class="w-full"
            />
          </ClientOnly>
        </div>
        <!-- Birthday Countdown Block -->
        <BioBlockBirthdayCountdownDisplay
          v-if="block.name === 'birthday-countdown' && birthdayCountdownData?.birthDate"
          id="birthday-countdown-block"
          :data="birthdayCountdownData"
          class="my-4 px-4"
        />
        <!-- Menu Block -->
        <BioMenuDisplay
          v-if="block.name === 'menu' && block.data?.sections?.length"
          id="menu-block"
          :data="block.data"
          :card-style="cardStyle"
          :heading-color="nameStyle.color"
          class="my-6 px-4"
        />
        <!-- Opening Hours Block -->
        <BioHoursDisplay
          v-if="block.name === 'hours' && block.data?.days?.length"
          id="hours-block"
          :data="block.data"
          :card-style="cardStyle"
          class="mx-4 my-4"
        />
        <!-- Contact Block -->
        <BioContactDisplay
          v-if="block.name === 'contact' && (block.data?.address || block.data?.phone || block.data?.email || block.data?.bookingUrl)"
          id="contact-block"
          :data="block.data"
          :card-style="cardStyle"
          :button-style="buttonStyle"
          class="mx-4 my-4"
        />
        <!-- more block -->
      </template>

      <!-- Footer -->
      <div v-if="mode !== 'preview'" class="text-center mt-12 px-3">
        <NuxtLink to="/" class="">
         <UCard variant="solid" color="neutral" class="bg-white"
         :ui="{
          body: '!p-3'
         }"
         >
         <div class="flex items-center">
           <img src="/logo-full.png" class="h-6" alt="Perlink.to" />
           <div class="flex-1"></div>
           <span class="text-xs text-black font-medium">Create your Perlink</span>

           <UIcon name="lucide:arrow-right" class="ml-2 text-black" />
         </div>
         </UCard>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, watch, onMounted, toRef } from "vue";
import avatarDefault from "~/assets/images/avatar-default-1.jpg";
import type { BioData, BioLink, SocialLink, ThemeConfig, BioBlock } from "~/types/bio";
import { useBioTheme } from "~/composables/useBioTheme";
import { getEffectBgClass } from "~/utils/effectUtils";
import { useGoogleFonts } from "~/composables/useGoogleFonts";
import { useBioBlock } from "~/composables/useBioBlock";

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
  paragraphStyle,
  socialButtonStyle,
  cardAppearClasses,
  cardHoverClasses,
  buttonAppearClasses,
  buttonHoverClasses,
  avatarAppearClasses,
  avatarHoverClasses,
} = useBioTheme(themeSource);

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

const avatarSrc = ref(props.bioData.avatarUrl || avatarDefault);

watch(
  () => props.bioData.avatarUrl,
  (val) => {
    avatarSrc.value = val || avatarDefault;
  },
);

function onAvatarError() {
  avatarSrc.value = avatarDefault;
}

const avatarFallbackStyle = computed(() => ({
  ...avatarStyle.value,
  backgroundColor: "#f3f4f6",
}));

// Use composable to extract data from blocks
const blocksRef = toRef(props.bioData, 'blocks');
const { links, socialLinks, albumImages, albumLayout, vietQRData, birthdayCountdownData } = useBioBlock({ blocks: blocksRef });

const activeLinks = computed<BioLink[]>(
  () =>
    links.value
      ?.filter((l) => l.isActive && l.title && l.url)
      .sort((a, b) => (a.order || 0) - (b.order || 0)) ?? [],
);

const activeSocials = computed(() => {
  return socialLinks.value
    .filter((s) => s.url && s.url.trim())
    .sort((a, b) => (a.index || 0) - (b.index || 0));
});

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
      alert("Link copied to clipboard!");
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
