<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
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
        </NuxtLink>
        <NuxtLink v-else to="/" class="flex items-center justify-center">
          <img src="/logo-perlink.png" class="h-10" alt="Perlink" />
        </NuxtLink>
      </template>

      <template #default="{ collapsed }">
        <UButton
          to="/dashboard/create"
          :label="collapsed ? undefined : 'Create new'"
          icon="i-heroicons-plus"
          block
          :square="collapsed"
          size="xl"
          class="bg-gradient-to-r from-perlink-blue to-perlink-cyan hover:from-perlink-cyan hover:to-perlink-blue"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="navigationLinks"
          orientation="vertical"
          :ui="{
            link: 'py-3',
          }"
        />

        <!-- Pro Plan Card -->
        <div
          v-if="!collapsed"
          class="mx-2 mb-4 p-4 rounded-xl bg-gradient-to-br from-perlink-blue/10 to-perlink-cyan/10 border border-perlink-cyan/20"
        >
          <div class="flex items-center gap-2 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
            >
              <path d="M0 0h16v16H0z" fill="none" />
              <g fill="none">
                <path
                  fill="url(#SVGtHgz6WvO)"
                  d="M6.625 2H3.5a.5.5 0 0 0-.447.276l-2 4h4.503z"
                />
                <path
                  fill="url(#SVGWfwR7b6S)"
                  d="M10.444 6.276L9.375 2H12.5a.5.5 0 0 1 .447.276l2 4z"
                />
                <path
                  fill="url(#SVGbKqqQeGY)"
                  d="M6.015 2.379A.5.5 0 0 1 6.5 2h3a.5.5 0 0 1 .485.379l1 4q.015.06.015.121H5a.5.5 0 0 1 .015-.121z"
                />
                <path
                  fill="url(#SVG9xXogciy)"
                  d="M5.568 6H1.191l-.138.276a.5.5 0 0 0 .059.54l6.5 8a.5.5 0 0 0 .765.012z"
                />
                <path
                  fill="url(#SVGGODBFdUo)"
                  d="M7.623 14.828L10.432 6h4.377l.138.276a.5.5 0 0 1-.059.54l-6.5 8a.5.5 0 0 1-.765.012"
                />
                <path
                  fill="url(#SVGoIdfzoRi)"
                  d="m5.11 6l-.095.379a.5.5 0 0 0 .008.27l2.5 8a.5.5 0 0 0 .954 0l2.5-8a.5.5 0 0 0 .008-.27L10.89 6z"
                />
                <path
                  fill="url(#SVGVVDu5gmx)"
                  fill-opacity=".7"
                  d="M3.5 2a.5.5 0 0 0-.447.276l-2 4a.5.5 0 0 0 .059.54l6.5 8a.5.5 0 0 0 .776 0l6.5-8a.5.5 0 0 0 .06-.54l-2-4A.5.5 0 0 0 12.5 2z"
                />
                <defs>
                  <linearGradient
                    id="SVGtHgz6WvO"
                    x1="5.829"
                    x2="3.513"
                    y1=".218"
                    y2="5.76"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#9ff0f9" />
                    <stop offset="1" stop-color="#29c3ff" />
                  </linearGradient>
                  <linearGradient
                    id="SVGWfwR7b6S"
                    x1="11.365"
                    x2="14.004"
                    y1="2"
                    y2="8.632"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#0fafff" />
                    <stop offset="1" stop-color="#102784" />
                  </linearGradient>
                  <linearGradient
                    id="SVGbKqqQeGY"
                    x1="8"
                    x2="8"
                    y1="2"
                    y2="7.625"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#3bd5ff" />
                    <stop offset="1" stop-color="#367af2" />
                  </linearGradient>
                  <linearGradient
                    id="SVG9xXogciy"
                    x1="2.302"
                    x2="7.818"
                    y1="4.2"
                    y2="14.84"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#0094f0" />
                    <stop offset="1" stop-color="#6ce0ff" />
                  </linearGradient>
                  <linearGradient
                    id="SVGGODBFdUo"
                    x1="16.736"
                    x2="8.517"
                    y1="1.5"
                    y2="13.828"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#1b44b1" />
                    <stop offset="1" stop-color="#2052cb" />
                  </linearGradient>
                  <linearGradient
                    id="SVGoIdfzoRi"
                    x1="7.996"
                    x2="7.996"
                    y1="2.85"
                    y2="15"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#2052cb" />
                    <stop offset="1" stop-color="#0fafff" />
                  </linearGradient>
                  <linearGradient
                    id="SVGVVDu5gmx"
                    x1="-.422"
                    x2="10.764"
                    y1="-10.242"
                    y2="16.053"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset=".533" stop-color="#ff6ce8" stop-opacity="0" />
                    <stop offset="1" stop-color="#ff6ce8" />
                  </linearGradient>
                </defs>
              </g>
            </svg>

            <span class="font-semibold text-sm text-primary">Pro Plan</span>
          </div>
          <p class="text-xs text-muted-foreground mb-3">
            Your plan will expire in 12 days
          </p>
          <div class="w-full bg-gray-200 rounded-full h-1.5 mb-3">
            <div
              class="bg-perlink-cyan h-1.5 rounded-full"
              style="width: 10%"
            ></div>
          </div>
          <p class="text-xs text-muted-foreground mb-3">10% used</p>
          <UButton
            block
            size="sm"
            class="bg-gradient-to-r from-perlink-blue to-perlink-cyan hover:from-perlink-cyan hover:to-perlink-blue text-white"
          >
            Upgrade Plan
          </UButton>
        </div>
        <!-- <div v-else class="mx-2 mb-4 flex justify-center">
          <UButton
            size="sm"
            icon="i-heroicons-crown"
            class="bg-gradient-to-r from-perlink-blue to-perlink-cyan text-white"
          />
        </div> -->

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
    to: "/dashboard",
  },
  {
    label: "Bio Pages",
    icon: "i-mingcute-profile-line",
    to: "/dashboard/bio",
  },
  {
    label: "QR Codes",
    icon: "i-mingcute-qrcode-2-line",
    to: "/dashboard/qr",
  },
  // {
  //   label: "Analytics",
  //   icon: "i-mingcute-chart-bar-line",
  //   to: "/dashboard/analytics",
  // },
  // {
  //   label: "Domains",
  //   icon: "i-mingcute-earth-2-line",
  //   to: "/dashboard/domains",
  // },
  {
    label: "Settings",
    icon: "i-mingcute-settings-6-line",
    to: "/dashboard/settings",
  },
];

const supportLinks: NavigationMenuItem[] = [
  {
    label: "Help & Support",
    icon: "i-mingcute-lifebuoy-line",
    to: "/dashboard/help",
  },
  {
    label: "Feedback",
    icon: "i-mingcute-chat-4-line",
    to: "/dashboard/feedback",
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
