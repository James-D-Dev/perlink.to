<template>
  <!-- Same frame as the dashboard: paper sidebar that folds to icons, a
       drawer from the left on phones -->
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="superadmin"
      v-model:open="open"
      collapsible
      mode="drawer"
      :menu="{ direction: 'left', handle: false }"
      resizable
      :min-size="16"
      :max-size="16"
      :default-size="16"
      :ui="{
        root: 'bg-paper border-r border-line',
        header: 'h-16',
        footer: 'border-t border-line',
        content: 'flex-col',
      }"
    >
      <template #header="{ collapsed }">
        <NuxtLink to="/superadmin" :aria-label="collapsed ? 'Perlink admin' : undefined" class="flex min-w-0 items-center gap-2" :class="collapsed && 'w-full justify-center'">
          <AppLogo :variant="collapsed ? 'mark' : 'full'" :size="collapsed ? 28 : 30" :inverted="theme === 'dark'" />
          <span v-if="!collapsed" class="rounded-full bg-error/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-error">Admin</span>
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton
          :collapsed="collapsed"
          color="neutral"
          variant="soft"
          :class="collapsed ? 'mx-auto' : 'w-full'"
        />

        <div v-for="group in navigationGroups" :key="group.label" class="mt-4 first-of-type:mt-3">
          <p v-if="!collapsed" class="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">{{ group.label }}</p>
          <UNavigationMenu
            :collapsed="collapsed"
            :items="group.items"
            orientation="vertical"
            tooltip
            :ui="navUi"
          />
        </div>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="[themeLink, ...supportLinks]"
          orientation="vertical"
          tooltip
          class="mt-auto"
          :ui="navUi"
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

// Admin colours (blue primary, dark-aware paper/ink) live under this class
useHead({ htmlAttrs: { class: "admin-theme" } });

// Light / dark switch, dark by default
const route = useRoute();
const colorMode = useColorMode();
const theme = useAdminTheme();
function toggleTheme() {
  const next = theme.value === "dark" ? "light" : "dark";
  theme.value = next;
  route.meta.colorMode = next;
  colorMode.value = next;
}
const themeLink = computed<NavigationMenuItem>(() => ({
  label: theme.value === "dark" ? "Light mode" : "Dark mode",
  icon: theme.value === "dark" ? "i-lucide-sun" : "i-lucide-moon",
  onSelect: toggleTheme,
}));

// Same rows as the dashboard menu
const navUi = {
  link: "min-h-11 gap-3 rounded-xl px-3 py-2.5 text-[15px] text-ink-soft before:rounded-xl hover:text-ink hover:before:bg-sand/60 data-active:font-medium data-active:text-ink data-active:before:bg-sand",
  linkLeadingIcon: "size-5 text-ink-muted group-data-active:text-tint",
};

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
      { label: "Emails", icon: "i-lucide-mail", to: "/superadmin/emails" },
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
