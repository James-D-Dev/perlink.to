<template>
  <UDashboardPanel id="create-site">
    <template #header>
      <UDashboardNavbar title="Create">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton to="/dashboard/bio" color="neutral" variant="ghost" icon="i-lucide-layout-grid" label="My sites" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-6xl space-y-10 py-2 sm:py-6">
        <!-- Hero -->
        <section class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 dark:border-white/[0.08] dark:bg-white/[0.03] dark:backdrop-blur-xl sm:p-10">
          <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_100%_0%,rgb(8_107_245/0.10),transparent)] dark:bg-[radial-gradient(ellipse_60%_80%_at_100%_0%,rgb(255_255_255/0.06),transparent)]" />
          <div class="relative max-w-2xl">
            <p class="mb-3 inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-2.5 py-1 text-xs font-medium text-gray-600 dark:border-white/10 dark:text-neutral-300">
              <UIcon name="i-lucide-sparkles" class="size-3.5 text-perlink-blue" />
              Templates · Drag-and-drop editor · 3D rooms
            </p>
            <h1 class="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Create your site
            </h1>
            <p class="mt-2 text-gray-600 dark:text-neutral-400">
              Pick your address, then start from a template or a blank page. You can change everything later.
            </p>
            <div class="mt-6">
              <SiteClaimForm size="lg" :initial-slug="initialSlug" autofocus />
            </div>
          </div>
        </section>

        <!-- Templates -->
        <section class="space-y-5">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Start from a template</h2>
              <p class="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                {{ PAGE_TEMPLATES.length }} templates, each with sample content, a theme and a matching 3D room.
              </p>
            </div>
          </div>

          <div class="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            <button
              v-for="chip in chips"
              :key="chip.id"
              type="button"
              class="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition"
              :class="category === chip.id
                ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-neutral-900'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:border-white/10 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-white'"
              @click="category = chip.id"
            >
              <UIcon :name="chip.icon" class="size-4" />
              {{ chip.label }}
              <span class="tabular-nums opacity-60">{{ chip.count }}</span>
            </button>
          </div>

          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <button
              v-for="template in filteredTemplates"
              :key="template.id"
              type="button"
              class="group overflow-hidden rounded-2xl border border-gray-200 bg-white text-left transition hover:-translate-y-0.5 hover:shadow-xl dark:border-white/[0.08] dark:bg-white/[0.03] dark:backdrop-blur-xl dark:hover:border-white/20 dark:hover:shadow-black/40"
              @click="openTemplate(template.id)"
            >
              <div class="relative aspect-[4/3] overflow-hidden border-b border-gray-200 dark:border-white/[0.08]">
                <SiteTemplateThumbnail :template="template" :scale="0.42" class="transition duration-500 group-hover:scale-[1.03]" />
                <div class="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-black/0 to-transparent p-4 opacity-0 transition group-hover:opacity-100">
                  <span class="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-sm font-semibold text-gray-900 shadow">
                    Use template
                    <UIcon name="i-lucide-arrow-right" class="size-4" />
                  </span>
                </div>
              </div>
              <div class="space-y-2 p-4">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ template.name }}</h3>
                  <span class="inline-flex items-center gap-1 rounded-md border border-gray-200 px-1.5 py-0.5 text-[11px] font-medium text-gray-500 dark:border-white/10 dark:text-neutral-400">
                    <UIcon name="i-lucide-box" class="size-3" />
                    3D
                  </span>
                </div>
                <p class="line-clamp-2 text-sm text-gray-500 dark:text-neutral-400">{{ template.description }}</p>
                <p class="text-xs text-gray-400 dark:text-neutral-500">{{ categoryLabel(template.category) }}</p>
              </div>
            </button>
          </div>
        </section>
      </div>

      <!-- Claim popup for a template -->
      <UModal
        v-model:open="modalOpen"
        :ui="{ content: 'sm:max-w-3xl', body: 'p-0 sm:p-0' }"
        :title="selectedTemplate?.name"
      >
        <template #content>
          <div v-if="selectedTemplate" class="grid sm:grid-cols-2">
            <div class="relative hidden h-full min-h-96 border-r border-gray-200 dark:border-white/[0.08] sm:block">
              <SiteTemplateThumbnail :template="selectedTemplate" :scale="0.62" class="absolute inset-0" />
            </div>
            <div class="flex flex-col p-6">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                    {{ categoryLabel(selectedTemplate.category) }}
                  </p>
                  <h3 class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">{{ selectedTemplate.name }}</h3>
                </div>
                <UButton icon="i-lucide-x" color="neutral" variant="ghost" aria-label="Close" @click="modalOpen = false" />
              </div>
              <p class="mt-2 text-sm text-gray-600 dark:text-neutral-400">{{ selectedTemplate.description }}</p>

              <ul class="mt-4 space-y-2 text-sm text-gray-600 dark:text-neutral-300">
                <li v-for="feature in templateFeatures" :key="feature" class="flex items-center gap-2">
                  <UIcon name="i-lucide-check" class="size-4 text-emerald-500" />
                  {{ feature }}
                </li>
              </ul>

              <div class="mt-auto pt-6">
                <p class="mb-2 text-sm font-medium text-gray-900 dark:text-white">Claim your site</p>
                <SiteClaimForm :template-id="selectedTemplate.id" :initial-slug="initialSlug" autofocus />
              </div>
            </div>
          </div>
        </template>
      </UModal>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { PAGE_TEMPLATES, TEMPLATE_CATEGORIES, type TemplateCategory } from '~/data/pageTemplates'

definePageMeta({
  colorMode: 'dark',
  layout: 'admin',
  middleware: 'auth',
  ssr: false,
})

const route = useRoute()

// Name typed on the landing page (?input=) carries over
const initialSlug = computed(() => (typeof route.query.input === 'string' ? route.query.input.toLowerCase() : ''))

const category = ref<TemplateCategory | 'all'>('all')
const modalOpen = ref(false)
const selectedTemplateId = ref<string | null>(null)

const chips = computed(() => [
  { id: 'all' as const, label: 'All', icon: 'i-lucide-layout-grid', count: PAGE_TEMPLATES.length },
  ...TEMPLATE_CATEGORIES.map(c => ({ ...c, count: PAGE_TEMPLATES.filter(t => t.category === c.id).length })),
].filter(chip => chip.count > 0))

const filteredTemplates = computed(() =>
  category.value === 'all' ? PAGE_TEMPLATES : PAGE_TEMPLATES.filter(t => t.category === category.value),
)

const selectedTemplate = computed(() => PAGE_TEMPLATES.find(t => t.id === selectedTemplateId.value) || null)

const templateFeatures = ['Sample content you can edit', 'Matching theme and fonts', 'A decorated 3D room included', 'Change templates anytime']

function categoryLabel(id: TemplateCategory) {
  return TEMPLATE_CATEGORIES.find(c => c.id === id)?.label ?? ''
}

function openTemplate(id: string) {
  selectedTemplateId.value = id
  modalOpen.value = true
}
</script>
