<template>
  <UDashboardPanel id="superadmin-qr-codes">
    <template #header>
      <UDashboardNavbar title="QR Codes">
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
              placeholder="Search code, name, URL, owner..."
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
              @click="refreshQRCodes"
            />
          </div>
        </template>

        <UTable
          :data="paginatedQRCodes"
          :columns="columns"
          :loading="isLoading"
          :ui="superadminTableUi"
        >
          <template #empty>
            {{ qrCodes.length === 0 ? 'No QR codes yet.' : 'No QR codes match your filters.' }}
          </template>
        </UTable>

        <template #footer>
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="text-sm text-muted">
              Showing {{ pageStart }}–{{ pageEnd }} of {{ filteredQRCodes.length }}
            </p>
            <UPagination
              v-model:page="currentPage"
              :total="filteredQRCodes.length"
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
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

type QRStatus = 'active' | 'inactive' | 'expired'

interface QRCodeRow {
  id: string
  userId: string
  shortCode: string
  name: string | null
  destinationUrl: string
  scanCount: number
  isActive: boolean
  expiresAt: string | null
  status: QRStatus
  createdAt: string
  updatedAt: string
  owner: {
    email: string | null
    name: string | null
  }
}

interface Stats {
  total: number
  active: number
  inactive: number
  totalScans: number
}

definePageMeta({
  layout: 'superadmin',
  middleware: 'superadmin',
});

const toast = useToast();
const confirm = useConfirm();

// State
const isLoading = ref(false);
const loaded = ref(false);
const searchQuery = ref('');
const statusFilter = ref<string | null>(null);
const sortBy = ref('created');
const currentPage = ref(1);
const itemsPerPage = ref(15);

const qrCodes = ref<QRCodeRow[]>([]);
const stats = ref<Stats>({ total: 0, active: 0, inactive: 0, totalScans: 0 });

// Options
const statusOptions = ref<SelectItem[]>([
  { label: 'All', value: null as unknown as string },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Expired', value: 'expired' },
]);

const sortOptions = ref<SelectItem[]>([
  { label: 'Newest', value: 'created' },
  { label: 'Recently updated', value: 'updated' },
  { label: 'Most scans', value: 'scans' },
  { label: 'Code (A-Z)', value: 'code' },
]);

const statCards = computed(() => [
  { label: 'Total QR Codes', value: stats.value.total, icon: 'i-lucide-qr-code' },
  { label: 'Active', value: stats.value.active, icon: 'i-lucide-check-circle' },
  { label: 'Inactive / Expired', value: stats.value.inactive, icon: 'i-lucide-pause-circle' },
  { label: 'Total Scans', value: stats.value.totalScans, icon: 'i-lucide-scan-line' },
]);

const statusColors: Record<QRStatus, 'success' | 'neutral' | 'error'> = {
  active: 'success',
  inactive: 'neutral',
  expired: 'error',
};

const columns: TableColumn<QRCodeRow>[] = [
  {
    accessorKey: 'shortCode',
    header: 'QR Code',
    cell: ({ row }) => {
      const qr = row.original
      return h('div', {}, [
        h('p', { class: 'font-medium text-highlighted' }, qr.name || 'Untitled'),
        h('a', {
          href: qrUrl(qr),
          target: '_blank',
          class: 'text-sm text-primary hover:underline'
        }, `perlink.to/qr/${qr.shortCode}`)
      ])
    }
  },
  {
    accessorKey: 'destinationUrl',
    header: 'Destination',
    cell: ({ row }) => {
      const qr = row.original
      return h('a', {
        href: qr.destinationUrl,
        target: '_blank',
        rel: 'noopener noreferrer',
        title: qr.destinationUrl,
        class: 'block max-w-xs text-sm text-muted truncate hover:underline'
      }, qr.destinationUrl)
    }
  },
  {
    id: 'owner',
    header: 'Owner',
    cell: ({ row }) => {
      const qr = row.original
      if (!qr.owner.email) return h('span', { class: 'text-sm text-dimmed' }, 'Unknown')
      return h('button', {
        class: 'text-left hover:underline',
        onClick: () => navigateTo(`/superadmin/users/${qr.userId}`)
      }, [
        h('p', { class: 'text-sm text-highlighted' }, qr.owner.name || 'No name'),
        h('p', { class: 'text-xs text-muted' }, qr.owner.email)
      ])
    }
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const qr = row.original
      return h(UBadge, { variant: 'subtle', color: statusColors[qr.status], size: 'sm', class: 'capitalize' }, () => qr.status)
    }
  },
  {
    accessorKey: 'scanCount',
    header: 'Scans',
    cell: ({ row }) => row.original.scanCount.toLocaleString()
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
      const qr = row.original
      return h(UDropdownMenu, { content: { align: 'end' }, items: getActionItems(qr) }, () =>
        h(UButton, { variant: 'ghost', color: 'neutral', icon: 'i-lucide-ellipsis-vertical', size: 'sm' })
      )
    }
  }
];

// Computed
const filteredQRCodes = computed(() => {
  let result = qrCodes.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter((q) =>
      q.shortCode.toLowerCase().includes(query) ||
      q.name?.toLowerCase().includes(query) ||
      q.destinationUrl.toLowerCase().includes(query) ||
      q.owner.name?.toLowerCase().includes(query) ||
      q.owner.email?.toLowerCase().includes(query)
    );
  }

  if (statusFilter.value) {
    result = result.filter((q) => q.status === statusFilter.value);
  }

  const sorters: Record<string, (a: QRCodeRow, b: QRCodeRow) => number> = {
    created: (a, b) => toTime(b.createdAt) - toTime(a.createdAt),
    updated: (a, b) => toTime(b.updatedAt) - toTime(a.updatedAt),
    scans: (a, b) => b.scanCount - a.scanCount,
    code: (a, b) => a.shortCode.localeCompare(b.shortCode),
  };

  return [...result].sort(sorters[sortBy.value] ?? sorters.created);
});

const paginatedQRCodes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredQRCodes.value.slice(start, start + itemsPerPage.value);
});

const pageStart = computed(() =>
  filteredQRCodes.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1
);
const pageEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredQRCodes.value.length)
);

// Reset to first page when filters change
watch([searchQuery, statusFilter, sortBy], () => {
  currentPage.value = 1;
});

// Methods
const qrUrl = (qr: QRCodeRow): string => `https://perlink.to/qr/${qr.shortCode}`;



const getActionItems = (qr: QRCodeRow): DropdownMenuItem[][] => [
  [
    {
      label: 'Open QR Link',
      icon: 'i-lucide-external-link',
      onSelect: () => window.open(qrUrl(qr), '_blank'),
    },
    {
      label: 'Open Destination',
      icon: 'i-lucide-arrow-up-right',
      onSelect: () => window.open(qr.destinationUrl, '_blank', 'noopener'),
    },
    {
      label: 'Copy QR Link',
      icon: 'i-lucide-copy',
      onSelect: () => copyLink(qr),
    },
    {
      label: 'View Owner',
      icon: 'i-lucide-user',
      disabled: !qr.owner.email,
      onSelect: () => navigateTo(`/superadmin/users/${qr.userId}`),
    },
  ],
  [
    {
      label: qr.isActive ? 'Deactivate' : 'Activate',
      icon: qr.isActive ? 'i-lucide-pause-circle' : 'i-lucide-play-circle',
      color: qr.isActive ? 'warning' : 'success',
      onSelect: () => toggleActive(qr),
    },
    {
      label: 'Delete QR Code',
      icon: 'i-lucide-trash',
      color: 'error',
      onSelect: () => deleteQRCode(qr),
    },
  ],
];

const copyLink = async (qr: QRCodeRow) => {
  try {
    await navigator.clipboard.writeText(qrUrl(qr));
    toast.add({ title: 'Link copied', color: 'success' });
  } catch {
    toast.add({ title: 'Failed to copy link', color: 'error' });
  }
};

const toggleActive = async (qr: QRCodeRow) => {
  try {
    await $fetch(`/api/superadmin/qr-codes/${qr.id}/toggle`, {
      method: 'POST' as any,
    });
    toast.add({
      title: qr.isActive ? `Deactivated ${qr.shortCode}` : `Activated ${qr.shortCode}`,
      color: 'success',
    });
    await refreshQRCodes();
  } catch (error) {
    console.error('Failed to toggle QR code:', error);
    toast.add({ title: 'Failed to update QR code', color: 'error' });
  }
};

const deleteQRCode = async (qr: QRCodeRow) => {
  if (!await confirm({
    title: `Delete QR code ${qr.shortCode}?`,
    description: 'Printed copies of this QR code will stop working. This cannot be undone.',
    confirmLabel: 'Delete QR code',
  })) return;

  try {
    await $fetch(`/api/superadmin/qr-codes/${qr.id}`, {
      method: 'DELETE' as any,
    });
    toast.add({ title: `Deleted ${qr.shortCode}`, color: 'success' });
    await refreshQRCodes();
  } catch (error) {
    console.error('Failed to delete QR code:', error);
    toast.add({ title: 'Failed to delete QR code', color: 'error' });
  }
};

const refreshQRCodes = async () => {
  isLoading.value = true;
  try {
    const response = await $fetch('/api/superadmin/qr-codes') as {
      qrCodes: QRCodeRow[]
      stats: Stats
    };
    qrCodes.value = response.qrCodes || [];
    stats.value = response.stats || { total: 0, active: 0, inactive: 0, totalScans: 0 };
    loaded.value = true;
  } catch (error) {
    console.error('Failed to fetch QR codes:', error);
    toast.add({ title: 'Failed to load QR codes', color: 'error' });
    qrCodes.value = [];
    stats.value = { total: 0, active: 0, inactive: 0, totalScans: 0 };
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  refreshQRCodes();
});
</script>
