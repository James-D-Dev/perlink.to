<template>
  <div />
</template>

<script setup lang="ts">
// /dashboard/create and /dashboard are the same "Create your site" page
definePageMeta({
  middleware: 'auth',
  redirect: to => ({ path: '/dashboard', query: to.query }),
})
</script>
