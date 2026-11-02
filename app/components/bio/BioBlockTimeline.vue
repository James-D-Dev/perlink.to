<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="timelineBlock?.hidden"
      :title="data.title || t('blocks.timeline.title')"
      block="timeline"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('timeline')"
    >
      <template #preview>
        <span class="mr-2 text-xs text-gray-500 dark:text-neutral-400">{{ t('blocks.timeline.count', { n: data.items.length }, data.items.length) }}</span>
      </template>
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField :label="t('blocks.timeline.titleLabel')">
        <UInput :model-value="data.title" :placeholder="t('blocks.timeline.titlePlaceholder')" class="w-full" @update:model-value="update({ title: String($event) })" />
      </UFormField>

      <div v-for="(item, index) in data.items" :key="item.id" class="space-y-2 rounded-lg border border-default bg-default p-3 dark:border-white/10">
        <div class="flex items-center gap-2">
          <UInput :model-value="item.date" :placeholder="t('blocks.timeline.datePlaceholder')" class="w-32 shrink-0" @update:model-value="updateItem(index, { date: String($event) })" />
          <span class="flex-1" />
          <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-arrow-up" :disabled="index === 0" :aria-label="t('blocks.timeline.moveUp')" @click="move(index, -1)" />
          <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-arrow-down" :disabled="index === data.items.length - 1" :aria-label="t('blocks.timeline.moveDown')" @click="move(index, 1)" />
          <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-x" :aria-label="t('common.delete')" @click="removeItem(index)" />
        </div>
        <UInput :model-value="item.title" :placeholder="t('blocks.timeline.itemTitlePlaceholder')" class="w-full" @update:model-value="updateItem(index, { title: String($event) })" />
        <UTextarea :model-value="item.text" :placeholder="t('blocks.timeline.textPlaceholder')" :rows="2" autoresize class="w-full" @update:model-value="updateItem(index, { text: String($event) })" />
        <div class="flex items-center gap-2">
          <!-- Photo: upload, or remove -->
          <label class="relative flex size-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-accented bg-default text-muted hover:border-inverted dark:border-white/15" :title="t('blocks.timeline.photo')">
            <img v-if="item.imageUrl" :src="item.imageUrl" alt="" class="size-full object-cover">
            <UIcon v-else-if="uploadingItem === item.id" name="i-lucide-loader-circle" class="size-4 animate-spin" />
            <UIcon v-else name="i-lucide-image-plus" class="size-4" />
            <input type="file" accept="image/*" class="hidden" @change="onPhoto($event, index, item.id)">
          </label>
          <UButton v-if="item.imageUrl" variant="ghost" color="neutral" size="xs" :label="t('blocks.timeline.removePhoto')" @click="updateItem(index, { imageUrl: undefined })" />
          <span v-else class="text-xs text-muted">{{ t('blocks.timeline.photoHint') }}</span>
        </div>
      </div>

      <UButton size="sm" variant="soft" color="neutral" icon="i-lucide-plus" :label="t('blocks.timeline.add')" @click="addItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { BioBlock, TimelineBlock, TimelineItem } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
  bioPageId?: string
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: TimelineBlock['data']]
}>()

const { t } = useI18n()
const toast = useToast()
const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })
const timelineBlock = computed(() => getBlock<TimelineBlock>('timeline'))
const data = computed<TimelineBlock['data']>(() => ({ ...(timelineBlock.value?.data || {}), items: timelineBlock.value?.data?.items ?? [] }))

function update(patch: Partial<TimelineBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}
function updateItem(index: number, patch: Partial<TimelineItem>) {
  update({ items: data.value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)) })
}
function addItem() {
  update({ items: [...data.value.items, { id: nanoid(6), date: '', title: '' }] })
}
function removeItem(index: number) {
  update({ items: data.value.items.filter((_, i) => i !== index) })
}
function move(index: number, by: number) {
  const items = [...data.value.items]
  const [item] = items.splice(index, 1)
  items.splice(index + by, 0, item!)
  update({ items })
}

// Photos go through the same resize + upload as gallery images
const { uploadImage } = useImageAlbumUpload()
const uploadingItem = ref<string | null>(null)
async function onPhoto(event: Event, index: number, itemId: string) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !props.bioPageId) return
  uploadingItem.value = itemId
  try {
    updateItem(index, { imageUrl: await uploadImage(file, props.bioPageId) })
  } catch {
    toast.add({ title: t('blocks.timeline.photoFailed'), color: 'error' })
  } finally {
    uploadingItem.value = null
  }
}
</script>
