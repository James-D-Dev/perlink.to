<template>
  <footer class="border-t border-line bg-paper">
    <div class="mx-auto max-w-6xl border-x border-line px-5 py-14 sm:px-8">
      <div class="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div class="max-w-xs">
          <AppLogo :size="26" />
          <p class="mt-4 text-sm leading-relaxed text-ink-muted">
            Personal websites and 3D worlds for people, places and small businesses.
          </p>
        </div>
        <div v-for="column in columns" :key="column.title">
          <p class="mb-4 text-sm font-medium text-ink">{{ column.title }}</p>
          <ul class="space-y-2.5">
            <li v-for="link in column.links" :key="link.label">
              <NuxtLink :to="link.to" class="text-sm text-ink-muted transition-colors hover:text-ink">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="border-t border-line">
      <div class="mx-auto flex max-w-6xl flex-col gap-2 border-x border-line px-5 py-6 text-xs text-ink-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p>© {{ year }} Perlink. All rights reserved.</p>
        <p>perlink.to</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Templates', to: '/#templates' },
      { label: '3D sites', to: '/#3d' },
      { label: 'Trends', to: '/trends' },
      { label: 'Pricing', to: '/pricing' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Get started', to: '/login' },
      { label: 'FAQ', to: '/#faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms', to: '/terms' },
      { label: 'Privacy', to: '/privacy' },
      { label: 'Cookies', to: '/cookie-notice' },
    ],
  },
]
</script>
