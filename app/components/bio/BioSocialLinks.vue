<template>
  <div class="flex flex-col gap-3">
    <!-- Where people buy, order or find the place: a button each, in the
         store's own colour, so "Order on GrabFood" reads at a glance -->
    <div v-if="channels.length" :class="cardAppearClasses" class="grid gap-2">
      <a
        v-for="social in channels"
        :key="social.id"
        :href="getSocialUrl(social)"
        target="_blank"
        rel="noopener noreferrer nofollow ugc"
        class="channel group flex min-h-12 items-center gap-3 px-3.5 py-2.5 text-[15px] font-semibold transition-transform active:scale-[0.98]"
        :style="channelStyle(social.provider)"
        @mouseenter="onMouseEnter"
        @click="trackSocialClick(social.id, getSocialUrl(social))"
      >
        <SocialBadge :provider="social.provider" :size="30" shape="circle" class="channel-badge" />
        <span class="min-w-0 flex-1 truncate text-left">{{ channelLabel(social.provider) }}</span>
        <UIcon name="i-lucide-arrow-up-right" class="size-4 shrink-0 opacity-70 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>

    <div v-if="icons.length" :class="[...cardAppearClasses, align === 'left' ? 'justify-start' : 'justify-center']" class="flex flex-wrap gap-2.5">
      <a
        v-for="social in icons"
        :key="social.id"
        :href="getSocialUrl(social)"
        target="_blank"
        rel="noopener noreferrer nofollow ugc"
        :style="socialButtonStyle"
        :aria-label="providerLabel(social.provider)"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @click="trackSocialClick(social.id, getSocialUrl(social))"
      >
        <UIcon :name="getSocialIcon(social.provider)" class="size-[18px]" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { SocialLink } from '~/types/bio'
import { SOCIAL_PROVIDERS } from '~/types/bio'

// Social links may include Zalo, an icon of our own
registerZaloIcon()

const props = defineProps<{
  socials: SocialLink[]
  socialButtonStyle: StyleValue
  cardAppearClasses: string[]
  cardHoverClasses: string[]
  username?: string
  mode: string
  /** Single-colour icons that take the theme colour instead of brand logos */
  monochrome?: boolean
  align?: 'left' | 'center'
}>()

const { t } = useSiteI18n()

// Stores, delivery apps and maps, with the words on their button
const CHANNELS: Record<string, { verb: 'shop' | 'order' | 'map'; background: string; color: string }> = {
  shopee: { verb: 'shop', background: '#EE4D2D', color: '#ffffff' },
  lazada: { verb: 'shop', background: 'linear-gradient(100deg, #0F146D 0%, #2A1D8F 100%)', color: '#ffffff' },
  tiktokshop: { verb: 'shop', background: '#111111', color: '#ffffff' },
  grabfood: { verb: 'order', background: '#00B14F', color: '#ffffff' },
  shopeefood: { verb: 'order', background: '#EE4D2D', color: '#ffffff' },
  googlemaps: { verb: 'map', background: '#ffffff', color: '#1f1f1f' },
}

const channels = computed(() => props.socials.filter(s => CHANNELS[s.provider]))
const icons = computed(() => props.socials.filter(s => !CHANNELS[s.provider]))

const providerLabel = (provider: string) => SOCIAL_PROVIDERS.find(p => p.key === provider)?.label ?? provider

function channelLabel(provider: string) {
  const name = providerLabel(provider)
  const verb = CHANNELS[provider]?.verb
  if (verb === 'order') return t('channelOrder', { name })
  if (verb === 'map') return t('channelMap')
  return t('channelShop', { name })
}

// The page's button corners, the store's colours
function channelStyle(provider: string) {
  const look = CHANNELS[provider]!
  const own = props.socialButtonStyle as Record<string, string | undefined> | undefined
  const radius = own && typeof own === 'object' && own.borderRadius ? `min(${own.borderRadius}, 999px)` : '999px'
  return {
    background: look.background,
    color: look.color,
    borderRadius: radius,
    boxShadow: look.background === '#ffffff' ? 'inset 0 0 0 1px rgb(0 0 0 / 0.12), 0 6px 18px -10px rgb(0 0 0 / 0.35)' : '0 8px 20px -12px rgb(0 0 0 / 0.45)',
  }
}

const MONO_ICONS: Record<string, string> = {
  twitter: 'i-simple-icons-x',
  website: 'i-lucide-globe',
  email: 'i-lucide-mail',
  phone: 'i-lucide-phone',
  lazada: 'i-lucide-shopping-bag',
  tiktokshop: 'i-simple-icons-tiktok',
  grabfood: 'i-simple-icons-grab',
  shopeefood: 'i-lucide-utensils',
}

function getSocialIcon(provider: string): string {
  if (props.monochrome) return MONO_ICONS[provider] ?? `i-simple-icons-${provider}`
  const found = SOCIAL_PROVIDERS.find(p => p.key === provider)
  return found?.icon || 'i-lucide-link'
}

function getSocialUrl(social: SocialLink): string {
  const provider = SOCIAL_PROVIDERS.find(p => p.key === social.provider)
  if (provider?.prefix && !social.url.startsWith('http')) {
    return provider.prefix + social.url
  }
  return social.url
}

function applyHoverAnimation(el: HTMLElement, classes: string[]) {
  if (!classes.length) return
  const hoverClasses = classes.filter(c => c !== 'animate__animated')
  el.classList.remove('animate__animated', ...hoverClasses)
  void el.offsetWidth
  el.classList.add('animate__animated', ...hoverClasses)
  const handler = () => {
    el.classList.remove('animate__animated', ...hoverClasses)
    el.removeEventListener('animationend', handler)
  }
  el.addEventListener('animationend', handler)
}

function onMouseEnter(e: MouseEvent) {
  applyHoverAnimation(e.currentTarget as HTMLElement, props.cardHoverClasses)
}

function onMouseLeave() {}

// Track social link click (simple count only)
const trackSocialClick = async (socialId: string, url: string) => {
  if (!props.username) return;
  if (props.mode === 'preview' || props.mode === 'template') return;

  try {
    await $fetch(`/api/bio/${props.username}/count`, {
      method: 'POST',
      body: {
        linkId: socialId,
        type: 'social'
      }
    });
  } catch (error) {
    // Silent fail - don't block the user's click
    console.error('Failed to count social link click:', error);
  }
};
</script>

<style scoped>
/* The store's mark sits on a soft white ring inside its coloured button */
.channel-badge {
  box-shadow: 0 0 0 2px rgb(255 255 255 / 0.35);
}
@media (prefers-reduced-motion: reduce) {
  .channel, .channel * { transition: none !important; }
}
</style>
