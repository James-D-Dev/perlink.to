<template>
  <div class="fixed inset-0 bg-slate-900 [touch-action:pan-x_pan-y] max-sm:[&_input]:text-base max-sm:[&_textarea]:text-base">
    <RoomCanvas
      ref="canvasRef"
      :room="room"
      intro
      :force-mode="forceMode"
      :guests="guestGifts"
      :products="shopProducts"
      :shop-accent="accent"
      :sold-out-label="t('soldOut')"
      @hover="onHover"
      @activate="onActivate"
      @guest-hover="onGuestHover"
      @guest-activate="openNote"
    />

    <!-- Profile (tap to switch to the 2D page) + controls -->
    <div class="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3 sm:p-4">
      <UTooltip :text="t('switchTo2d')" :content="{ side: 'bottom', align: 'start' }">
        <button
          type="button"
          class="group pointer-events-auto flex min-w-0 max-w-[16rem] items-center gap-2.5 rounded-2xl bg-black/30 p-1.5 pr-3 text-left text-white shadow-lg ring-1 ring-white/15 backdrop-blur-xl transition hover:bg-black/40"
          :class="{ 'py-2 pl-3': !avatarUrl }"
          :aria-label="t('switchTo2d')"
          @click="emit('switch2d')"
        >
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="title"
            class="size-9 shrink-0 rounded-full object-cover ring-1 ring-white/20"
          >
          <div class="min-w-0 flex-1">
            <h1 class="truncate text-sm font-semibold">{{ title }}</h1>
            <p v-if="bio" class="truncate text-[11px] text-white/70">{{ bio }}</p>
          </div>
          <UIcon name="i-lucide-layout-list" class="size-4 shrink-0 text-white/60 transition group-hover:text-white" />
        </button>
      </UTooltip>

      <div class="pointer-events-auto flex items-center gap-2">
        <!-- Guestbook -->
        <button
          v-if="guestbookOn"
          type="button"
          class="flex h-10 items-center gap-1.5 rounded-full bg-white/90 px-3.5 text-sm font-semibold text-gray-900 shadow-lg ring-1 ring-white/30 backdrop-blur-xl transition hover:bg-white"
          @click="openGuestbook"
        >
          <span aria-hidden="true">💌</span>
          <span class="max-sm:hidden">{{ t('guestbook') }}</span>
          <span v-if="guestTotal" class="rounded-full bg-gray-900/10 px-1.5 text-xs tabular-nums">{{ guestTotal }}</span>
        </button>
        <UTooltip v-if="track" :text="musicOn ? t('muteMusic') : t('playMusic', { title: track.title })">
          <button
            type="button"
            class="flex size-10 items-center justify-center rounded-full shadow-lg ring-1 backdrop-blur-xl transition"
            :class="musicOn ? 'bg-white/25 text-white ring-white/30' : 'bg-black/30 text-white/80 ring-white/15 hover:bg-black/40'"
            :aria-label="musicOn ? t('muteMusic') : t('playMusic', { title: track.title })"
            data-music-toggle
            @click="toggleMusic"
          >
            <UIcon :name="musicOn ? 'i-lucide-volume-2' : 'i-lucide-volume-x'" class="size-5" />
          </button>
        </UTooltip>
        <UTooltip :text="isDayShown ? t('switchToNight') : t('switchToDay')">
          <button
            type="button"
            class="flex size-10 items-center justify-center rounded-full bg-black/30 text-white/80 shadow-lg ring-1 ring-white/15 backdrop-blur-xl transition hover:bg-black/40"
            :aria-label="isDayShown ? t('switchToNight') : t('switchToDay')"
            @click="toggleDayNight"
          >
            <UIcon :name="isDayShown ? 'i-lucide-moon' : 'i-lucide-sun'" class="size-5" />
          </button>
        </UTooltip>
      </div>
    </div>

    <!-- Photo popup for picture frames -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="photo"
        class="absolute inset-0 z-20 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
        role="dialog"
        aria-modal="true"
        :aria-label="t('viewPhoto')"
        @click.self="photo = null"
      >
        <div class="relative flex max-h-full max-w-full flex-col items-center gap-3">
          <img
            :src="photo.image"
            alt="Photo"
            class="max-h-[78vh] max-w-[min(92vw,64rem)] rounded-2xl object-contain shadow-2xl ring-1 ring-white/15"
          >
          <a
            v-if="photo.link?.url"
            :href="safeUrl(photo.link.url)"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-1.5 rounded-full bg-black/30 px-4 py-2 text-sm font-medium text-white shadow-lg ring-1 ring-white/15 backdrop-blur-xl transition hover:bg-black/40"
          >
            {{ photo.link.label || hostOf(photo.link.url) }}
            <UIcon name="i-lucide-arrow-up-right" class="size-4" />
          </a>
          <button
            type="button"
            class="absolute -right-2 -top-2 flex size-9 items-center justify-center rounded-full bg-black/40 text-white shadow-lg ring-1 ring-white/20 backdrop-blur-xl transition hover:bg-black/60"
            :aria-label="t('closePhoto')"
            @click="photo = null"
          >
            <UIcon name="i-lucide-x" class="size-5" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- A product on a stand -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" leave-active-class="transition duration-150" leave-to-class="opacity-0">
      <div v-if="shopItem" class="absolute inset-0 z-30 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" @click.self="shopItem = null">
        <div class="relative w-full max-w-sm overflow-hidden rounded-t-3xl bg-white text-gray-900 shadow-2xl sm:rounded-3xl">
          <img v-if="shopItem.product.imageUrl" :src="shopItem.product.imageUrl" :alt="shopItem.product.name" class="aspect-square w-full object-cover">
          <div class="space-y-2 p-5">
            <span v-if="shopItem.product.tag && !shopItem.product.soldOut" class="inline-block rounded-full bg-gray-900/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide">{{ shopItem.product.tag }}</span>
            <p class="text-lg font-semibold leading-snug">{{ shopItem.product.name }}</p>
            <p v-if="shopItem.product.description" class="text-sm text-gray-600">{{ shopItem.product.description }}</p>
            <p v-if="shopItem.product.price" class="flex items-baseline gap-2 tabular-nums">
              <span class="text-xl font-bold" :style="{ color: accent }">{{ formatVnd(shopItem.product.price) }}</span>
              <span v-if="(shopItem.product.comparePrice ?? 0) > shopItem.product.price" class="text-sm text-gray-400 line-through">{{ formatVnd(shopItem.product.comparePrice!) }}</span>
            </p>
            <p v-if="shopItem.product.soldOut" class="text-sm font-semibold text-gray-500">{{ t('soldOut') }}</p>
            <a
              v-else-if="shopItem.product.url"
              :href="safeUrl(shopItem.product.url)"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-2 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[15px] font-semibold text-white"
              :style="{ backgroundColor: accent }"
              @click="trackVisitorAction(username ?? '', 'store', 'view')"
            >
              <UIcon :name="productStore(shopItem.product.url)?.icon ?? 'i-lucide-external-link'" class="size-4" />
              {{ productStore(shopItem.product.url) ? t('shopBuyOn', { store: productStore(shopItem.product.url)!.name }) : t('shopBuy') }}
            </a>
            <button
              v-else-if="shopItem.block.data.ordering && productPaymentOptions(shopItem.block.data.payment, canTransfer).length"
              type="button"
              class="mt-2 flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-[15px] font-semibold text-white"
              :style="{ backgroundColor: accent }"
              @click="orderFromStand"
            >
              <UIcon name="i-lucide-shopping-bag" class="size-4" />
              {{ t('shopOrder') }}
            </button>
          </div>
          <button type="button" class="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow backdrop-blur hover:bg-white" aria-label="Close" @click="shopItem = null">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
      </div>
    </Transition>
    <BioOrderSheet
      v-if="orderBlock && username"
      v-model:product="ordering"
      :data="orderBlock.data"
      :block-id="orderBlock.id!"
      :username="username"
      :can-transfer="canTransfer"
      :accent="accent"
    />

    <!-- A gift's message -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95" leave-active-class="transition duration-150" leave-to-class="opacity-0">
      <div v-if="note" class="absolute inset-0 z-30 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" @click.self="note = null">
        <div class="relative w-full max-w-sm rounded-3xl bg-[#fffaf3] p-6 text-center text-gray-900 shadow-2xl">
          <div class="text-5xl" aria-hidden="true">{{ GUEST_GIFT_EMOJI[note.gift] }}</div>
          <p class="mt-4 whitespace-pre-line text-[17px] leading-relaxed">{{ note.message }}</p>
          <p class="mt-4 text-sm font-semibold text-gray-600">{{ t('guestbookFrom', { name: note.name }) }}</p>
          <p class="mt-0.5 text-xs text-gray-400">{{ formatWhen(note.createdAt) }}</p>
          <button type="button" class="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-gray-500 hover:bg-black/5" aria-label="Close" @click="note = null">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>
      </div>
    </Transition>

    <!-- Guestbook panel: write a message, read the others -->
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="translate-y-full sm:translate-y-0 sm:translate-x-full" leave-active-class="transition duration-200 ease-in" leave-to-class="translate-y-full sm:translate-y-0 sm:translate-x-full">
      <aside
        v-if="guestbookPanel"
        class="absolute inset-x-0 bottom-0 z-30 flex max-h-[85dvh] flex-col rounded-t-3xl bg-[#fffaf3] text-gray-900 shadow-2xl sm:inset-y-3 sm:left-auto sm:right-3 sm:max-h-none sm:w-[380px] sm:rounded-3xl"
        :aria-label="t('guestbookTitle')"
      >
        <div class="flex items-start justify-between gap-3 px-5 pb-2 pt-5">
          <div>
            <h2 class="text-lg font-semibold">💌 {{ t('guestbookTitle') }}</h2>
            <p class="mt-0.5 text-sm text-gray-500">{{ t('guestbookIntro') }}</p>
          </div>
          <button type="button" class="flex size-8 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-black/5" aria-label="Close" @click="guestbookPanel = false">
            <UIcon name="i-lucide-x" class="size-4" />
          </button>
        </div>

        <div class="min-h-0 flex-1 overflow-y-auto px-5 pb-5">
          <!-- Write -->
          <form class="space-y-3 rounded-2xl bg-white p-4 ring-1 ring-black/5" @submit.prevent="sendGuestbook">
            <input v-model="guestForm.website" type="text" name="website" tabindex="-1" autocomplete="off" class="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true">
            <div>
              <p class="mb-1.5 text-xs font-medium text-gray-500">{{ t('guestbookGift') }}</p>
              <div class="grid grid-cols-6 gap-1.5">
                <button
                  v-for="gift in GUEST_GIFTS"
                  :key="gift"
                  type="button"
                  class="flex aspect-square items-center justify-center rounded-xl text-2xl ring-1 transition"
                  :class="guestForm.gift === gift ? 'bg-amber-50 ring-2 ring-amber-400' : 'ring-black/10 hover:bg-black/[0.03]'"
                  :title="t(GIFT_LABEL[gift])"
                  :aria-label="t(GIFT_LABEL[gift])"
                  :aria-pressed="guestForm.gift === gift"
                  @click="guestForm.gift = gift"
                >
                  {{ GUEST_GIFT_EMOJI[gift] }}
                </button>
              </div>
            </div>
            <input v-model="guestForm.name" required :maxlength="GUESTBOOK_LIMITS.name" autocomplete="name" :placeholder="t('guestbookName')" class="w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5">
            <div class="relative">
              <textarea v-model="guestForm.message" required rows="3" :maxlength="GUESTBOOK_LIMITS.message" :placeholder="t('guestbookMessage')" class="w-full resize-none rounded-xl border border-black/10 bg-white px-3 py-2.5 text-[15px] outline-none focus:border-black/30 focus:ring-2 focus:ring-black/5" />
              <span class="absolute bottom-2 right-3 text-[11px] tabular-nums text-gray-400">{{ guestForm.message.length }}/{{ GUESTBOOK_LIMITS.message }}</span>
            </div>
            <p v-if="guestError" class="text-sm text-red-600">{{ guestError }}</p>
            <button type="submit" class="flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-[15px] font-semibold text-white disabled:opacity-50" :disabled="guestSending || !guestForm.name.trim() || !guestForm.message.trim()">
              <UIcon v-if="guestSending" name="i-lucide-loader-circle" class="size-4 animate-spin" />
              {{ t('guestbookSend') }} {{ GUEST_GIFT_EMOJI[guestForm.gift] }}
            </button>
          </form>

          <!-- Read -->
          <ul v-if="guestEntries.length" class="mt-4 space-y-2.5">
            <li v-for="entry in guestEntries" :key="entry.id">
              <button type="button" class="flex w-full gap-3 rounded-2xl bg-white p-3.5 text-left ring-1 ring-black/5 transition hover:ring-black/15" @click="openNote(entry.id)">
                <span class="text-2xl" aria-hidden="true">{{ GUEST_GIFT_EMOJI[entry.gift] }}</span>
                <span class="min-w-0 flex-1">
                  <span class="flex items-baseline justify-between gap-2">
                    <span class="truncate text-sm font-semibold">{{ entry.name }}</span>
                    <span class="shrink-0 text-[11px] text-gray-400">{{ formatWhen(entry.createdAt) }}</span>
                  </span>
                  <span class="mt-0.5 line-clamp-3 block whitespace-pre-line text-sm text-gray-600">{{ entry.message }}</span>
                </span>
              </button>
            </li>
          </ul>
          <p v-else class="mt-6 text-center text-sm text-gray-500">{{ t('guestbookEmpty') }}</p>
        </div>
      </aside>
    </Transition>

    <!-- Thanks after sending -->
    <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-2" leave-active-class="transition duration-200" leave-to-class="opacity-0">
      <div v-if="guestThanks" class="pointer-events-none absolute inset-x-0 top-20 z-30 flex justify-center px-4">
        <p class="rounded-full bg-gray-900/90 px-4 py-2 text-sm font-medium text-white shadow-lg">{{ t('guestbookSent') }}</p>
      </div>
    </Transition>

    <!-- Hover tooltip -->
    <div
      v-if="hovered"
      class="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+12px)] rounded-lg bg-gray-900/90 px-3 py-1.5 text-sm text-white shadow-lg"
      :style="{ left: `${hovered.x}px`, top: `${hovered.y}px` }"
    >
      {{ hovered.label }}
      <UIcon v-if="hovered.external" name="i-lucide-arrow-up-right" class="ml-1 inline size-3.5 align-[-2px]" />
    </div>

    <!-- Links in the room (also keyboard / screen-reader friendly) -->
    <div class="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-4">
      <div v-if="linkedObjects.length" class="flex max-w-full gap-2 overflow-x-auto pb-1">
        <a
          v-for="obj in linkedObjects"
          :key="obj.id"
          :href="safeUrl(obj.link!.url)"
          target="_blank"
          rel="noopener noreferrer"
          class="flex shrink-0 items-center gap-1.5 rounded-full bg-white/85 px-3 py-1.5 text-sm font-medium text-gray-800 shadow backdrop-blur transition hover:bg-white"
        >
          <UIcon :name="iconFor(obj.type)" class="size-4" />
          {{ obj.link!.label || hostOf(obj.link!.url) }}
        </a>
      </div>
      <p class="rounded-full bg-black/30 px-3 py-1 text-xs text-white/90 backdrop-blur">
        Drag to look around · click objects to open
      </p>
      <p v-if="track && musicOn" class="text-[10px] text-white/60">
        Music: {{ track.title }} by {{ track.artist }} ·
        <a :href="track.sourceUrl" target="_blank" rel="noopener noreferrer" class="underline">Pixabay</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SiteLanguage, SiteMessageKey } from '~/utils/siteI18n'
import type { RoomConfig, RoomObject } from '~/types/room'
import { CATALOG_BY_TYPE } from '~/utils/room/catalog'
import { getDaylight } from '~/utils/room/daylight'
import { MUSIC_BY_ID, ROOM_MUSIC_ENABLED } from '~/data/roomMusic'
import { GUEST_GIFTS, GUEST_GIFT_EMOJI, GUESTBOOK_LIMITS, type GuestbookEntry, type GuestGiftType } from '#shared/guestbook'
import type { BioBlock, ProductItem, ProductsBlock } from '~/types/bio'
import { formatVnd } from '#shared/plans'

// Pinch zooms the camera, never the page
usePreventPageZoom()

const props = defineProps<{
  room: RoomConfig
  /** Site address, for the guestbook and orders */
  username?: string
  /** The page's blocks: products for product stands, bank account for transfers */
  blocks?: BioBlock[]
  /** The site's accent colour (prices, buttons) */
  accent?: string
  title: string
  bio?: string
  avatarUrl?: string
  lang?: SiteLanguage
}>()

const emit = defineEmits<{ switch2d: [] }>()

const t = (key: SiteMessageKey, params?: Record<string, string | number>) => siteT(props.lang ?? 'en', key, params)

const hovered = ref<{ label: string; x: number; y: number; external?: boolean } | null>(null)

// Visitors can flip between day and night; until they do, the room follows its own setting
const forceMode = ref<'day' | 'night' | null>(null)
const now = ref(new Date())
let clock: ReturnType<typeof setInterval> | undefined
onMounted(() => (clock = setInterval(() => (now.value = new Date()), 2000)))
onBeforeUnmount(() => clearInterval(clock))

const isDayShown = computed(() =>
  forceMode.value ? forceMode.value === 'day' : getDaylight(props.room.environment, now.value).daylight >= 0.5,
)

function toggleDayNight() {
  forceMode.value = isDayShown.value ? 'night' : 'day'
}

// Background music: off until the visitor turns it on, unless the owner enabled autoplay
const track = computed(() => (ROOM_MUSIC_ENABLED && props.room.music?.trackId ? MUSIC_BY_ID[props.room.music.trackId] : undefined))
const musicOn = ref(false)
let audio: HTMLAudioElement | null = null

function toggleMusic() {
  if (!track.value) return
  if (musicOn.value) {
    audio?.pause()
    musicOn.value = false
    return
  }
  if (!audio) {
    audio = new Audio(track.value.src)
    audio.loop = true
    audio.addEventListener('error', () => (musicOn.value = false))
  }
  audio.volume = props.room.music?.volume ?? 0.5
  audio.play().then(() => (musicOn.value = true)).catch(() => (musicOn.value = false))
}

// Browsers block sound before the first interaction, so autoplay waits for it if needed
const unlockEvents = ['pointerdown', 'keydown', 'touchstart'] as const
function startOnInteraction(event: Event) {
  removeUnlock()
  // The music button handles its own click
  if ((event.target as Element | null)?.closest?.('[data-music-toggle]')) return
  if (!musicOn.value) toggleMusic()
}
function removeUnlock() {
  for (const event of unlockEvents) window.removeEventListener(event, startOnInteraction, true)
}

onMounted(() => {
  if (!track.value || !props.room.music?.autoplay) return
  toggleMusic()
  // If play() was blocked, start on the first tap, click or key press instead
  for (const event of unlockEvents) window.addEventListener(event, startOnInteraction, true)
  audio?.addEventListener('playing', removeUnlock, { once: true })
})

onBeforeUnmount(() => {
  removeUnlock()
  audio?.pause()
})

const linkedObjects = computed(() => props.room.objects.filter(o => o.link?.url))

function iconFor(type: string) {
  return CATALOG_BY_TYPE[type]?.icon || 'i-lucide-link'
}

function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function safeUrl(url: string) {
  // Only open web, mail and phone links
  return /^(https?:|mailto:|tel:)/i.test(url) ? url : `https://${url}`
}

function onHover(id: string | null, x: number, y: number) {
  const obj = id ? props.room.objects.find(o => o.id === id) : undefined
  const product = obj?.productId ? shopById.value.get(obj.productId)?.product : undefined
  if (product) hovered.value = { label: product.price ? `${product.name} · ${formatVnd(product.price)}` : product.name, x, y }
  else if (obj?.image) hovered.value = { label: t('viewPhoto'), x, y }
  else hovered.value = obj?.link?.url ? { label: obj.link.label || hostOf(obj.link.url), x, y, external: true } : null
}

// Picture frames with a photo open it in a popup; other linked objects open their link
const photo = ref<RoomObject | null>(null)

function onActivate(id: string) {
  const obj = props.room.objects.find(o => o.id === id)
  const shop = obj?.productId ? shopById.value.get(obj.productId) : undefined
  if (shop) {
    shopItem.value = shop
    hovered.value = null
    return
  }
  if (obj?.image) {
    photo.value = obj
    hovered.value = null
    return
  }
  if (obj?.link?.url) window.open(safeUrl(obj.link.url), '_blank', 'noopener,noreferrer')
}

// ---------- Shop (product stands) ----------

// Shop texts follow the site's language (BioOrderSheet reads it)
provide(SITE_LANG_KEY, computed(() => props.lang ?? 'en'))

const accent = computed(() => props.accent || '#1c1a17')
const shop = computed(() => pageProducts(props.blocks))
const shopById = computed(() => new Map(shop.value.map(s => [s.product.id, s])))
const shopProducts = computed(() => shop.value.map(s => s.product))
const canTransfer = computed(() =>
  (props.blocks ?? []).some(b => b.name === 'vietqr' && !b.hidden && !!(b.data as { bankId?: string })?.bankId && !!(b.data as { accountNumber?: string })?.accountNumber),
)
const shopItem = ref<{ product: ProductItem; block: ProductsBlock } | null>(null)
const ordering = ref<ProductItem | null>(null)
const orderBlock = ref<ProductsBlock | null>(null)

function orderFromStand() {
  if (!shopItem.value) return
  orderBlock.value = shopItem.value.block
  ordering.value = shopItem.value.product
  shopItem.value = null
}

// ---------- Guestbook ----------

const GIFT_LABEL: Record<GuestGiftType, SiteMessageKey> = {
  flower: 'giftFlower',
  gift: 'giftGift',
  cake: 'giftCake',
  balloon: 'giftBalloon',
  bear: 'giftBear',
  star: 'giftStar',
}

const canvasRef = ref<{ focusGuest: (id: string) => void } | null>(null)
const guestbookOn = computed(() => !!props.username && props.room.guestbook !== false)
const guestEntries = ref<GuestbookEntry[]>([])
const guestTotal = ref(0)
const guestGifts = computed(() => guestEntries.value.map(e => ({ id: e.id, gift: e.gift })))
const guestbookPanel = ref(false)
const guestSending = ref(false)
const guestError = ref('')
const guestThanks = ref(false)
const guestForm = reactive({ name: '', message: '', gift: 'flower' as GuestGiftType, website: '' })
const note = ref<GuestbookEntry | null>(null)

onMounted(async () => {
  if (!guestbookOn.value) return
  try {
    const res = await $fetch<{ enabled: boolean; total: number; entries: GuestbookEntry[] }>(`/api/bio/${props.username}/guestbook`)
    guestEntries.value = res.entries
    guestTotal.value = res.total
  } catch {
    // The room works without it
  }
})

function openGuestbook() {
  note.value = null
  guestbookPanel.value = true
}

function openNote(id: string) {
  const entry = guestEntries.value.find(e => e.id === id)
  if (!entry) return
  hovered.value = null
  note.value = entry
}

async function sendGuestbook() {
  if (guestSending.value) return
  guestSending.value = true
  guestError.value = ''
  try {
    const { entry } = await $fetch<{ entry: GuestbookEntry }>(`/api/bio/${props.username}/guestbook`, {
      method: 'POST',
      body: { name: guestForm.name, message: guestForm.message, gift: guestForm.gift, website: guestForm.website },
    })
    guestEntries.value = [entry, ...guestEntries.value].slice(0, GUESTBOOK_LIMITS.shown)
    guestTotal.value++
    guestForm.message = ''
    guestbookPanel.value = false
    // Show the new gift landing in front of the room
    nextTick(() => canvasRef.value?.focusGuest(entry.id))
    guestThanks.value = true
    setTimeout(() => (guestThanks.value = false), 3500)
  } catch (error: any) {
    guestError.value = error?.statusCode === 429 && error?.data?.statusMessage ? error.data.statusMessage : t('guestbookError')
  } finally {
    guestSending.value = false
  }
}

function onGuestHover(id: string | null, x: number, y: number) {
  const entry = id ? guestEntries.value.find(e => e.id === id) : undefined
  hovered.value = entry ? { label: t('guestbookFrom', { name: entry.name }), x, y } : null
}

/** Stored as UTC "YYYY-MM-DD HH:MM:SS" */
function formatWhen(value: string) {
  const date = new Date(`${value.replace(' ', 'T')}Z`)
  return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString(props.lang ?? 'en', { day: 'numeric', month: 'short', year: 'numeric' })
}

function onKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  photo.value = null
  shopItem.value = null
  note.value = null
  guestbookPanel.value = false
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>
