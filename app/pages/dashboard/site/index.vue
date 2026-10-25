<template>
  <UDashboardPanel id="bio-list">
    <template #header>
      <UDashboardNavbar :title="t('dashboard.sites.title')">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>

        <template #right>
          <!-- The main site's address, always one click from sharing -->
          <button
            v-if="primary"
            type="button"
            class="hidden items-center gap-2 rounded-full bg-sand px-3.5 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-sand-strong sm:inline-flex"
            :title="t('common.copyLink')"
            @click="copyUrl(primary.username)"
          >
            <AppLogo variant="mark" :size="14" />
            perlink.to/{{ primary.username }}
            <UIcon name="i-lucide-copy" class="size-3.5 text-ink-muted" />
          </button>
          <UButton
            to="/dashboard"
            color="primary"
            icon="i-lucide-plus"
            :label="t('dashboard.sites.createSite')"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-5xl space-y-10 py-2 sm:py-4">
        <h1 class="mk-display text-3xl text-ink sm:text-4xl">{{ greeting }}</h1>

        <!-- Sites -->
        <section class="space-y-4">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 class="text-lg font-semibold text-ink">{{ t('dashboard.sites.heading') }}</h2>
              <p v-if="!loading && bioPages.length" class="text-sm text-ink-muted">
                {{ t('dashboard.sites.count', bioPages.length) }} · {{ t('dashboard.sites.liveCount', { n: liveCount }) }}
              </p>
            </div>
            <UInput
              v-if="bioPages.length > 3"
              v-model="searchQuery"
              :placeholder="t('dashboard.sites.search')"
              icon="i-lucide-search"
              class="w-full sm:w-64"
            />
          </div>

          <div v-if="loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
            <div v-for="i in 2" :key="i" class="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <USkeleton class="absolute inset-0 rounded-3xl" />
              <div class="absolute inset-x-4 bottom-4 flex items-end gap-2">
                <div class="flex-1 space-y-2">
                  <USkeleton class="h-5 w-32 bg-paper/70" />
                  <USkeleton class="h-3 w-24 bg-paper/70" />
                </div>
                <USkeleton class="h-10 w-16 rounded-full bg-paper/70" />
              </div>
            </div>
          </div>

          <div v-else-if="bioPages.length" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <SiteCard
              v-for="bio in filteredBioPages"
              :key="bio.id"
              :site="bio"
              :pending="pendingSite === bio.username"
              @share="shareSite(bio)"
              @copy="copyUrl(bio.username)"
              @qr="qrSite = bio"
              @publish="publishBio(bio.username)"
              @unpublish="unpublishBio(bio.username)"
            />
            <!-- One more -->
            <NuxtLink
              v-if="!searchQuery"
              to="/dashboard"
              class="flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed py-10 sm:aspect-[4/5] sm:py-0 border-line text-ink-muted transition-colors hover:border-ink-faint hover:bg-sand/40 hover:text-ink"
            >
              <span class="flex size-12 items-center justify-center rounded-full bg-sand">
                <UIcon name="i-lucide-plus" class="size-5" />
              </span>
              <span class="text-sm font-medium">{{ t('dashboard.sites.newSite') }}</span>
            </NuxtLink>
          </div>

          <!-- Empty State -->
          <div v-else class="flex flex-col items-center rounded-3xl bg-sand px-6 py-14 text-center">
            <MarketingMkOrb palette="sunset" :size="72" />
            <h3 class="mt-6 text-lg font-medium text-ink">{{ t('dashboard.sites.emptyTitle') }}</h3>
            <p class="mt-1 max-w-sm text-sm text-ink-muted">{{ t('dashboard.sites.emptyText') }}</p>
            <UButton to="/dashboard" class="mt-6" icon="i-lucide-plus" :label="t('dashboard.sites.createSite')" />
          </div>

          <p v-if="!loading && bioPages.length && !filteredBioPages.length" class="text-sm text-ink-muted">
            {{ t('dashboard.sites.noMatch', { query: searchQuery }) }}
          </p>
        </section>

        <section v-if="loading" class="space-y-4" aria-busy="true">
          <USkeleton class="h-5 w-28" />
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <USkeleton class="h-56 rounded-3xl" />
            <USkeleton class="h-56 rounded-3xl" />
          </div>
        </section>

        <!-- The last seven days, across all sites -->
        <section v-if="!loading && bioPages.length" class="space-y-4">
          <h2 class="text-lg font-semibold text-ink">{{ t('dashboard.sites.week.heading') }}</h2>
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <!-- Visits -->
            <div class="rounded-3xl bg-paper p-5 ring-1 ring-line">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p class="text-sm font-medium text-ink">{{ t('dashboard.sites.week.visits') }}</p>
                  <p class="mt-1 text-4xl font-semibold tabular-nums text-ink">{{ weekTotal.toLocaleString() }}</p>
                  <p v-if="weekTotal || previousTotal" class="mt-1 text-xs" :class="weekChange >= 0 ? 'text-emerald-700' : 'text-red-600'">
                    {{ weekChange >= 0 ? '↑' : '↓' }} {{ t('dashboard.sites.week.change', { n: Math.abs(weekChange) }) }}
                  </p>
                </div>
                <UButton
                  v-if="primary"
                  :to="`/dashboard/site/${primary.username}/analytics`"
                  size="xs"
                  color="neutral"
                  variant="outline"
                  :label="t('dashboard.sites.week.details')"
                />
              </div>
              <!-- Daily bars -->
              <div class="mt-5 flex h-24 items-end gap-1.5">
                <div v-for="(n, i) in weekSeries" :key="i" class="group/bar relative flex flex-1 flex-col items-center justify-end gap-1.5 self-stretch">
                  <span class="pointer-events-none absolute -top-5 rounded bg-ink px-1.5 py-0.5 text-[10px] tabular-nums text-paper opacity-0 transition group-hover/bar:opacity-100">{{ n }}</span>
                  <div
                    class="w-full rounded-t-md transition-colors"
                    :class="n ? 'bg-ink group-hover/bar:bg-ink-soft' : 'bg-sand-strong'"
                    :style="{ height: `${n ? Math.max(8, (n / weekMax) * 100) : 4}%` }"
                  />
                  <span class="text-[10px] text-ink-faint">{{ weekdayLabel(i) }}</span>
                </div>
              </div>
            </div>

            <!-- What to do next -->
            <div class="flex flex-col justify-between gap-4 rounded-3xl bg-sand p-5">
              <template v-if="unreadTotal">
                <div>
                  <p class="text-sm font-medium text-ink">{{ t('dashboard.sites.week.requestsTitle', { n: unreadTotal }, unreadTotal) }}</p>
                  <p class="mt-1 text-sm text-ink-muted">{{ t('dashboard.sites.week.requestsText') }}</p>
                </div>
                <UButton class="self-start" icon="i-lucide-inbox" :to="`/dashboard/site/${unreadSite!.username}/inbox`" :label="t('dashboard.inbox.open')" />
              </template>
              <template v-else-if="weekTotal === 0">
                <div>
                  <p class="mk-display text-2xl leading-tight text-ink">{{ t('dashboard.sites.week.nudgeTitle') }}</p>
                  <p class="mt-2 text-sm text-ink-muted">{{ t('dashboard.sites.week.nudgeText') }}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <UButton v-if="primary" icon="i-lucide-copy" :label="t('common.copyLink')" @click="copyUrl(primary.username)" />
                  <UButton v-if="primary" color="neutral" variant="outline" icon="i-lucide-qr-code" :label="t('dashboard.qr.open')" @click="qrSite = primary" />
                </div>
              </template>
              <template v-else>
                <div>
                  <p class="mk-display text-2xl leading-tight text-ink">{{ t('dashboard.sites.week.goodTitle') }}</p>
                  <p class="mt-2 text-sm text-ink-muted">{{ t('dashboard.sites.week.goodText') }}</p>
                </div>
                <UButton v-if="primary" class="self-start" icon="i-lucide-share" :label="t('dashboard.editor.share')" @click="shareSite(primary)" />
              </template>
            </div>
          </div>
        </section>
      </div>

      <SiteQrModal
        v-if="qrSite"
        :open="!!qrSite"
        :username="qrSite.username"
        :title="qrSite.title"
        :theme-config="qrSite.themeConfig"
        @update:open="(v: boolean) => { if (!v) qrSite = null }"
      />
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
definePageMeta({
  colorMode: 'light',
  layout: "admin",
  middleware: "auth",
  ssr: false,
});

const toast = useToast();
const { t, locale } = useI18n();
const { user } = useUserSession();
const { current: setup } = useSiteSetup();

// State
const loading = ref(true);
const bioPages = ref<any[]>([]);
const searchQuery = ref("");

// Fetch bio pages
const fetchBioPages = async () => {
  try {
    loading.value = true;
    const response = await $fetch("/api/admin/bios");
    if (response.success && response.bioPages) {
      bioPages.value = response.bioPages;
      registerSetup();
    }
  } catch (error) {
    console.error("Failed to fetch bio pages:", error);
    toast.add({
      title: t("dashboard.toast.error"),
      description: t("dashboard.sites.loadFailed"),
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};

const liveCount = computed(() => bioPages.value.filter((bio) => bio.isPublished).length);

// Filtered bio pages
const filteredBioPages = computed(() => {
  if (!searchQuery.value) return bioPages.value;
  const query = searchQuery.value.toLowerCase();
  return bioPages.value.filter(
    (bio) =>
      bio.username?.toLowerCase().includes(query) ||
      bio.title?.toLowerCase().includes(query),
  );
});

// "Good afternoon, Minh" by the owner's local time
const greeting = computed(() => {
  const hour = new Date().getHours();
  const part = hour < 11 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const name = ((user.value as any)?.name || (user.value as any)?.username || "").trim();
  return name ? t(`dashboard.sites.greeting.${part}`, { name }) : t(`dashboard.sites.greeting.${part}Plain`);
});

// The site shown in the header pill and used for nudges: the latest edited
const primary = computed(() =>
  [...bioPages.value].sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))[0] ?? null,
);

// Visits across all sites, day by day for the last week
const weekSeries = computed(() =>
  Array.from({ length: 7 }, (_, i) => bioPages.value.reduce((sum, b) => sum + (b.visits?.week?.[i] ?? 0), 0)),
);
const weekTotal = computed(() => weekSeries.value.reduce((a, b) => a + b, 0));
const weekMax = computed(() => Math.max(1, ...weekSeries.value));
const previousTotal = computed(() => bioPages.value.reduce((sum, b) => sum + (b.visits?.previousTotal ?? 0), 0));
const weekChange = computed(() =>
  previousTotal.value ? Math.round(((weekTotal.value - previousTotal.value) / previousTotal.value) * 100) : weekTotal.value ? 100 : 0,
);
const weekdayLabel = (i: number) => {
  const day = bioPages.value[0]?.visits?.days?.[i];
  if (!day) return "";
  return new Date(`${day}T12:00:00Z`).toLocaleDateString(locale.value === "vi" ? "vi-VN" : "en-GB", { weekday: "narrow" });
};

const unreadSite = computed(() => bioPages.value.find((b) => b.unreadRequests > 0) ?? null);
const unreadTotal = computed(() => bioPages.value.reduce((sum, b) => sum + (b.unreadRequests || 0), 0));

const qrSite = ref<any | null>(null);

const shareSite = async (bio: any) => {
  const url = `https://perlink.to/${bio.username}`;
  try {
    await navigator.share({ title: bio.title || bio.username, url });
  } catch {
    await copyUrl(bio.username);
  }
};

// The sidebar's setup card, for the first site that still has steps left
const registerSetup = () => {
  const site = bioPages.value.find((b) => {
    const memory = readSetupMemory(b.username);
    return !memory.dismissed && siteSetupSteps(b, !!b.isPublished, memory.shared).some((s) => !s.done);
  });
  if (!site) return;
  const memory = readSetupMemory(site.username);
  const steps = computed(() => siteSetupSteps(site, !!site.isPublished, memory.shared));
  const done = computed(() => steps.value.filter((s) => s.done).length);
  setup.value = {
    username: site.username,
    steps,
    done,
    visible: computed(() => done.value < steps.value.length),
    openChecklist: () => navigateTo(`/dashboard/site/${site.username}?setup=1`),
  };
};
onBeforeUnmount(() => {
  if (setup.value?.openChecklist) setup.value = null;
});

// Copy URL
const copyUrl = async (username: string) => {
  try {
    const url = `https://perlink.to/${username}`;
    await navigator.clipboard.writeText(url);
    toast.add({
      title: t("dashboard.toast.copied"),
      description: url,
    });
  } catch {
    toast.add({
      title: t("dashboard.toast.copyFailed"),
      color: "error",
    });
  }
};

// Update the row right away: re-reading the list just after the write can
// still return the old state, so the badge looked stuck until a reload
const pendingSite = ref<string | null>(null);
const setPublished = (username: string, published: boolean) => {
  const site = bioPages.value.find((bio) => bio.username === username);
  if (site) site.isPublished = published;
};

// Publish bio
const publishBio = async (username: string) => {
  pendingSite.value = username;
  try {
    await $fetch(`/api/admin/bio/${username}/publish`, {
      method: "POST" as const,
    });
    setPublished(username, true);
    toast.add({
      title: t("dashboard.toast.published"),
      description: t("dashboard.sites.publishedText"),
    });
  } catch (error) {
    if (useUpgradePrompt().fromError(error)) return;
    toast.add({
      title: t("dashboard.toast.error"),
      description: t("dashboard.sites.publishFailed"),
      color: "error",
    });
  } finally {
    pendingSite.value = null;
  }
};

// Unpublish bio
const unpublishBio = async (username: string) => {
  pendingSite.value = username;
  try {
    await $fetch(`/api/admin/bio/${username}/unpublish`, {
      method: "POST" as const,
    });
    setPublished(username, false);
    toast.add({
      title: t("dashboard.toast.unpublished"),
      description: t("dashboard.sites.unpublishedText"),
    });
  } catch (error) {
    toast.add({
      title: t("dashboard.toast.error"),
      description: t("dashboard.sites.unpublishFailed"),
      color: "error",
    });
  } finally {
    pendingSite.value = null;
  }
};

// Initial fetch
onMounted(() => {
  fetchBioPages();
});
</script>
