<template>
  <div id="social-block" :class="cardAppearClasses" class="flex justify-center gap-3 mb-6">
    <a
      v-for="social in socials"
      :key="social.id"
      :href="getSocialUrl(social)"
      target="_blank"
      rel="noopener noreferrer"
      :style="socialButtonStyle"
      :aria-label="social.provider"
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @click="trackSocialClick(social.id, getSocialUrl(social))"
    >
      <UIcon :name="getSocialIcon(social.provider)" class="w-5 h-5" />
    </a>
  </div>
</template>

<script setup lang="ts">
import type { StyleValue } from 'vue'
import type { SocialLink } from '~/types/bio'
import { SOCIAL_PROVIDERS } from '~/types/bio'

const props = defineProps<{
  socials: SocialLink[]
  socialButtonStyle: StyleValue
  cardAppearClasses: string[]
  cardHoverClasses: string[]
  username?: string
  mode: string
}>()

function getSocialIcon(provider: string): string {
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
  if (props.mode === 'preview') return;

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
