<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="hoursBlock?.hidden"
      :title="data.title || t('blocks.hours.title')"
      icon="i-lucide-clock"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('hours')"
    >
      <template #actions>
        <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-trash-2" @click.stop="$emit('remove')" />
      </template>
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField :label="t('blocks.hours.titleLabel')">
        <UInput :model-value="data.title" :placeholder="t('blocks.hours.titlePlaceholder')" class="w-full" @update:model-value="update({ title: String($event) })" />
      </UFormField>

      <div class="space-y-2">
        <div v-for="(day, index) in data.days" :key="day.day" class="flex items-center gap-2">
          <span class="w-12 text-sm font-medium text-gray-700 dark:text-neutral-200">{{ dayNames[day.day] }}</span>
          <UInput type="time" :model-value="day.open" :disabled="day.closed" class="flex-1" @update:model-value="updateDay(index, { open: String($event) })" />
          <span class="text-gray-400 dark:text-neutral-500">–</span>
          <UInput type="time" :model-value="day.close" :disabled="day.closed" class="flex-1" @update:model-value="updateDay(index, { close: String($event) })" />
          <UCheckbox :model-value="day.closed" :label="t('blocks.hours.closed')" @update:model-value="updateDay(index, { closed: Boolean($event) })" />
        </div>
      </div>

      <UButton size="sm" variant="soft" color="neutral" icon="i-lucide-copy" :label="t('blocks.hours.copyMonday')" @click="copyMonday" />

      <UFormField :label="t('blocks.hours.note')">
        <UInput :model-value="data.note" :placeholder="t('blocks.hours.notePlaceholder')" class="w-full" @update:model-value="update({ note: String($event) })" />
      </UFormField>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BioBlock, HoursBlock, OpeningDay } from '~/types/bio'
import { DEFAULT_OPENING_DAYS } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: HoursBlock['data']]
}>()

const { t, locale } = useI18n()

// Short weekday names (index 0 = Sunday) in the dashboard language.
// 2024-01-07 was a Sunday.
const dayNames = computed(() => {
  const format = new Intl.DateTimeFormat(locale.value, { weekday: 'short' })
  return Array.from({ length: 7 }, (_, i) => format.format(new Date(2024, 0, 7 + i)))
})

const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })

const hoursBlock = computed(() => getBlock<HoursBlock>('hours'))

const data = computed<HoursBlock['data']>(() => {
  const saved = hoursBlock.value?.data
  return {
    title: saved?.title ?? 'Opening hours',
    note: saved?.note ?? '',
    days: saved?.days?.length ? saved.days : DEFAULT_OPENING_DAYS,
  }
})

function update(patch: Partial<HoursBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}

function updateDay(index: number, patch: Partial<OpeningDay>) {
  update({ days: data.value.days.map((d, i) => (i === index ? { ...d, ...patch } : d)) })
}

function copyMonday() {
  const monday = data.value.days.find(d => d.day === 1)
  if (!monday) return
  update({ days: data.value.days.map(d => ({ ...d, open: monday.open, close: monday.close, closed: monday.closed })) })
}
</script>
