<template>
  <UDashboardPanel id="superadmin-links">
    <template #header>
      <UDashboardNavbar title="Short Links">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>

    <template #body>
      <div class="mx-auto w-full max-w-6xl space-y-6 py-2 sm:py-4">

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <SuperadminStatCard
          v-for="card in statCards"
          :key="card.label"
          :label="card.label"
          :value="card.value"
          :icon="card.icon"
          :loading="isLoading && !loaded"
        />
      </div>

      <!-- Table -->
      <UCard :ui="superadminCardUi">
        <template #header>
          <div class="flex flex-wrap items-center gap-2">
            <UInput
              v-model="searchQuery"
              placeholder="Search code, URL, owner..."
              icon="i-lucide-search"
              class="w-full sm:w-72"
            />
            <USelect v-model="protectionFilter" :items="protectionOptions" placeholder="Protection" class="w-44" />
            <USelect v-model="sortBy" :items="sortOptions" class="w-44" />
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-refresh-cw"
              :loading="isLoading"
              class="ml-auto"
              @click="refreshLinks"
            />
          </div>
        </template>

        <UTable
          :data="paginatedLinks"
          :columns="columns"
          :loading="isLoading"
          :ui="superadminTableUi"
        >
          <template #empty>
            {{ links.length === 0 ? 'No short links yet.' : 'No short links match your filters.' }}
          </template>
        </UTable>

        <template #footer>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm text-muted">
              Showing {{ pageStart }}–{{ pageEnd }} of {{ filteredLinks.length }}
            </p>
            <UPagination
              v-model:page="currentPage"
              :total="filteredLinks.length"
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

const UIcon = resolveComponent('UIcon')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

const SHORT_DOMAIN = 's.perlink.to'

interface LinkRow {
  id: string
  userId: string
  shortCode: string
  targetUrl: string | null
  title: string | null
  hasPassword: boolean
  clickCount: number
  createdAt: string
  updatedAt: string
  owner: {
    email: string | null
    name: string | null
  }
}

interface Stats {
  total: number
  totalClicks: number
  protected: number
  owners: number
}

definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
  colorMode: 'light',
});

const toast = useToast();
const confirm = useConfirm();

// State
const isLoading = ref(false);
const loaded = ref(false);
const searchQuery = ref('');
const protectionFilter = ref<string | null>(null);
const sortBy = ref('created');
const currentPage = ref(1);
const itemsPerPage = ref(15);

const links = ref<LinkRow[]>([]);
const stats = ref<Stats>({ total: 0, totalClicks: 0, protected: 0, owners: 0 });

// Options
const protectionOptions = ref<SelectItem[]>([
  { label: 'All', value: null as unknown as string },
  { label: 'Password protected', value: 'protected' },
  { label: 'Public', value: 'public' },
]);

const sortOptions = ref<SelectItem[]>([
  { label: 'Newest', value: 'created' },
  { label: 'Recently updated', value: 'updated' },
  { label: 'Most clicks', value: 'clicks' },
  { label: 'Code (A-Z)', value: 'code' },
]);

const statCards = computed(() => [
  { label: 'Total Short Links', value: stats.value.total, icon: 'i-lucide-link' },
  { label: 'Total Clicks', value: stats.value.totalClicks, icon: 'i-lucide-mouse-pointer-click' },
  { label: 'Password Protected', value: stats.value.protected, icon: 'i-lucide-lock' },
  { label: 'Owners', value: stats.value.owners, icon: 'i-lucide-users' },
]);

const columns: TableColumn<LinkRow>[] = [
  {
    accessorKey: 'shortCode',
    header: 'Short Link',
    cell: ({ row }) => {
      const link = row.original
      return h('div', { class: 'flex items-center gap-2' }, [
        h('a', {
          href: shortUrl(link),
          target: '_blank',
          class: 'font-medium text-primary hover:underline'
        }, `${SHORT_DOMAIN}/${link.shortCode}`),
        link.hasPassword
          ? h(UIcon, { name: 'i-lucide-lock', class: 'w-3.5 h-3.5 text-amber-500' })
          : null
      ])
    }
  },
  {
    accessorKey: 'targetUrl',
    header: 'Destination',
    cell: ({ row }) => {
      const link = row.original
      if (!link.targetUrl) return h('span', { class: 'text-sm text-dimmed' }, '-')
      return h('div', { class: 'max-w-xs' }, [
        link.title ? h('p', { class: 'text-sm text-highlighted truncate' }, link.title) : null,
        h('a', {
          href: link.targetUrl,
          target: '_blank',
          rel: 'noopener noreferrer',
          title: link.targetUrl,
          class: 'block text-xs text-muted truncate hover:underline'
        }, link.targetUrl)
      ])
    }
  },
  {
    id: 'owner',
    header: 'Owner',
    cell: ({ row }) => {
      const link = row.original
      if (!link.owner.email) return h('span', { class: 'text-sm text-dimmed' }, 'Unknown')
      return h('button', {
        class: 'text-left hover:underline',
        onClick: () => navigateTo(`/superadmin/users/${link.userId}`)
      }, [
        h('p', { class: 'text-sm text-highlighted' }, link.owner.name || 'No name'),
        h('p', { class: 'text-xs text-muted' }, link.owner.email)
      ])
    }
  },
  {
    accessorKey: 'clickCount',
    header: 'Clicks',
    cell: ({ row }) => row.original.clickCount.toLocaleString()
  },
  {
    accessorKey: 'createdAt',
    header: 'Created',
    cell: ({ row }) => h('span', { class: 'text-muted' }, formatAdminDate(row.original.createdAt))
  },
  {
    id: 'actions',
    meta: { class: { td: 'text-right' } },
    cell: ({ row }) => {
      const link = row.original
      return h(UDropdownMenu, { content: { align: 'end' }, items: getActionItems(link) }, () =>
        h(UButton, { variant: 'ghost', color: 'neutral', icon: 'i-lucide-ellipsis-vertical', size: 'sm' })
      )
    }
  }
];

// Computed
const filteredLinks = computed(() => {
  let result = links.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((l) =>
      l.shortCode.toLowerCase().includes(query) ||
      l.targetUrl?.toLowerCase().includes(query) ||
      l.title?.toLowerCase().includes(query) ||
      l.owner.name?.toLowerCase().includes(query) ||
      l.owner.email?.toLowerCase().includes(query)
    );
  }

  if (protectionFilter.value) {
    const isProtected = protectionFilter.value === 'protected';
    result = result.filter((l) => l.hasPassword === isProtected);
  }

  const sorters: Record<string, (a: LinkRow, b: LinkRow) => number> = {
    created: (a, b) => toTime(b.createdAt) - toTime(a.createdAt),
    updated: (a, b) => toTime(b.updatedAt) - toTime(a.updatedAt),
    clicks: (a, b) => b.clickCount - a.clickCount,
    code: (a, b) => a.shortCode.localeCompare(b.shortCode),
  };

  return [...result].sort(sorters[sortBy.value] ?? sorters.created);
});

const paginatedLinks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredLinks.value.slice(start, start + itemsPerPage.value);
});

const pageStart = computed(() =>
  filteredLinks.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
);
const pageEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredLinks.value.length)
);

// Reset to first page when filters change
watch([searchQuery, protectionFilter, sortBy], () => {
  currentPage.value = 1;
});

// Methods
const shortUrl = (link: LinkRow): string => `https://${SHORT_DOMAIN}/${link.shortCode}`;



const getActionItems = (link: LinkRow): DropdownMenuItem[][] => [
  [
    {
      label: 'Open Short Link',
      icon: 'i-lucide-external-link',
      onSelect: () => window.open(shortUrl(link), '_blank'),
    },
    {
      label: 'Open Destination',
      icon: 'i-lucide-arrow-up-right',
      disabled: !link.targetUrl,
      onSelect: () => link.targetUrl && window.open(link.targetUrl, '_blank', 'noopener'),
    },
    {
      label: 'Copy Short Link',
      icon: 'i-lucide-copy',
      onSelect: () => copyLink(link),
    },
    {
      label: 'View Owner',
      icon: 'i-lucide-user',
      disabled: !link.owner.email,
      onSelect: () => navigateTo(`/superadmin/users/${link.userId}`),
    },
  ],
  [
    {
      label: 'Delete Link',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect: () => deleteLink(link),
    },
  ],
];

const copyLink = async (link: LinkRow) => {
  try {
    await navigator.clipboard.writeText(shortUrl(link));
    toast.add({ title: 'Link copied', color: 'success' });
  } catch {
    toast.add({ title: 'Failed to copy link', color: 'error' });
  }
};

const deleteLink = async (link: LinkRow) => {
  if (!await confirm({
    title: `Delete ${SHORT_DOMAIN}/${link.shortCode}?`,
    description: 'The short link will stop redirecting immediately. This cannot be undone.',
    confirmLabel: 'Delete link',
  })) return;

  try {
    await $fetch(`/api/superadmin/links/${link.id}`, {
      method: 'DELETE' as any,
    });
    toast.add({ title: `Deleted ${SHORT_DOMAIN}/${link.shortCode}`, color: 'success' });
    await refreshLinks();
  } catch (error) {
    console.error('Failed to delete link:', error);
    toast.add({ title: 'Failed to delete link', color: 'error' });
  }
};

const refreshLinks = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch('/api/superadmin/links') as {
      links: LinkRow[]
      stats: Stats
    };
    links.value = response.links || [];
    stats.value = response.stats || { total: 0, totalClicks: 0, protected: 0, owners: 0 };
    loaded.value = true;
  } catch (error) {
    console.error('Failed to fetch links:', error);
    toast.add({ title: 'Failed to load short links', color: 'error' });
    links.value = [];
    stats.value = { total: 0, totalClicks: 0, protected: 0, owners: 0 };
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  refreshLinks();
});
</script>
