<template>
  <!-- Any other error page: missing pages get the same invitation as a free
       site address; other errors a short note -->
  <SiteNotFound v-if="error.statusCode === 404" />
  <div v-else class="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#fdfcfb] px-5 text-center text-[#0c0b0a]">
    <AppLoader :size="64" />
    <h1 class="mk-display text-3xl">Something went wrong</h1>
    <p class="max-w-sm text-[#6b655e]">Please try again in a moment.</p>
    <button type="button" class="rounded-full bg-[#0c0b0a] px-6 py-3 text-sm font-semibold text-white" @click="clearError({ redirect: '/' })">Go to Perlink</button>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()
useSeoMeta({ title: 'Page not found — Perlink', robots: 'noindex' })
</script>
