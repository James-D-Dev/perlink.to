<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      :min-size="16"
      :max-size="16"
      :default-size="16"
      :ui="{
        root: 'bg-paper border-r border-line',
        header: 'h-16',
        footer: 'border-t border-line',
        content: 'max-w-72',
      }"
    >
      <template #header="{ collapsed }">
        <NuxtLink to="/" :aria-label="collapsed ? 'Perlink home' : undefined" class="flex items-center" :class="collapsed && 'w-full justify-center'">
          <AppLogo :variant="collapsed ? 'mark' : 'full'" :size="24" />
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <NuxtLink
          to="/dashboard/create"
          class="flex h-10 items-center justify-center gap-2 rounded-full bg-ink text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
          :class="collapsed ? 'mx-auto w-10' : 'w-full'"
          :aria-label="collapsed ? 'Create a site' : undefined"
        >
          <UIcon name="i-lucide-plus" class="size-4" />
          <span v-if="!collapsed">Create a site</span>
        </NuxtLink>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="navigationLinks"
          orientation="vertical"
          class="mt-2"
          :ui="{
            link: 'rounded-lg py-2 text-ink-soft before:rounded-lg hover:text-ink data-active:text-ink data-active:before:bg-sand',
            linkLeadingIcon: 'size-[18px] text-ink-muted group-data-active:text-ink',
          }"
        />

        <!-- Upgrade -->
        <NuxtLink
          v-if="!collapsed"
          to="/dashboard/upgrade"
          class="group mt-4 block rounded-2xl bg-sand p-4 transition-colors hover:bg-sand-strong"
        >
          <div class="flex items-center gap-2">
            <MarketingMkOrb palette="sunset" :size="18" still />
            <p class="text-sm font-medium text-ink">Perlink Pro</p>
          </div>
          <p class="mt-1.5 text-xs leading-relaxed text-ink-muted">More sites, more 3D worlds and premium extras.</p>
          <p class="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ink">
            See plans
            <UIcon name="i-lucide-arrow-right" class="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </p>
        </NuxtLink>

        <UNavigationMenu
          :collapsed="collapsed"
          :items="supportLinks"
          orientation="vertical"
          class="mt-auto"
          :ui="{
            link: 'rounded-lg py-2 text-ink-soft before:rounded-lg hover:text-ink data-active:text-ink data-active:before:bg-sand',
            linkLeadingIcon: 'size-[18px] text-ink-muted',
          }"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>
    <UDashboardSearch :groups="groups" />

    <slot />
    <NotificationsSlideover />
    <HelpCenter />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { User } from "#auth-utils";
import type { NavigationMenuItem } from "@nuxt/ui";

const { user: sessionUser, loggedIn } = useUserSession();
const user = sessionUser as Ref<User | null>;
const open = ref(false);

const helpOpen = useHelpCenter();

const navigationLinks: NavigationMenuItem[] = [
  { label: "Home", icon: "i-lucide-house", to: "/dashboard", exact: true },
  { label: "Sites", icon: "i-lucide-layout-template", to: "/dashboard/site" },
  { label: "Settings", icon: "i-lucide-settings", to: "/dashboard/settings" },
];

const supportLinks: NavigationMenuItem[] = [
  { label: "Help", icon: "i-lucide-circle-help", onSelect: () => (helpOpen.value = true) },
  { label: "Feedback", icon: "i-lucide-message-square-heart", to: "/dashboard/feedback" },
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
    await useUserSession().clear(); // Clear client session first
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
      onSelect: () => navigateTo("/dashboard/settings"),
    },
    {
      label: "Billing",
      icon: "i-heroicons-credit-card",
      onSelect: () => navigateTo("/dashboard/billing"),
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
