<template>
  <UDashboardPanel id="superadmin-dashboard">
    <template #header>
      <UDashboardNavbar title="Dashboard">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <span v-if="updatedAt" class="hidden text-xs text-dimmed sm:inline">Updated {{ updatedLabel }}</span>
          <UTooltip text="Refresh">
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-refresh-cw"
              aria-label="Refresh"
              :loading="isLoading"
              @click="fetchOverview"
            />
          </UTooltip>
          <UButton
            to="/superadmin/users/create"
            icon="i-lucide-user-plus"
            color="neutral"
            variant="outline"
            aria-label="Create user"
            class="max-sm:px-2"
          >
            <span class="hidden sm:inline">Create user</span>
          </UButton>
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-6xl space-y-6 py-2 sm:py-4">
        <!-- Waiting on you -->
        <div v-if="loaded" class="flex flex-wrap items-center gap-2">
          <template v-if="todo.length">
            <span class="mr-1 text-sm font-medium text-highlighted">To do</span>
            <NuxtLink
              v-for="t in todo"
              :key="t.label"
              :to="t.to"
              class="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 transition-colors"
              :class="t.tone === 'error' ? 'bg-error/10 text-error ring-error/25 hover:bg-error/15' : 'bg-primary/10 text-primary ring-primary/25 hover:bg-primary/15'"
            >
              <UIcon :name="t.icon" class="size-4" />
              <span class="font-semibold tabular-nums">{{ t.count }}</span>
              <span>{{ t.label }}</span>
            </NuxtLink>
          </template>
          <p v-else class="inline-flex items-center gap-2 text-sm text-muted">
            <UIcon name="i-lucide-circle-check" class="size-4 text-success" />
            All clear: no payments to review, open reports or unread mail.
          </p>
        </div>
        <USkeleton v-else class="h-8 w-80 rounded-full" />

        <!-- KPIs -->
        <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <SuperadminStatCard
            label="Revenue · 30 days"
            :value="revenue.usd30"
            :display="revenueLabel"
            icon="i-lucide-dollar-sign"
            :hint="`${revenue.orders30} ${revenue.orders30 === 1 ? 'sale' : 'sales'} · ${usd(revenue.usdAll)} all time`"
            to="/superadmin/payments"
            :loading="!loaded"
          />
          <SuperadminStatCard
            label="Users"
            :value="totals.users"
            icon="i-lucide-users"
            :hint="`+${totals.usersNewThisWeek} this week · ${totals.usersPaid} paid`"
            to="/superadmin/users"
            :loading="!loaded"
          />
          <SuperadminStatCard
            label="Bio pages"
            :value="totals.bioPages"
            icon="i-lucide-id-card"
            :hint="`${totals.bioPublished} published · ${compact(totals.bioViews)} views`"
            to="/superadmin/bio"
            :loading="!loaded"
          />
          <SuperadminStatCard
            label="Links & QR"
            :value="totals.links + totals.qrCodes"
            icon="i-lucide-link"
            :hint="`${totals.links} links · ${totals.qrCodes} QR · ${compact(totals.linkClicks + totals.qrScans)} clicks`"
            to="/superadmin/links"
            :loading="!loaded"
          />
        </div>

        <!-- Trends -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <UCard v-for="chart in charts" :key="chart.title" :ui="cardUi">
            <template #header>
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <h3 class="font-medium text-highlighted">{{ chart.title }}</h3>
                  <p class="truncate text-xs text-muted">{{ chart.hint }}</p>
                </div>
                <div class="text-right">
                  <p class="text-xl font-semibold tabular-nums text-highlighted">{{ chart.total }}</p>
                  <p
                    v-if="chart.change !== null"
                    class="whitespace-nowrap text-xs tabular-nums"
                    :class="chart.change >= 0 ? 'text-success' : 'text-error'"
                    title="Last 15 days against the 15 days before"
                  >
                    {{ chart.change >= 0 ? '▲' : '▼' }} {{ Math.abs(chart.change) }}%
                  </p>
                </div>
              </div>
            </template>
            <USkeleton v-if="!loaded" class="h-36 w-full" />
            <SuperadminBarChart v-else :data="chart.data" :unit="chart.unit" :format="chart.format" :height="130" />
          </UCard>
        </div>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <!-- Recent users -->
          <UCard :ui="listCardUi" class="lg:col-span-3">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-medium text-highlighted">New users</h3>
                <UButton to="/superadmin/users" variant="link" color="neutral" size="sm" trailing-icon="i-lucide-arrow-right" label="View all" />
              </div>
            </template>
            <ul class="divide-y divide-line">
              <li v-for="u in recentUsers" :key="u.id">
                <NuxtLink :to="`/superadmin/users/${u.id}`" class="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-sand/40">
                  <UAvatar :src="u.avatar || undefined" :text="initial(u.name || u.email)" size="sm" />
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-highlighted">{{ u.name || u.email || 'No name' }}</p>
                    <p class="truncate text-xs text-muted">{{ u.name ? u.email : '' }}</p>
                  </div>
                  <UBadge v-if="u.plan !== 'free'" :color="getPlanColor(u.plan)" variant="subtle" size="sm" class="capitalize">{{ u.plan }}</UBadge>
                  <UBadge v-if="u.status === 'banned'" color="error" variant="subtle" size="sm">Banned</UBadge>
                  <span class="w-16 shrink-0 text-right text-xs text-dimmed">{{ timeAgo(u.createdAt) }}</span>
                </NuxtLink>
              </li>
              <li v-if="loaded && recentUsers.length === 0" class="px-5 py-8 text-center text-sm text-muted">No users yet.</li>
            </ul>
          </UCard>

          <div class="space-y-4 lg:col-span-2">
            <!-- Recent sales -->
            <UCard :ui="listCardUi">
              <template #header>
                <div class="flex items-center justify-between">
                  <h3 class="font-medium text-highlighted">Recent sales</h3>
                  <UButton to="/superadmin/payments" variant="link" color="neutral" size="sm" trailing-icon="i-lucide-arrow-right" label="View all" />
                </div>
              </template>
              <ul class="divide-y divide-line">
                <li v-for="p in recentPayments" :key="p.id" class="flex items-center gap-3 px-5 py-3">
                  <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                    <UIcon :name="methodIcon(p.method)" class="size-4" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-highlighted">{{ productLabel(p) }}</p>
                    <p class="truncate text-xs text-muted">{{ p.name || p.email || 'Deleted account' }}</p>
                  </div>
                  <div class="shrink-0 text-right">
                    <p class="text-sm font-semibold tabular-nums text-highlighted">{{ p.amountUsd ? usd(p.amountUsd) : vnd(p.amount) }}</p>
                    <p class="text-xs text-dimmed">{{ timeAgo(p.paidAt) }}</p>
                  </div>
                </li>
                <li v-if="loaded && recentPayments.length === 0" class="px-5 py-8 text-center text-sm text-muted">No sales yet.</li>
              </ul>
            </UCard>

            <!-- Plans -->
            <UCard :ui="cardUi">
              <template #header>
                <div class="flex items-baseline justify-between">
                  <h3 class="font-medium text-highlighted">Plans</h3>
                  <p class="text-xs text-muted">{{ revenue.activeSubs }} active {{ revenue.activeSubs === 1 ? 'subscription' : 'subscriptions' }}</p>
                </div>
              </template>
              <!-- One stacked bar, then the legend -->
              <div class="flex h-2 overflow-hidden rounded-full bg-accented">
                <div v-for="p in planBreakdown" :key="p.id" :style="{ width: `${p.share}%`, backgroundColor: p.color }" />
              </div>
              <ul class="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
                <li v-for="p in planBreakdown" :key="p.id" class="flex items-center gap-2 text-sm">
                  <span class="size-2 shrink-0 rounded-full" :style="{ backgroundColor: p.color }" />
                  <span class="text-default">{{ p.name }}</span>
                  <span class="ml-auto tabular-nums text-muted">{{ p.count }}</span>
                </li>
              </ul>
            </UCard>
          </div>
        </div>

        <!-- Top content -->
        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <UCard :ui="listCardUi">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-medium text-highlighted">Top bio pages</h3>
                <UButton to="/superadmin/bio" variant="link" color="neutral" size="sm" trailing-icon="i-lucide-arrow-right" label="View all" />
              </div>
            </template>
            <ul class="divide-y divide-line">
              <li v-for="(b, i) in topBios" :key="b.id">
                <a :href="`/${b.username}`" target="_blank" rel="noopener" class="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-sand/40">
                  <span class="w-4 text-xs tabular-nums text-dimmed">{{ i + 1 }}</span>
                  <UAvatar :src="b.avatarUrl || undefined" :text="initial(b.title || b.username)" size="xs" />
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-highlighted group-hover:text-primary">{{ b.title || b.username }}</p>
                    <p class="truncate text-xs text-muted">perlink.to/{{ b.username }}</p>
                  </div>
                  <span class="text-sm tabular-nums text-default">{{ b.viewCount.toLocaleString() }} <span class="text-xs text-dimmed">views</span></span>
                </a>
              </li>
              <li v-if="loaded && topBios.length === 0" class="px-5 py-8 text-center text-sm text-muted">No bio pages yet.</li>
            </ul>
          </UCard>

          <UCard :ui="listCardUi">
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-medium text-highlighted">Top short links</h3>
                <UButton to="/superadmin/links" variant="link" color="neutral" size="sm" trailing-icon="i-lucide-arrow-right" label="View all" />
              </div>
            </template>
            <ul class="divide-y divide-line">
              <li v-for="(l, i) in topLinks" :key="l.id">
                <a :href="`https://s.perlink.to/${l.shortCode}`" target="_blank" rel="noopener" class="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-sand/40">
                  <span class="w-4 text-xs tabular-nums text-dimmed">{{ i + 1 }}</span>
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-highlighted group-hover:text-primary">s.perlink.to/{{ l.shortCode }}</p>
                    <p class="truncate text-xs text-muted">{{ l.title || l.ownerEmail || '-' }}</p>
                  </div>
                  <span class="text-sm tabular-nums text-default">{{ l.clickCount.toLocaleString() }} <span class="text-xs text-dimmed">clicks</span></span>
                </a>
              </li>
              <li v-if="loaded && topLinks.length === 0" class="px-5 py-8 text-center text-sm text-muted">No short links yet.</li>
            </ul>
          </UCard>
        </div>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { useNow } from '@vueuse/core'
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
  revenue: { usdAll: number; vndAll: number; usd30: number; vnd30: number; orders30: number; activeSubs: number }
  revenueSeries: SeriesPoint[]
  attention: { payments: number; reports: number; mail: number; mailFailed: number }
  recentPayments: {
    id: string; plan: string | null; period: string | null; method: string; amount: number; amountUsd: number | null
    paidAt: string; email: string | null; name: string | null; product: string | null
  }[]
}

definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
});

const toast = useToast();
const { getPlanColor } = usePlans();

const cardUi = { header: 'px-5 py-4 sm:px-5', body: 'p-5 sm:p-5' };
const listCardUi = { ...cardUi, body: 'p-0 sm:p-0' };

// State
const isLoading = ref(false);
const loaded = ref(false);
const updatedAt = ref<number | null>(null);
const now = useNow({ interval: 30_000 });
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
const revenue = ref<Overview['revenue']>({ usdAll: 0, vndAll: 0, usd30: 0, vnd30: 0, orders30: 0, activeSubs: 0 });
const revenueSeries = ref<SeriesPoint[]>([]);
const attention = ref<Overview['attention']>({ payments: 0, reports: 0, mail: 0, mailFailed: 0 });
const recentPayments = ref<Overview['recentPayments']>([]);

// Formatting
const usd = (n: number): string => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
const vnd = (n: number): string => `${n.toLocaleString('vi-VN')}₫`;
const compact = (n: number): string => n.toLocaleString('en-US', { notation: n >= 10_000 ? 'compact' : 'standard', maximumFractionDigits: 1 });
const sum = (series: SeriesPoint[]): number => series.reduce((s, p) => s + p.value, 0);
// First character, emoji included ("🌱" → 🌱, not half of it)
const initial = (text: string | null): string => (Array.from(text?.trim() || '')[0] || '?').toUpperCase();

const timeAgo = (date: string): string => {
  if (!date) return '-';
  const diff = now.value.getTime() - new Date(date.includes('T') || date.endsWith('Z') ? date : `${date.replace(' ', 'T')}Z`).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const updatedLabel = computed(() => updatedAt.value ? timeAgo(new Date(updatedAt.value).toISOString()) : '');

// Computed
const revenueLabel = computed(() => {
  const r = revenue.value;
  if (r.vnd30 && !r.usd30) return vnd(r.vnd30);
  return r.vnd30 ? `${usd(r.usd30)} + ${compact(r.vnd30)}₫` : usd(r.usd30);
});

/** Last 15 days against the 15 before, in percent (null when there's nothing to compare) */
const change = (series: SeriesPoint[]): number | null => {
  const half = Math.floor(series.length / 2);
  const before = sum(series.slice(0, half));
  const after = sum(series.slice(half));
  if (!before) return null;
  return Math.round(((after - before) / before) * 100);
};

const charts = computed(() => [
  { title: 'Revenue', hint: 'Last 30 days · USD, card & crypto', total: usd(sum(revenueSeries.value)), data: revenueSeries.value, unit: '', format: usd, change: change(revenueSeries.value) },
  { title: 'New users', hint: 'Last 30 days', total: sum(signups.value).toLocaleString(), data: signups.value, unit: 'signups', format: undefined, change: change(signups.value) },
  { title: 'Clicks', hint: 'Last 30 days · links & bio pages, no bots', total: sum(clicks.value).toLocaleString(), data: clicks.value, unit: 'clicks', format: undefined, change: change(clicks.value) },
]);

const todo = computed(() => {
  const a = attention.value;
  return [
    { count: a.payments, label: a.payments === 1 ? 'payment to review' : 'payments to review', icon: 'i-lucide-wallet', to: '/superadmin/payments', tone: 'primary' },
    { count: a.reports, label: a.reports === 1 ? 'open report' : 'open reports', icon: 'i-lucide-flag', to: '/superadmin/reports', tone: 'error' },
    { count: a.mail, label: 'unread mail', icon: 'i-lucide-mail', to: '/superadmin/emails', tone: 'primary' },
    { count: a.mailFailed, label: a.mailFailed === 1 ? 'email failed (7d)' : 'emails failed (7d)', icon: 'i-lucide-mail-x', to: '/superadmin/emails?box=out', tone: 'error' },
  ].filter(t => t.count > 0);
});

const PLAN_COLORS: Record<string, string> = {
  free: 'var(--ui-border-accented)',
  starter: 'var(--color-sky-400)',
  plus: 'var(--ui-primary)',
  max: 'var(--color-violet-500)',
};

const planBreakdown = computed(() => {
  const total = plans.value.reduce((s, p) => s + p.count, 0) || 1;
  return (Object.keys(PLANS) as PlanId[]).map((id) => {
    const count = plans.value.find(p => p.plan === id)?.count || 0;
    return { id, name: PLANS[id].name, count, share: (count / total) * 100, color: PLAN_COLORS[id] || 'var(--ui-primary)' };
  });
});

const methodIcon = (method: string): string => ({
  creem: 'i-lucide-credit-card',
  lemon: 'i-lucide-credit-card',
  crypto: 'i-lucide-bitcoin',
  bank: 'i-lucide-landmark',
}[method] || 'i-lucide-receipt');

const productLabel = (p: Overview['recentPayments'][number]): string => {
  if (p.product === 'wedding') return 'Wedding pass';
  if (p.product?.startsWith('pack:')) {
    const pack = p.product.slice(5);
    return `${pack.charAt(0).toUpperCase()}${pack.slice(1)} room pack`;
  }
  const name = PLANS[p.plan as PlanId]?.name || p.plan || 'Payment';
  return `${name} · ${p.period === 'annual' ? 'yearly' : 'monthly'}`;
};

const fetchOverview = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch<Overview>('/api/superadmin/overview');
    totals.value = response.totals;
    signups.value = response.signups;
    clicks.value = response.clicks;
    plans.value = response.plans;
    recentUsers.value = response.recentUsers;
    topLinks.value = response.topLinks;
    topBios.value = response.topBios;
    revenue.value = response.revenue;
    revenueSeries.value = response.revenueSeries;
    attention.value = response.attention;
    recentPayments.value = response.recentPayments;
    loaded.value = true;
    updatedAt.value = Date.now();
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
