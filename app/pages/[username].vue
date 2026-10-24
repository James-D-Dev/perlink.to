<template>
  <SitePage :username="String(route.params.username)" />
</template>

<script setup lang="ts">
// A published site at perlink.to/<username>
definePageMeta({
  layout: "blank",
});

const route = useRoute();
</script>
