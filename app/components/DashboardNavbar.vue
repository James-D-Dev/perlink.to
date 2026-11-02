<template>
  <!-- The bar on top of a dashboard page, frosted glass (iOS 26 style) over
       the page as it scrolls beneath. Computers: the button that folds the
       menu, the title, the page's actions. Phones: the Perlink logo on the
       left, the title in the middle, then the page's actions, the account
       and the menu (which slides in from the right) -->
  <UDashboardNavbar
    :toggle="false"
    :ui="{ root: 'pl-navbar absolute inset-x-0 top-0 z-30 border-line/70 bg-paper/65 backdrop-blur-2xl backdrop-saturate-[1.8]' }"
  >
    <template #leading>
      <UDashboardSidebarCollapse />
      <NuxtLink to="/dashboard" class="relative z-10 flex shrink-0 items-center gap-1.5 lg:hidden" aria-label="Perlink">
        <AppLogo variant="mark" :size="26" />
        <AppLogo :size="20" :inverted="isDark" />
      </NuxtLink>
    </template>

    <template #title>
      <span class="contents max-lg:hidden">
        <slot name="title">{{ title }}</slot>
      </span>
      <!-- Centred on the bar, between the logo and the buttons -->
      <span class="pointer-events-none absolute inset-x-0 top-1/2 mx-auto w-fit max-w-[36%] -translate-y-1/2 truncate text-center text-[15px] lg:hidden">
        {{ mobileTitle ?? title }}
      </span>
    </template>

    <template #right>
      <slot name="right" />
      <div class="flex items-center gap-1 lg:hidden">
        <UserMenu compact />
        <span class="h-5 w-px bg-line" aria-hidden="true" />
        <UDashboardSidebarToggle side="right" color="neutral" variant="ghost" />
      </div>
    </template>
  </UDashboardNavbar>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  /** On phones, when the title slot holds more than fits (e.g. a breadcrumb) */
  mobileTitle?: string
}>()

const theme = useDashboardTheme()
const isDark = computed(() => theme.value === 'dark')
</script>
