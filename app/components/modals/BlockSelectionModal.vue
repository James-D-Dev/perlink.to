<template>
  <UModal
    :open="open"
    :title="t('blocks.picker.title')"
    :ui="{ content: 'sm:max-w-3xl', body: 'p-0 sm:p-0' }"
    @update:open="$emit('update:open', $event)"
  >
    <template #body>
      <!-- Fixed height: switching category or typing a search shouldn't make the dialog jump -->
      <div class="flex h-[min(38rem,80vh)] flex-col">
        <!-- One box: search the blocks, or paste a link and we'll pick the block -->
        <div class="border-b border-line p-4 sm:px-5">
          <UInput
            ref="searchRef"
            v-model="query"
            icon="i-lucide-search"
            size="xl"
            :placeholder="t('blocks.picker.searchPlaceholder')"
            class="w-full"
            :ui="{ base: 'rounded-full bg-sand/70 ring-0 focus-visible:ring-2' }"
            @keydown.enter.prevent="onEnter"
          />
        </div>

        <div class="flex min-h-0 flex-1 flex-col sm:flex-row">
          <!-- Categories -->
          <nav v-if="!query" class="flex shrink-0 gap-1 overflow-x-auto border-b border-line p-3 sm:w-48 sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-r">
            <button
              v-for="cat in categories"
              :key="cat.key"
              type="button"
              class="flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors"
              :class="category === cat.key ? 'bg-sand font-medium text-ink' : 'text-ink-soft hover:bg-sand/60'"
              @click="category = cat.key"
            >
              <UIcon :name="cat.icon" class="size-4" />
              {{ cat.label }}
            </button>
          </nav>

          <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
            <!-- A pasted link -->
            <button
              v-if="pasted"
              type="button"
              class="flex w-full items-center gap-3 rounded-2xl bg-ink p-4 text-left text-paper transition hover:bg-ink-soft"
              @click="addPasted"
            >
              <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-paper/15">
                <UIcon :name="pasted.icon" class="size-5" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-semibold">{{ pasted.label }}</span>
                <span class="block truncate text-xs text-paper/70">{{ pasted.url }}</span>
              </span>
              <span class="shrink-0 text-xs font-medium">{{ t('blocks.picker.pasteAdd') }} ↵</span>
            </button>

            <!-- The most used, large -->
            <div v-if="!query && category === 'suggested'" class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button
                v-for="block in quick"
                :key="block.id"
                type="button"
                class="flex flex-col items-start gap-6 rounded-2xl bg-sand/70 p-3.5 text-left transition-colors hover:bg-sand disabled:opacity-50"
                :disabled="isAdded(block.id)"
                @click="selectBlock(block.id)"
              >
                <span class="text-sm font-medium text-ink">{{ block.label }}</span>
                <UIcon :name="block.icon" class="size-5 text-ink-soft" />
              </button>
            </div>

            <div>
              <p v-if="listTitle" class="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-ink-muted">{{ listTitle }}</p>
              <ul v-if="list.length" class="space-y-1">
                <li v-for="block in list" :key="block.id">
                  <button
                    type="button"
                    class="group flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors hover:bg-sand/60 disabled:cursor-default disabled:opacity-55 disabled:hover:bg-transparent"
                    :disabled="isAdded(block.id)"
                    @click="selectBlock(block.id)"
                  >
                    <span class="flex size-11 shrink-0 items-center justify-center rounded-xl" :class="block.tint">
                      <UIcon :name="block.icon" class="size-5" />
                    </span>
                    <span class="min-w-0 flex-1">
                      <span class="flex items-center gap-2">
                        <span class="text-sm font-medium text-ink">{{ block.label }}</span>
                        <span v-if="isAdded(block.id)" class="inline-flex items-center gap-0.5 rounded-full bg-sand px-1.5 py-0.5 text-[10px] font-medium text-ink-muted">
                          <UIcon name="i-lucide-check" class="size-3" />
                          {{ t('blocks.picker.added') }}
                        </span>
                      </span>
                      <span class="mt-0.5 line-clamp-1 text-xs text-ink-muted">{{ block.description }}</span>
                    </span>
                    <UIcon v-if="!isAdded(block.id)" name="i-lucide-chevron-right" class="size-4 shrink-0 text-ink-faint transition group-hover:translate-x-0.5 group-hover:text-ink" />
                  </button>
                </li>
              </ul>
              <p v-else-if="!pasted" class="py-10 text-center text-sm text-ink-muted">{{ t('blocks.picker.noResults', { query }) }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { SOCIAL_PROVIDERS } from '~/types/bio'

export interface BlockSeed {
  /** e.g. a pasted video address, or a social link to append */
  url?: string
  provider?: string
}

interface BlockOption {
  id: string
  key: string
  icon: string
  group: 'content' | 'business' | 'extras'
  /** Extra words people may search for */
  keywords: string
}

const props = withDefaults(defineProps<{
  open: boolean
  enabledBlocks?: string[]
}>(), {
  enabledBlocks: () => [],
})

const emit = defineEmits<{
  'update:open': [value: boolean]
  select: [blockId: string, seed?: BlockSeed]
}>()

const { t } = useI18n()

const BLOCKS: BlockOption[] = [
  { id: 'links', key: 'links', icon: 'i-lucide-link', group: 'content', keywords: 'link url website button liên kết nút' },
  { id: 'social', key: 'social', icon: 'i-lucide-at-sign', group: 'content', keywords: 'instagram facebook tiktok zalo youtube mạng xã hội' },
  { id: 'text', key: 'text', icon: 'i-lucide-text', group: 'content', keywords: 'about intro paragraph giới thiệu văn bản đoạn' },
  { id: 'image-album', key: 'imageAlbum', icon: 'i-lucide-images', group: 'content', keywords: 'photo gallery picture ảnh hình album' },
  { id: 'video', key: 'video', icon: 'i-lucide-clapperboard', group: 'content', keywords: 'youtube tiktok vimeo video clip' },
  { id: 'menu', key: 'menu', icon: 'i-lucide-utensils', group: 'business', keywords: 'price list services rooms thực đơn bảng giá dịch vụ phòng món' },
  { id: 'hours', key: 'hours', icon: 'i-lucide-clock', group: 'business', keywords: 'opening hours giờ mở cửa lịch' },
  { id: 'contact', key: 'contact', icon: 'i-lucide-map-pin', group: 'business', keywords: 'address phone map email địa chỉ điện thoại bản đồ liên hệ' },
  { id: 'form', key: 'form', icon: 'i-lucide-calendar-check', group: 'business', keywords: 'booking reservation appointment rsvp đặt lịch đặt bàn đặt chỗ form' },
  { id: 'testimonials', key: 'testimonials', icon: 'i-lucide-quote', group: 'business', keywords: 'reviews feedback đánh giá cảm nhận khách hàng' },
  { id: 'vietqr', key: 'vietqr', icon: 'i-lucide-qr-code', group: 'extras', keywords: 'bank transfer payment donate qr chuyển khoản thanh toán ủng hộ ngân hàng' },
  { id: 'birthday-countdown', key: 'birthdayCountdown', icon: 'i-lucide-cake', group: 'extras', keywords: 'countdown birthday event đếm ngược sinh nhật sự kiện' },
]

const TINT = {
  content: 'bg-sky-50 text-sky-700',
  business: 'bg-amber-50 text-amber-700',
  extras: 'bg-rose-50 text-rose-700',
} as const

const QUICK = ['links', 'text', 'image-album', 'form']

type Category = 'suggested' | 'content' | 'business' | 'extras'
const category = ref<Category>('suggested')
const query = ref('')
const searchRef = ref<{ inputRef?: HTMLInputElement } | null>(null)

const categories = computed(() => [
  { key: 'suggested' as const, label: t('blocks.picker.suggested'), icon: 'i-lucide-sparkles' },
  { key: 'content' as const, label: t('blocks.picker.groups.content'), icon: 'i-lucide-layout-list' },
  { key: 'business' as const, label: t('blocks.picker.groups.business'), icon: 'i-lucide-store' },
  { key: 'extras' as const, label: t('blocks.picker.groups.extras'), icon: 'i-lucide-gift' },
])

const options = computed(() => BLOCKS.map(b => ({
  ...b,
  tint: TINT[b.group],
  label: t(`blocks.picker.items.${b.key}.label`),
  description: t(`blocks.picker.items.${b.key}.description`),
})))

const quick = computed(() => QUICK.map(id => options.value.find(o => o.id === id)!))

// Fold Vietnamese marks so "dat lich" finds "đặt lịch"
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase()

const list = computed(() => {
  if (query.value && !pasted.value) {
    const q = fold(query.value.trim())
    return options.value.filter(o => fold(`${o.label} ${o.description} ${o.keywords}`).includes(q))
  }
  if (query.value) return []
  // Suggested: what the page doesn't have yet, business blocks first
  if (category.value === 'suggested') {
    const order = { business: 0, content: 1, extras: 2 }
    return options.value
      .filter(o => !isAdded(o.id) && !QUICK.includes(o.id))
      .sort((a, b) => order[a.group] - order[b.group])
  }
  return options.value.filter(o => o.group === category.value)
})

const listTitle = computed(() => {
  if (query.value) return pasted.value ? '' : t('blocks.picker.results')
  return category.value === 'suggested' ? t('blocks.picker.more') : ''
})

// ---- Pasted links ----

const SOCIAL_HOSTS: Record<string, string> = {
  'instagram.com': 'instagram',
  'tiktok.com': 'tiktok',
  'facebook.com': 'facebook',
  'fb.com': 'facebook',
  'zalo.me': 'zalo',
  'x.com': 'twitter',
  'twitter.com': 'twitter',
  'linkedin.com': 'linkedin',
  'threads.net': 'threads',
  'github.com': 'github',
  't.me': 'telegram',
  'wa.me': 'whatsapp',
  'youtube.com': 'youtube',
  'pinterest.com': 'pinterest',
  'spotify.com': 'spotify',
}

const pasted = computed<{ block: string; seed: BlockSeed; url: string; label: string; icon: string } | null>(() => {
  const raw = query.value.trim()
  if (!/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(raw) || !raw.includes('.')) return null
  const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  let host = ''
  try {
    host = new URL(url).hostname.replace(/^(www|m|vm|vt|open)\./, '')
  } catch {
    return null
  }
  if (videoEmbed(url)) return { block: 'video', seed: { url }, url, label: t('blocks.picker.paste.video'), icon: 'i-lucide-clapperboard' }
  if (/(^|\.)google\.[a-z.]+$/.test(host) && url.includes('/maps') || host === 'maps.app.goo.gl' || host === 'goo.gl') {
    return { block: 'contact', seed: { url }, url, label: t('blocks.picker.paste.map'), icon: 'i-lucide-map-pin' }
  }
  const provider = SOCIAL_HOSTS[host]
  if (provider) {
    const name = SOCIAL_PROVIDERS.find(p => p.key === provider)?.label ?? provider
    return { block: 'social', seed: { url, provider }, url, label: t('blocks.picker.paste.social', { name }), icon: SOCIAL_PROVIDERS.find(p => p.key === provider)?.icon ?? 'i-lucide-at-sign' }
  }
  return { block: 'links', seed: { url }, url, label: t('blocks.picker.paste.link'), icon: 'i-lucide-link' }
})

function addPasted() {
  if (!pasted.value) return
  emit('select', pasted.value.block, pasted.value.seed)
  close()
}

function onEnter() {
  if (pasted.value) return addPasted()
  const first = list.value.find(o => !isAdded(o.id))
  if (first) selectBlock(first.id)
}

// Repeatable blocks (links, text, gallery, menu, video) can always be added again
function isAdded(blockId: string) {
  return !isRepeatableBlock(blockId) && props.enabledBlocks.includes(blockId)
}

function selectBlock(blockId: string) {
  emit('select', blockId)
  close()
}

function close() {
  emit('update:open', false)
}

// Fresh each time, with the cursor in the box
watch(() => props.open, (open) => {
  if (!open) return
  query.value = ''
  category.value = 'suggested'
  nextTick(() => searchRef.value?.inputRef?.focus())
})
</script>
