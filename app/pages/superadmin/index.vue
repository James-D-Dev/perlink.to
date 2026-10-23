<template>
  <UDashboardPanel id="superadmin-dashboard">
    <template #header>
      <UDashboardNavbar title="Dashboard">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-lucide-refresh-cw"
            :loading="isLoading"
            @click="fetchOverview"
          />
          <UButton
            to="/superadmin/users/create"
            icon="i-lucide-user-plus"
            label="Create User"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-7xl space-y-6">

      <!-- KPIs -->
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SuperadminStatCard
          label="Users"
          :value="totals.users"
          icon="i-lucide-users"
          :hint="`+${totals.usersNewThisWeek} this week · ${totals.usersPaid} paid`"
          to="/superadmin/users"
          :loading="isLoading && !loaded"
        />
        <SuperadminStatCard
          label="Bio Pages"
          :value="totals.bioPages"
          icon="i-lucide-id-card"
          :hint="`${totals.bioPublished} published · ${totals.bioViews.toLocaleString()} views`"
          to="/superadmin/bio"
          :loading="isLoading && !loaded"
        />
        <SuperadminStatCard
          label="Short Links"
          :value="totals.links"
          icon="i-lucide-link"
          :hint="`${totals.linkClicks.toLocaleString()} total clicks`"
          to="/superadmin/links"
          :loading="isLoading && !loaded"
        />
        <SuperadminStatCard
          label="QR Codes"
          :value="totals.qrCodes"
          icon="i-lucide-qr-code"
          :hint="`${totals.qrActive} active · ${totals.qrScans.toLocaleString()} scans`"
          to="/superadmin/qr-codes"
          :loading="isLoading && !loaded"
        />
      </div>

      <!-- Trends -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UCard :ui="cardUi">
          <template #header>
            <div class="flex items-baseline justify-between">
              <div>
                <h3 class="font-medium text-highlighted">New users</h3>
                <p class="text-xs text-muted">Last 30 days</p>
              </div>
              <p class="text-xl font-semibold tabular-nums text-highlighted">{{ sum(signups).toLocaleString() }}</p>
            </div>
          </template>
          <USkeleton v-if="!loaded" class="h-44 w-full" />
          <SuperadminBarChart v-else :data="signups" unit="signups" />
        </UCard>

        <UCard :ui="cardUi">
          <template #header>
            <div class="flex items-baseline justify-between">
              <div>
                <h3 class="font-medium text-highlighted">Clicks</h3>
                <p class="text-xs text-muted">Last 30 days · links &amp; bio pages, bots excluded</p>
              </div>
              <p class="text-xl font-semibold tabular-nums text-highlighted">{{ sum(clicks).toLocaleString() }}</p>
            </div>
          </template>
          <USkeleton v-if="!loaded" class="h-44 w-full" />
          <SuperadminBarChart v-else :data="clicks" unit="clicks" />
        </UCard>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <!-- Recent users -->
        <UCard :ui="{ ...cardUi, body: 'p-0 sm:p-0' }" class="lg:col-span-2">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-highlighted">Recent users</h3>
              <UButton to="/superadmin/users" variant="link" color="neutral" size="sm" trailing-icon="i-lucide-arrow-right" label="View all" />
            </div>
          </template>
          <ul class="divide-y divide-default">
            <li v-for="u in recentUsers" :key="u.id">
              <NuxtLink :to="`/superadmin/users/${u.id}`" class="flex items-center gap-3 px-4 py-3 hover:bg-elevated/50 transition-colors">
                <UAvatar :src="u.avatar || undefined" :text="initial(u.name || u.email)" size="sm" />
                <div class="min-w-0 flex-1">
                  <p class="truncate text-sm font-medium text-highlighted">{{ u.name || 'No name' }}</p>
                  <p class="truncate text-xs text-muted">{{ u.email }}</p>
                </div>
                <UBadge :color="getPlanColor(u.plan)" variant="subtle" size="sm" class="capitalize">{{ u.plan }}</UBadge>
                <span class="hidden w-24 text-right text-xs text-dimmed sm:block">{{ timeAgo(u.createdAt) }}</span>
              </NuxtLink>
            </li>
            <li v-if="loaded && recentUsers.length === 0" class="px-4 py-8 text-center text-sm text-muted">No users yet.</li>
          </ul>
        </UCard>

        <!-- Plan distribution -->
        <UCard :ui="cardUi">
          <template #header>
            <h3 class="font-medium text-highlighted">Plans</h3>
          </template>
          <ul class="space-y-3">
            <li v-for="p in planBreakdown" :key="p.id">
              <div class="mb-1 flex justify-between text-sm">
                <span class="text-default">{{ p.name }}</span>
                <span class="tabular-nums text-muted">{{ p.count.toLocaleString() }} · {{ p.percent }}%</span>
              </div>
              <div class="h-1.5 rounded-full bg-accented">
                <div class="h-full rounded-full bg-primary" :style="{ width: `${p.percent}%` }" />
              </div>
            </li>
          </ul>
        </UCard>
      </div>

      <!-- Top content -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UCard :ui="{ ...cardUi, body: 'p-0 sm:p-0' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-highlighted">Top short links</h3>
              <UButton to="/superadmin/links" variant="link" color="neutral" size="sm" trailing-icon="i-lucide-arrow-right" label="View all" />
            </div>
          </template>
          <ul class="divide-y divide-default">
            <li v-for="(l, i) in topLinks" :key="l.id" class="flex items-center gap-3 px-4 py-3">
              <span class="w-4 text-xs tabular-nums text-dimmed">{{ i + 1 }}</span>
              <div class="min-w-0 flex-1">
                <a :href="`https://s.perlink.to/${l.shortCode}`" target="_blank" class="truncate text-sm font-medium text-highlighted hover:text-primary">
                  s.perlink.to/{{ l.shortCode }}
                </a>
                <p class="truncate text-xs text-muted">{{ l.title || l.ownerEmail || '-' }}</p>
              </div>
              <span class="text-sm tabular-nums text-default">{{ l.clickCount.toLocaleString() }}</span>
            </li>
            <li v-if="loaded && topLinks.length === 0" class="px-4 py-8 text-center text-sm text-muted">No short links yet.</li>
          </ul>
        </UCard>

        <UCard :ui="{ ...cardUi, body: 'p-0 sm:p-0' }">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="font-medium text-highlighted">Top bio pages</h3>
              <UButton to="/superadmin/bio" variant="link" color="neutral" size="sm" trailing-icon="i-lucide-arrow-right" label="View all" />
            </div>
          </template>
          <ul class="divide-y divide-default">
            <li v-for="(b, i) in topBios" :key="b.id" class="flex items-center gap-3 px-4 py-3">
              <span class="w-4 text-xs tabular-nums text-dimmed">{{ i + 1 }}</span>
              <UAvatar :src="b.avatarUrl || undefined" :text="initial(b.title || b.username)" size="xs" />
              <div class="min-w-0 flex-1">
                <a :href="`/${b.username}`" target="_blank" class="truncate text-sm font-medium text-highlighted hover:text-primary">
                  {{ b.title || b.username }}
                </a>
                <p class="truncate text-xs text-muted">perlink.to/{{ b.username }}</p>
              </div>
              <span class="text-sm tabular-nums text-default">{{ b.viewCount.toLocaleString() }}</span>
            </li>
            <li v-if="loaded && topBios.length === 0" class="px-4 py-8 text-center text-sm text-muted">No bio pages yet.</li>
          </ul>
        </UCard>
      </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { PLANS, usePlans, type PlanId } from '~/composables/usePlans'

interface SeriesPoint { date: string; value: number }

interface Overview {
  totals: Record<
    'users' | 'usersNewThisWeek' | 'usersBanned' | 'usersPaid' | 'bioPages' | 'bioPublished' | 'bioViews'
    | 'links' | 'linkClicks' | 'qrCodes' | 'qrActive' | 'qrScans',
    number
  >
  signups: SeriesPoint[]
  clicks: SeriesPoint[]
  plans: { plan: string; count: number }[]
  recentUsers: { id: string; email: string; name: string | null; avatar: string | null; plan: string; status: string; createdAt: string }[]
  topLinks: { id: string; shortCode: string; title: string | null; clickCount: number; ownerEmail: string | null }[]
  topBios: { id: string; username: string; title: string | null; avatarUrl: string | null; viewCount: number; ownerEmail: string | null }[]
}

definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
  colorMode: 'dark',
});

const toast = useToast();
const { getPlanColor } = usePlans();

const cardUi = { root: 'bg-elevated/40 ring-default', header: 'px-4 py-3 sm:px-4', body: 'p-4 sm:p-4' };

// State
const isLoading = ref(false);
const loaded = ref(false);
const totals = ref<Overview['totals']>({
  users: 0, usersNewThisWeek: 0, usersBanned: 0, usersPaid: 0,
  bioPages: 0, bioPublished: 0, bioViews: 0,
  links: 0, linkClicks: 0, qrCodes: 0, qrActive: 0, qrScans: 0,
});
const signups = ref<SeriesPoint[]>([]);
const clicks = ref<SeriesPoint[]>([]);
const plans = ref<Overview['plans']>([]);
const recentUsers = ref<Overview['recentUsers']>([]);
const topLinks = ref<Overview['topLinks']>([]);
const topBios = ref<Overview['topBios']>([]);

// Computed
const planBreakdown = computed(() => {
  const total = plans.value.reduce((s, p) => s + p.count, 0) || 1;
  return (Object.keys(PLANS) as PlanId[]).map((id) => {
    const count = plans.value.find(p => p.plan === id)?.count || 0;
    return { id, name: PLANS[id].name, count, percent: Math.round((count / total) * 100) };
  });
});

// Methods
const sum = (series: SeriesPoint[]): number => series.reduce((s, p) => s + p.value, 0);

const initial = (text: string | null): string => (text?.charAt(0) || '?').toUpperCase();

const timeAgo = (date: string): string => {
  if (!date) return '-';
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${Math.max(minutes, 1)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const fetchOverview = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch('/api/superadmin/overview') as Overview;
    totals.value = response.totals;
    signups.value = response.signups;
    clicks.value = response.clicks;
    plans.value = response.plans;
    recentUsers.value = response.recentUsers;
    topLinks.value = response.topLinks;
    topBios.value = response.topBios;
    loaded.value = true;
  } catch (error) {
    console.error('Failed to fetch overview:', error);
    toast.add({ title: 'Failed to load dashboard', color: 'error' });
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchOverview();
});
</script>
