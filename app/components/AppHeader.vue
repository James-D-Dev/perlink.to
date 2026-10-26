<template>
  <header
    class="sticky top-0 z-50 transition-colors duration-200"
    :class="scrolled || menuOpen ? 'border-b border-line bg-paper/85 backdrop-blur-xl' : 'border-b border-transparent bg-paper'"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-8 px-5 sm:px-8">
      <NuxtLink :to="home" class="shrink-0" :aria-label="copy.header.home">
        <AppLogo :size="26" />
      </NuxtLink>

      <nav class="hidden items-center gap-1 md:flex" aria-label="Main">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="rounded-full px-3 py-1.5 text-sm text-ink-soft transition-colors hover:bg-sand hover:text-ink"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-2">
        <!-- Language: the home page exists in English (/) and Vietnamese (/vi);
             other pages switch in place -->
        <NuxtLink
          :to="otherLanguage"
          :hreflang="lang === 'vi' ? 'en' : 'vi'"
          @click="switchInPlace"
          class="hidden rounded-full px-2.5 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-sand hover:text-ink sm:inline-flex"
          :aria-label="copy.header.language"
        >
          {{ lang === 'vi' ? 'EN' : 'VI' }}
        </NuxtLink>
        <template v-if="loggedIn">
          <MarketingMkButton to="/dashboard" size="sm" variant="solid">{{ copy.header.dashboard }}</MarketingMkButton>
        </template>
        <template v-else>
          <MarketingMkButton to="/login" size="sm" variant="outline" class="hidden sm:inline-flex">{{ copy.header.login }}</MarketingMkButton>
          <MarketingMkButton to="/login" size="sm">{{ copy.header.start }}</MarketingMkButton>
        </template>
        <button
          type="button"
          class="-mr-2 inline-flex size-9 items-center justify-center rounded-full text-ink hover:bg-sand md:hidden"
          :aria-expanded="menuOpen"
:aria-label="copy.header.menu"
          @click="menuOpen = !menuOpen"
        >
          <UIcon :name="menuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="size-5" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <nav v-if="menuOpen" class="border-t border-line px-5 pb-6 pt-2 md:hidden" aria-label="Mobile">
      <NuxtLink
        v-for="item in nav"
        :key="item.to"
        :to="item.to"
        class="flex items-center justify-between border-b border-line py-3.5 text-[15px] text-ink"
        @click="menuOpen = false"
      >
        {{ item.label }}
        <UIcon name="i-lucide-arrow-up-right" class="size-4 text-ink-faint" />
      </NuxtLink>
      <MarketingMkButton v-if="!loggedIn" to="/login" variant="outline" block class="mt-5">{{ copy.header.login }}</MarketingMkButton>
      <NuxtLink :to="otherLanguage" class="mt-4 block text-center text-sm text-ink-muted" @click="(event: MouseEvent) => { menuOpen = false; switchInPlace(event) }">
        {{ lang === 'vi' ? 'English' : 'Tiếng Việt' }}
      </NuxtLink>
    </nav>
  </header>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()

const { lang, copy, home, anchor } = useMarketingLang()

// The other language: the other home page, or this page in that language
const route = useRoute()
const { setLocale } = useI18n()
const onHome = computed(() => route.path === '/' || route.path === '/vi')
const otherLanguage = computed(() => (onHome.value ? (lang.value === 'vi' ? '/' : '/vi') : route.fullPath))
function switchInPlace(event: MouseEvent) {
  if (onHome.value) return
  event.preventDefault()
  const next = lang.value === 'vi' ? 'en' : 'vi'
  setLocale(next)
  // Signed in: the account remembers it too (dashboard, Telegram, email)
  if (loggedIn.value) $fetch('/api/account', { method: 'PATCH', body: { language: next } }).catch(() => {})
}
const nav = computed(() => [
  { label: copy.value.header.nav.templates, to: anchor('templates') },
  { label: copy.value.header.nav.worlds, to: anchor('3d') },
  { label: copy.value.header.nav.trends, to: '/trends' },
  { label: copy.value.header.nav.pricing, to: '/pricing' },
])

const menuOpen = ref(false)
const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 8)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>
