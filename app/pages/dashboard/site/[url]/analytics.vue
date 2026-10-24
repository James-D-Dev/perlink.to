<template>
  <UDashboardPanel id="site-analytics">
    <template #header>
      <UDashboardNavbar :title="t('common.analytics')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            :to="`/dashboard/site/${username}`"
            color="neutral"
            variant="outline"
            icon="i-lucide-pencil"
            :label="t('dashboard.analyticsPage.editSite')"
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
          {{ t('dashboard.analyticsPage.notFound') }}
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

definePageMeta({
  colorMode: 'light',
  layout: 'admin',
  middleware: 'auth',
  ssr: false,
})

const route = useRoute()
const { t } = useI18n()
const username = computed(() => String(route.params.url || ''))

useSeoMeta({ title: () => t('dashboard.analyticsPage.seoTitle', { username: username.value }), robots: 'noindex, nofollow' })

const loading = ref(true)
const bioPage = ref<{ id: string; username: string; blocks?: BioBlock[] } | null>(null)
const blocks = computed(() => bioPage.value?.blocks ?? [])
// Every links and social block on the page (a page can hold several)
const links = computed(() => blocks.value.flatMap(b => (b.name === 'links' ? b.data?.items ?? [] : [])))
const socialLinks = computed(() => blocks.value.flatMap(b => (b.name === 'social' ? b.data?.links ?? [] : [])))

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
