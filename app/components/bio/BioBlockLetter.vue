<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="letterBlock?.hidden"
      :title="t('blocks.letter.title')"
      block="letter"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('letter')"
    >
      <template #preview>
        <span v-if="data.to" class="mr-2 max-w-32 truncate text-xs text-gray-500 dark:text-neutral-400">{{ data.to }}</span>
      </template>
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField :label="t('blocks.letter.to')">
        <UInput :model-value="data.to" :placeholder="t('blocks.letter.toPlaceholder')" class="w-full" @update:model-value="update({ to: String($event) })" />
      </UFormField>
      <UFormField :label="t('blocks.letter.body')" required>
        <UTextarea :model-value="data.body" :placeholder="t('blocks.letter.bodyPlaceholder')" :rows="6" autoresize class="w-full" @update:model-value="update({ body: String($event) })" />
      </UFormField>
      <UFormField :label="t('blocks.letter.from')">
        <UInput :model-value="data.from" :placeholder="t('blocks.letter.fromPlaceholder')" class="w-full" @update:model-value="update({ from: String($event) })" />
      </UFormField>

      <UFormField :label="t('blocks.letter.paper')">
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="option in papers"
            :key="option.id"
            type="button"
            class="flex items-center gap-2 rounded-lg border p-2 text-sm transition-all"
            :class="(data.paper || 'cream') === option.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300 dark:border-white/10 dark:hover:border-white/20'"
            @click="update({ paper: option.id })"
          >
            <span class="size-5 shrink-0 rounded-full ring-1 ring-black/10" :style="{ background: option.color }" />
            {{ option.label }}
          </button>
        </div>
      </UFormField>

      <label class="flex cursor-pointer items-start gap-3">
        <USwitch :model-value="data.sealed !== false" @update:model-value="update({ sealed: Boolean($event) })" />
        <span class="text-sm">
          <span class="font-medium text-highlighted">{{ t('blocks.letter.sealed') }}</span>
          <span class="block text-muted">{{ t('blocks.letter.sealedHint') }}</span>
        </span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, LetterBlock } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: LetterBlock['data']]
}>()

const { t } = useI18n()
const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })
const letterBlock = computed(() => getBlock<LetterBlock>('letter'))
const data = computed<LetterBlock['data']>(() => ({ body: '', sealed: true, paper: 'cream', ...(letterBlock.value?.data || {}) }))

function update(patch: Partial<LetterBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}

const papers = computed(() => [
  { id: 'cream' as const, label: t('blocks.letter.papers.cream'), color: '#fbf6ec' },
  { id: 'blush' as const, label: t('blocks.letter.papers.blush'), color: '#ffd9e3' },
  { id: 'night' as const, label: t('blocks.letter.papers.night'), color: '#231a33' },
])
</script>
