<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="videoBlock?.hidden"
      :title="data.title || t('blocks.video.title')"
      block="video"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('video')"
    >
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField :label="t('blocks.video.urlLabel')" :help="t('blocks.video.urlHelp')" :error="data.url && !embed ? t('blocks.video.unsupported') : undefined">
        <UInput :model-value="data.url" placeholder="https://youtube.com/watch?v=..." icon="i-lucide-link" class="w-full" @update:model-value="update({ url: String($event).trim() })" />
      </UFormField>
      <p v-if="embed" class="flex items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-circle-check" class="size-3.5 text-emerald-500" />
        {{ t(`blocks.video.providers.${embed.provider}`) }}
      </p>
      <UFormField :label="t('blocks.video.titleLabel')">
        <UInput :model-value="data.title" :placeholder="t('blocks.video.titlePlaceholder')" class="w-full" @update:model-value="update({ title: String($event) })" />
      </UFormField>
      <UFormField :label="t('blocks.video.captionLabel')">
        <UInput :model-value="data.caption" class="w-full" @update:model-value="update({ caption: String($event) })" />
      </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, VideoBlock } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: VideoBlock['data']]
}>()

const { t } = useI18n()
const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })
const videoBlock = computed(() => getBlock<VideoBlock>('video'))
const data = computed<VideoBlock['data']>(() => ({ url: '', ...(videoBlock.value?.data || {}) }))
const embed = computed(() => videoEmbed(data.value.url))

function update(patch: Partial<VideoBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}
</script>
