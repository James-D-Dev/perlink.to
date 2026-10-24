<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="textBlock?.hidden"
      :title="data.title || 'Text'"
      icon="i-lucide-text"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('text')"
    >
      <template #actions>
        <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-trash-2" @click.stop="$emit('remove')" />
      </template>
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField label="Title" help="Optional heading above the text.">
        <UInput :model-value="data.title" placeholder="About us" class="w-full" @update:model-value="update({ title: String($event) })" />
      </UFormField>
      <UFormField label="Text">
        <UTextarea
          :model-value="data.content"
          placeholder="Tell visitors who you are, what you do or what makes your place special."
          :rows="5"
          autoresize
          class="w-full"
          @update:model-value="update({ content: String($event) })"
        />
      </UFormField>
      <div class="grid grid-cols-2 gap-3">
        <UFormField label="Alignment">
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
        <UFormField label="Style">
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

const alignments = [
  { value: 'left', label: 'Align left', icon: 'i-lucide-align-left' },
  { value: 'center', label: 'Align centre', icon: 'i-lucide-align-center' },
  { value: 'right', label: 'Align right', icon: 'i-lucide-align-right' },
] as const

const styles = [
  { value: 'plain', label: 'Plain' },
  { value: 'card', label: 'Card' },
] as const

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
