<template>
  <article class="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-3xl bg-sand ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-xl">
    <!-- The site itself, scaled down; the whole card opens the editor -->
    <NuxtLink :to="editTo" class="absolute inset-0" :aria-label="t('dashboard.sites.edit')">
      <!-- The snapshot taken in the editor; the live page only until there is one -->
      <img
        v-if="picture"
        :src="picture"
        :alt="site.title || site.username"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 size-full object-cover object-top"
      >
      <div v-else ref="frame" class="pointer-events-none absolute inset-0 overflow-hidden" :style="{ background: previewBg }" aria-hidden="true" inert>
        <!-- Rendered at phone width, then scaled to the card; only once the card is on screen -->
        <div v-if="onScreen" class="absolute left-0 top-0 origin-top-left" :style="{ width: `${PHONE_WIDTH}px`, transform: `scale(${scale})` }">
          <BioPageView :bio-data="bioData" :username="site.username" mode="thumbnail" />
        </div>
      </div>
    </NuxtLink>

    <!-- Status, top left -->
    <span
      class="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium shadow-sm backdrop-blur"
      :class="site.isPublished ? 'bg-emerald-50/90 text-emerald-700' : 'bg-white/90 text-ink-muted'"
    >
      <span class="size-1.5 rounded-full" :class="site.isPublished ? 'bg-emerald-500' : 'bg-ink-faint'" />
      {{ site.isPublished ? t('dashboard.sites.live') : t('dashboard.sites.draft') }}
    </span>

    <!-- Name and actions over a fade at the bottom -->
    <div class="pointer-events-none relative mt-auto bg-gradient-to-t from-black/85 via-black/55 to-transparent px-4 pb-4 pt-16">
      <div class="flex items-end gap-2">
        <div class="min-w-0 flex-1 text-white">
          <h3 class="truncate text-lg font-semibold leading-tight">{{ site.title || site.username }}</h3>
          <p class="truncate text-xs text-white/75">perlink.to/{{ site.username }}</p>
        </div>
        <div class="pointer-events-auto flex shrink-0 items-center gap-1.5">
          <UTooltip :text="t('dashboard.editor.share')">
            <button
              type="button"
              class="flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30"
              :aria-label="t('dashboard.editor.share')"
              @click="$emit('share')"
            >
              <UIcon name="i-lucide-share" class="size-4" />
            </button>
          </UTooltip>
          <UDropdownMenu :items="menuItems" :content="{ align: 'end' }" :ui="{ content: 'w-52' }">
            <button
              type="button"
              class="relative flex size-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition hover:bg-white/30"
              :aria-label="t('blocks.editor.menu.more')"
            >
              <UIcon name="i-lucide-ellipsis" class="size-4" />
              <span v-if="site.unreadRequests" class="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-semibold">{{ site.unreadRequests }}</span>
            </button>
          </UDropdownMenu>
          <NuxtLink
            :to="editTo"
            class="flex h-10 items-center rounded-full bg-white px-4 text-sm font-semibold text-ink transition hover:bg-white/90"
          >
            {{ t('dashboard.sites.edit') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useElementSize, useIntersectionObserver } from '@vueuse/core'
import type { BioData } from '~/types/bio'

const props = defineProps<{
  site: any
  pending?: boolean
}>()

const emit = defineEmits<{
  share: []
  copy: []
  qr: []
  publish: []
  unpublish: []
}>()

const { t } = useI18n()

const PHONE_WIDTH = 390
const frame = ref<HTMLElement | null>(null)
const { width: frameWidth } = useElementSize(frame)
const scale = computed(() => (frameWidth.value ? frameWidth.value / PHONE_WIDTH : 0.8))
const onScreen = ref(false)
useIntersectionObserver(frame, ([entry]) => {
  if (entry?.isIntersecting) onScreen.value = true
}, { rootMargin: '200px' })

// Sites that open in 3D show their room
const picture = computed(() =>
  props.site.themeConfig?.pageMode === '3d' && props.site.roomThumbnailUrl ? props.site.roomThumbnailUrl : props.site.thumbnailUrl,
)

const editTo = computed(() => `/dashboard/site/${props.site.username}`)

const bioData = computed<BioData>(() => ({
  title: props.site.title || '',
  bio: props.site.bio || '',
  avatarUrl: props.site.avatarUrl || '',
  templateId: props.site.templateId || 'modern',
  themeConfig: { ...(props.site.themeConfig || {}), showShare: false, pageMode: '2d' },
  blocks: props.site.blocks || [],
}))

// Behind the scaled page, so short pages don't show a blank strip
const previewBg = computed(() => {
  const bg = props.site.themeConfig?.background
  if (bg?.type === 'gradient' && bg.gradient) return `linear-gradient(${bg.gradient.angle ?? 160}deg, ${bg.gradient.from}, ${bg.gradient.to})`
  return bg?.color || props.site.themeConfig?.colors?.third || '#ffffff'
})

const menuItems = computed(() => [
  [
    { label: t('common.openSite'), icon: 'i-lucide-external-link', to: `/${props.site.username}`, target: '_blank' },
    { label: t('common.analytics'), icon: 'i-lucide-chart-column', to: `/dashboard/site/${props.site.username}/analytics` },
    {
      label: props.site.unreadRequests ? `${t('dashboard.inbox.open')} (${props.site.unreadRequests})` : t('dashboard.inbox.open'),
      icon: 'i-lucide-inbox',
      to: `/dashboard/site/${props.site.username}/inbox`,
    },
  ],
  [
    { label: t('common.copyLink'), icon: 'i-lucide-copy', onSelect: () => emit('copy') },
    { label: t('dashboard.qr.open'), icon: 'i-lucide-qr-code', onSelect: () => emit('qr') },
  ],
  [
    props.site.isPublished
      ? { label: t('common.unpublish'), icon: 'i-lucide-eye-off', disabled: props.pending, onSelect: () => emit('unpublish') }
      : { label: t('common.publish'), icon: 'i-lucide-globe', disabled: props.pending, onSelect: () => emit('publish') },
  ],
])
</script>
