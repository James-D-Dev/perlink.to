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
      <div class="mx-auto w-full max-w-7xl">
        <!-- Loading -->
        <div v-if="isLoading && !user" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <USkeleton class="h-96" />
          <USkeleton class="h-96 lg:col-span-2" />
        </div>

        <div v-else-if="user" class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <!-- Left: profile -->
          <div class="space-y-6">
            <UCard :ui="cardUi">
              <div class="flex flex-col items-center text-center">
                <UAvatar
                  :src="user.avatar || undefined"
                  :alt="user.name || ''"
                  :text="(user.name?.charAt(0) || user.email?.charAt(0) || '?').toUpperCase()"
                  size="3xl"
                />
                <h2 class="mt-3 text-lg font-semibold text-highlighted">{{ user.name || 'No name' }}</h2>
                <p class="text-sm text-muted">{{ user.email }}</p>
                <div class="mt-3 flex items-center gap-2">
                  <UBadge :color="statusColor" variant="subtle" size="sm" class="capitalize">{{ user.status }}</UBadge>
                  <UBadge :color="getPlanColor(user.plan)" variant="subtle" size="sm" class="capitalize">{{ user.plan }}</UBadge>
                </div>
              </div>

              <USeparator class="my-4" />

              <dl class="space-y-3 text-sm">
                <div class="flex justify-between gap-4">
                  <dt class="shrink-0 text-muted">User ID</dt>
                  <dd class="flex items-center gap-1 min-w-0">
                    <span class="truncate font-mono text-xs text-default">{{ user.id }}</span>
                    <UButton icon="i-lucide-copy" variant="ghost" color="neutral" size="xs" @click="copy(user.id, 'User ID')" />
                  </dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="shrink-0 text-muted">Username</dt>
                  <dd class="text-default">{{ user.username || '-' }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="shrink-0 text-muted">Country</dt>
                  <dd class="text-default">{{ user.country || '-' }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="shrink-0 text-muted">Joined</dt>
                  <dd class="text-default">{{ formatAdminDate(user.createdAt) }}</dd>
                </div>
                <div class="flex justify-between gap-4">
                  <dt class="shrink-0 text-muted">Last updated</dt>
                  <dd class="text-default">{{ formatAdminDate(user.updatedAt) }}</dd>
                </div>
              </dl>
            </UCard>

            <!-- Plan -->
            <UCard :ui="cardUi">
              <template #header>
                <h3 class="font-medium text-highlighted">Plan</h3>
              </template>
              <div class="flex items-center gap-2">
                <USelect v-model="selectedPlan" :items="planOptions" class="flex-1" />
                <UButton
                  label="Save"
                  :loading="isUpdatingPlan"
                  :disabled="selectedPlan === user.plan"
                  @click="updatePlan"
                />
              </div>
            </UCard>

            <!-- Danger zone -->
            <UCard :ui="{ ...cardUi, root: 'bg-error/5 ring-error/30' }">
              <template #header>
                <h3 class="font-medium text-error">Danger zone</h3>
              </template>
              <div class="space-y-3">
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <p class="text-sm font-medium text-highlighted">{{ user.status === 'banned' ? 'Unban user' : 'Ban user' }}</p>
                    <p class="text-xs text-muted">{{ user.status === 'banned' ? 'Restore access to this account.' : 'Mark this account as banned.' }}</p>
                  </div>
                  <UButton
                    :color="user.status === 'banned' ? 'success' : 'warning'"
                    variant="soft"
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
                  <UButton color="error" variant="soft" label="Delete" :loading="isDeleting" @click="deleteUser" />
                </div>
              </div>
            </UCard>
          </div>

          <!-- Right: activity -->
          <div class="space-y-6 lg:col-span-2">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SuperadminStatCard label="Bio Pages" :value="stats.bioCount" icon="i-lucide-id-card" :hint="`${stats.bioViews.toLocaleString()} views`" />
              <SuperadminStatCard label="Short Links" :value="stats.linksCount" icon="i-lucide-link" :hint="`${stats.clicksCount.toLocaleString()} clicks`" />
              <SuperadminStatCard label="QR Codes" :value="stats.qrCount" icon="i-lucide-qr-code" :hint="`${stats.scansCount.toLocaleString()} scans`" />
            </div>

            <UCard :ui="{ ...cardUi, body: 'p-0 sm:p-0' }">
              <template #header>
                <UTabs v-model="activeTab" :items="tabs" variant="link" :content="false" class="-mb-3" />
              </template>

              <!-- Bio pages -->
              <ul v-if="activeTab === 'bio'" class="divide-y divide-default">
                <li v-for="b in bioPages" :key="b.id" class="flex items-center gap-3 px-4 py-3">
                  <UAvatar :src="b.avatarUrl || undefined" :text="(b.title || b.username).charAt(0).toUpperCase()" size="sm" />
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-highlighted">{{ b.title || 'Untitled' }}</p>
                    <a :href="`/${b.username}`" target="_blank" class="truncate text-xs text-primary hover:underline">perlink.to/{{ b.username }}</a>
                  </div>
                  <UBadge :color="b.isPublished ? 'success' : 'neutral'" variant="subtle" size="sm">{{ b.isPublished ? 'Published' : 'Draft' }}</UBadge>
                  <span class="w-20 text-right text-sm tabular-nums text-muted">{{ b.viewCount.toLocaleString() }} views</span>
                </li>
                <li v-if="bioPages.length === 0" class="px-4 py-12 text-center text-sm text-muted">No bio pages.</li>
              </ul>

              <!-- Short links -->
              <ul v-else-if="activeTab === 'links'" class="divide-y divide-default">
                <li v-for="l in links" :key="l.id" class="flex items-center gap-3 px-4 py-3">
                  <div class="min-w-0 flex-1">
                    <a :href="`https://s.perlink.to/${l.shortCode}`" target="_blank" class="truncate text-sm font-medium text-highlighted hover:text-primary">s.perlink.to/{{ l.shortCode }}</a>
                    <p class="truncate text-xs text-muted" :title="l.targetUrl || ''">{{ l.targetUrl || '-' }}</p>
                  </div>
                  <span class="hidden text-xs text-dimmed sm:block">{{ formatAdminDate(l.createdAt) }}</span>
                  <span class="w-20 text-right text-sm tabular-nums text-muted">{{ l.clickCount.toLocaleString() }} clicks</span>
                </li>
                <li v-if="links.length === 0" class="px-4 py-12 text-center text-sm text-muted">No short links.</li>
              </ul>

              <!-- QR codes -->
              <ul v-else class="divide-y divide-default">
                <li v-for="q in qrCodes" :key="q.id" class="flex items-center gap-3 px-4 py-3">
                  <div class="min-w-0 flex-1">
                    <p class="truncate text-sm font-medium text-highlighted">{{ q.name || q.shortCode }}</p>
                    <p class="truncate text-xs text-muted" :title="q.destinationUrl">{{ q.destinationUrl }}</p>
                  </div>
                  <UBadge :color="q.isActive ? 'success' : 'neutral'" variant="subtle" size="sm">{{ q.isActive ? 'Active' : 'Inactive' }}</UBadge>
                  <span class="w-20 text-right text-sm tabular-nums text-muted">{{ q.scanCount.toLocaleString() }} scans</span>
                </li>
                <li v-if="qrCodes.length === 0" class="px-4 py-12 text-center text-sm text-muted">No QR codes.</li>
              </ul>
            </UCard>
          </div>
        </div>

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
import { PLAN_OPTIONS, usePlans } from '~/composables/usePlans'

interface User {
  id: string
  name: string | null
  username: string | null
  email: string
  avatar: string | null
  status: 'active' | 'pending' | 'banned' | 'inactive'
  plan: string
  country: string | null
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
}

interface BioPageRow { id: string; username: string; title: string | null; avatarUrl: string | null; isPublished: boolean; viewCount: number }
interface LinkRow { id: string; shortCode: string; title: string | null; targetUrl: string | null; clickCount: number; createdAt: string }
interface QRCodeRow { id: string; shortCode: string; name: string | null; destinationUrl: string; scanCount: number; isActive: boolean }

definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
  colorMode: 'dark',
});

const route = useRoute();
const userId = route.params.id as string;
const toast = useToast();
const confirm = useConfirm();
const { getPlanColor } = usePlans();

const cardUi = { root: 'bg-elevated/40 ring-default', header: 'px-4 py-3 sm:px-4', body: 'p-4 sm:p-4' };

// State
const isLoading = ref(true);
const isUpdatingPlan = ref(false);
const isTogglingBan = ref(false);
const isDeleting = ref(false);
const user = ref<User | null>(null);
const selectedPlan = ref<string>('free');
const activeTab = ref('bio');

const stats = ref<UserStats>({ bioCount: 0, bioViews: 0, linksCount: 0, clicksCount: 0, qrCount: 0, scansCount: 0 });
const bioPages = ref<BioPageRow[]>([]);
const links = ref<LinkRow[]>([]);
const qrCodes = ref<QRCodeRow[]>([]);

const planOptions = PLAN_OPTIONS;

const tabs = computed<TabsItem[]>(() => [
  { label: `Bio Pages (${stats.value.bioCount})`, value: 'bio', icon: 'i-lucide-id-card' },
  { label: `Short Links (${stats.value.linksCount})`, value: 'links', icon: 'i-lucide-link' },
  { label: `QR Codes (${stats.value.qrCount})`, value: 'qr', icon: 'i-lucide-qr-code' },
]);

const statusColor = computed(() => ({
  active: 'success',
  pending: 'warning',
  banned: 'error',
  inactive: 'neutral',
} as const)[user.value?.status || 'inactive'] || 'neutral');

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
    };
    user.value = response.user;
    selectedPlan.value = response.user.plan || 'free';
    stats.value = response.stats;
    bioPages.value = response.bioPages;
    links.value = response.links;
    qrCodes.value = response.qrCodes;
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
