<template>
  <div class="bg-white dark:bg-white/[0.04] dark:backdrop-blur-xl rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
    <BioBlockItemHeader
      :is-active="isActive"
      :hidden="productsBlock?.hidden"
      :title="data.title || t('blocks.products.title')"
      block="products"
      @toggle="$emit('toggle')"
      @toggle-hidden="toggleBlockHidden('products')"
    >
      <template #preview>
        <span class="text-xs text-gray-500 dark:text-neutral-400 mr-2">{{ t('blocks.products.itemCount', { n: data.items.length }, data.items.length) }}</span>
      </template>
    </BioBlockItemHeader>

    <div v-if="isActive" class="p-3 sm:p-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.03] space-y-4">
      <UFormField :label="t('blocks.products.titleLabel')">
        <UInput :model-value="data.title" :placeholder="t('blocks.products.titlePlaceholder')" class="w-full" @update:model-value="update({ title: String($event) })" />
      </UFormField>

      <UFormField :label="t('blocks.products.layout')">
        <BioVisualPicker :model-value="data.layout" :options="layouts" :cols="2" @update:model-value="update({ layout: $event })">
          <template #preview="{ value }">
            <span v-if="value === 'grid'" class="grid w-4/5 grid-cols-2 gap-1">
              <span v-for="i in 2" :key="i" class="flex flex-col gap-0.5 rounded-sm bg-white p-0.5 shadow-sm dark:bg-white/10">
                <span class="h-5 rounded-[2px] bg-gray-300 dark:bg-white/25" />
                <span class="h-0.5 w-3/4 rounded-full bg-gray-400 dark:bg-white/40" />
                <span class="h-1 rounded-full bg-gray-500 dark:bg-white/50" />
              </span>
            </span>
            <span v-else class="flex w-4/5 flex-col gap-1">
              <span v-for="i in 2" :key="i" class="flex gap-1 rounded-sm bg-white p-0.5 shadow-sm dark:bg-white/10">
                <span class="size-4 rounded-[2px] bg-gray-300 dark:bg-white/25" />
                <span class="flex flex-1 flex-col justify-center gap-0.5">
                  <span class="h-0.5 w-3/4 rounded-full bg-gray-400 dark:bg-white/40" />
                  <span class="h-0.5 w-1/2 rounded-full bg-gray-300 dark:bg-white/25" />
                </span>
              </span>
            </span>
          </template>
        </BioVisualPicker>
      </UFormField>

      <!-- Ordering on the page -->
      <div class="space-y-3 rounded-lg border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <label class="flex cursor-pointer items-start justify-between gap-3">
          <span>
            <span class="block text-sm font-medium text-highlighted">{{ t('blocks.products.ordering') }}</span>
            <span class="block text-xs text-muted">{{ t('blocks.products.orderingHelp') }}</span>
          </span>
          <USwitch :model-value="data.ordering" @update:model-value="update({ ordering: $event })" />
        </label>
        <template v-if="data.ordering">
          <label class="flex cursor-pointer items-center justify-between gap-3">
            <span class="text-sm text-highlighted">{{ t('blocks.products.askAddress') }}</span>
            <USwitch :model-value="data.askAddress" @update:model-value="update({ askAddress: $event })" />
          </label>
          <UFormField :label="t('blocks.products.payment')">
            <USelect :model-value="data.payment" :items="paymentItems" class="w-full" @update:model-value="update({ payment: $event as ProductPayment })" />
          </UFormField>
          <p v-if="data.payment !== 'cod' && !bankReady" class="flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            <UIcon name="i-lucide-info" class="mt-0.5 size-3.5 shrink-0" />
            {{ t('blocks.products.needBank') }}
          </p>
        </template>
      </div>

      <!-- Products -->
      <div v-for="(item, index) in data.items" :key="item.id" class="space-y-2.5 rounded-lg border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <div class="flex gap-3">
          <!-- Photo -->
          <label class="relative flex size-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-accented bg-default text-muted hover:border-inverted dark:border-white/15" :title="t('blocks.products.photo')">
            <img v-if="item.imageUrl" :src="item.imageUrl" alt="" class="size-full object-cover">
            <UIcon v-else-if="uploadingItem === item.id" name="i-lucide-loader-circle" class="size-5 animate-spin" />
            <UIcon v-else name="i-lucide-image-plus" class="size-5" />
            <input type="file" accept="image/*" class="hidden" @change="onPhoto($event, index, item.id)">
          </label>
          <div class="min-w-0 flex-1 space-y-2">
            <UInput :model-value="item.name" :placeholder="t('blocks.products.namePlaceholder')" class="w-full" @update:model-value="updateItem(index, { name: String($event) })" />
            <div class="grid grid-cols-2 gap-2">
              <UInput
                :model-value="item.price"
                type="number"
                min="0"
                step="1000"
                inputmode="numeric"
                :placeholder="t('blocks.products.price')"
                class="w-full"
                :ui="{ trailing: 'pointer-events-none text-xs text-muted' }"
                @update:model-value="updateItem(index, { price: toPrice($event) })"
              >
                <template #trailing>đ</template>
              </UInput>
              <UInput
                :model-value="item.comparePrice"
                type="number"
                min="0"
                step="1000"
                inputmode="numeric"
                :placeholder="t('blocks.products.comparePrice')"
                class="w-full"
                :ui="{ trailing: 'pointer-events-none text-xs text-muted' }"
                @update:model-value="updateItem(index, { comparePrice: toPrice($event) })"
              >
                <template #trailing>đ</template>
              </UInput>
            </div>
          </div>
        </div>

        <UTextarea :model-value="item.description" :placeholder="t('blocks.products.descriptionPlaceholder')" :rows="1" autoresize class="w-full" @update:model-value="updateItem(index, { description: String($event) })" />

        <!-- Store link: buy elsewhere instead of ordering here -->
        <UInput
          :model-value="item.url"
          :placeholder="t('blocks.products.urlPlaceholder')"
          class="w-full"
          :icon="productStore(item.url)?.icon ?? 'i-lucide-link'"
          @update:model-value="updateItem(index, { url: String($event).trim() || undefined })"
          @blur="fillFromLink(index)"
        >
          <template v-if="fetchingItem === item.id" #trailing>
            <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin text-muted" />
          </template>
        </UInput>
        <p class="-mt-1 text-xs text-muted">
          {{ item.url ? t('blocks.products.urlHelpStore', { store: productStore(item.url)?.name ?? t('blocks.products.website') }) : data.ordering ? t('blocks.products.urlHelpOrder') : t('blocks.products.urlHelp') }}
        </p>

        <div class="flex flex-wrap items-center gap-2">
          <UInput :model-value="item.tag" :placeholder="t('blocks.products.tagPlaceholder')" class="min-w-0 flex-1" @update:model-value="updateItem(index, { tag: String($event) })" />
          <label class="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-muted">
            <USwitch size="sm" :model-value="!!item.soldOut" @update:model-value="updateItem(index, { soldOut: $event })" />
            {{ t('blocks.products.soldOut') }}
          </label>
          <div class="flex shrink-0">
            <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-arrow-up" :disabled="index === 0" :aria-label="t('blocks.products.moveUp')" @click="move(index, -1)" />
            <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-arrow-down" :disabled="index === data.items.length - 1" :aria-label="t('blocks.products.moveDown')" @click="move(index, 1)" />
            <UButton variant="ghost" color="neutral" size="xs" icon="i-lucide-trash-2" :aria-label="t('common.delete')" @click="removeItem(index)" />
          </div>
        </div>
      </div>

      <UButton block variant="outline" color="neutral" icon="i-lucide-plus" :label="t('blocks.products.add')" @click="addItem" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { nanoid } from 'nanoid'
import type { BioBlock, ProductItem, ProductPayment, ProductsBlock } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

const props = defineProps<{
  isActive: boolean
  blocks: BioBlock[]
  bioPageId?: string
  /** The page has a VietQR block with a bank account, so transfers work */
  bankReady?: boolean
}>()

const emit = defineEmits<{
  toggle: []
  remove: []
  update: [data: ProductsBlock['data']]
}>()

const { t } = useI18n()
const toast = useToast()

const { getBlock, toggleBlockHidden } = useBioBlock({ blocks: toRef(props, 'blocks') })
const productsBlock = computed(() => getBlock<ProductsBlock>('products'))

const data = computed<ProductsBlock['data']>(() => ({
  ...(emptyBlockData('products') as ProductsBlock['data']),
  ...(productsBlock.value?.data || {}),
}))

const layouts = computed(() => [
  { value: 'grid' as const, label: t('blocks.products.layouts.grid'), icon: 'i-lucide-layout-grid' },
  { value: 'list' as const, label: t('blocks.products.layouts.list'), icon: 'i-lucide-list' },
])

const paymentItems = computed(() => [
  { value: 'both', label: t('blocks.products.payments.both') },
  { value: 'cod', label: t('blocks.products.payments.cod') },
  { value: 'transfer', label: t('blocks.products.payments.transfer') },
])

function update(patch: Partial<ProductsBlock['data']>) {
  emit('update', { ...data.value, ...patch })
}

function setItems(items: ProductItem[]) {
  update({ items })
}

function addItem() {
  setItems([...data.value.items, { id: nanoid(6), name: '' }])
}

function removeItem(index: number) {
  setItems(data.value.items.filter((_, i) => i !== index))
}

function updateItem(index: number, patch: Partial<ProductItem>) {
  setItems(data.value.items.map((item, i) => (i === index ? { ...item, ...patch } : item)))
}

function move(index: number, by: number) {
  const items = [...data.value.items]
  const [item] = items.splice(index, 1)
  items.splice(index + by, 0, item!)
  setItems(items)
}

const toPrice = (value: unknown) => {
  const n = Math.round(Number(value))
  return Number.isFinite(n) && n > 0 ? n : undefined
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
    toast.add({ title: t('blocks.products.photoFailed'), color: 'error' })
  } finally {
    uploadingItem.value = null
  }
}

// A pasted store link fills in an empty name and photo when the store allows it
const fetchingItem = ref<string | null>(null)
async function fillFromLink(index: number) {
  const item = data.value.items[index]
  if (!item?.url || (item.name && item.imageUrl)) return
  fetchingItem.value = item.id
  try {
    const meta = await $fetch<{ title?: string; image?: string; description?: string }>('/api/crawl-link', { method: 'POST', body: { url: safeWebUrl(item.url) } })
    const current = data.value.items.find(i => i.id === item.id)
    if (!current) return
    updateItem(data.value.items.indexOf(current), {
      name: current.name || meta.title?.slice(0, 120) || '',
      imageUrl: current.imageUrl || meta.image || undefined,
      description: current.description || meta.description?.slice(0, 200) || undefined,
    })
  } catch {
    // Many stores block this; the owner fills it in by hand
  } finally {
    fetchingItem.value = null
  }
}
</script>
