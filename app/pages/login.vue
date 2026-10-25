<template>
  <div class="relative flex min-h-dvh flex-col bg-paper text-ink">
    <header class="px-5 py-6 sm:px-8">
      <NuxtLink to="/" aria-label="Perlink home" class="inline-flex">
        <AppLogo :size="26" />
      </NuxtLink>
    </header>

    <main class="flex flex-1 items-center justify-center px-5 pb-16">
      <div class="w-full max-w-[360px]">
        <div class="mb-8 flex justify-center gap-1.5" aria-hidden="true">
          <MarketingMkOrb palette="sakura" :size="22" still />
          <MarketingMkOrb palette="sunset" :size="22" still />
          <MarketingMkOrb palette="lagoon" :size="22" still />
        </div>

        <template v-if="loggedIn">
          <h1 class="mk-display text-center text-3xl">You're signed in</h1>
          <p class="mt-3 text-center text-sm text-ink-muted">Pick up where you left off.</p>
          <div class="mt-8 space-y-2.5">
            <MarketingMkButton to="/dashboard" size="lg" block>Go to dashboard</MarketingMkButton>
            <MarketingMkButton variant="outline" size="lg" block @click="logout">Sign out</MarketingMkButton>
          </div>
        </template>

        <template v-else>
          <h1 class="mk-display text-center text-3xl">Welcome to Perlink</h1>
          <p class="mt-3 text-center text-sm leading-relaxed text-ink-muted">
            Sign in to build your personal site and 3D world.
          </p>

          <div v-if="error" class="mt-6 flex items-start gap-2 rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700" role="alert">
            <UIcon name="i-lucide-circle-alert" class="mt-0.5 size-4 shrink-0" />
            {{ error }}
          </div>

          <button
            type="button"
            class="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full bg-paper text-[15px] font-medium text-ink ring-1 ring-inset ring-line transition-colors hover:bg-sand disabled:opacity-60"
            :disabled="isLoading"
            @click="handleGoogleLogin"
          >
            <UIcon v-if="isLoading" name="i-lucide-loader-circle" class="size-5 animate-spin" />
            <UIcon v-else name="i-flat-color-icons-google" class="size-5" />
            Continue with Google
          </button>

          <p class="mt-6 text-center text-xs leading-relaxed text-ink-faint">
            New here? Signing in creates your free account.<br>
            By continuing you agree to our
            <NuxtLink to="/terms" class="text-ink-muted underline underline-offset-2 hover:text-ink">Terms</NuxtLink>
            and
            <NuxtLink to="/privacy" class="text-ink-muted underline underline-offset-2 hover:text-ink">Privacy Policy</NuxtLink>.
          </p>
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'blank', colorMode: 'light' })

useSeoMeta({
  title: 'Sign in — Perlink',
  description: 'Sign in to Perlink to build your personal website and 3D world.',
  ogTitle: 'Sign in — Perlink',
  ogDescription: 'Sign in to Perlink to build your personal website and 3D world.',
  ogImage: 'https://perlink.to/images/og.jpg',
  robots: 'noindex, follow',
})
useHead({ link: [{ rel: 'canonical', href: 'https://perlink.to/login' }] })

const { loggedIn, clear } = useUserSession()
const route = useRoute()
const error = ref('')
const isLoading = ref(false)

// Already signed in: straight on to where the link was going, or the dashboard
// (landing buttons all point here)
const nextPath = computed(() => {
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
  return redirect.startsWith('/') && !redirect.startsWith('//') ? redirect : '/dashboard'
})
if (loggedIn.value) await navigateTo(nextPath.value, { replace: true })
watch(loggedIn, (isIn) => {
  if (isIn) navigateTo(nextPath.value, { replace: true })
})

onMounted(() => {
  if (route.query.error) {
    error.value = route.query.error === 'oauth_failed'
      ? 'Sign-in with Google did not finish. Please try again.'
      : String(route.query.error)
  }
})

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  window.location.reload()
}

function handleGoogleLogin() {
  isLoading.value = true
  error.value = ''
  // Remember where to go after Google sends the user back (e.g. a claimed name)
  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : ''
  if (redirect.startsWith('/') && !redirect.startsWith('//')) rememberPostLoginRedirect(redirect)
  window.location.href = '/api/auth/google?prompt=select_account'
}
</script>
