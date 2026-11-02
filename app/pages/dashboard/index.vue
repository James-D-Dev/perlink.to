<template>
  <UDashboardPanel id="create-site">
    <template #header>
      <UDashboardNavbar :title="t('nav.home')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <!-- Hero: the full width of the page, right under the bar; its content
           lines up with the page's (75rem: max-w-6xl plus the page padding) -->
      <section class="relative isolate -mx-4 -mt-4 shrink-0 overflow-hidden border-b border-line bg-elevated sm:-mx-6 sm:-mt-6 dark:bg-[#171412]">
        <!-- Same living backdrop as the landing hero -->
        <MarketingMkHeroBackdrop :fade="false" />
        <div class="pointer-events-none absolute inset-0 dark:bg-[radial-gradient(ellipse_60%_80%_at_100%_0%,rgb(255_255_255/0.06),transparent)]" />
        <div class="relative mx-auto w-full max-w-[75rem] px-4 py-10 sm:px-6 sm:py-14">
          <!-- Gradient orbs, echoing the 3D lands -->
          <!-- Softer on the dark theme, where full-strength colour glares -->
          <div class="pointer-events-none absolute right-24 top-1/2 hidden -translate-y-1/2 lg:block dark:opacity-55 dark:saturate-[0.8]" aria-hidden="true">
            <span class="absolute -left-36 -top-16"><MarketingMkOrb palette="sakura" :size="88" /></span>
            <span class="absolute -left-10 top-6"><MarketingMkOrb palette="sunset" :size="120" /></span>
            <span class="absolute -left-44 top-20"><MarketingMkOrb palette="lagoon" :size="52" /></span>
          </div>
          <div class="relative max-w-2xl">
            <h1 class="mk-display text-4xl sm:text-5xl dark:text-white">
              {{ t('dashboard.home.heading') }}
            </h1>
            <p class="mt-2 text-muted dark:text-neutral-400">
              {{ t('dashboard.home.intro') }}
            </p>
            <div class="mt-6">
              <SiteClaimForm size="lg" :initial-slug="initialSlug" autofocus />
            </div>
          </div>
        </div>
      </section>

      <div class="mx-auto w-full max-w-6xl space-y-10 py-2 sm:py-4">
        <!-- The sites they already have (most recently edited first) -->
        <section v-if="sites.length" class="space-y-5">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="mk-display text-2xl sm:text-3xl dark:text-white">{{ t('dashboard.home.yourSites') }}</h2>
              <p class="mt-1 text-sm text-muted dark:text-neutral-400">{{ t('dashboard.sites.count', sites.length) }}</p>
            </div>
            <UButton
              v-if="sites.length > recentSites.length"
              to="/dashboard/site"
              color="neutral"
              variant="ghost"
              trailing-icon="i-lucide-arrow-right"
              :label="t('dashboard.home.seeAllSites', { n: sites.length })"
            />
          </div>
          <!-- Two columns up to large screens, so four fill two rows; three there -->
          <div class="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
            <SiteCard
              v-for="(site, i) in recentSites"
              :key="site.id"
              :class="i === 3 && 'lg:hidden'"
              :site="site"
              :pending="pendingSite === site.username"
              @share="shareSite(site)"
              @copy="copyUrl(site.username)"
              @qr="qrSite = site"
              @publish="publishSite(site.username)"
              @unpublish="unpublishSite(site.username)"
            />
          </div>
          <SiteQrModal
            v-if="qrSite"
            :open="!!qrSite"
            :username="qrSite.username"
            :title="qrSite.title"
            :theme-config="qrSite.themeConfig"
            :blocks="qrSite.blocks"
            @update:open="(v: boolean) => { if (!v) qrSite = null }"
          />
        </section>

        <!-- Templates -->
        <section class="space-y-5">
          <div class="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 class="mk-display text-2xl sm:text-3xl dark:text-white">{{ t('dashboard.home.templatesHeading') }}</h2>
              <p class="mt-1 text-sm text-muted dark:text-neutral-400">
                {{ t('dashboard.home.templatesIntro', { n: PAGE_TEMPLATES.length }) }}
              </p>
            </div>
          </div>

          <!-- Phones swipe through the categories; wider screens show them all -->
          <div class="-mx-1 flex gap-2 overflow-x-auto scroll-fade-x px-1 pb-1 max-sm:[scrollbar-width:none] max-sm:[&::-webkit-scrollbar]:hidden sm:flex-wrap sm:overflow-visible sm:[mask-image:none]">
            <button
              v-for="chip in chips"
              :key="chip.id"
              type="button"
              class="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition"
              :class="category === chip.id
                ? 'border-inverted bg-inverted text-inverted dark:border-white dark:bg-white dark:text-neutral-900'
                : 'border-default text-muted hover:border-accented hover:text-highlighted dark:border-white/10 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-white'"
              @click="category = chip.id"
            >
              <UIcon :name="chip.icon" class="size-4" />
              {{ chip.label }}
              <span class="tabular-nums opacity-60">{{ chip.count }}</span>
            </button>
          </div>

          <div class="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
            <!-- Not <button>: the live preview inside contains buttons of its own -->
            <div
              v-for="template in filteredTemplates"
              :key="template.id"
              role="button"
              tabindex="0"
              class="group cursor-pointer overflow-hidden rounded-3xl bg-paper text-left ring-1 ring-line transition hover:-translate-y-0.5 hover:shadow-xl"
              :class="creatingId && creatingId !== template.id ? 'pointer-events-none opacity-60' : ''"
              :aria-busy="creatingId === template.id"
              @click="useTemplate(template.id)"
              @keydown.enter.prevent="useTemplate(template.id)"
              @keydown.space.prevent="useTemplate(template.id)"
            >
              <div class="relative aspect-[3/4] overflow-hidden border-b border-default dark:border-white/[0.08]">
                <SiteTemplateThumbnail :template="template" :scale="0.4" class="transition duration-500 group-hover:scale-[1.03]" />
                <SiteTemplatePreviewButton :template-id="template.id" />
                <div
                  class="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/60 via-black/0 to-transparent p-4 transition"
                  :class="creatingId === template.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'"
                >
                  <span class="inline-flex items-center gap-1.5 rounded-lg bg-default px-3 py-1.5 text-sm font-semibold text-highlighted shadow">
                    <template v-if="creatingId === template.id">
                      <UIcon name="i-lucide-loader-circle" class="size-4 animate-spin" />
                      {{ t('dashboard.home.creating') }}
                    </template>
                    <template v-else>
                      {{ t('dashboard.home.useTemplate') }}
                      <UIcon name="i-lucide-arrow-right" class="size-4" />
                    </template>
                  </span>
                </div>
              </div>
              <div class="space-y-1.5 p-3 sm:space-y-2 sm:p-4">
                <div class="flex items-center justify-between gap-2">
                  <h3 class="truncate text-sm font-semibold text-highlighted sm:text-base dark:text-white">{{ templateName(template.id) }}</h3>
                  <span class="hidden shrink-0 sm:inline-flex items-center gap-1 rounded-md border border-default px-1.5 py-0.5 text-[11px] font-medium text-muted dark:border-white/10 dark:text-neutral-400">
                    <UIcon name="i-lucide-box" class="size-3" />
                    3D
                  </span>
                </div>
                <p class="line-clamp-2 text-xs text-muted sm:text-sm dark:text-neutral-400">{{ templateDescription(template.id) }}</p>
                <p class="text-xs text-dimmed dark:text-neutral-500">{{ categoryLabel(template.category) }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>

    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { PAGE_TEMPLATES, TEMPLATE_CATEGORIES, type TemplateCategory } from '~/data/pageTemplates'

definePageMeta({
  colorMode: 'light',
  layout: 'admin',
  middleware: 'auth',
  ssr: false,
})

const route = useRoute()
const { t } = useI18n()
useSeoMeta({ title: () => `${t('nav.home')} — Perlink`, robots: 'noindex, nofollow' })

// Name typed on the landing page (?input=) carries over
const initialSlug = computed(() => (typeof route.query.input === 'string' ? route.query.input.toLowerCase() : ''))

const category = ref<TemplateCategory | 'all'>('all')
const toast = useToast()
const { createSite } = useCreateSite()

const chips = computed(() => [
  { id: 'all' as const, label: t('dashboard.home.all'), icon: 'i-lucide-layout-grid', count: PAGE_TEMPLATES.length },
  ...TEMPLATE_CATEGORIES.map(c => ({ ...c, label: t(`dashboard.categories.${c.id}`), count: PAGE_TEMPLATES.filter(t => t.category === c.id).length })),
].filter(chip => chip.count > 0))

const filteredTemplates = computed(() =>
  category.value === 'all' ? PAGE_TEMPLATES : PAGE_TEMPLATES.filter(t => t.category === category.value),
)


function categoryLabel(id: TemplateCategory) {
  return TEMPLATE_CATEGORIES.some(c => c.id === id) ? t(`dashboard.categories.${id}`) : ''
}

function templateName(id: string) {
  return t(`dashboard.templates.${id}.name`)
}

function templateDescription(id: string) {
  return t(`dashboard.templates.${id}.description`)
}

// Their sites, newest edits first; the home shows the latest three
const sites = ref<any[]>([])
const recentSites = computed(() =>
  [...sites.value].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''))).slice(0, 4),
)
const { qrSite, pendingSite, copyUrl, shareSite, publishSite, unpublishSite } = useSiteActions(sites)
onMounted(async () => {
  const res = await $fetch<{ success: boolean; bioPages?: any[] }>('/api/admin/bios').catch(() => null)
  if (res?.bioPages) sites.value = res.bioPages
})

// One click: the site is made with a temporary address and opens in the
// editor, which asks for a real address before publishing
const creatingId = ref<string | null>(null)
async function useTemplate(id: string) {
  if (creatingId.value) return
  creatingId.value = id
  try {
    const username = await createSite({ templateId: id })
    await navigateTo(`/dashboard/site/${username}`)
  } catch (error: any) {
    creatingId.value = null
    if (useUpgradePrompt().fromError(error)) return
    toast.add({ title: t('dashboard.claim.createFailed'), description: error?.data?.statusMessage || error?.message, color: 'error' })
  }
}

// "Use this template" on a template's preview page lands here
onMounted(() => {
  const id = typeof route.query.template === 'string' ? route.query.template : ''
  if (!id || !PAGE_TEMPLATES.some(item => item.id === id)) return
  // Off the address first, so coming back here doesn't make another site
  navigateTo({ query: { ...route.query, template: undefined } }, { replace: true })
  useTemplate(id)
})
</script>
