<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="questionBlock?.hidden"
      :title="t('blocks.question.title')"
      block="question"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('question')"
    >
      <template #preview>
        <span v-if="data.question" class="mr-2 max-w-40 truncate text-xs text-gray-500 dark:text-neutral-400">{{ data.question }}</span>
      </template>
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField :label="t('blocks.question.question')" required>
        <UInput :model-value="data.question" :placeholder="t('blocks.question.questionPlaceholder')" class="w-full" @update:model-value="update({ question: String($event) })" />
      </UFormField>
      <!-- Ready-made questions -->
      <div class="flex flex-wrap gap-1.5">
        <UButton
          v-for="idea in ideas"
          :key="idea"
          size="xs"
          color="neutral"
          variant="soft"
          :label="idea"
          @click="update({ question: idea })"
        />
      </div>
      <div class="grid grid-cols-2 gap-3">
        <UFormField :label="t('blocks.question.yesLabel')">
          <UInput :model-value="data.yesLabel" :placeholder="t('blocks.question.yesPlaceholder')" class="w-full" @update:model-value="update({ yesLabel: String($event) })" />
        </UFormField>
        <UFormField :label="t('blocks.question.noLabel')">
          <UInput :model-value="data.noLabel" :placeholder="t('blocks.question.noPlaceholder')" class="w-full" @update:model-value="update({ noLabel: String($event) })" />
        </UFormField>
      </div>
      <UFormField :label="t('blocks.question.answer')">
        <UTextarea :model-value="data.answer" :placeholder="t('blocks.question.answerPlaceholder')" :rows="2" autoresize class="w-full" @update:model-value="update({ answer: String($event) })" />
      </UFormField>

      <label class="flex cursor-pointer items-start gap-3">
        <USwitch :model-value="data.playful !== false" @update:model-value="update({ playful: Boolean($event) })" />
        <span class="text-sm">
          <span class="font-medium text-highlighted">{{ t('blocks.question.playful') }}</span>
          <span class="block text-muted">{{ t('blocks.question.playfulHint') }}</span>
        </span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, QuestionBlock } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: QuestionBlock['data']]
}>()

const { t } = useI18n()
const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })
const questionBlock = computed(() => getBlock<QuestionBlock>('question'))
const data = computed<QuestionBlock['data']>(() => ({ question: '', playful: true, ...(questionBlock.value?.data || {}) }))
const ideas = computed(() => [1, 2, 3, 4].map(n => t(`blocks.question.idea${n}`)))

function update(patch: Partial<QuestionBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}
</script>
