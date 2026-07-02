<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div v-if="loading" class="text-center">
      <UIcon name="i-lucide-loader-2" class="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
      <p class="text-gray-600">Loading...</p>
    </div>
    
    <div v-else-if="error" class="text-center max-w-md">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-alert-triangle" class="w-8 h-8 text-red-500" />
      </div>
      <h1 class="text-xl font-semibold text-gray-900 mb-2">{{ error.title }}</h1>
      <p class="text-gray-600">{{ error.message }}</p>
      <UButton to="/" color="primary" class="mt-6">Go Home</UButton>
    </div>
    
    <div v-else class="text-center max-w-md">
      <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <UIcon name="i-lucide-check" class="w-8 h-8 text-green-500" />
      </div>
      <h1 class="text-xl font-semibold text-gray-900 mb-2">Redirecting...</h1>
      <p class="text-gray-600 mb-2">Taking you to your destination</p>
      <p class="text-sm text-gray-500">{{ countdown }} seconds</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const code = route.params.code as string

const loading = ref(true)
const error = ref<{ title: string; message: string } | null>(null)
const countdown = ref(3)

onMounted(async () => {
  if (!code) {
    error.value = {
      title: 'Invalid QR Code',
      message: 'This QR code link is invalid.'
    }
    loading.value = false
    return
  }

  try {
    // Fetch QR code data and record scan
    const response = await $fetch(`/api/qr/scan/${code}`, {
      method: 'POST'
    })

    if (!response.success || !response.data?.destinationUrl) {
      throw new Error('QR code not found or inactive')
    }

    // Countdown and redirect
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
        // Redirect to destination
        window.location.href = response.data.destinationUrl
      }
    }, 1000)
  } catch (err: any) {
    error.value = {
      title: err.message?.includes('not found') ? 'QR Code Not Found' : 'Error',
      message: err.message || 'Something went wrong. Please try again.'
    }
  } finally {
    loading.value = false
  }
})
</script>
