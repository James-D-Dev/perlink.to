<template>
  <UDashboardPanel id="site-analytics">
    <template #header>
      <UDashboardNavbar title="Analytics">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            :to="`/dashboard/site/${username}`"
            color="neutral"
            variant="outline"
            icon="i-lucide-pencil"
            label="Edit site"
            size="sm"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-5xl">
        <p class="mb-4 text-sm text-muted">perlink.to/{{ username }}</p>
        <div v-if="loading" class="flex justify-center py-20">
          <UIcon name="i-lucide-loader-2" class="size-8 animate-spin text-dimmed" />
        </div>
        <div v-else-if="!bioPage" class="py-20 text-center text-sm text-muted">
          Site not found.
        </div>
        <BioAnalytics
          v-else
          :bio-page-id="bioPage.id"
          :username="bioPage.username"
          :bio-links="links"
          :social-links="socialLinks"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { BioBlock } from '~/types/bio'
import { useBioBlock } from '~/composables/useBioBlock'

definePageMeta({
  colorMode: 'light',
  layout: 'admin',
  middleware: 'auth',
  ssr: false,
})

const route = useRoute()
const username = computed(() => String(route.params.url || ''))

useSeoMeta({ title: () => `Analytics · ${username.value} — Perlink`, robots: 'noindex, nofollow' })

const loading = ref(true)
const bioPage = ref<{ id: string; username: string; blocks?: BioBlock[] } | null>(null)
const blocks = computed(() => bioPage.value?.blocks ?? [])
const { links, socialLinks } = useBioBlock({ blocks })

onMounted(async () => {
  try {
    const response = await $fetch<{ success: boolean; bioPage?: any }>(`/api/admin/bio/${username.value}`)
    bioPage.value = response.success ? response.bioPage : null
  } catch {
    bioPage.value = null
  } finally {
    loading.value = false
  }
})
</script>
