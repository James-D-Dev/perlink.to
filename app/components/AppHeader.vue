<script setup lang="ts">
const { loggedIn, user } = useUserSession(); // TODO: Uncomment when auth is configured

// Temporary user type
type User = {
  email?: string;
  username?: string;
} | null;
</script>

<template>
  <UHeader
    title="Perlink.to"
    :ui="{
      root: 'fixed md:top-6 top-2 left-0 right-0 z-50 px-2 md:px-0 backdrop-blur-none bg-transparent',
      container:
        'max-w-7xl mx-auto bg-white/80 backdrop-blur-lg rounded-xl border border-perlink-blue/20',
    }"
  >
    <!-- Logo -->
    <template #left>
      <NuxtLink to="/" class="flex items-center">
        <img src="/logo-full.png" class="h-8 md:h-10" alt="Perlink.to" />
      </NuxtLink>
    </template>

    <!-- Navigation Links (Center) -->
    <template #default>
      <nav class="hidden md:flex items-center space-x-8">
        <ULink
          to="#"
          class="text-perlink-blue/80 hover:text-perlink-blue transition-colors"
        >
          Templates
        </ULink>
        <ULink
          to="#"
          class="text-perlink-blue/80 hover:text-perlink-blue transition-colors"
        >
          Marketplace
        </ULink>
        <ULink
          to="#"
          class="text-perlink-blue/80 hover:text-perlink-blue transition-colors"
        >
          Discover
        </ULink>
        <ULink
          to="pricing"
          class="text-perlink-blue/80 hover:text-perlink-blue transition-colors"
        >
          Pricing
        </ULink>
        <ULink
          to="#"
          class="text-perlink-blue/80 hover:text-perlink-blue transition-colors"
        >
          Learn
        </ULink>
      </nav>
    </template>

    <!-- Auth Buttons -->
    <template #right>
      <div class="flex items-center space-x-4">
        <template v-if="loggedIn">
          <NuxtLink to="/dashboard" class="flex items-center space-x-3">
            <UAvatar
              :src="user?.avatar || ''"
              :text="
                user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()
              "
              size="sm"
              :ui="{ fallback: 'bg-perlink-blue/10 text-perlink-blue' }"
            />
            <span
              class="md:inline-block hidden text-perlink-blue/80 hover:text-perlink-blue transition-colors"
            >
              {{ user?.name || user?.username || user?.email?.split("@")[0] }}
            </span>
          </NuxtLink>
        </template>
        <template v-else>
          <UButton to="/login" variant="ghost" color="neutral" label="Log in" />
          <UButton
            to="/login"
            label="Sign up free"
            :ui="{
              base: 'bg-gradient-to-r from-perlink-blue to-perlink-cyan hover:from-perlink-cyan hover:to-perlink-blue',
            }"
          />
        </template>
      </div>
    </template>

    <!-- Mobile Menu Content -->
    <template #body>
      <nav class="flex flex-col space-y-4 p-4">
        <ULink
          to="#"
          class="text-perlink-blue/80 hover:text-perlink-blue transition-colors"
        >
          Templates
        </ULink>
        <ULink
          to="#"
          class="text-perlink-blue/80 hover:text-perlink-blue transition-colors"
        >
          Marketplace
        </ULink>
        <ULink
          to="#"
          class="text-perlink-blue/80 hover:text-perlink-blue transition-colors"
        >
          Discover
        </ULink>
        <ULink
          to="/pricing"
          class="text-perlink-blue/80 hover:text-perlink-blue transition-colors"
        >
          Pricing
        </ULink>
        <ULink
          to="#"
          class="text-perlink-blue/80 hover:text-perlink-blue transition-colors"
        >
          Learn
        </ULink>
      </nav>
    </template>
  </UHeader>
</template>
