<template>
  <div />
</template>

<script setup lang="ts">
// /dashboard/create is the create flow (an address typed elsewhere comes along)
definePageMeta({
  middleware: 'auth',
  redirect: to => ({ path: '/dashboard/new', query: to.query }),
})
</script>
