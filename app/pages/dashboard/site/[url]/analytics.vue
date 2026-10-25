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
        <!-- Tabs, stat tiles and chart, shimmering until the site loads -->
        <div v-if="loading" class="space-y-4" aria-busy="true">
          <div class="flex gap-4 border-b border-line pb-3">
            <USkeleton v-for="i in 2" :key="i" class="h-5 w-24" />
          </div>
          <USkeleton class="h-8 w-56 rounded-full" />
          <div class="grid grid-cols-2 gap-px overflow-hidden rounded-xl ring-1 ring-line md:grid-cols-4">
            <div v-for="i in 4" :key="i" class="space-y-2 bg-paper p-4 sm:p-5">
              <USkeleton class="h-3 w-20" />
              <USkeleton class="h-8 w-16" />
            </div>
          </div>
          <USkeleton class="h-56 w-full rounded-xl" />
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
