<template>
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <div class="w-full max-w-sm space-y-6">
      <!-- Logo -->
      <!-- <div class="text-center">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <img src="/images/logo.svg" alt="Perlink" class="h-8" />
        </NuxtLink>
      </div> -->

      <!-- Card -->
      <div class="bg-white rounded-2xl border border-gray-200 p-6 space-y-5 shadow-sm">
        <div class="text-center space-y-2">
          <div class="mx-auto w-12 h-12 bg-perlink-blue/10 rounded-full flex items-center justify-center">
            <UIcon name="i-mingcute-lock-line" class="w-6 h-6 text-perlink-blue" />
          </div>
          <h1 class="text-xl font-bold">Password Required</h1>
          <p class="text-sm text-muted-foreground">
            {{ customMessage || 'Please enter the password to continue.' }}
          </p>
        </div>

        <form @submit.prevent="verifyPassword" class="space-y-4">
          <UInput
            v-model="password"
            type="password"
            placeholder="Enter password"
            size="lg"
            :disabled="isVerifying"
            autofocus
            class="w-full"
          />

          <p v-if="errorMessage" class="text-sm text-red-500 text-center">
            {{ errorMessage }}
          </p>

          <UButton
            type="submit"
            color="primary"
            size="xl"
            block
            :loading="isVerifying"
            :disabled="!password"
          >
            Continue
          </UButton>
        </form>
      </div>

      <p class="text-center text-xs text-gray-400">
        Powered by <NuxtLink to="/" class="text-primary hover:underline">Perlink</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'blank',
  ssr: false,
})

const route = useRoute()
const slug = route.params.slug as string

const password = ref('')
const isVerifying = ref(false)
const errorMessage = ref('')
const customMessage = ref('')

// Fetch link info to get custom message
const { data } = await useFetch(`/api/links/${slug}`)
if (data.value && (data.value as any).success) {
  const meta = (data.value as any).data?.meta
  if (meta?.password?.message) {
    customMessage.value = meta.password.message
  }
}

const verifyPassword = async () => {
  if (!password.value) return

  isVerifying.value = true
  errorMessage.value = ''

  try {
    const res = await $fetch<{ success: boolean; url?: string; message?: string }>(
      `/api/links/${slug}/verify-password`,
      {
        method: 'POST',
        body: { password: password.value },
      }
    )

    if (res.success && res.url) {
      const targetUrl = new URL(res.url)
      targetUrl.searchParams.set('utm_source', 'perlink')
      window.location.href = targetUrl.toString()
    } else {
      errorMessage.value = res.message || 'Incorrect password'
      password.value = ''
    }
  } catch (e: any) {
    errorMessage.value = 'Something went wrong. Please try again.'
  } finally {
    isVerifying.value = false
  }
}
</script>
