<template>
  <!-- Where a site's own page sits: Sites › the site › this page. Phones keep
       the last two -->
  <nav :aria-label="t('dashboard.sites.title')" class="flex min-w-0 items-center gap-1.5 text-sm">
    <NuxtLink to="/dashboard/site" class="hidden shrink-0 text-ink-muted transition-colors hover:text-ink sm:inline">{{ t('dashboard.sites.title') }}</NuxtLink>
    <UIcon name="i-lucide-chevron-right" class="hidden size-4 shrink-0 text-ink-faint sm:block" />
    <NuxtLink :to="`/dashboard/site/${username}`" class="min-w-0 truncate text-ink-muted transition-colors hover:text-ink">perlink.to/{{ username }}</NuxtLink>
    <UIcon name="i-lucide-chevron-right" class="size-4 shrink-0 text-ink-faint" />
    <span class="shrink-0 font-semibold text-ink" aria-current="page">{{ page }}</span>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  username: string
  /** This page's name */
  page: string
}>()

const { t } = useI18n()
</script>
