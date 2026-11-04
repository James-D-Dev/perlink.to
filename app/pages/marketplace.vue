<template>
  <div class="bg-paper text-ink">
    <!-- Hero -->
    <section class="px-3 pt-3 sm:px-5 sm:pt-5">
      <div class="relative isolate mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-[#1a0b16] px-6 py-14 text-white sm:rounded-[36px] sm:px-10 sm:py-20 lg:px-14">
        <div class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_80%_at_85%_10%,#e11d48_0%,#9d174d_35%,transparent_70%),radial-gradient(60%_60%_at_0%_100%,#7c3aed_0%,transparent_70%)] opacity-80" />
        <div class="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]" />
        <svg v-for="h in HEARTS" :key="h.c" viewBox="0 0 24 24" class="mk-float pointer-events-none absolute -z-10 text-pink-300/70" :class="h.c" :style="{ animationDelay: h.d }" aria-hidden="true">
          <path d="M12 21s-7.5-4.6-10-9.2C.3 8.6 2.1 4.5 6 4.5c2.3 0 3.7 1.3 6 3.6 2.3-2.3 3.7-3.6 6-3.6 3.9 0 5.7 4.1 4 7.3C19.5 16.4 12 21 12 21z" fill="currentColor" />
        </svg>
        <div class="max-w-2xl">
          <p class="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-pink-100 ring-1 ring-white/20 backdrop-blur">
            <UIcon name="i-lucide-store" class="size-3.5" />{{ t('room.market.eyebrow') }}
          </p>
          <h1 class="mk-display mt-5 text-[40px] leading-[1.05] sm:text-6xl">{{ t('room.market.title') }}</h1>
          <p class="mt-5 text-base leading-relaxed text-pink-50/80 sm:text-lg">{{ t('room.market.intro') }}</p>
          <p class="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white/10 px-3.5 py-2 text-sm text-white ring-1 ring-white/15 backdrop-blur">
            <UIcon name="i-lucide-gem" class="size-4 text-amber-300" />{{ t('room.market.maxNote') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Packs -->
    <section class="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="pack in ROOM_PACKS" :key="pack.id" class="flex flex-col overflow-hidden rounded-3xl bg-paper shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] ring-1 ring-line">
          <button type="button" class="group relative block text-left" :aria-label="t('room.market.preview3d')" @click="showcase = pack">
            <RoomPackPreview :pack="pack" />
            <span class="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              <UIcon name="i-lucide-activity" class="size-3.5" />{{ t('room.packs.animated') }}
            </span>
            <span class="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/25 group-hover:opacity-100">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-lg">
                <UIcon name="i-lucide-box" class="size-4" />{{ t('room.market.preview3d') }}
              </span>
            </span>
          </button>
          <div class="flex flex-1 flex-col p-6">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h2 class="text-xl font-semibold">{{ t(`room.packs.${pack.id}.name`) }}</h2>
                <p class="mt-1 text-sm text-ink-muted">{{ t(`room.packs.${pack.id}.tagline`) }}</p>
              </div>
              <p class="shrink-0 text-2xl font-semibold tabular-nums">{{ formatUsd(pack.priceUsd) }}</p>
            </div>
            <ul class="mt-4 flex flex-wrap gap-1.5">
              <li v-for="type in pack.items" :key="type" class="rounded-full bg-sand px-2.5 py-1 text-xs text-ink-muted">{{ t(`room.objects.${type}`) }}</li>
            </ul>
            <UButton class="mt-4 self-start" size="sm" color="neutral" variant="outline" icon="i-lucide-box" :label="t('room.market.preview3d')" @click="showcase = pack" />
            <div class="mt-auto pt-6">
              <template v-if="state && (state.allIncluded || ownsPack(pack.id))">
                <p class="flex items-center justify-center gap-1.5 rounded-full bg-emerald-500/10 py-2.5 text-sm font-semibold text-emerald-700">
                  <UIcon name="i-lucide-badge-check" class="size-4" />
                  {{ state.allIncluded ? t('room.packs.included') : t('room.packs.owned') }}
                </p>
                <UButton class="mt-2" block color="neutral" variant="ghost" icon="i-lucide-box" :label="t('room.market.openEditor')" to="/dashboard/site" />
              </template>
              <template v-else>
                <UButton
                  block
                  size="lg"
                  icon="i-lucide-shopping-bag"
                  :loading="buying === pack.id"
                  :label="state && !state.signedIn ? t('room.packs.signIn') : t('room.packs.buy', { price: formatUsd(pack.priceUsd) })"
                  @click="buy(pack.id, '/marketplace')"
                />
                <p class="mt-2 text-center text-xs text-ink-faint">{{ t('room.packs.oneTime') }}</p>
              </template>
            </div>
          </div>
        </article>

        <!-- More to come -->
        <div class="flex min-h-64 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-line p-8 text-center">
          <UIcon name="i-lucide-sparkles" class="size-6 text-ink-faint" />
          <p class="mt-3 max-w-xs text-sm text-ink-muted">{{ t('room.market.soon') }}</p>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="border-t border-line">
      <div class="mx-auto max-w-6xl px-5 py-14 sm:px-8 md:py-20">
        <h2 class="mk-display text-3xl sm:text-4xl">{{ t('room.market.howTitle') }}</h2>
        <ol class="mt-10 grid gap-4 md:grid-cols-3">
          <li v-for="i in 3" :key="i" class="rounded-2xl bg-sand p-6 md:p-8">
            <span class="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-400 to-fuchsia-600 text-lg font-semibold text-white shadow-lg shadow-rose-500/30">{{ i }}</span>
            <p class="mt-6 text-base font-medium">{{ t(`room.market.how.${i - 1}.title`) }}</p>
            <p class="mt-1 text-sm leading-relaxed text-ink-muted">{{ t(`room.market.how.${i - 1}.text`) }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- A live 3D room with the pack's items -->
    <UModal v-model:open="showcaseOpen" fullscreen :ui="{ content: 'bg-black' }">
      <template #content>
        <div class="relative h-dvh w-full">
          <LazyRoomPackShowcase v-if="showcase" :pack="showcase" />
          <div class="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-center gap-2 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <UButton
              v-if="showcase && !(state?.allIncluded || ownsPack(showcase.id))"
              size="lg"
              icon="i-lucide-shopping-bag"
              :loading="buying === showcase.id"
              :label="t('room.packs.buy', { price: formatUsd(showcase.priceUsd) })"
              @click="buy(showcase.id, '/marketplace')"
            />
            <UButton size="lg" color="neutral" variant="solid" icon="i-lucide-x" :label="t('common.close')" @click="showcase = null" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ROOM_PACKS, isRoomPackId } from '#shared/roomPacks'
import { formatUsd } from '#shared/plans'

definePageMeta({ layout: 'default', colorMode: 'light' })

const { t } = useI18n()
const route = useRoute()
const toast = useToast()
const { state, buying, refresh, owns: ownsPack } = useRoomPacks()

// The pack shown in the live 3D preview
const showcase = shallowRef<(typeof ROOM_PACKS)[number] | null>(null)
const showcaseOpen = computed({
  get: () => !!showcase.value,
  set: (open: boolean) => { if (!open) showcase.value = null },
})

const HEARTS = [
  { c: 'right-[8%] top-[12%] size-10 rotate-12', d: '0s' },
  { c: 'right-[22%] top-[40%] size-6 -rotate-12 hidden sm:block', d: '1.2s' },
  { c: 'right-[6%] bottom-[14%] size-14 rotate-6 hidden md:block', d: '0.6s' },
  { c: 'right-[34%] bottom-[10%] size-5 hidden lg:block', d: '1.8s' },
]

const SITE = 'https://perlink.to'
useSeoMeta({
  title: () => t('room.market.metaTitle'),
  description: () => t('room.market.metaDescription'),
  ogTitle: () => t('room.market.metaTitle'),
  ogDescription: () => t('room.market.metaDescription'),
  ogUrl: `${SITE}/marketplace`,
  ogImage: `${SITE}/images/og.jpg`,
  twitterCard: 'summary_large_image',
})
useHead({ link: [{ rel: 'canonical', href: `${SITE}/marketplace` }] })

async function buy(pack: (typeof ROOM_PACKS)[number]['id'], back: string) {
  if (state.value && !state.value.signedIn) {
    rememberPostLoginRedirect('/marketplace')
    await navigateTo('/login')
    return
  }
  await useRoomPacks().buy(pack, back)
}

onMounted(async () => {
  await refresh()
  // Back from Lemon Squeezy: the order webhook adds the pack within seconds
  const bought = route.query.bought
  if (!isRoomPackId(bought)) return
  const name = t(`room.packs.${bought}.name`)
  for (let i = 0; i < 6 && !ownsPack(bought) && !state.value?.allIncluded; i++) {
    await new Promise(r => setTimeout(r, 2000))
    await refresh()
  }
  toast.add(ownsPack(bought)
    ? { title: t('room.packs.bought', { name }), description: t('room.packs.boughtText'), color: 'success', icon: 'i-lucide-party-popper' }
    : { title: t('room.packs.boughtPending'), color: 'info' })
})
</script>

<style scoped>
.mk-float { animation: mk-float 6s ease-in-out infinite; }
@keyframes mk-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -12px; }
}
@media (prefers-reduced-motion: reduce) {
  .mk-float { animation: none; }
}
</style>
