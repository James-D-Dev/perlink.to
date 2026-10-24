<template>
  <section class="@container space-y-4">
    <h2 v-if="data.title" class="text-[17px]" :style="headingStyle">{{ data.title }}</h2>

    <div v-for="section in sections" :key="section.id" class="space-y-3">
      <h3 v-if="section.name" class="text-xs font-semibold uppercase tracking-[0.14em] opacity-70" :style="{ color: headingStyle?.color, textAlign: headingStyle?.textAlign }">
        {{ section.name }}
      </h3>

      <!-- List: one card per section with rows -->
      <div v-if="data.layout !== 'cards'" class="divide-y divide-current/10 overflow-hidden px-4" :style="cardStyle">
        <div v-for="item in section.items" :key="item.id" class="flex gap-3 py-3.5">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="size-16 shrink-0 rounded-lg object-cover" loading="lazy">
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline gap-2">
              <p class="font-medium">{{ item.name }}</p>
              <span v-if="item.tag" class="rounded-full bg-current/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{{ item.tag }}</span>
              <span class="flex-1 border-b border-dotted border-current/25" />
              <p v-if="item.price" class="shrink-0 font-semibold tabular-nums">{{ formatPrice(item.price) }}</p>
            </div>
            <p v-if="item.description" class="mt-0.5 text-sm opacity-75">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- Cards: one card per item (e.g. hotel rooms) -->
      <div v-else class="grid grid-cols-1 gap-2.5 @md:grid-cols-2">
        <div v-for="item in section.items" :key="item.id" class="overflow-hidden" :style="cardStyle">
          <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" class="aspect-[4/3] w-full object-cover" loading="lazy">
          <div class="space-y-1 p-4">
            <div class="flex items-start justify-between gap-2">
              <p class="font-semibold">{{ item.name }}</p>
              <span v-if="item.tag" class="shrink-0 rounded-full bg-current/10 px-2 py-0.5 text-[10px] font-semibold uppercase">{{ item.tag }}</span>
            </div>
            <p v-if="item.description" class="text-sm opacity-70">{{ item.description }}</p>
            <p v-if="item.price" class="pt-1.5 font-semibold tabular-nums">{{ formatPrice(item.price) }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { MenuBlock } from '~/types/bio'

const props = defineProps<{
  data: MenuBlock['data']
  cardStyle: Record<string, string | undefined>
  headingStyle?: Record<string, any>
}>()

const sections = computed(() =>
  (props.data.sections || [])
    .map(s => ({ ...s, items: s.items.filter(i => i.name) }))
    .filter(s => s.items.length),
)

function formatPrice(price: string) {
  const currency = props.data.currency?.trim()
  const suffix = props.data.priceSuffix || ''
  if (!currency || price.includes(currency)) return `${price}${suffix}`
  // Symbols like $ € go before the number, codes and ₫ after
  const before = ['$', '€', '£', '¥'].includes(currency)
  return `${before ? currency : ''}${price}${before ? '' : ` ${currency}`}${suffix}`
}
</script>
