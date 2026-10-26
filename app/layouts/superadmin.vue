<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="superadmin"
      v-model:open="open"
      collapsible
      resizable
      :min-size="15"
      :max-size="20"
      :default-size="16"
      :ui="{
        root: 'bg-default border-r border-default',
        header: 'h-(--ui-header-height) border-b border-default',
        body: 'py-4',
        footer: 'border-t border-default',
        content: 'max-w-72',
      }"
    >
      <template #header="{ collapsed }">
        <NuxtLink to="/superadmin" class="flex items-center gap-2.5 min-w-0" :class="collapsed && 'mx-auto'">
          <img src="/logo-perlink.png" class="size-8 shrink-0" alt="Perlink" />
          <template v-if="!collapsed">
            <span class="font-semibold text-highlighted truncate">Perlink</span>
            <UBadge label="Admin" color="error" variant="subtle" size="sm" />
          </template>
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton :collapsed="collapsed" class="bg-transparent ring-default" />

        <UNavigationMenu
          v-for="group in navigationGroups"
          :key="group.label"
          :collapsed="collapsed"
          :items="[{ label: group.label, type: 'label' }, ...group.items]"
          orientation="vertical"
          tooltip
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="supportLinks"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="groups" />

    <slot />
    <NotificationsSlideover />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

const open = ref(false);

const navigationGroups: { label: string; items: NavigationMenuItem[] }[] = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", icon: "i-lucide-layout-dashboard", to: "/superadmin", exact: true },
    ],
  },
  {
    label: "Manage",
    items: [
      { label: "Users", icon: "i-lucide-users", to: "/superadmin/users" },
      { label: "Bio Pages", icon: "i-lucide-id-card", to: "/superadmin/bio" },
      { label: "Short Links", icon: "i-lucide-link", to: "/superadmin/links" },
      { label: "QR Codes", icon: "i-lucide-qr-code", to: "/superadmin/qr-codes" },
      { label: "Reports", icon: "i-lucide-flag", to: "/superadmin/reports" },
      { label: "Payments", icon: "i-lucide-wallet", to: "/superadmin/payments" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", icon: "i-lucide-settings", to: "/superadmin/settings" },
    ],
  },
];

const supportLinks: NavigationMenuItem[] = [
  { label: "User Dashboard", icon: "i-lucide-layout-grid", to: "/dashboard" },
  { label: "Back to Site", icon: "i-lucide-arrow-left", to: "/" },
];

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: navigationGroups.flatMap(g => g.items) as any,
  },
  {
    id: "actions",
    label: "Actions",
    items: [
      { label: "Create user", icon: "i-lucide-user-plus", to: "/superadmin/users/create" },
    ],
  },
]);
</script>
