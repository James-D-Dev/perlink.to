<template>
  <form class="w-full max-w-md" @submit.prevent="claim">
    <div
      class="flex h-12 items-center rounded-full bg-paper pl-5 pr-1.5 ring-1 ring-line transition-shadow focus-within:ring-ink/40"
      :class="dark && 'bg-paper/95'"
    >
      <span class="shrink-0 text-[15px] text-ink-muted">perlink.to/</span>
      <input
        v-model="name"
        type="text"
        inputmode="url"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        maxlength="40"
        placeholder="yourname"
        aria-label="Your page name"
        class="min-w-0 flex-1 bg-transparent px-0.5 text-[15px] text-ink placeholder:text-ink-faint focus:outline-none"
      >
      <MarketingMkButton type="submit" size="sm" class="h-9 px-4">Claim</MarketingMkButton>
    </div>
    <p v-if="error" class="mt-2 pl-5 text-xs text-red-600">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
// "perlink.to/yourname" claim box. Signed-in users go straight to setup;
// others sign in first and continue there.
withDefaults(defineProps<{ dark?: boolean }>(), { dark: false })

const { loggedIn } = useUserSession()
const name = ref('')
const error = ref('')

function claim() {
  const slug = name.value.trim().toLowerCase()
  if (!slug) {
    error.value = 'Type the name you want.'
    return
  }
  if (!/^[a-z0-9][a-z0-9_-]{1,38}$/.test(slug)) {
    error.value = 'Use 2–40 letters, numbers, hyphens or underscores.'
    return
  }
  error.value = ''
  const target = `/dashboard?input=${encodeURIComponent(slug)}`
  navigateTo(loggedIn.value ? target : `/login?redirect=${encodeURIComponent(target)}`)
}
</script>
