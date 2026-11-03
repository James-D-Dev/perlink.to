<template>
  <section class="@container space-y-4">
    <h2 v-if="data.title" class="text-[17px]" :style="headingStyle">{{ data.title }}</h2>

    <div v-for="section in sections" :key="section.id" class="space-y-3">
      <h3 v-if="section.name" class="text-xs font-semibold uppercase tracking-[0.14em] opacity-70" :style="{ color: headingStyle?.color, textAlign: headingStyle?.textAlign }">
        {{ section.name }}
      </h3>

      <!-- List: one card per section with rows -->
      <div v-if="data.layout !== 'cards'" class="divide-y divide-current/10 overflow-hidden px-4" :style="cardStyle">
        <div v-for="item in section.items" :key="item.id" class="flex gap-3 py-3.5" :class="item.soldOut && 'opacity-55'">
          <button v-if="item.imageUrl" type="button" class="group relative size-16 shrink-0 overflow-hidden rounded-lg" :aria-label="`${t('viewPhoto')}: ${item.name}`" @click="viewing = { ...item, suffix: section.priceSuffix }">
            <img :src="item.imageUrl" :alt="item.name" class="size-full object-cover transition-transform duration-300 group-hover:scale-105" loading="lazy">
          </button>
          <div class="min-w-0 flex-1">
            <div class="flex items-baseline gap-2">
              <p class="font-medium">{{ item.name }}</p>
              <span v-if="item.soldOut" class="shrink-0 rounded-full border border-current/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">{{ t('soldOut') }}</span>
              <span v-else-if="item.tag" class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" :style="tagStyle">{{ item.tag }}</span>
              <span class="flex-1 border-b border-dotted border-current/25" />
              <p v-if="item.price" class="shrink-0 font-semibold tabular-nums" :class="item.soldOut && 'line-through'">{{ formatPrice(item.price, section.priceSuffix) }}</p>
            </div>
            <p v-if="item.description" class="mt-0.5 text-sm opacity-75">{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- Cards: one card per item (e.g. hotel rooms) -->
      <div v-else class="grid grid-cols-1 gap-2.5 @md:grid-cols-2">
        <div v-for="item in section.items" :key="item.id" class="overflow-hidden" :class="item.soldOut && 'opacity-55'" :style="cardStyle">
          <button v-if="item.imageUrl" type="button" class="group block w-full overflow-hidden" :aria-label="`${t('viewPhoto')}: ${item.name}`" @click="viewing = { ...item, suffix: section.priceSuffix }">
            <img :src="item.imageUrl" :alt="item.name" class="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy">
          </button>
          <div class="space-y-1 p-4">
            <div class="flex items-start justify-between gap-2">
              <p class="font-semibold">{{ item.name }}</p>
              <span v-if="item.soldOut" class="shrink-0 rounded-full border border-current/30 px-2 py-0.5 text-[10px] font-semibold uppercase">{{ t('soldOut') }}</span>
              <span v-else-if="item.tag" class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide" :style="tagStyle">{{ item.tag }}</span>
            </div>
            <p v-if="item.description" class="text-sm opacity-70">{{ item.description }}</p>
            <p v-if="item.price" class="pt-1.5 font-semibold tabular-nums" :class="item.soldOut && 'line-through'">{{ formatPrice(item.price, section.priceSuffix) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- A dish or room photo, full screen: tap anywhere or press Esc to close -->
    <Teleport to="body">
      <Transition enter-from-class="opacity-0" enter-active-class="transition duration-200" leave-to-class="opacity-0" leave-active-class="transition duration-150">
        <div
          v-if="viewing"
          class="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 text-white backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          :aria-label="viewing.name"
          @click="viewing = null"
        >
          <button type="button" class="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] flex size-10 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25" :aria-label="t('closePhoto')" @click.stop="viewing = null">
            <UIcon name="i-lucide-x" class="size-5" />
          </button>
          <img :src="viewing.imageUrl" :alt="viewing.name" class="menu-zoom max-h-[75vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl">
          <div class="mt-4 max-w-md text-center">
            <p class="text-lg font-semibold">{{ viewing.name }}</p>
            <p v-if="viewing.description" class="mt-1 text-sm text-white/70">{{ viewing.description }}</p>
            <p v-if="viewing.price" class="mt-2 inline-block rounded-full bg-white/15 px-3 py-1 text-sm font-semibold tabular-nums">{{ formatPrice(viewing.price, viewing.suffix) }}</p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import type { MenuBlock, MenuItem } from '~/types/bio'

const props = defineProps<{
  data: MenuBlock['data']
  cardStyle: Record<string, string | undefined>
  headingStyle?: Record<string, any>
  /** The page's filled button, whose colour the tags take */
  accentStyle?: Record<string, any>
}>()

const { t } = useSiteI18n()

// Tags like "Best seller" in the page's accent, softly
const tagStyle = computed(() => {
  const accent = props.accentStyle?.backgroundColor
  return accent
    ? { backgroundColor: `color-mix(in srgb, ${accent} 16%, transparent)`, color: 'inherit', boxShadow: `inset 0 0 0 1px color-mix(in srgb, ${accent} 35%, transparent)` }
    : { backgroundColor: 'color-mix(in srgb, currentColor 10%, transparent)' }
})

// The photo open full screen
const viewing = ref<(MenuItem & { suffix?: string }) | null>(null)
function onKey(event: KeyboardEvent) {
  if (event.key === 'Escape') viewing.value = null
}
watch(viewing, (item) => {
  if (!import.meta.client) return
  if (item) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
})
onBeforeUnmount(() => import.meta.client && window.removeEventListener('keydown', onKey))

const sections = computed(() =>
  (props.data.sections || [])
    .map(s => ({ ...s, items: s.items.filter(i => i.name) }))
    .filter(s => s.items.length),
)

// A section's own suffix ("/ month") wins over the list's
function formatPrice(price: string, sectionSuffix?: string) {
  return formatListPrice(price, props.data.currency, sectionSuffix?.trim() ? sectionSuffix : props.data.priceSuffix || '')
}
</script>

<style scoped>
.menu-zoom {
  animation: menu-zoom 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes menu-zoom {
  from { transform: scale(0.94); opacity: 0.4; }
  to { transform: scale(1); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .menu-zoom { animation: none; }
}
</style>
