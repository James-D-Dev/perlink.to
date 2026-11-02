<template>
  <!-- A gallery card: the site's picture on top, its name and state on a
       plain strip below (no text over the picture). The whole card opens the
       editor; the buttons sit above that link -->
  <article class="group relative flex flex-col overflow-hidden rounded-3xl bg-paper ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-xl">
    <NuxtLink :to="editTo" class="absolute inset-0 z-10 rounded-3xl" :aria-label="`${t('dashboard.sites.edit')}: ${site.title || site.username}`" />

    <div class="relative aspect-[4/3] overflow-hidden border-b border-line bg-sand">
      <!-- The site's snapshot; a site without one renders its page once, which is then snapshotted -->
      <img
        v-if="picture"
        :src="picture"
        :alt="site.title || site.username"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 size-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
      >
      <div v-else ref="frame" class="pointer-events-none absolute inset-0 overflow-hidden" :style="{ background: previewBg }" aria-hidden="true" inert>
        <!-- Rendered at phone width, then scaled to the card; only once the card is on screen -->
        <div v-if="onScreen" class="absolute left-0 top-0 origin-top-left" :style="{ width: `${PHONE_WIDTH}px`, transform: `scale(${scale})` }">
          <BioPageView ref="page" :bio-data="bioData" :username="site.username" mode="thumbnail" />
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 p-3 sm:gap-3 sm:p-4">
      <div class="min-w-0 flex-1">
        <h3 class="truncate text-sm font-semibold text-ink sm:text-base">{{ site.title || site.username }}</h3>
        <!-- Live or draft as a dot before the address -->
        <p class="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-ink-muted">
          <span
            class="size-1.5 shrink-0 rounded-full"
            :class="site.isPublished ? 'bg-emerald-500' : 'bg-ink-faint'"
            :title="site.isPublished ? t('dashboard.sites.live') : t('dashboard.sites.draft')"
          />
          <span v-if="!site.isPublished" class="shrink-0">{{ t('dashboard.sites.draft') }} ·</span>
          <span class="truncate">perlink.to/{{ site.username }}</span>
        </p>
      </div>
      <div class="relative z-20 flex shrink-0 items-center gap-0.5">
        <!-- Phones: sharing is in the menu -->
        <UTooltip :text="t('dashboard.editor.share')">
          <UButton
            icon="i-lucide-share"
            color="neutral"
            variant="ghost"
            class="hidden sm:inline-flex"
            :aria-label="t('dashboard.editor.share')"
            @click="$emit('share')"
          />
        </UTooltip>
        <UDropdownMenu :items="menuItems" :content="{ align: 'end' }" :ui="{ content: 'w-52' }">
          <UButton
            icon="i-lucide-ellipsis"
            color="neutral"
            variant="ghost"
            class="relative"
            :aria-label="t('blocks.editor.menu.more')"
          >
            <template #trailing>
              <span v-if="site.unreadRequests" class="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">{{ site.unreadRequests }}</span>
            </template>
          </UButton>
        </UDropdownMenu>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useElementSize, useIntersectionObserver } from '@vueuse/core'
import type { BioData } from '~/types/bio'
import { queueSnapshot, snapshotPage } from '~/composables/useSiteSnapshot'

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

// A snapshot taken here, for a site that had none
const snapped = ref<string | null>(null)

// Page snapshots from before the share button was left out of them are taken again
const pageSnapshot = computed(() => (String(props.site.thumbnailUrl || '').includes('/thumb_page_v2') ? props.site.thumbnailUrl : null))

// Sites that open in 3D show their room
const picture = computed(() =>
  snapped.value
  || (props.site.themeConfig?.pageMode === '3d' && props.site.roomThumbnailUrl ? props.site.roomThumbnailUrl : pageSnapshot.value),
)

// No snapshot yet (the site hasn't been opened in the editor since they
// were added): once its page has rendered here, take one and keep it, so the
// list shows a light image from then on instead of rendering every page
const page = ref<{ $el?: HTMLElement } | null>(null)
watch(onScreen, async (visible) => {
  if (!visible || picture.value) return
  await nextTick()
  // Images and fonts settle first
  await new Promise(resolve => setTimeout(resolve, 1500))
  await document.fonts?.ready
  const element = page.value?.$el
  if (!element || picture.value) return
  try {
    const result = await queueSnapshot(() => snapshotPage(props.site.username, element))
    if (result?.url) snapped.value = result.url
  } catch (error) {
    console.warn('[sites] snapshot failed', props.site.username, error)
  }
})

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
    { label: t('dashboard.editor.share'), icon: 'i-lucide-share', onSelect: () => emit('share') },
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
