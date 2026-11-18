<template>
  <UDashboardPanel id="user-details">
    <template #header>
      <UDashboardNavbar :title="user?.name || user?.email || 'User'">
        <template #leading>
          <UDashboardSidebarCollapse />
          <UButton to="/superadmin/users" variant="ghost" color="neutral" icon="i-lucide-arrow-left" size="sm" />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-6xl space-y-6 py-2 sm:py-4">
        <!-- Loading -->
        <template v-if="isLoading && !user">
          <USkeleton class="h-40 w-full rounded-3xl" />
          <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <USkeleton v-for="i in 4" :key="i" class="h-28 rounded-3xl" />
          </div>
        </template>

        <template v-else-if="user">
          <!-- Who -->
          <div class="relative overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
            <div class="h-24 bg-gradient-to-r sm:h-28" :class="heroGradient" />
            <div class="px-5 pb-5 sm:px-6">
              <div class="-mt-12 flex flex-wrap items-end justify-between gap-4">
                <div class="flex min-w-0 items-end gap-4">
                  <UAvatar
                    :src="user.avatar || undefined"
                    :alt="user.name || ''"
                    :text="initial(user.name || user.email)"
                    size="3xl"
                    class="size-24 shrink-0 text-3xl ring-4 ring-[var(--ui-bg)]"
                  />
                  <div class="min-w-0 pb-1">
                    <h2 class="truncate text-xl font-semibold text-highlighted">{{ user.name?.trim() || 'No name' }}</h2>
                    <p class="truncate text-sm text-muted">{{ user.email || 'No email' }}</p>
                  </div>
                </div>
                <div class="flex flex-wrap gap-2 pb-1">
                  <UButton v-if="primarySite" :to="`/${primarySite.username}`" target="_blank" icon="i-lucide-external-link" label="View site" color="neutral" variant="outline" size="sm" />
                  <UButton v-if="user.email" :to="`/superadmin/emails?to=${encodeURIComponent(user.email)}`" icon="i-lucide-mail" label="Send email" size="sm" />
                </div>
              </div>

              <div class="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ring-1" :class="statusChip.class">
                  <UIcon :name="statusChip.icon" class="size-3.5" />{{ statusChip.label }}
                </span>
                <span class="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ring-1" :class="planChip.class">
                  <UIcon :name="planChip.icon" class="size-3.5" />{{ planChip.label }}
                  <span v-if="user.planExpiresAt && user.plan !== 'free'" class="font-normal opacity-80">· until {{ shortDate(user.planExpiresAt) }}</span>
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-1 text-ink-soft ring-1 ring-line">
                  <span v-if="user.country" class="text-sm leading-none">{{ flag(user.country) }}</span>
                  <UIcon v-else name="i-lucide-globe" class="size-3.5" />
                  {{ user.country ? countryName(user.country) : 'Country not known yet' }}
                </span>
                <span v-for="p in user.providers" :key="p" class="inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-1 text-ink-soft ring-1 ring-line">
                  <UIcon :name="PROVIDER[p]?.icon ?? 'i-lucide-key-round'" class="size-3.5" />{{ PROVIDER[p]?.label ?? p }}
                </span>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-sand px-2.5 py-1 text-ink-soft ring-1 ring-line">
                  <UIcon name="i-lucide-calendar-plus" class="size-3.5" />Joined {{ ago(user.createdAt) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Numbers -->
          <div class="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            <div v-for="tile in tiles" :key="tile.label" class="rounded-3xl bg-paper p-4 ring-1 ring-line sm:p-5">
              <div class="flex items-center justify-between gap-2">
                <p class="text-sm text-ink-muted">{{ tile.label }}</p>
                <span class="flex size-8 items-center justify-center rounded-full" :class="tile.iconClass">
                  <UIcon :name="tile.icon" class="size-4" />
                </span>
              </div>
              <p class="mt-2 text-2xl font-semibold tracking-tight tabular-nums text-ink">{{ tile.value }}</p>
              <p class="mt-0.5 text-xs text-ink-muted">{{ tile.hint }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <!-- Left: details and actions -->
            <div class="space-y-6">
              <UCard :ui="cardUi">
                <template #header>
                  <h3 class="flex items-center gap-2 font-medium text-highlighted"><UIcon name="i-lucide-info" class="size-4 text-muted" />Details</h3>
                </template>
                <dl class="space-y-3 text-sm">
                  <div v-for="row in details" :key="row.label" class="flex items-center justify-between gap-4">
                    <dt class="flex shrink-0 items-center gap-2 text-muted"><UIcon :name="row.icon" class="size-4" />{{ row.label }}</dt>
                    <dd class="flex min-w-0 items-center gap-1 text-right text-default">
                      <span class="truncate" :class="row.mono && 'font-mono text-xs'">{{ row.value }}</span>
                      <UButton v-if="row.copy" icon="i-lucide-copy" variant="ghost" color="neutral" size="xs" :aria-label="`Copy ${row.label}`" @click="copy(row.copy, row.label)" />
                    </dd>
                  </div>
                </dl>
              </UCard>

              <UCard :ui="cardUi">
                <template #header>
                  <h3 class="flex items-center gap-2 font-medium text-highlighted"><UIcon name="i-lucide-gem" class="size-4 text-muted" />Plan</h3>
                </template>
                <div class="flex items-center gap-2">
                  <USelect v-model="selectedPlan" :items="planOptions" class="flex-1" />
                  <UButton label="Save" :loading="isUpdatingPlan" :disabled="selectedPlan === user.plan" @click="updatePlan" />
                </div>
                <p class="mt-2 text-xs text-muted">Sets the plan by hand, with no end date. Paid plans from Creem are kept in sync on their own.</p>
              </UCard>

              <UCard :ui="{ ...cardUi, root: 'bg-error/5 ring-error/30' }">
                <template #header>
                  <h3 class="flex items-center gap-2 font-medium text-error"><UIcon name="i-lucide-triangle-alert" class="size-4" />Danger zone</h3>
                </template>
                <div class="space-y-3">
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="text-sm font-medium text-highlighted">{{ user.status === 'banned' ? 'Unban user' : 'Ban user' }}</p>
                      <p class="text-xs text-muted">{{ user.status === 'banned' ? 'Restore access to this account.' : 'Signs them out and blocks sign-in.' }}</p>
                    </div>
                    <UButton
                      :color="user.status === 'banned' ? 'success' : 'warning'"
                      variant="soft"
                      :icon="user.status === 'banned' ? 'i-lucide-unlock' : 'i-lucide-ban'"
                      :label="user.status === 'banned' ? 'Unban' : 'Ban'"
                      :loading="isTogglingBan"
                      @click="toggleBan"
                    />
                  </div>
                  <USeparator />
                  <div class="flex items-center justify-between gap-4">
                    <div>
                      <p class="text-sm font-medium text-highlighted">Delete user</p>
                      <p class="text-xs text-muted">Removes the account and all of its content.</p>
                    </div>
                    <UButton color="error" variant="soft" icon="i-lucide-trash-2" label="Delete" :loading="isDeleting" @click="deleteUser" />
                  </div>
                </div>
              </UCard>
            </div>

            <!-- Right: what they made and bought -->
            <div class="lg:col-span-2">
              <UCard :ui="{ ...cardUi, body: 'p-0 sm:p-0' }">
                <template #header>
                  <UTabs v-model="activeTab" :items="tabs" variant="link" :content="false" class="-mb-3" />
                </template>

                <!-- Sites -->
                <ul v-if="activeTab === 'bio'" class="divide-y divide-line">
                  <li v-for="b in bioPages" :key="b.id">
                    <a :href="`/${b.username}`" target="_blank" rel="noopener" class="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-sand/40">
                      <img v-if="b.thumbnailUrl" :src="b.thumbnailUrl" alt="" class="h-12 w-9 shrink-0 rounded-lg object-cover ring-1 ring-line" loading="lazy">
                      <UAvatar v-else :src="b.avatarUrl || undefined" :text="initial(b.title || b.username)" size="md" />
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-medium text-highlighted group-hover:text-primary">{{ b.title || 'Untitled' }}</p>
                        <p class="truncate text-xs text-muted">perlink.to/{{ b.username }} · edited {{ ago(b.updatedAt) }}</p>
                      </div>
                      <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1" :class="siteChip(b).class">
                        <UIcon :name="siteChip(b).icon" class="size-3.5" />{{ siteChip(b).label }}
                      </span>
                      <span class="hidden w-24 items-center justify-end gap-1 text-sm tabular-nums text-muted sm:flex">
                        <UIcon name="i-lucide-eye" class="size-3.5" />{{ b.viewCount.toLocaleString() }}
                      </span>
                    </a>
                  </li>
                  <li v-if="bioPages.length === 0" class="flex flex-col items-center gap-2 px-4 py-12 text-center">
                    <UIcon name="i-lucide-layout-template" class="size-8 text-dimmed" />
                    <p class="text-sm text-muted">No site yet.</p>
                  </li>
                </ul>

                <!-- Purchases -->
                <ul v-else-if="activeTab === 'purchases'" class="divide-y divide-line">
                  <li v-for="p in purchases" :key="p.id" class="flex items-center gap-3 px-5 py-3.5">
                    <span class="flex size-10 shrink-0 items-center justify-center rounded-xl text-lg" :class="purchaseTile(p).class">
                      <UIcon v-if="purchaseTile(p).icon" :name="purchaseTile(p).icon!" class="size-5" />
                      <template v-else>{{ purchaseTile(p).emoji }}</template>
                    </span>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-medium text-highlighted">{{ purchaseTitle(p) }}</p>
                      <p class="truncate text-xs text-muted">{{ METHOD_LABEL[p.method] ?? p.method }} · {{ shortDate(p.at) }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-sm font-semibold tabular-nums" :class="p.status === 'paid' ? 'text-highlighted' : 'text-muted line-through'">
                        {{ p.amountUsd ? usd(p.amountUsd) : `${p.amount.toLocaleString('vi-VN')}₫` }}
                      </p>
                      <p class="text-xs capitalize" :class="p.status === 'paid' ? 'text-success' : 'text-muted'">{{ p.status }}</p>
                    </div>
                  </li>
                  <li v-if="purchases.length === 0" class="flex flex-col items-center gap-2 px-4 py-12 text-center">
                    <UIcon name="i-lucide-shopping-bag" class="size-8 text-dimmed" />
                    <p class="text-sm text-muted">Nothing bought yet.</p>
                  </li>
                </ul>

                <!-- Short links -->
                <ul v-else-if="activeTab === 'links'" class="divide-y divide-line">
                  <li v-for="l in links" :key="l.id" class="flex items-center gap-3 px-5 py-3.5">
                    <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-500/15 text-sky-500"><UIcon name="i-lucide-link" class="size-5" /></span>
                    <div class="min-w-0 flex-1">
                      <a :href="`https://s.perlink.to/${l.shortCode}`" target="_blank" rel="noopener" class="truncate text-sm font-medium text-highlighted hover:text-primary">s.perlink.to/{{ l.shortCode }}</a>
                      <p class="truncate text-xs text-muted" :title="l.targetUrl || ''">{{ l.targetUrl || '-' }}</p>
                    </div>
                    <span class="hidden text-xs text-dimmed sm:block">{{ shortDate(l.createdAt) }}</span>
                    <span class="flex w-20 items-center justify-end gap-1 text-sm tabular-nums text-muted">
                      <UIcon name="i-lucide-mouse-pointer-click" class="size-3.5" />{{ l.clickCount.toLocaleString() }}
                    </span>
                  </li>
                  <li v-if="links.length === 0" class="flex flex-col items-center gap-2 px-4 py-12 text-center">
                    <UIcon name="i-lucide-link-2-off" class="size-8 text-dimmed" />
                    <p class="text-sm text-muted">No short links.</p>
                  </li>
                </ul>

                <!-- QR codes -->
                <ul v-else class="divide-y divide-line">
                  <li v-for="q in qrCodes" :key="q.id" class="flex items-center gap-3 px-5 py-3.5">
                    <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-violet-500"><UIcon name="i-lucide-qr-code" class="size-5" /></span>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-medium text-highlighted">{{ q.name || q.shortCode }}</p>
                      <p class="truncate text-xs text-muted" :title="q.destinationUrl">{{ q.destinationUrl }}</p>
                    </div>
                    <UBadge :color="q.isActive ? 'success' : 'neutral'" variant="subtle" size="sm">{{ q.isActive ? 'Active' : 'Inactive' }}</UBadge>
                    <span class="flex w-20 items-center justify-end gap-1 text-sm tabular-nums text-muted">
                      <UIcon name="i-lucide-scan-line" class="size-3.5" />{{ q.scanCount.toLocaleString() }}
                    </span>
                  </li>
                  <li v-if="qrCodes.length === 0" class="flex flex-col items-center gap-2 px-4 py-12 text-center">
                    <UIcon name="i-lucide-qr-code" class="size-8 text-dimmed" />
                    <p class="text-sm text-muted">No QR codes.</p>
                  </li>
                </ul>
              </UCard>
            </div>
          </div>
        </template>

        <!-- Not Found -->
        <UEmpty
          v-else
          icon="i-lucide-user-x"
          title="User not found"
          description="The user you're looking for doesn't exist or was deleted."
          :actions="[{ label: 'Back to Users', to: '/superadmin/users' }]"
          class="py-16"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { TabsItem } from '@nuxt/ui'
import { PLAN_OPTIONS } from '~/composables/usePlans'

interface User {
  id: string
  name: string | null
  username: string | null
  email: string
  avatar: string | null
  status: 'active' | 'pending' | 'banned' | 'inactive'
  plan: string
  country: string | null
  language: string | null
  planExpiresAt: string | null
  providers: string[]
  createdAt: string
  updatedAt: string
}

interface UserStats {
  bioCount: number
  bioViews: number
  linksCount: number
  clicksCount: number
  qrCount: number
  scansCount: number
  spentUsd: number
}

interface Purchase { id: string; plan: string | null; period: string | null; method: string; status: string; amount: number; amountUsd: number | null; at: string; product: string | null }

interface BioPageRow { id: string; username: string; title: string | null; avatarUrl: string | null; thumbnailUrl: string | null; isPublished: boolean; removed: boolean; viewCount: number; updatedAt: string }
interface LinkRow { id: string; shortCode: string; title: string | null; targetUrl: string | null; clickCount: number; createdAt: string }
interface QRCodeRow { id: string; shortCode: string; name: string | null; destinationUrl: string; scanCount: number; isActive: boolean }

definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
});

const route = useRoute();
const userId = route.params.id as string;
const toast = useToast();
const confirm = useConfirm();

const cardUi = { header: 'px-5 py-4 sm:px-5', body: 'p-5 sm:p-5' };

// State
const isLoading = ref(true);
const isUpdatingPlan = ref(false);
const isTogglingBan = ref(false);
const isDeleting = ref(false);
const user = ref<User | null>(null);
const selectedPlan = ref<string>('free');
const activeTab = ref('bio');

const stats = ref<UserStats>({ bioCount: 0, bioViews: 0, linksCount: 0, clicksCount: 0, qrCount: 0, scansCount: 0, spentUsd: 0 });
const purchases = ref<Purchase[]>([]);
const bioPages = ref<BioPageRow[]>([]);
const links = ref<LinkRow[]>([]);
const qrCodes = ref<QRCodeRow[]>([]);

const planOptions = PLAN_OPTIONS;

const tabs = computed<TabsItem[]>(() => [
  { label: `Sites (${stats.value.bioCount})`, value: 'bio', icon: 'i-lucide-layout-template' },
  { label: `Purchases (${purchases.value.length})`, value: 'purchases', icon: 'i-lucide-shopping-bag' },
  { label: `Short Links (${stats.value.linksCount})`, value: 'links', icon: 'i-lucide-link' },
  { label: `QR Codes (${stats.value.qrCount})`, value: 'qr', icon: 'i-lucide-qr-code' },
]);

const usd = (n: number) => `$${n.toLocaleString('en-US', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`;
// First character, emoji included
const initial = (text: string | null) => (Array.from(text?.trim() || '')[0] || '?').toUpperCase();
const toDate = (value: string) => new Date(value.includes('T') ? value : `${value.replace(' ', 'T')}Z`);
const shortDate = (value: string) => toDate(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const ago = (value: string) => {
  const days = Math.floor((Date.now() - toDate(value).getTime()) / 86_400_000);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return shortDate(value);
};
const flag = (code: string) => String.fromCodePoint(...[...code.toUpperCase()].map(c => 0x1F1A5 + c.charCodeAt(0)));
const countryName = (code: string) => {
  try { return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) || code; } catch { return code; }
};

const PROVIDER: Record<string, { label: string; icon: string }> = {
  google: { label: 'Google', icon: 'i-simple-icons-google' },
  facebook: { label: 'Facebook', icon: 'i-simple-icons-facebook' },
  tiktok: { label: 'TikTok', icon: 'i-simple-icons-tiktok' },
};
const METHOD_LABEL: Record<string, string> = { creem: 'Card · Creem', lemon: 'Card · Lemon Squeezy', bank: 'Bank transfer', crypto: 'Crypto' };

const statusChip = computed(() => ({
  active: { label: 'Active', icon: 'i-lucide-circle-check', class: 'bg-success/10 text-success ring-success/25' },
  pending: { label: 'Pending', icon: 'i-lucide-clock', class: 'bg-warning/10 text-warning ring-warning/30' },
  banned: { label: 'Banned', icon: 'i-lucide-ban', class: 'bg-error/10 text-error ring-error/25' },
  inactive: { label: 'Inactive', icon: 'i-lucide-moon', class: 'bg-sand text-ink-muted ring-line' },
}[user.value?.status || 'inactive']));

const PLAN_STYLE: Record<string, { icon: string; class: string; gradient: string }> = {
  free: { icon: 'i-lucide-circle', class: 'bg-sand text-ink-soft ring-line', gradient: 'from-slate-500/30 via-slate-400/15 to-transparent' },
  starter: { icon: 'i-lucide-rocket', class: 'bg-sky-500/10 text-sky-500 ring-sky-500/25', gradient: 'from-sky-500/40 via-sky-400/15 to-transparent' },
  plus: { icon: 'i-lucide-sparkles', class: 'bg-primary/10 text-primary ring-primary/25', gradient: 'from-blue-600/45 via-blue-500/15 to-transparent' },
  max: { icon: 'i-lucide-crown', class: 'bg-violet-500/10 text-violet-500 ring-violet-500/25', gradient: 'from-violet-600/45 via-fuchsia-500/15 to-transparent' },
};
const planStyle = computed(() => PLAN_STYLE[user.value?.plan || 'free'] ?? PLAN_STYLE.free!);
const planChip = computed(() => ({ ...planStyle.value, label: `${(user.value?.plan || 'free').charAt(0).toUpperCase()}${(user.value?.plan || 'free').slice(1)} plan` }));
const heroGradient = computed(() => planStyle.value.gradient);

const primarySite = computed(() => bioPages.value.find(b => b.isPublished) ?? bioPages.value[0] ?? null);

const tiles = computed(() => [
  { label: 'Sites', value: String(stats.value.bioCount), hint: `${bioPages.value.filter(b => b.isPublished).length} published`, icon: 'i-lucide-layout-template', iconClass: 'bg-primary/15 text-primary' },
  { label: 'Site views', value: stats.value.bioViews.toLocaleString(), hint: 'All their sites', icon: 'i-lucide-eye', iconClass: 'bg-amber-500/15 text-amber-500' },
  { label: 'Links & QR', value: String(stats.value.linksCount + stats.value.qrCount), hint: `${(stats.value.clicksCount + stats.value.scansCount).toLocaleString()} clicks & scans`, icon: 'i-lucide-link', iconClass: 'bg-sky-500/15 text-sky-500' },
  { label: 'Spent', value: usd(stats.value.spentUsd), hint: `${purchases.value.filter(p => p.status === 'paid').length} purchases`, icon: 'i-lucide-badge-dollar-sign', iconClass: 'bg-success/15 text-success' },
]);

const details = computed(() => {
  const u = user.value!;
  return [
    { label: 'User ID', icon: 'i-lucide-fingerprint', value: u.id, mono: true, copy: u.id },
    { label: 'Email', icon: 'i-lucide-at-sign', value: u.email || '-', copy: u.email || undefined },
    { label: 'Username', icon: 'i-lucide-user', value: u.username || '-' },
    { label: 'Country', icon: 'i-lucide-map-pin', value: u.country ? `${flag(u.country)} ${countryName(u.country)}` : 'Saved on their next visit' },
    { label: 'Language', icon: 'i-lucide-languages', value: u.language === 'vi' ? 'Tiếng Việt' : u.language === 'en' ? 'English' : '-' },
    { label: 'Joined', icon: 'i-lucide-calendar-plus', value: formatAdminDate(u.createdAt) },
    { label: 'Last updated', icon: 'i-lucide-history', value: formatAdminDate(u.updatedAt) },
  ];
});

const siteChip = (b: BioPageRow) => b.removed
  ? { label: 'Removed', icon: 'i-lucide-octagon-x', class: 'bg-error/10 text-error ring-error/25' }
  : b.isPublished
    ? { label: 'Live', icon: 'i-lucide-globe', class: 'bg-success/10 text-success ring-success/25' }
    : { label: 'Draft', icon: 'i-lucide-pencil-line', class: 'bg-sand text-ink-muted ring-line' };

const PACK_EMOJI: Record<string, string> = { valentine: '💝', birthday: '🎂', proposal: '💍', wedding: '💒', christmas: '🎄', halloween: '🎃' };
const purchaseTile = (p: Purchase): { class: string; icon?: string; emoji?: string } => {
  if (p.product === 'wedding') return { class: 'bg-pink-500/15', emoji: '💍' };
  if (p.product?.startsWith('pack:')) return { class: 'bg-fuchsia-500/15', emoji: PACK_EMOJI[p.product.slice(5)] ?? '🎁' };
  const style = PLAN_STYLE[p.plan || 'free'] ?? PLAN_STYLE.free!;
  return { class: style.class.replace(/ring-\S+/g, ''), icon: style.icon };
};
const purchaseTitle = (p: Purchase) => {
  if (p.product === 'wedding') return 'Wedding pass';
  if (p.product?.startsWith('pack:')) { const id = p.product.slice(5); return `${id.charAt(0).toUpperCase()}${id.slice(1)} room pack`; }
  const plan = p.plan || 'plan';
  return `${plan.charAt(0).toUpperCase()}${plan.slice(1)} · ${p.period === 'annual' ? 'yearly' : 'monthly'}`;
};

// Methods
const copy = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({ title: `${label} copied`, color: 'success' });
  } catch {
    toast.add({ title: 'Failed to copy', color: 'error' });
  }
};

const fetchUser = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch(`/api/superadmin/users/${userId}`) as {
      user: User
      stats: UserStats
      bioPages: BioPageRow[]
      links: LinkRow[]
      qrCodes: QRCodeRow[]
      purchases: Purchase[]
    };
    user.value = response.user;
    selectedPlan.value = response.user.plan || 'free';
    stats.value = response.stats;
    bioPages.value = response.bioPages;
    links.value = response.links;
    qrCodes.value = response.qrCodes;
    purchases.value = response.purchases;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    user.value = null;
  } finally {
    isLoading.value = false;
  }
};

const updatePlan = async () => {
  if (!user.value || selectedPlan.value === user.value.plan) return;

  isUpdatingPlan.value = true;
  try {
    await $fetch(`/api/superadmin/users/${userId}/plan`, {
      method: 'POST' as any,
      body: { plan: selectedPlan.value },
    });
    toast.add({ title: `Plan updated to ${selectedPlan.value}`, color: 'success' });
    await fetchUser();
  } catch (error) {
    console.error('Failed to update plan:', error);
    toast.add({ title: 'Failed to update plan', color: 'error' });
  } finally {
    isUpdatingPlan.value = false;
  }
};

const toggleBan = async () => {
  if (!user.value) return;
  const banning = user.value.status !== 'banned';
  if (banning && !await confirm({
    title: `Ban ${user.value.name || user.value.email}?`,
    description: 'The user will be marked as banned.',
    confirmLabel: 'Ban user',
    color: 'warning',
  })) return;

  isTogglingBan.value = true;
  try {
    await $fetch(`/api/superadmin/users/${userId}/ban`, {
      method: 'POST' as any,
    });
    toast.add({ title: banning ? 'User banned' : 'User unbanned', color: 'success' });
    await fetchUser();
  } catch (error) {
    console.error('Failed to toggle ban:', error);
    toast.add({ title: 'Failed to update user', color: 'error' });
  } finally {
    isTogglingBan.value = false;
  }
};

const deleteUser = async () => {
  if (!user.value) return;
  if (!await confirm({
    title: `Delete ${user.value.name || user.value.email}?`,
    description: `This permanently deletes the account and all of its content (${stats.value.bioCount} bio pages, ${stats.value.linksCount} short links, ${stats.value.qrCount} QR codes). This cannot be undone.`,
    confirmLabel: 'Delete user',
  })) return;

  isDeleting.value = true;
  try {
    await $fetch(`/api/superadmin/users/${userId}`, {
      method: 'DELETE' as any,
    });
    toast.add({ title: 'User deleted', color: 'success' });
    await navigateTo('/superadmin/users');
  } catch (error) {
    console.error('Failed to delete user:', error);
    toast.add({ title: 'Failed to delete user', color: 'error' });
    isDeleting.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchUser();
});
</script>
