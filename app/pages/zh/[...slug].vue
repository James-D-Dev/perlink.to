<template>
  <MarketingMkLocalizedPage />
</template>

<script setup lang="ts">
// Perlink's marketing pages in this language, at the English addresses under
// /zh (see MkLocalizedPage, data/langPaths)
definePageMeta({ layout: 'default', colorMode: 'light', key: route => route.path })
</script>
