<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="blogBlock?.hidden"
      :title="data.title || t('blocks.blog.title')"
      block="blog"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('blog')"
    />

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField :label="t('blocks.blog.titleLabel')">
        <UInput :model-value="data.title" :placeholder="t('blocks.blog.titlePlaceholder')" class="w-full" @update:model-value="update({ title: String($event) })" />
      </UFormField>
      <UFormField :label="t('blocks.blog.countLabel')">
        <div class="flex gap-1.5">
          <UButton
            v-for="n in [3, 5, 10]"
            :key="n"
            size="sm"
            :color="(data.count ?? 3) === n ? 'primary' : 'neutral'"
            :variant="(data.count ?? 3) === n ? 'solid' : 'soft'"
            :label="String(n)"
            @click="update({ count: n })"
          />
        </div>
      </UFormField>
      <p class="flex items-center gap-1.5 text-xs text-muted">
        <UIcon name="i-lucide-info" class="size-3.5" />
        {{ t('blocks.blog.hint') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, BlogBlock } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: BlogBlock['data']]
}>()

const { t } = useI18n()
const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })
const blogBlock = computed(() => getBlock<BlogBlock>('blog'))
const data = computed<BlogBlock['data']>(() => ({ count: 3, ...(blogBlock.value?.data || {}) }))

function update(patch: Partial<BlogBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}
</script>
