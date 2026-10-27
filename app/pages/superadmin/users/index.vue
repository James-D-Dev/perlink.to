<template>
  <UDashboardPanel id="users-list">
    <template #header>
      <UDashboardNavbar title="Users">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            to="/superadmin/users/create"
            icon="i-lucide-user-plus"
            label="Create User"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-6xl space-y-6 py-2 sm:py-4">

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SuperadminStatCard label="Total Users" :value="stats.total" icon="i-lucide-users" :hint="`+${stats.newThisWeek} in the last 7 days`" :loading="isLoading && !loaded" />
        <SuperadminStatCard label="Active" :value="stats.active" icon="i-lucide-user-check" :loading="isLoading && !loaded" />
        <SuperadminStatCard label="Paid Plans" :value="stats.paid" icon="i-lucide-crown" :hint="paidPercent" :loading="isLoading && !loaded" />
        <SuperadminStatCard label="Banned" :value="stats.banned" icon="i-lucide-ban" :loading="isLoading && !loaded" />
      </div>

      <!-- Users Table -->
      <UCard :ui="superadminCardUi">
        <template #header>
          <div class="flex flex-wrap items-center gap-2">
            <UInput
              v-model="searchQuery"
              placeholder="Search name, email, username..."
              icon="i-lucide-search"
              class="w-full sm:w-72"
            />
            <USelect v-model="statusFilter" :items="statusOptions" placeholder="Status" class="w-36" />
            <USelect v-model="planFilter" :items="planOptions" placeholder="Plan" class="w-36" />
            <USelect v-model="sortBy" :items="sortOptions" class="w-44" />
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-refresh-cw"
              :loading="isLoading"
              class="ml-auto"
              @click="refreshUsers"
            />
          </div>
        </template>

        <UTable
          :data="paginatedUsers"
          :columns="columns"
          :loading="isLoading"
          :ui="superadminTableUi"
        >
          <template #empty>
            {{ users.length === 0 ? 'No users yet.' : 'No users match your filters.' }}
          </template>
        </UTable>

        <template #footer>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm text-muted">
              Showing {{ pageStart }}–{{ pageEnd }} of {{ filteredUsers.length }}
            </p>
            <UPagination
              v-model:page="currentPage"
              :total="filteredUsers.length"
              :items-per-page="itemsPerPage"
              :sibling-count="1"
              size="sm"
            />
          </div>
        </template>
      </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn, SelectItem, DropdownMenuItem } from '@nuxt/ui'
import { PLAN_OPTIONS, PLAN_OPTIONS_WITH_ALL, usePlans } from '~/composables/usePlans'

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UIcon = resolveComponent('UIcon')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const NuxtLink = resolveComponent('NuxtLink')

interface User {
  id: string
  name: string | null
  username: string | null
  email: string
  avatar: string | null
  status: 'active' | 'pending' | 'banned' | 'inactive'
  plan: string
  createdAt: string
  bioCount: number
  linkCount: number
  qrCount: number
}

interface Stats {
  total: number
  active: number
  banned: number
  paid: number
  newThisWeek: number
}

definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
  colorMode: 'light',
});

const toast = useToast();
const confirm = useConfirm();
const { getPlanColor } = usePlans();

// State
const isLoading = ref(false);
const loaded = ref(false);
const searchQuery = ref('');
const statusFilter = ref<string | null>(null);
const planFilter = ref<string | null>(null);
const sortBy = ref('created');
const currentPage = ref(1);
const itemsPerPage = ref(15);

const users = ref<User[]>([]);
const stats = ref<Stats>({ total: 0, active: 0, banned: 0, paid: 0, newThisWeek: 0 });

// Options
const statusOptions = ref<SelectItem[]>([
  { label: 'All statuses', value: null as unknown as string },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Banned', value: 'banned' },
]);

const planOptions = PLAN_OPTIONS_WITH_ALL.map(o =>
  (o as { value: unknown }).value === null ? { ...(o as object), label: 'All plans' } : o
) as SelectItem[];

const sortOptions = ref<SelectItem[]>([
  { label: 'Newest', value: 'created' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Most content', value: 'content' },
  { label: 'Name (A-Z)', value: 'name' },
]);

const statusColors: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
  active: 'success',
  pending: 'warning',
  banned: 'error',
  inactive: 'neutral',
};

const countChip = (icon: string, count: number, title: string) =>
  h('span', { class: ['inline-flex items-center gap-1 tabular-nums', count ? 'text-default' : 'text-dimmed'], title }, [
    h(UIcon, { name: icon, class: 'size-3.5 text-dimmed' }),
    String(count)
  ])

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'email',
    header: 'User',
    cell: ({ row }) => {
      const user = row.original
      return h(NuxtLink, { to: `/superadmin/users/${user.id}`, class: 'flex items-center gap-3 min-w-0 group' }, () => [
        h(UAvatar, {
          src: user.avatar || undefined,
          alt: user.name || '',
          text: (user.name?.charAt(0) || user.email?.charAt(0) || '?').toUpperCase(),
          size: 'sm'
        }),
        h('div', { class: 'min-w-0' }, [
          h('p', { class: 'truncate font-medium text-highlighted group-hover:text-primary' }, user.name || 'No name'),
          h('p', { class: 'truncate text-xs text-muted' }, user.email)
        ])
      ])
    }
  },
  {
    accessorKey: 'plan',
    header: 'Plan',
    cell: ({ row }) => h(UBadge, { variant: 'subtle', color: getPlanColor(row.original.plan), size: 'sm', class: 'capitalize' }, () => row.original.plan)
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status
      return h('span', { class: 'inline-flex items-center gap-1.5 capitalize' }, [
        h('span', { class: ['size-1.5 rounded-full', {
          success: 'bg-success', warning: 'bg-warning', error: 'bg-error', neutral: 'bg-dimmed'
        }[statusColors[status] || 'neutral']] }),
        status
      ])
    }
  },
  {
    id: 'content',
    header: 'Content',
    cell: ({ row }) => {
      const user = row.original
      return h('div', { class: 'flex items-center gap-3' }, [
        countChip('i-lucide-id-card', user.bioCount, 'Bio pages'),
        countChip('i-lucide-link', user.linkCount, 'Short links'),
        countChip('i-lucide-qr-code', user.qrCount, 'QR codes'),
      ])
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => h('span', { class: 'text-muted' }, formatAdminDate(row.original.createdAt))
  },
  {
    id: 'actions',
    meta: { class: { td: 'text-right' } },
    cell: ({ row }) => {
      const user = row.original
      return h(UDropdownMenu, { items: getActionItems(user), content: { align: 'end' } }, () =>
        h(UButton, { variant: 'ghost', color: 'neutral', icon: 'i-lucide-ellipsis-vertical', size: 'sm' })
      )
    }
  }
];

// Computed
const filteredUsers = computed(() => {
  let result = users.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((u) =>
      u.name?.toLowerCase().includes(query) ||
      u.username?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value) {
    result = result.filter((u) => u.status === statusFilter.value);
  }

  if (planFilter.value) {
    result = result.filter((u) => u.plan === planFilter.value);
  }

  const content = (u: User) => u.bioCount + u.linkCount + u.qrCount;
  const sorters: Record<string, (a: User, b: User) => number> = {
    created: (a, b) => toTime(b.createdAt) - toTime(a.createdAt),
    oldest: (a, b) => toTime(a.createdAt) - toTime(b.createdAt),
    content: (a, b) => content(b) - content(a),
    name: (a, b) => (a.name || a.email).localeCompare(b.name || b.email),
  };

  return [...result].sort(sorters[sortBy.value] ?? sorters.created);
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredUsers.value.slice(start, start + itemsPerPage.value);
});

const pageStart = computed(() =>
  filteredUsers.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
);
const pageEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredUsers.value.length)
);

const paidPercent = computed(() =>
  stats.value.total ? `${Math.round((stats.value.paid / stats.value.total) * 100)}% of users` : undefined
);

// Reset to first page when filters change
watch([searchQuery, statusFilter, planFilter, sortBy], () => {
  currentPage.value = 1;
});

// Methods
const getActionItems = (user: User): DropdownMenuItem[][] => [
  [
    {
      label: 'View details',
      icon: 'i-lucide-eye',
      onSelect: () => navigateTo(`/superadmin/users/${user.id}`),
    },
    {
      label: 'Change plan',
      icon: 'i-lucide-crown',
      children: PLAN_OPTIONS.map((o) => {
        const option = o as { label: string; value: string };
        return {
          label: option.label,
          type: 'checkbox' as const,
          checked: user.plan === option.value,
          onSelect: () => updatePlan(user, option.value),
        };
      }),
    },
    {
      label: 'Copy email',
      icon: 'i-lucide-copy',
      onSelect: () => copyEmail(user),
    },
  ],
  [
    {
      label: user.status === 'banned' ? 'Unban user' : 'Ban user',
      icon: user.status === 'banned' ? 'i-lucide-user-check' : 'i-lucide-ban',
      color: user.status === 'banned' ? 'success' : 'warning',
      onSelect: () => toggleBanUser(user),
    },
    {
      label: 'Delete user',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect: () => deleteUser(user),
    },
  ],
];

const copyEmail = async (user: User) => {
  try {
    await navigator.clipboard.writeText(user.email);
    toast.add({ title: 'Email copied', color: 'success' });
  } catch {
    toast.add({ title: 'Failed to copy email', color: 'error' });
  }
};

const updatePlan = async (user: User, plan: string) => {
  if (user.plan === plan) return;
  try {
    await $fetch(`/api/superadmin/users/${user.id}/plan`, {
      method: 'POST' as any,
      body: { plan },
    });
    toast.add({ title: `${user.name || user.email} moved to ${plan}`, color: 'success' });
    await refreshUsers();
  } catch (error) {
    console.error('Failed to update plan:', error);
    toast.add({ title: 'Failed to update plan', color: 'error' });
  }
};

const toggleBanUser = async (user: User) => {
  const banning = user.status !== 'banned';
  if (banning && !await confirm({
    title: `Ban ${user.name || user.email}?`,
    description: 'The user will be marked as banned.',
    confirmLabel: 'Ban user',
    color: 'warning',
  })) return;

  try {
    await $fetch(`/api/superadmin/users/${user.id}/ban`, {
      method: 'POST' as any,
    });
    toast.add({ title: banning ? 'User banned' : 'User unbanned', color: 'success' });
    await refreshUsers();
  } catch (error) {
    console.error('Failed to toggle ban:', error);
    toast.add({ title: 'Failed to update user', color: 'error' });
  }
};

const deleteUser = async (user: User) => {
  if (!await confirm({
    title: `Delete ${user.name || user.email}?`,
    description: `This permanently deletes the account and all of its content (${user.bioCount} bio pages, ${user.linkCount} short links, ${user.qrCount} QR codes). This cannot be undone.`,
    confirmLabel: 'Delete user',
  })) return;

  try {
    await $fetch(`/api/superadmin/users/${user.id}`, {
      method: 'DELETE' as any,
    });
    toast.add({ title: 'User deleted', color: 'success' });
    await refreshUsers();
  } catch (error) {
    console.error('Failed to delete user:', error);
    toast.add({ title: 'Failed to delete user', color: 'error' });
  }
};

const refreshUsers = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch('/api/superadmin/users') as {
      users: User[]
      stats: Stats
    };
    users.value = response.users || [];
    stats.value = response.stats || { total: 0, active: 0, banned: 0, paid: 0, newThisWeek: 0 };
    loaded.value = true;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    toast.add({ title: 'Failed to load users', color: 'error' });
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  refreshUsers();
});
</script>
