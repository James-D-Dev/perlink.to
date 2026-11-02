<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="eventBlock?.hidden"
      :title="data.name || t('blocks.event.title')"
      block="event"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('event')"
    >
      <template #preview>
        <span v-if="data.date" class="mr-2 text-xs text-gray-500 dark:text-neutral-400">{{ data.date }}</span>
      </template>
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField :label="t('blocks.event.name')">
        <UInput :model-value="data.name" :placeholder="t('blocks.event.namePlaceholder')" class="w-full" @update:model-value="update({ name: String($event) })" />
      </UFormField>

      <UFormField :label="t('blocks.event.date')" required>
        <UInput type="date" :model-value="data.date" class="w-full" @update:model-value="update({ date: String($event) })" />
      </UFormField>
      <div class="grid grid-cols-2 gap-3">
        <UFormField :label="t('blocks.event.startTime')">
          <UInput type="time" :model-value="data.startTime" class="w-full" @update:model-value="update({ startTime: String($event) })" />
        </UFormField>
        <UFormField :label="t('blocks.event.endTime')">
          <UInput type="time" :model-value="data.endTime" class="w-full" @update:model-value="update({ endTime: String($event) })" />
        </UFormField>
      </div>

      <UFormField :label="t('blocks.event.venue')">
        <UInput :model-value="data.venue" :placeholder="t('blocks.event.venuePlaceholder')" class="w-full" @update:model-value="update({ venue: String($event) })" />
      </UFormField>
      <UFormField :label="t('blocks.event.address')" :help="t('blocks.event.addressHelp')">
        <UInput :model-value="data.address" :placeholder="t('blocks.event.addressPlaceholder')" class="w-full" @update:model-value="update({ address: String($event) })" />
      </UFormField>
      <UFormField :label="t('blocks.event.mapUrl')">
        <UInput :model-value="data.mapUrl" placeholder="https://maps.app.goo.gl/…" class="w-full" @update:model-value="update({ mapUrl: String($event) })" />
      </UFormField>
      <UFormField :label="t('blocks.event.dressCode')">
        <UInput :model-value="data.dressCode" :placeholder="t('blocks.event.dressCodePlaceholder')" class="w-full" @update:model-value="update({ dressCode: String($event) })" />
      </UFormField>
      <UFormField :label="t('blocks.event.note')">
        <UTextarea :model-value="data.note" :placeholder="t('blocks.event.notePlaceholder')" :rows="2" autoresize class="w-full" @update:model-value="update({ note: String($event) })" />
      </UFormField>

      <div class="flex items-start gap-2 rounded-lg bg-elevated/60 p-3 text-xs text-muted">
        <UIcon name="i-lucide-calendar-plus" class="mt-0.5 size-4 shrink-0" />
        <span>{{ t('blocks.event.calendarNote') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, EventBlock } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: EventBlock['data']]
}>()

const { t } = useI18n()
const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })
const eventBlock = computed(() => getBlock<EventBlock>('event'))
const data = computed<EventBlock['data']>(() => ({ date: '', ...(eventBlock.value?.data || {}) }))

function update(patch: Partial<EventBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}
</script>
