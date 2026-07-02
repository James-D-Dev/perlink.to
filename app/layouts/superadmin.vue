<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="superadmin"
      v-model:open="open"
      collapsible
      resizable
      :min-size="17"
      :max-size="17"
      :default-size="17"
      :ui="{
        root: 'bg-white',
        footer: 'border-t border-default',
      }"
    >
      <template #header="{ collapsed }">
        <NuxtLink v-if="!collapsed" to="/" class="flex items-center gap-2">
          <img src="/logo-full.png" class="h-10" alt="Perlink" />
          <UKbd color="error" class="ml-2">SUPERADMIN</UKbd>
        </NuxtLink>
        <NuxtLink v-else to="/" class="flex items-center justify-center">
          <img src="/logo-perlink.png" class="h-10" alt="Perlink" />
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UButton
          to="/superadmin/users/create"
          :label="collapsed ? undefined : 'Create User'"
          icon="i-heroicons-plus"
          block
          :square="collapsed"
          size="xl"
          color="error"
          class="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="navigationLinks"
          orientation="vertical"
          :ui="{
            link: 'py-3',
          }"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="supportLinks"
          orientation="vertical"
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
import type { User } from "#auth-utils";
import type { NavigationMenuItem } from "@nuxt/ui";

const { user: sessionUser, loggedIn } = useUserSession();
const user = sessionUser as Ref<User | null>;
const open = ref(false);

const navigationLinks: NavigationMenuItem[] = [
  {
    label: "Dashboard",
    icon: "i-mingcute-dashboard-4-line",
    to: "/superadmin",
  },
  {
    label: "Users",
    icon: "i-mingcute-user-2-line",
    to: "/superadmin/users",
  },
  {
    label: "Bio Pages",
    icon: "i-mingcute-profile-line",
    to: "/superadmin/bio",
  },
  {
    label: "Short Links",
    icon: "i-mingcute-link-2-line",
    to: "/superadmin/links",
  },
  {
    label: "QR Codes",
    icon: "i-mingcute-qrcode-2-line",
    to: "/superadmin/qr-codes",
  },
  {
    label: "Settings",
    icon: "i-mingcute-settings-6-line",
    to: "/superadmin/settings",
  },
];

const supportLinks: NavigationMenuItem[] = [
  {
    label: "Back to Site",
    icon: "i-mingcute-arrow-left-line",
    to: "/",
  },
  {
    label: "Admin Panel",
    icon: "i-mingcute-dashboard-3-line",
    to: "/admin",
  },
];

const groups = computed(() => [
  {
    id: "links",
    label: "Go to",
    items: navigationLinks as any,
  },
]);

const handleSignOut = async () => {
  try {
    await $fetch("/api/auth/logout", { method: "POST" });
    await useUserSession().clear();
    await navigateTo("/login");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

const accountMenuItems = [
  [
    {
      label: "My Account",
      icon: "i-heroicons-user",
      onSelect: () => navigateTo("/superadmin/settings"),
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-right-on-rectangle",
      onSelect: handleSignOut,
    },
  ],
];
</script>
