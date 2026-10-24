<template>
  <div class="flex min-h-dvh items-center justify-center bg-paper">
    <UIcon name="i-lucide-loader-circle" class="size-6 animate-spin text-ink-muted" />
  </div>
</template>

<script setup lang="ts">
// Old entry point for claiming a name: sites are now created in the
// dashboard, which picks the name up from ?input=
definePageMeta({ layout: 'blank' })

const route = useRoute()
const input = typeof route.query.input === 'string' ? route.query.input : ''
const target = input ? `/dashboard?input=${encodeURIComponent(input)}` : '/dashboard'
const { loggedIn } = useUserSession()
await navigateTo(loggedIn.value ? target : `/login?redirect=${encodeURIComponent(target)}`, { replace: true })
</script>
