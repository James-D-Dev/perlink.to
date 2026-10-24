<template>
  <header
    class="sticky top-0 z-50 transition-colors duration-200"
    :class="scrolled || menuOpen ? 'border-b border-line bg-paper/85 backdrop-blur-xl' : 'border-b border-transparent bg-paper'"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-8 px-5 sm:px-8">
      <NuxtLink to="/" class="shrink-0" aria-label="Perlink home">
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
        <template v-if="loggedIn">
          <MarketingMkButton to="/dashboard" size="sm" variant="solid">Dashboard</MarketingMkButton>
        </template>
        <template v-else>
          <MarketingMkButton to="/login" size="sm" variant="outline" class="hidden sm:inline-flex">Log in</MarketingMkButton>
          <MarketingMkButton to="/login" size="sm">Get started</MarketingMkButton>
        </template>
        <button
          type="button"
          class="-mr-2 inline-flex size-9 items-center justify-center rounded-full text-ink hover:bg-sand md:hidden"
          :aria-expanded="menuOpen"
          aria-label="Menu"
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
      <MarketingMkButton v-if="!loggedIn" to="/login" variant="outline" block class="mt-5">Log in</MarketingMkButton>
    </nav>
  </header>
</template>

<script setup lang="ts">
const { loggedIn } = useUserSession()

const nav = [
  { label: 'Templates', to: '/#templates' },
  { label: '3D sites', to: '/#3d' },
  { label: 'Trends', to: '/trends' },
  { label: 'Pricing', to: '/pricing' },
]

const menuOpen = ref(false)
const scrolled = ref(false)
const onScroll = () => (scrolled.value = window.scrollY > 8)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>
