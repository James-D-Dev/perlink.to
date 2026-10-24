<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="menuBlock?.hidden"
      :title="data.title || t('blocks.menu.title')"
      icon="i-lucide-utensils"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('menu')"
    >
      <template #preview>
        <span class="text-xs text-gray-500 dark:text-neutral-400 mr-2">{{ t('blocks.menu.itemCount', { n: itemCount }, itemCount) }}</span>
      </template>
      <template #actions>
        <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-trash-2" @click.stop="$emit('remove')" />
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
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="option in layouts"
              :key="option.value"
              type="button"
              class="flex items-center gap-2 p-2 rounded-lg border text-sm transition-all"
              :class="data.layout === option.value ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'"
              @click="update({ layout: option.value })"
            >
              <UIcon :name="option.icon" class="w-4 h-4" />
              {{ option.label }}
            </button>
          </div>
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
          <div class="flex gap-2">
            <UInput :model-value="item.tag" :placeholder="t('blocks.menu.itemTagPlaceholder')" class="w-40" @update:model-value="updateItem(sIndex, iIndex, { tag: String($event) })" />
            <UInput :model-value="item.imageUrl" :placeholder="t('blocks.menu.itemImagePlaceholder')" icon="i-lucide-image" class="flex-1" @update:model-value="updateItem(sIndex, iIndex, { imageUrl: String($event) })" />
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
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: MenuBlock['data']]
}>()

const { t } = useI18n()

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
