<template>
  <footer class="border-t border-line bg-paper">
    <div class="mx-auto max-w-6xl border-x border-line px-5 py-14 sm:px-8">
      <div class="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div class="max-w-xs">
          <AppLogo :size="26" />
          <p class="mt-4 text-sm leading-relaxed text-ink-muted">
            {{ copy.footer.tagline }}
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
        <p>© {{ year }} Perlink. {{ copy.footer.rights }}</p>
        <p>{{ copy.footer.contact }}: <a :href="`mailto:${SUPPORT_EMAIL}`" class="hover:text-ink">{{ SUPPORT_EMAIL }}</a></p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()

const { copy, anchor } = useMarketingLang()
const columns = computed(() => {
  const f = copy.value.footer
  return [
    {
      title: f.product,
      links: [
        { label: f.templates, to: anchor('templates') },
        { label: f.worlds, to: anchor('3d') },
        { label: f.trends, to: '/trends' },
        { label: f.pricing, to: '/pricing' },
      ],
    },
    {
      title: f.resources,
      links: [
        { label: f.start, to: '/login' },
        { label: f.faq, to: anchor('faq') },
      ],
    },
    {
      title: f.legal,
      links: [
        { label: f.terms, to: '/terms' },
        { label: f.privacy, to: '/privacy' },
        { label: f.cookies, to: '/cookie-notice' },
        { label: f.refund, to: '/refund' },
        { label: f.report, to: '/report' },
      ],
    },
  ]
})
</script>
