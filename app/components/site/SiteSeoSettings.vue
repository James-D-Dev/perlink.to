<template>
  <div class="space-y-4">
    <UFormField :label="t('dashboard.seo.titleLabel')" :hint="`${(seo.title || '').length}/60`">
      <UInput
        :model-value="seo.title"
        :placeholder="defaults.title"
        maxlength="60"
        class="w-full"
        @update:model-value="patch({ title: String($event) || undefined })"
      />
    </UFormField>

    <UFormField :label="t('dashboard.seo.descriptionLabel')" :hint="`${(seo.description || '').length}/160`">
      <UTextarea
        :model-value="seo.description"
        :placeholder="defaults.description"
        :rows="2"
        autoresize
        maxlength="160"
        class="w-full"
        @update:model-value="patch({ description: String($event) || undefined })"
      />
    </UFormField>

    <UFormField :label="t('dashboard.seo.imageLabel')" :help="t('dashboard.seo.imageHelp')">
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="flex h-14 w-24 items-center justify-center rounded-md border text-xs font-medium transition"
          :class="!seo.imageUrl ? 'border-inverted ring-1 ring-inverted text-highlighted' : 'border-default text-muted hover:border-accented'"
          @click="patch({ imageUrl: undefined })"
        >
          {{ t('dashboard.seo.auto') }}
        </button>
        <button
          v-for="url in imageChoices"
          :key="url"
          type="button"
          class="h-14 w-24 overflow-hidden rounded-md border transition"
          :class="seo.imageUrl === url ? 'border-inverted ring-1 ring-inverted' : 'border-default hover:border-accented'"
          @click="patch({ imageUrl: url })"
        >
          <img :src="url" alt="" class="size-full object-cover">
        </button>
      </div>
    </UFormField>

    <!-- What a shared link looks like in Zalo, Messenger or Facebook -->
    <div>
      <p class="mb-2 text-xs font-medium text-muted">{{ t('dashboard.seo.previewLabel') }}</p>
      <div class="overflow-hidden rounded-lg border border-default bg-elevated/40 dark:border-white/10">
        <div class="aspect-[1.91/1] w-full bg-elevated">
          <img v-if="shareImage" :src="shareImage" alt="" class="size-full object-cover">
        </div>
        <div class="space-y-0.5 p-3">
          <p class="text-[11px] uppercase tracking-wide text-dimmed">perlink.to</p>
          <p class="line-clamp-1 text-sm font-semibold text-highlighted">{{ seo.title || defaults.title }}</p>
          <p class="line-clamp-2 text-xs text-muted">{{ seo.description || defaults.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioData, ThemeConfig, ThemeSeo } from '~/types/bio'

const props = defineProps<{
  bioData: BioData
  username: string
}>()

const emit = defineEmits<{ updateTheme: [patch: Partial<ThemeConfig>] }>()

const { t } = useI18n()

const seo = computed<ThemeSeo>(() => props.bioData.themeConfig.seo ?? {})

// What visitors see when nothing is filled in (same rules as the public page)
const defaults = computed(() => siteSeoDefaults(props.bioData, props.username))

// Photos the site already has: banner, avatar and gallery images
const imageChoices = computed(() => {
  const urls = [
    props.bioData.themeConfig.header?.bannerUrl,
    props.bioData.avatarUrl,
    ...props.bioData.blocks.flatMap(b => (b.name === 'image-album' ? (b.data?.images ?? []).map(i => i.url) : [])),
  ].filter((url): url is string => !!url)
  return [...new Set(urls)].slice(0, 9)
})

const shareImage = computed(() => seo.value.imageUrl || defaults.value.image)

function patch(values: Partial<ThemeSeo>) {
  emit('updateTheme', { seo: { ...seo.value, ...values } })
}
</script>
