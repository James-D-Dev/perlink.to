<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="testimonialsBlock?.hidden"
      :title="data.title || t('blocks.testimonials.title')"
      block="testimonials"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('testimonials')"
    >
      <template #preview>
        <span class="mr-2 text-xs text-gray-500 dark:text-neutral-400">{{ t('blocks.testimonials.count', { n: data.items.length }, data.items.length) }}</span>
      </template>
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField :label="t('blocks.testimonials.titleLabel')">
        <UInput :model-value="data.title" :placeholder="t('blocks.testimonials.titlePlaceholder')" class="w-full" @update:model-value="update({ title: String($event) })" />
      </UFormField>

      <div v-for="(item, index) in data.items" :key="item.id" class="space-y-2 rounded-lg border border-default bg-default p-3 dark:border-white/10">
        <div class="flex items-center justify-between gap-2">
          <!-- Star rating; click the same star again to clear -->
          <div class="flex gap-0.5">
            <button
              v-for="n in 5"
              :key="n"
              type="button"
              class="text-amber-500"
              :aria-label="t('blocks.testimonials.stars', { n }, n)"
              @click="updateItem(index, { rating: item.rating === n ? undefined : n })"
            >
              <span class="text-lg leading-none" :class="n > (item.rating || 0) && 'opacity-30'">★</span>
            </button>
          </div>
          <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-x" :aria-label="t('common.delete')" @click="removeItem(index)" />
        </div>
        <UTextarea :model-value="item.quote" :placeholder="t('blocks.testimonials.quotePlaceholder')" :rows="2" autoresize class="w-full" @update:model-value="updateItem(index, { quote: String($event) })" />
        <div class="grid grid-cols-2 gap-2">
          <UInput :model-value="item.author" :placeholder="t('blocks.testimonials.authorPlaceholder')" @update:model-value="updateItem(index, { author: String($event) })" />
          <UInput :model-value="item.detail" :placeholder="t('blocks.testimonials.detailPlaceholder')" @update:model-value="updateItem(index, { detail: String($event) })" />
        </div>
      </div>

      <UButton size="sm" variant="soft" color="neutral" icon="i-lucide-plus" :label="t('blocks.testimonials.add')" @click="addItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { BioBlock, Testimonial, TestimonialsBlock } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: TestimonialsBlock['data']]
}>()

const { t } = useI18n()
const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })
const testimonialsBlock = computed(() => getBlock<TestimonialsBlock>('testimonials'))
const data = computed<TestimonialsBlock['data']>(() => ({ ...(testimonialsBlock.value?.data || {}), items: testimonialsBlock.value?.data?.items ?? [] }))

function update(patch: Partial<TestimonialsBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}
function updateItem(index: number, patch: Partial<Testimonial>) {
  update({ items: data.value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) })
}
function addItem() {
  update({ items: [...data.value.items, { id: nanoid(6), quote: '', author: '', rating: 5 }] })
}
function removeItem(index: number) {
  update({ items: data.value.items.filter((_, i) => i !== index) })
}
</script>
