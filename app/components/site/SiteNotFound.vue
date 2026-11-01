<template>
  <!-- A missing page. For a site address nobody has taken yet, it's an
       invitation: the address types itself out and can be claimed at once.
       Always light, whatever the device's colour scheme. -->
  <div class="nf relative isolate flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#fdfcfb] px-5 py-16 text-center text-[#0c0b0a]">
    <MarketingMkHeroBackdrop :fade="false" />
    <!-- Orbs drifting at the edges, like the floating lands -->
    <div class="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
      <span class="nf-orb absolute -left-6 top-[14%]" style="--d: 0s"><MarketingMkOrb palette="sakura" :size="96" /></span>
      <span class="nf-orb absolute right-[8%] top-[9%]" style="--d: 1.2s"><MarketingMkOrb palette="lagoon" :size="54" /></span>
      <span class="nf-orb absolute bottom-[12%] left-[12%]" style="--d: 2.1s"><MarketingMkOrb palette="sunset" :size="44" /></span>
      <span class="nf-orb absolute -right-8 bottom-[18%]" style="--d: 0.6s"><MarketingMkOrb palette="night" :size="110" /></span>
    </div>

    <div class="flex w-full max-w-xl flex-col items-center">
      <!-- The mark builds its room, as this page could be built -->
      <div class="mk-rise" aria-hidden="true"><AppLoader :size="72" /></div>

      <!-- The address, typed out -->
      <p v-if="name" class="mk-rise mt-8 inline-flex max-w-full items-center rounded-full bg-white/80 px-5 py-2.5 text-lg font-medium shadow-[0_10px_30px_-12px_rgb(0_0_0/0.25)] ring-1 ring-black/[0.06] backdrop-blur sm:text-xl" style="--rise-delay: 120ms">
        <span class="text-[#6b655e]">perlink.to/</span>
        <span class="truncate text-[#086bf5]">{{ typed }}</span>
        <span class="nf-caret ml-0.5 h-6 w-[2px] shrink-0 rounded bg-[#086bf5]" aria-hidden="true" />
      </p>

      <h1 class="mk-rise mk-display mt-8 text-[38px] leading-[1.05] sm:text-5xl" style="--rise-delay: 220ms">{{ text.title }}</h1>
      <p class="mk-rise mt-4 max-w-md text-base leading-relaxed text-[#6b655e] sm:text-lg" style="--rise-delay: 320ms">{{ text.body }}</p>

      <div class="mk-rise mt-9 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row" style="--rise-delay: 420ms">
        <button
          v-if="state === 'free'"
          type="button"
          class="nf-cta group relative inline-flex h-14 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#0c0b0a] px-7 text-base font-semibold text-white shadow-[0_14px_34px_-12px_rgb(8_107_245/0.6)] transition-transform hover:-translate-y-0.5 sm:w-auto"
          @click="claim"
        >
          <span class="nf-shine" aria-hidden="true" />
          <UIcon name="i-lucide-sparkles" class="size-5 text-[#7fb6ff]" />
          {{ text.claim }}
          <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <NuxtLink
          v-else
          to="/dashboard"
          class="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0c0b0a] px-7 text-base font-semibold text-white transition-transform hover:-translate-y-0.5 sm:w-auto"
        >
          {{ text.create }}
          <UIcon name="i-lucide-arrow-right" class="size-4" />
        </NuxtLink>
        <NuxtLink :to="home" class="inline-flex h-14 w-full items-center justify-center rounded-full bg-white/80 px-6 text-base font-medium ring-1 ring-black/[0.08] backdrop-blur transition-colors hover:bg-white sm:w-auto">
          {{ text.explore }}
        </NuxtLink>
      </div>
      <p v-if="state === 'free'" class="mk-rise mt-4 text-sm text-[#9b948c]" style="--rise-delay: 500ms">{{ text.note }}</p>
    </div>

    <NuxtLink :to="home" class="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-70 transition-opacity hover:opacity-100" aria-label="Perlink">
      <AppLogo :size="22" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** The site address that was asked for; none for any other missing page */
  name?: string
}>()

const { locale } = useI18n()
const { loggedIn } = useUserSession()
const vi = computed(() => locale.value === 'vi')
const home = computed(() => (vi.value ? '/vi' : '/'))

// Free to claim, taken (by a site not published yet), or not a site address at all
const slug = (props.name ?? '').toLowerCase()
const { data: availability } = await useFetch<{ success: boolean; message?: string }>('/api/check_bio_username_exists', {
  key: `nf-${slug}`,
  method: 'POST',
  body: { username: slug },
  immediate: !!slug,
})
const state = computed<'free' | 'taken' | 'none'>(() => {
  if (!slug || !availability.value) return 'none'
  if (availability.value.success) return 'free'
  // Taken by a site that isn't published; reserved or malformed names aren't sites at all
  return /taken/i.test(availability.value.message ?? '') ? 'taken' : 'none'
})

const TEXT = {
  en: {
    free: { title: 'This address is still free', body: `Make perlink.to/${slug} yours: a link in bio, a website or a 3D room, ready in a minute.` },
    taken: { title: 'This page isn’t live yet', body: 'Its owner hasn’t published it. Want a page of your own? Pick your address and start free.' },
    none: { title: 'This page doesn’t exist', body: 'The link may be wrong or the page may have moved. Build your own page in a minute, free.' },
    claim: 'Claim it now',
    create: 'Create your page',
    explore: 'Explore Perlink',
    note: 'Free to start · No credit card',
  },
  vi: {
    free: { title: 'Địa chỉ này vẫn còn trống', body: `Biến perlink.to/${slug} thành của bạn: link bio, trang web hay phòng 3D, xong trong một phút.` },
    taken: { title: 'Trang này chưa lên sóng', body: 'Chủ trang chưa xuất bản. Muốn có trang của riêng bạn? Chọn địa chỉ và bắt đầu miễn phí.' },
    none: { title: 'Trang này không tồn tại', body: 'Có thể đường dẫn bị sai hoặc trang đã chuyển. Tạo trang của riêng bạn trong một phút, miễn phí.' },
    claim: 'Giữ địa chỉ này',
    create: 'Tạo trang của bạn',
    explore: 'Khám phá Perlink',
    note: 'Miễn phí để bắt đầu · Không cần thẻ',
  },
}
const text = computed(() => {
  const copy = TEXT[vi.value ? 'vi' : 'en']
  return { ...copy, ...copy[state.value] }
})

// The address types itself out once the page is up
const typed = ref(slug)
onMounted(() => {
  if (!slug || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
  typed.value = ''
  let i = 0
  const step = () => {
    typed.value = slug.slice(0, ++i)
    if (i < slug.length) setTimeout(step, 70 + Math.random() * 60)
  }
  setTimeout(step, 500)
})

// Same way in as the claim boxes: straight to setup, or sign in first
function claim() {
  const target = `/dashboard?input=${encodeURIComponent(slug)}`
  navigateTo(loggedIn.value ? target : `/login?redirect=${encodeURIComponent(target)}`)
}
</script>

<style scoped>
.nf-orb {
  animation: nf-float 7s ease-in-out infinite;
  animation-delay: var(--d);
}
@keyframes nf-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
}

.nf-caret { animation: nf-blink 1s steps(1) infinite; }
@keyframes nf-blink {
  50% { opacity: 0; }
}

/* A light sweeping across the claim button every few seconds */
.nf-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(100deg, transparent 30%, rgb(255 255 255 / 0.28) 50%, transparent 70%);
  transform: translateX(-120%);
  animation: nf-shine 3.2s ease-in-out 1.2s infinite;
}
@keyframes nf-shine {
  0% { transform: translateX(-120%); }
  45%, 100% { transform: translateX(120%); }
}

@media (prefers-reduced-motion: reduce) {
  .nf-orb, .nf-caret, .nf-shine { animation: none; }
}
</style>
