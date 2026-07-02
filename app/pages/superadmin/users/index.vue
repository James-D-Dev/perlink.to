<template>
  <UDashboardPanel id="users-list">
    <template #header>
      <UDashboardNavbar title="Users Management">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <UButton
            to="/superadmin/users/create"
            color="primary"
            icon="i-lucide-plus"
            label="Add User"
          />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="max-w-7xl mx-auto w-full px-2 md:px-4 py-4 space-y-6">

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <UCard class="bg-white">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-blue-50 rounded-lg">
              <UIcon name="i-lucide-users" class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Total Users</p>
              <p class="text-2xl font-semibold">{{ stats.total }}</p>
            </div>
          </div>
        </UCard>
        <UCard class="bg-white">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-green-50 rounded-lg">
              <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Active</p>
              <p class="text-2xl font-semibold">{{ stats.active }}</p>
            </div>
          </div>
        </UCard>
        <UCard class="bg-white">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-amber-50 rounded-lg">
              <UIcon name="i-lucide-clock" class="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Pending</p>
              <p class="text-2xl font-semibold">{{ stats.pending }}</p>
            </div>
          </div>
        </UCard>
        <UCard class="bg-white">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-red-50 rounded-lg">
              <UIcon name="i-lucide-ban" class="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p class="text-sm text-gray-500">Banned</p>
              <p class="text-2xl font-semibold">{{ stats.banned }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-4 mb-6">
        <UInput
          v-model="searchQuery"
          placeholder="Search users..."
          icon="i-lucide-search"
          class="w-72"
        />
        <USelect
          v-model="statusFilter"
          :items="statusOptions"
          placeholder="Filter by status"
          class="w-40"
        />
        <USelect
          v-model="planFilter"
          :items="planOptions"
          placeholder="Filter by plan"
          class="w-40"
        />
        <UButton
          variant="ghost"
          color="neutral"
          icon="i-lucide-refresh-cw"
          @click="refreshUsers"
        />
      </div>

      <!-- Debug -->
      <div v-if="users.length === 0 && !isLoading" class="p-4 bg-yellow-50 text-yellow-700 rounded-lg mb-4">
        No users loaded. Check API response.
      </div>
      <div v-else class="p-2 bg-green-50 text-green-700 rounded-lg mb-4 text-sm">
        Loaded {{ users.length }} users, filtered: {{ filteredUsers.length }}
      </div>

      <!-- Users Table -->
      <UCard class="bg-white overflow-hidden">
        <UTable
          :data="users"
          :columns="columns"
          :loading="isLoading"
          sort-mode="manual"
          @sort="handleSort"
        />

        <!-- Pagination -->
        <div class="flex items-center justify-between px-4 py-4 border-t border-gray-200">
          <p class="text-sm text-gray-500">
            Showing {{ pagination.start }} to {{ pagination.end }} of {{ pagination.total }} users
          </p>
          <UPagination
            v-model:page="currentPage"
            :total="pagination.total"
            :items-per-page="itemsPerPage"
            :sibling-count="1"
          />
        </div>
      </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn, SelectItem } from '@nuxt/ui'
import type { DropdownMenuItem } from '@nuxt/ui'
import { PLAN_OPTIONS_WITH_ALL, type PlanId, usePlans } from '~/composables/usePlans'

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

interface User {
  id: string
  name: string | null
  email: string
  avatar: string | null
  status: 'active' | 'pending' | 'banned' | 'inactive'
  plan: 'free' | 'starter' | 'plus' | 'pro' | null
  createdAt: string
}

interface Stats {
  total: number
  active: number
  pending: number
  banned: number
}

interface Pagination {
  start: number
  end: number
  total: number
}

definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
});

// State
const isLoading = ref(false);
const searchQuery = ref('');
const statusFilter = ref<string | null>(null);
const planFilter = ref<string | null>(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);

const stats = ref<Stats>({
  total: 0,
  active: 0,
  pending: 0,
  banned: 0,
});

const users = ref<User[]>([]);
const pagination = ref<Pagination>({
  start: 1,
  end: 10,
  total: 0,
});

// Options
const statusOptions = ref<SelectItem[]>([
  { label: 'All', value: null as unknown as string },
  { label: 'Active', value: 'active' },
  { label: 'Pending', value: 'pending' },
  { label: 'Banned', value: 'banned' },
]);

const planOptions = PLAN_OPTIONS_WITH_ALL;

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'email',
    header: 'User',
    cell: ({ row }) => {
      const user = row.original as User
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: user.avatar || undefined,
          alt: user.name || '',
          text: (user.name?.charAt(0) || user.email?.charAt(0) || '?').toUpperCase(),
          size: 'sm'
        }),
        h('div', {}, [
          h('p', { class: 'font-medium text-gray-900' }, user.name || 'No name'),
          h('p', { class: 'text-sm text-gray-500' }, user.email)
        ])
      ])
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const user = row.original as User
      const color = {
        active: 'success',
        pending: 'warning',
        banned: 'error',
        inactive: 'neutral'
      }[user.status] || 'neutral'
      return h(UBadge, { variant: 'soft', color, size: 'sm' }, () => user.status)
    }
  },
  {
    accessorKey: 'plan',
    header: 'Plan',
    cell: ({ row }) => {
      const user = row.original as User
      const color = {
        free: 'neutral',
        starter: 'primary',
        plus: 'secondary',
        pro: 'warning'
      }[user.plan || 'free'] || 'neutral'
      return h(UBadge, { variant: 'soft', color, size: 'sm' }, () => user.plan || 'Free')
    }
  },
  {
    accessorKey: 'createdAt',
    header: 'Joined',
    cell: ({ row }) => {
      const user = row.original as User
      return formatDate(user.createdAt)
    }
  },
  {
    accessorKey: 'id',
    header: '',
    meta: { class: { td: 'text-right' } },
    cell: ({ row }) => {
      const user = row.original as User
      return h(UDropdownMenu, { items: getActionItems(user) }, () =>
        h(UButton, { variant: 'ghost', color: 'neutral', icon: 'i-lucide-more-vertical', size: 'sm' })
      )
    }
  }
];

// Computed
const filteredUsers = computed(() => {
  let result = users.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((u: User) => 
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query)
    );
  }
  
  if (statusFilter.value) {
    result = result.filter((u: User) => u.status === statusFilter.value);
  }

  if (planFilter.value) {
    result = result.filter((u: User) => u.plan === planFilter.value);
  }
  
  return result;
});

// Methods
const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'neutral' => {
  const colors: Record<string, 'success' | 'warning' | 'error' | 'neutral'> = {
    active: 'success',
    pending: 'warning',
    banned: 'error',
    inactive: 'neutral',
  };
  return colors[status] || 'neutral';
};

const formatDate = (date: string | Date): string => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const getActionItems = (user: User): DropdownMenuItem[][] => [
  [
    {
      label: 'View Details',
      icon: 'i-lucide-eye',
      onSelect: () => navigateTo(`/superadmin/users/${user.id}`),
    },
    {
      label: 'Edit User',
      icon: 'i-lucide-pencil',
      onSelect: () => navigateTo(`/superadmin/users/${user.id}/edit`),
    },
  ],
  [
    {
      label: user.status === 'banned' ? 'Unban User' : 'Ban User',
      icon: user.status === 'banned' ? 'i-lucide-check-circle' : 'i-lucide-ban',
      color: user.status === 'banned' ? 'success' : 'error',
      onSelect: () => toggleBanUser(user),
    },
    {
      label: 'Delete User',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect: () => deleteUser(user),
    },
  ],
];

const toggleBanUser = async (user: User) => {
  try {
    await $fetch(`/api/superadmin/users/${user.id}/ban`, {
      method: 'POST' as any,
    });
    await refreshUsers();
  } catch (error) {
    console.error('Failed to toggle ban:', error);
  }
};

const deleteUser = async (user: User) => {
  if (!confirm(`Are you sure you want to delete ${user.name || user.email}?`)) return;
  
  try {
    await $fetch(`/api/superadmin/users/${user.id}`, {
      method: 'DELETE' as any,
    });
    await refreshUsers();
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
};

const handleSort = (sort: { id: string; desc: boolean }) => {
  console.log('Sort:', sort);
  // TODO: Implement server-side sorting
};

const refreshUsers = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch('/api/superadmin/users') as {
      users: User[]
      stats: Stats
      pagination: Pagination
    };
    console.log('API Response:', response);
    console.log('Users:', response.users);
    users.value = response.users || [];
    stats.value = response.stats || { total: 0, active: 0, pending: 0, banned: 0 };
    pagination.value = response.pagination || { start: 1, end: 0, total: 0 };
    console.log('users.value set to:', users.value);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    users.value = [];
    stats.value = { total: 0, active: 0, pending: 0, banned: 0 };
    pagination.value = { start: 1, end: 0, total: 0 };
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  refreshUsers();
});
</script>
