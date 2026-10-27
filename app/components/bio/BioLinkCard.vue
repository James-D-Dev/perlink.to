<template>
  <!-- Appear wrapper -->
  <div
    ref="cardRef"
    class="w-full overflow-hidden"
    :class="[...cardAppearClasses, {}]"
    :style="{
      'animation-delay': animationDelay,
      backdropFilter: cardStyle.backdropFilter,
      borderRadius: cardStyle.borderRadius,
      boxShadow: cardStyle.boxShadow,
      border: cardStyle.border,
      color: cardStyle.color,
    }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <!-- Hover wrapper -->
    <a
    
      :href="link.url"
      target="_blank"
      rel="noopener noreferrer"
      class="block w-full relative"
      @click="trackClick"
   
    >
      <div :style="{ backgroundColor: cardStyle.backgroundColor }">
        <!-- Content layer: VERTICAL -->
        <div v-if="layout === 'vertical'" class="relative">
          <div class="w-full h-28 overflow-hidden flex items-center justify-center">
            <UIcon
              :name="getIconForLink(link)"
              class="w-12 h-12"
              :style="{ color: cardStyle.color }"
            />
          </div>
          <div class="px-4 py-3 flex items-center gap-3">
            <div class="flex-1 min-w-0 text-center">
              <p class="font-medium truncate">{{ link.title }}</p>
              <p
                v-if="link.subtitle"
                class="text-sm opacity-70 truncate mt-0.5"
              >
                {{ link.subtitle }}
              </p>
            </div>
          </div>
        </div>

        <!-- Content layer: CENTERED (text only) -->
        <div v-else-if="layout === 'centered'" class="relative flex min-h-14 items-center justify-center px-12 py-3.5 text-center">
          <div class="min-w-0">
            <p class="font-medium truncate">{{ link.title }}</p>
            <p v-if="link.subtitle" class="text-sm opacity-70 truncate mt-0.5">{{ link.subtitle }}</p>
          </div>
          <UIcon name="i-lucide-arrow-up-right" class="absolute right-4 size-4 opacity-40" />
        </div>

        <!-- Content layer: HORIZONTAL (icon left or right) -->
        <div
          v-else
          class="relative flex items-stretch"
          :class="
            layout === 'horizontal-right' ? 'flex-row-reverse' : 'flex-row'
          "
        >
          <div class="w-20 shrink-0 overflow-hidden flex items-center justify-center">
            <UIcon
              :name="getIconForLink(link)"
              class="w-10 h-10"
              :style="{ color: cardStyle.color }"
            />
          </div>
          <div class="flex-1 py-3 flex items-center gap-3 min-w-0"
          :class="layout === 'horizontal-right' ? 'pl-4' : 'pr-4'"
          >
            <div
              class="flex-1 min-w-0"
              :class="
                layout === 'horizontal-right' ? 'text-right' : 'text-left'
              "
            >
              <p class="font-medium truncate">{{ link.title }}</p>
              <p
                v-if="link.subtitle"
                class="text-sm opacity-70 truncate mt-0.5"
              >
                {{ link.subtitle }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { BioLink, LinkCardLayout } from "~/types/bio";

const cardRef = ref<HTMLElement | null>(null);

const props = defineProps<{
  link: BioLink;
  layout?: LinkCardLayout;
  animationDelay?: string;
  username: string;
  cardStyle: {
    borderRadius: string;
    boxShadow: string;
    border: string;
    backgroundColor: string;
    backdropFilter?: string;
    color?: string;
    borderColor?: string;
  };
  transparency: number;
  buttonStyle: Record<string, string>;
  cardAppearClasses: string[];
  cardHoverClasses: string[];
  buttonAppearClasses: string[];
  buttonHoverClasses: string[];
  mode: string
}>();

function applyHoverAnimation(el: HTMLElement, classes: string[]) {
  if (!classes.length) return;
  const hoverClasses = classes.filter((c) => c !== "animate__animated");
  el.classList.remove("animate__animated", ...hoverClasses, ...props.cardAppearClasses);
  void el.offsetWidth;
  el.classList.add("animate__animated", ...hoverClasses);
  const handler = () => {
    el.classList.remove("animate__animated", ...hoverClasses, ...props.cardAppearClasses);
    el.removeEventListener("animationend", handler);
  };
  el.addEventListener("animationend", handler);
}

function onMouseEnter() {
  if (cardRef.value) applyHoverAnimation(cardRef.value, props.cardHoverClasses);
}

function onMouseLeave() {}

// Icon mapping
const urlIconMap: Record<string, string> = {
  'facebook.com': 'facebook',
  'fb.com': 'facebook',
  'twitter.com': 'twitter',
  'x.com': 'twitter',
  'instagram.com': 'instagram',
  'linkedin.com': 'linkedin',
  'youtube.com': 'youtube',
  'youtu.be': 'youtube',
  'tiktok.com': 'tiktok',
};

const iconToUiIcon: Record<string, string> = {
  'facebook': 'i-fa-facebook',
  'twitter': 'i-prime-twitter',
  'instagram': 'i-fa-instagram',
  'linkedin': 'i-fa-linkedin',
  'youtube': 'i-fa-youtube-play',
  'tiktok': 'i-prime-tiktok',
  'globe': 'i-prime-globe',
};

const iconColorClasses: Record<string, string> = {
  'facebook': 'text-blue-600',
  'twitter': 'text-sky-500',
  'instagram': 'text-pink-600',
  'linkedin': 'text-blue-700',
  'youtube': 'text-red-600',
  'tiktok': 'text-black',
  'globe': 'text-gray-600',
};

function detectIconFromUrl(url: string): string {
  const lowerUrl = url.toLowerCase();
  for (const [domain, icon] of Object.entries(urlIconMap)) {
    if (lowerUrl.includes(domain)) {
      return icon;
    }
  }
  return 'globe';
}

function getIconForLink(link: BioLink): string {
  const iconId = link.icon;
  if (iconId && iconToUiIcon[iconId]) {
    return iconToUiIcon[iconId];
  }
  const detected = detectIconFromUrl(link.url);
  return iconToUiIcon[detected] ?? 'i-lucide-link';
}

function getIconColorClass(iconId?: string): string {
  if (iconId && iconColorClasses[iconId]) {
    return iconColorClasses[iconId];
  }
  return 'text-gray-500';
}

// Track bio link click (simple count only)
const trackClick = async () => {
  if (!props.username || !props.link.id) return;
  if (props.mode === 'preview' || props.mode === 'template') return;
  
  try {
    await $fetch(`/api/bio/${props.username}/count`, {
      method: 'POST',
      body: {
        linkId: props.link.id
      }
    });
  } catch (error) {
    // Silent fail - don't block the user's click
    console.error('Failed to count bio link click:', error);
  }
};
</script>
