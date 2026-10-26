<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="menuBlock?.hidden"
      :title="data.title || t('blocks.menu.title')"
      block="menu"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('menu')"
    >
      <template #preview>
        <span class="text-xs text-gray-500 dark:text-neutral-400 mr-2">{{ t('blocks.menu.itemCount', { n: itemCount }, itemCount) }}</span>
      </template>
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <div class="grid grid-cols-2 gap-3">
        <UFormField :label="t('blocks.menu.titleLabel')" class="col-span-2">
          <UInput :model-value="data.title" :placeholder="t('blocks.menu.titlePlaceholder')" class="w-full" @update:model-value="update({ title: String($event) })" />
        </UFormField>
        <UFormField :label="t('blocks.menu.currency')">
          <UInput :model-value="data.currency" placeholder="₫, $, €" class="w-full" @update:model-value="update({ currency: String($event) })" />
        </UFormField>
        <UFormField :label="t('blocks.menu.priceSuffix')">
          <UInput :model-value="data.priceSuffix" :placeholder="t('blocks.menu.priceSuffixPlaceholder')" class="w-full" @update:model-value="update({ priceSuffix: String($event) })" />
        </UFormField>
        <UFormField :label="t('blocks.menu.layout')" class="col-span-2">
          <BioVisualPicker :model-value="data.layout || 'list'" :options="layouts" :cols="2" @update:model-value="update({ layout: $event })">
            <template #preview="{ value }">
              <!-- List: rows with a price on the right. Cards: tiles with a photo -->
              <span v-if="value === 'list'" class="flex w-4/5 flex-col gap-1.5">
                <span v-for="i in 3" :key="i" class="flex items-center gap-1">
                  <span class="h-1 flex-1 rounded-full bg-gray-400 dark:bg-white/40" />
                  <span class="h-1 w-3 rounded-full bg-gray-300 dark:bg-white/25" />
                </span>
              </span>
              <span v-else class="grid w-4/5 grid-cols-2 gap-1">
                <span v-for="i in 2" :key="i" class="flex flex-col gap-0.5 rounded-sm bg-white p-0.5 shadow-sm dark:bg-white/10">
                  <span class="h-4 rounded-[2px] bg-gray-300 dark:bg-white/25" />
                  <span class="h-0.5 w-3/4 rounded-full bg-gray-400 dark:bg-white/40" />
                </span>
              </span>
            </template>
          </BioVisualPicker>
        </UFormField>
      </div>

      <div v-for="(section, sIndex) in data.sections" :key="section.id" class="rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl p-3 space-y-3">
        <div class="flex items-center gap-2">
          <UInput
            :model-value="section.name"
            :placeholder="t('blocks.menu.sectionPlaceholder')"
            class="flex-1"
            @update:model-value="updateSection(sIndex, { name: String($event) })"
          />
          <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-trash-2" @click="removeSection(sIndex)" />
        </div>

        <div v-for="(item, iIndex) in section.items" :key="item.id" class="rounded-lg bg-gray-50 dark:bg-white/[0.03] p-3 space-y-2">
          <div class="flex items-center gap-2">
            <UInput :model-value="item.name" :placeholder="t('blocks.menu.itemNamePlaceholder')" class="flex-1" @update:model-value="updateItem(sIndex, iIndex, { name: String($event) })" />
            <UInput :model-value="item.price" :placeholder="t('blocks.menu.itemPricePlaceholder')" class="w-28" @update:model-value="updateItem(sIndex, iIndex, { price: String($event) })" />
            <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-x" @click="removeItem(sIndex, iIndex)" />
          </div>
          <UTextarea
            :model-value="item.description"
            :placeholder="t('blocks.menu.itemDescriptionPlaceholder')"
            :rows="1"
            autoresize
            class="w-full"
            @update:model-value="updateItem(sIndex, iIndex, { description: String($event) })"
          />
          <div class="flex flex-wrap items-center gap-2">
            <!-- Photo: upload, or remove -->
            <label class="relative flex size-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-accented bg-default text-muted hover:border-inverted dark:border-white/15" :title="t('blocks.menu.itemPhoto')">
              <img v-if="item.imageUrl" :src="item.imageUrl" alt="" class="size-full object-cover">
              <UIcon v-else-if="uploadingItem === item.id" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              <UIcon v-else name="i-lucide-image-plus" class="size-4" />
              <input type="file" accept="image/*" class="hidden" @change="onItemPhoto($event, sIndex, iIndex, item.id)">
            </label>
            <UButton v-if="item.imageUrl" variant="ghost" color="neutral" size="xs" :label="t('blocks.menu.removePhoto')" @click="updateItem(sIndex, iIndex, { imageUrl: undefined })" />
            <UInput :model-value="item.tag" :placeholder="t('blocks.menu.itemTagPlaceholder')" class="min-w-0 flex-1" @update:model-value="updateItem(sIndex, iIndex, { tag: String($event) })" />
            <label class="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-muted">
              <USwitch size="sm" :model-value="!!item.soldOut" @update:model-value="updateItem(sIndex, iIndex, { soldOut: $event })" />
              {{ t('blocks.menu.soldOut') }}
            </label>
          </div>
        </div>

        <UButton size="sm" variant="soft" color="neutral" icon="i-lucide-plus" :label="t('blocks.menu.addItem')" @click="addItem(sIndex)" />
      </div>

      <UButton block variant="outline" color="neutral" icon="i-lucide-plus" :label="t('blocks.menu.addSection')" @click="addSection" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { BioBlock, MenuBlock, MenuItem, MenuSection } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
  bioPageId?: string
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: MenuBlock['data']]
}>()

const { t } = useI18n()
const toast = useToast()

// Dish photos go through the same resize + upload as gallery images
const { uploadImage } = useImageAlbumUpload()
const uploadingItem = ref<string | null>(null)
async function onItemPhoto(event: Event, sIndex: number, iIndex: number, itemId: string) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file || !props.bioPageId) return
  uploadingItem.value = itemId
  try {
    const url = await uploadImage(file, props.bioPageId)
    updateItem(sIndex, iIndex, { imageUrl: url })
  } catch {
    toast.add({ title: t('blocks.menu.photoFailed'), color: 'error' })
  } finally {
    uploadingItem.value = null
  }
}

const layouts = computed(() => [
  { value: 'list' as const, label: t('blocks.menu.layouts.list'), icon: 'i-lucide-list' },
  { value: 'cards' as const, label: t('blocks.menu.layouts.cards'), icon: 'i-lucide-layout-grid' },
])

const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })

const menuBlock = computed(() => getBlock<MenuBlock>('menu'))

const data = computed<MenuBlock['data']>(() => ({
  title: 'Menu',
  currency: '',
  priceSuffix: '',
  layout: 'list',
  sections: [],
  ...(menuBlock.value?.data || {}),
}))

const itemCount = computed(() => data.value.sections.reduce((n, s) => n + s.items.length, 0))

function update(patch: Partial<MenuBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}

function setSections(sections: MenuSection[]) {
  update({ sections })
}

function addSection() {
  setSections([...data.value.sections, { id: nanoid(6), name: '', items: [] }])
}

function removeSection(index: number) {
  setSections(data.value.sections.filter((_, i) => i !== index))
}

function updateSection(index: number, patch: Partial<MenuSection>) {
  setSections(data.value.sections.map((s, i) => (i === index ? { ...s, ...patch } : s)))
}

function addItem(sectionIndex: number) {
  const section = data.value.sections[sectionIndex]
  if (!section) return
  updateSection(sectionIndex, { items: [...section.items, { id: nanoid(6), name: '', price: '' }] })
}

function removeItem(sectionIndex: number, itemIndex: number) {
  const section = data.value.sections[sectionIndex]
  if (!section) return
  updateSection(sectionIndex, { items: section.items.filter((_, i) => i !== itemIndex) })
}

function updateItem(sectionIndex: number, itemIndex: number, patch: Partial<MenuItem>) {
  const section = data.value.sections[sectionIndex]
  if (!section) return
  updateSection(sectionIndex, { items: section.items.map((it, i) => (i === itemIndex ? { ...it, ...patch } : it)) })
}
</script>
