<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="textBlock?.hidden"
      :title="data.title || t('blocks.text.title')"
      block="text"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('text')"
    >
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField :label="t('blocks.text.titleLabel')" :help="t('blocks.text.titleHelp')">
        <UInput :model-value="data.title" :placeholder="t('blocks.text.titlePlaceholder')" class="w-full" @update:model-value="update({ title: String($event) })" />
      </UFormField>
      <UFormField :label="t('blocks.text.textLabel')">
        <UTextarea
          :model-value="data.content"
          :placeholder="t('blocks.text.textPlaceholder')"
          :rows="5"
          autoresize
          class="w-full"
          @update:model-value="update({ content: String($event) })"
        />
      </UFormField>
      <div class="grid grid-cols-2 gap-3">
        <UFormField :label="t('blocks.text.alignment')">
          <div class="flex gap-1">
            <UButton
              v-for="option in alignments"
              :key="option.value"
              :icon="option.icon"
              :aria-label="option.label"
              size="sm"
              :color="data.align === option.value ? 'primary' : 'neutral'"
              :variant="data.align === option.value ? 'solid' : 'outline'"
              @click="update({ align: option.value })"
            />
          </div>
        </UFormField>
        <UFormField :label="t('blocks.text.style')">
          <div class="flex gap-1">
            <UButton
              v-for="option in styles"
              :key="option.value"
              size="sm"
              :color="data.style === option.value ? 'primary' : 'neutral'"
              :variant="data.style === option.value ? 'solid' : 'outline'"
              @click="update({ style: option.value })"
            >
              {{ option.label }}
            </UButton>
          </div>
        </UFormField>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, TextBlock } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: TextBlock['data']]
}>()

const { t } = useI18n()

const alignments = computed(() => [
  { value: 'left', label: t('blocks.text.alignLeft'), icon: 'i-lucide-align-left' },
  { value: 'center', label: t('blocks.text.alignCenter'), icon: 'i-lucide-align-center' },
  { value: 'right', label: t('blocks.text.alignRight'), icon: 'i-lucide-align-right' },
] as const)

const styles = computed(() => [
  { value: 'plain', label: t('blocks.text.styles.plain') },
  { value: 'card', label: t('blocks.text.styles.card') },
] as const)

const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })

const textBlock = computed(() => getBlock<TextBlock>('text'))

const data = computed<TextBlock['data']>(() => ({
  content: '',
  align: 'left',
  style: 'plain',
  ...(textBlock.value?.data || {}),
}))

function update(patch: Partial<TextBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}
</script>
