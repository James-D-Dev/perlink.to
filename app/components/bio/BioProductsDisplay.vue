<template>
  <section class="@container space-y-3">
    <h2 v-if="data.title" class="text-[17px]" :style="headingStyle">{{ data.title }}</h2>

    <div :class="data.layout === 'list' ? 'space-y-2.5' : 'grid grid-cols-2 gap-2.5 @lg:grid-cols-3'">
      <article
        v-for="item in items"
        :key="item.id"
        class="flex overflow-hidden"
        :class="[data.layout === 'list' ? 'flex-row items-stretch' : 'flex-col', item.soldOut && 'opacity-60']"
        :style="cardStyle"
      >
        <!-- Photo, with the discount on it -->
        <div class="relative shrink-0 bg-current/5" :class="data.layout === 'list' ? 'w-28 self-stretch' : 'aspect-square w-full'">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="absolute inset-0 size-full object-cover" loading="lazy">
          <UIcon v-else name="i-lucide-shopping-bag" class="absolute left-1/2 top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 opacity-30" />
          <span v-if="discount(item)" class="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold text-white">-{{ discount(item) }}%</span>
        </div>

        <div class="flex min-w-0 flex-1 flex-col gap-1 p-3">
          <div class="flex flex-wrap items-center gap-1.5">
            <span v-if="item.soldOut" class="rounded-full border border-current/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{{ t('soldOut') }}</span>
            <span v-else-if="item.tag" class="rounded-full bg-current/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{{ item.tag }}</span>
          </div>
          <p class="line-clamp-2 text-[15px] font-semibold leading-snug">{{ item.name }}</p>
          <p v-if="item.description" class="line-clamp-2 text-[13px] leading-snug opacity-70">{{ item.description }}</p>
          <p v-if="item.price" class="mt-auto flex flex-wrap items-baseline gap-x-1.5 pt-1 tabular-nums">
            <span class="font-bold">{{ formatVnd(item.price) }}</span>
            <span v-if="discount(item)" class="text-xs line-through opacity-50">{{ formatVnd(item.comparePrice!) }}</span>
          </p>

          <!-- Buy elsewhere, or order here -->
          <a
            v-if="item.url && !item.soldOut"
            :href="safeWebUrl(item.url)"
            target="_blank"
            rel="noopener noreferrer"
            class="mt-2 flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-semibold"
            :style="buttonStyle"
            @click="onStoreClick($event)"
          >
            <UIcon :name="productStore(item.url)?.icon ?? 'i-lucide-external-link'" class="size-4 shrink-0" />
            <span class="truncate">{{ productStore(item.url) ? t('shopBuyOn', { store: productStore(item.url)!.name }) : t('shopBuy') }}</span>
          </a>
          <button
            v-else-if="data.ordering && canOrder && !item.soldOut"
            type="button"
            class="mt-2 flex items-center justify-center gap-1.5 px-3 py-2 text-[13px] font-semibold"
            :style="buttonStyle"
            @click="openOrder(item)"
          >
            <UIcon name="i-lucide-shopping-bag" class="size-4 shrink-0" />
            {{ t('shopOrder') }}
          </button>
        </div>
      </article>
    </div>

    <BioOrderSheet v-model:product="ordering" :data="data" :block-id="blockId" :username="username" :preview="preview" :can-transfer="canTransfer" :accent="[buttonStyle.backgroundColor, buttonStyle.color]" />
  </section>
</template>

<script setup lang="ts">
import type { ProductItem, ProductsBlock } from '~/types/bio'
import { formatVnd } from '#shared/plans'

const props = defineProps<{
  data: ProductsBlock['data']
  blockId: string
  username: string
  /** Editor previews and template thumbnails never order */
  preview?: boolean
  /** The page has a bank account (VietQR block) to pay by transfer */
  canTransfer?: boolean
  cardStyle: Record<string, string | undefined>
  buttonStyle: Record<string, string | undefined>
  headingStyle?: Record<string, any>
}>()

const { t } = useSiteI18n()

const items = computed(() => (props.data.items || []).filter(i => i.name))

const discount = (item: ProductItem) =>
  item.price && item.comparePrice && item.comparePrice > item.price ? Math.round((1 - item.price / item.comparePrice) * 100) : 0

function onStoreClick(event: MouseEvent) {
  if (props.preview) {
    event.preventDefault()
    return
  }
  trackVisitorAction(props.username, 'store', 'view')
}

// Ordering happens in BioOrderSheet; in the editor it opens too, so owners
// see what customers fill in
const ordering = ref<ProductItem | null>(null)
const canOrder = computed(() => productPaymentOptions(props.data.payment, props.canTransfer).length > 0)

function openOrder(item: ProductItem) {
  ordering.value = item
}
</script>
