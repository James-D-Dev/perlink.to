<template>
  <UDashboardPanel id="superadmin-bio">
    <template #header>
      <UDashboardNavbar title="Bio Pages">
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
              placeholder="Search username, title, owner..."
              icon="i-lucide-search"
              class="w-full sm:w-72"
            />
            <USelect v-model="statusFilter" :items="statusOptions" placeholder="Status" class="w-44" />
            <USelect v-model="sortBy" :items="sortOptions" class="w-44" />
            <UButton
              variant="ghost"
              color="neutral"
              icon="i-lucide-refresh-cw"
              :loading="isLoading"
              class="ml-auto"
              @click="refreshBioPages"
            />
          </div>
        </template>

        <UTable
          :data="paginatedBioPages"
          :columns="columns"
          :loading="isLoading"
          :ui="superadminTableUi"
        >
          <template #empty>
            {{ bioPages.length === 0 ? 'No bio pages yet.' : 'No bio pages match your filters.' }}
          </template>
        </UTable>

        <template #footer>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm text-muted">
              Showing {{ pageStart }}–{{ pageEnd }} of {{ filteredBioPages.length }}
            </p>
            <UPagination
              v-model:page="currentPage"
              :total="filteredBioPages.length"
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

const UBadge = resolveComponent('UBadge')
const UAvatar = resolveComponent('UAvatar')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

interface BioPageRow {
  id: string
  userId: string
  username: string
  title: string | null
  avatarUrl: string | null
  templateId: string
  isPublished: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
  owner: {
    email: string | null
    name: string | null
    avatar: string | null
    plan: string
  }
}

interface Stats {
  total: number
  published: number
  draft: number
  totalViews: number
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
const statusFilter = ref<string | null>(null);
const sortBy = ref('updated');
const currentPage = ref(1);
const itemsPerPage = ref(15);

const bioPages = ref<BioPageRow[]>([]);
const stats = ref<Stats>({ total: 0, published: 0, draft: 0, totalViews: 0 });

// Options
const statusOptions = ref<SelectItem[]>([
  { label: 'All', value: null as unknown as string },
  { label: 'Published', value: 'published' },
  { label: 'Draft', value: 'draft' },
]);

const sortOptions = ref<SelectItem[]>([
  { label: 'Recently updated', value: 'updated' },
  { label: 'Newest', value: 'created' },
  { label: 'Most views', value: 'views' },
  { label: 'Username (A-Z)', value: 'username' },
]);

const statCards = computed(() => [
  { label: 'Total Bio Pages', value: stats.value.total, icon: 'i-lucide-id-card' },
  { label: 'Published', value: stats.value.published, icon: 'i-lucide-globe' },
  { label: 'Draft', value: stats.value.draft, icon: 'i-lucide-file-pen' },
  { label: 'Total Views', value: stats.value.totalViews, icon: 'i-lucide-eye' },
]);

const columns: TableColumn<BioPageRow>[] = [
  {
    accessorKey: 'username',
    header: 'Bio Page',
    cell: ({ row }) => {
      const bio = row.original
      return h('div', { class: 'flex items-center gap-3' }, [
        h(UAvatar, {
          src: bio.avatarUrl || undefined,
          alt: bio.title || bio.username,
          text: (bio.title?.charAt(0) || bio.username.charAt(0)).toUpperCase(),
          size: 'sm'
        }),
        h('div', {}, [
          h('p', { class: 'font-medium text-highlighted' }, bio.title || 'Untitled'),
          h('a', {
            href: `/${bio.username}`,
            target: '_blank',
            class: 'text-sm text-primary hover:underline'
          }, `perlink.to/${bio.username}`)
        ])
      ])
    }
  },
  {
    id: 'owner',
    header: 'Owner',
    cell: ({ row }) => {
      const bio = row.original
      if (!bio.owner.email) return h('span', { class: 'text-sm text-dimmed' }, 'Unknown')
      return h('button', {
        class: 'text-left hover:underline',
        onClick: () => navigateTo(`/superadmin/users/${bio.userId}`)
      }, [
        h('p', { class: 'text-sm text-highlighted' }, bio.owner.name || 'No name'),
        h('p', { class: 'text-xs text-muted' }, bio.owner.email)
      ])
    }
  },
  {
    accessorKey: 'isPublished',
    header: 'Status',
    cell: ({ row }) => {
      const bio = row.original
      return h(UBadge, {
        variant: 'subtle',
        color: bio.isPublished ? 'success' : 'neutral',
        size: 'sm'
      }, () => bio.isPublished ? 'Published' : 'Draft')
    }
  },
  {
    accessorKey: 'viewCount',
    header: 'Views',
    cell: ({ row }) => row.original.viewCount.toLocaleString()
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated',
    cell: ({ row }) => h('span', { class: 'text-muted' }, formatAdminDate(row.original.updatedAt))
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
      const bio = row.original
      return h(UDropdownMenu, { content: { align: 'end' }, items: getActionItems(bio) }, () =>
        h(UButton, { variant: 'ghost', color: 'neutral', icon: 'i-lucide-ellipsis-vertical', size: 'sm' })
      )
    }
  }
];

// Computed
const filteredBioPages = computed(() => {
  let result = bioPages.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((b) =>
      b.username.toLowerCase().includes(query) ||
      b.title?.toLowerCase().includes(query) ||
      b.owner.name?.toLowerCase().includes(query) ||
      b.owner.email?.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value) {
    const published = statusFilter.value === 'published';
    result = result.filter((b) => b.isPublished === published);
  }

  const sorters: Record<string, (a: BioPageRow, b: BioPageRow) => number> = {
    updated: (a, b) => toTime(b.updatedAt) - toTime(a.updatedAt),
    created: (a, b) => toTime(b.createdAt) - toTime(a.createdAt),
    views: (a, b) => b.viewCount - a.viewCount,
    username: (a, b) => a.username.localeCompare(b.username),
  };

  return [...result].sort(sorters[sortBy.value] ?? sorters.updated);
});

const paginatedBioPages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredBioPages.value.slice(start, start + itemsPerPage.value);
});

const pageStart = computed(() =>
  filteredBioPages.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
);
const pageEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredBioPages.value.length)
);

// Reset to first page when filters change
watch([searchQuery, statusFilter, sortBy], () => {
  currentPage.value = 1;
});

// Methods


const getActionItems = (bio: BioPageRow): DropdownMenuItem[][] => [
  [
    {
      label: 'View Page',
      icon: 'i-lucide-external-link',
      onSelect: () => window.open(`/${bio.username}`, '_blank'),
    },
    {
      label: 'Copy Link',
      icon: 'i-lucide-copy',
      onSelect: () => copyLink(bio),
    },
    {
      label: 'View Owner',
      icon: 'i-lucide-user',
      disabled: !bio.owner.email,
      onSelect: () => navigateTo(`/superadmin/users/${bio.userId}`),
    },
  ],
  [
    {
      label: bio.isPublished ? 'Unpublish' : 'Publish',
      icon: bio.isPublished ? 'i-lucide-eye-off' : 'i-lucide-globe',
      color: bio.isPublished ? 'warning' : 'success',
      onSelect: () => togglePublish(bio),
    },
    {
      label: 'Delete Bio Page',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect: () => deleteBioPage(bio),
    },
  ],
];

const copyLink = async (bio: BioPageRow) => {
  try {
    await navigator.clipboard.writeText(`${window.location.origin}/${bio.username}`);
    toast.add({ title: 'Link copied', color: 'success' });
  } catch {
    toast.add({ title: 'Failed to copy link', color: 'error' });
  }
};

const togglePublish = async (bio: BioPageRow) => {
  try {
    await $fetch(`/api/superadmin/bio/${bio.id}/publish`, {
      method: 'POST' as any,
    });
    toast.add({
      title: bio.isPublished ? `Unpublished /${bio.username}` : `Published /${bio.username}`,
      color: 'success',
    });
    await refreshBioPages();
  } catch (error) {
    console.error('Failed to toggle publish:', error);
    toast.add({ title: 'Failed to update bio page', color: 'error' });
  }
};

const deleteBioPage = async (bio: BioPageRow) => {
  if (!await confirm({
    title: `Delete /${bio.username}?`,
    description: 'The bio page will be permanently deleted. This cannot be undone.',
    confirmLabel: 'Delete bio page',
  })) return;

  try {
    await $fetch(`/api/superadmin/bio/${bio.id}`, {
      method: 'DELETE' as any,
    });
    toast.add({ title: `Deleted /${bio.username}`, color: 'success' });
    await refreshBioPages();
  } catch (error) {
    console.error('Failed to delete bio page:', error);
    toast.add({ title: 'Failed to delete bio page', color: 'error' });
  }
};

const refreshBioPages = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch('/api/superadmin/bio') as {
      bioPages: BioPageRow[]
      stats: Stats
    };
    bioPages.value = response.bioPages || [];
    stats.value = response.stats || { total: 0, published: 0, draft: 0, totalViews: 0 };
    loaded.value = true;
  } catch (error) {
    console.error('Failed to fetch bio pages:', error);
    toast.add({ title: 'Failed to load bio pages', color: 'error' });
    bioPages.value = [];
    stats.value = { total: 0, published: 0, draft: 0, totalViews: 0 };
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  refreshBioPages();
});
</script>
