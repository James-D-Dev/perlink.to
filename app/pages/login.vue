<template>
  <Head>
    <Meta charSet="utf-8" />
    <Meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=contain, user-scalable=no"
    />
    <Title>Sign In - Perlink.to</Title>
    <Meta
      name="description"
      content="Sign in to Perlink.to to create your bio link page, shorten URLs, and generate QR codes. Secure Google OAuth login."
    />
    <Meta
      name="keywords"
      content="login, sign in, Perlink, bio link, URL shortener, QR code, Google OAuth"
    />

    <!-- Open Graph -->
    <Meta property="og:title" content="Sign In - Perlink.to" />
    <Meta property="og:description" content="Sign in to create your bio link page and short links on Perlink.to" />
    <Meta property="og:url" content="https://perlink.to/login" />
    <Meta property="og:site_name" content="Perlink.to" />
    <Meta property="og:type" content="website" />

    <!-- Twitter -->
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:site" content="@perlinkto" />
    <Meta name="twitter:title" content="Sign In - Perlink.to" />
    <Meta name="twitter:description" content="Sign in to create your bio link page and short links on Perlink.to" />

    <!-- PWA -->
    <Meta name="mobile-web-app-capable" content="yes" />
    <Meta name="apple-mobile-web-app-title" content="Sign In - Perlink.to" />
    <Meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <Meta name="theme-color" content="#0984E3" />

    <Link rel="canonical" href="https://perlink.to/login" />
  </Head>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div class="w-full max-w-md space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <NuxtLink to="/" class="inline-flex items-center space-x-2">
          <img src="/logo-full.png" class="h-10" alt="Perlink" />
        </NuxtLink>
      </div>

      <!-- Login Card -->
      <UCard class="shadow-xl">
        <div class="space-y-6 p-2">
          <div class="text-center space-y-2">
            <h1 class="text-2xl font-bold text-gray-900">Welcome to Perlink.to</h1>
            <p class="text-gray-500">Sign in to create your bio page & short links</p>
          </div>

          <!-- Error Alert -->
          <UAlert
            v-if="error"
            color="error"
            variant="soft"
            :title="error"
            icon="i-heroicons-exclamation-triangle"
          />

          <!-- Already logged in -->
          <div v-if="loggedIn" class="text-center space-y-4">
            <p class="text-green-600">✓ You are already signed in</p>
            <div class="flex gap-3">
              <UButton to="/dashboard" color="primary" size="xl" block>
                Go to Dashboard
              </UButton>
              <UButton @click="logout" color="neutral" size="xl" variant="outline" block>
                Sign Out
              </UButton>
            </div>
          </div>

          <!-- Google Login Button -->
          <UButton
            v-else
            @click="handleGoogleLogin"
            :loading="isLoading"
            block
            size="lg"
            color="neutral"
            variant="outline"
            class="hover:bg-gray-50"
          >
            <template #leading>
              <UIcon name="i-flat-color-icons-google" class="w-5 h-5" />
            </template>
            Continue with Google
          </UButton>

          <!-- Terms -->
          <p class="text-center text-xs text-gray-500">
            By signing in, you agree to our
            <NuxtLink to="/terms" class="text-perlink-blue hover:underline">Terms of Service</NuxtLink>
            and
            <NuxtLink to="/privacy" class="text-perlink-blue hover:underline">Privacy Policy</NuxtLink>
          </p>
        </div>
      </UCard>

      <!-- Back to home -->
      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-gray-500 hover:text-gray-700">
          ← Back to home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "blank",
});

const { loggedIn, clear } = useUserSession()
const error = ref('')
const isLoading = ref(false)
const route = useRoute()

// Get error from query params (e.g., from OAuth failure)
onMounted(() => {
  if (route.query.error) {
    error.value = route.query.error === 'oauth_failed' 
      ? 'Authentication failed. Please try again.'
      : String(route.query.error)
  }
})

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await clear()
  window.location.reload()
}

const handleGoogleLogin = () => {
  isLoading.value = true
  error.value = ''
  
  // Redirect to Google OAuth with prompt to force account selection
  window.location.href = '/api/auth/google?prompt=select_account'
}
</script>
