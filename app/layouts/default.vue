<template>
  <AppHeader />
  <slot />
  <AppFooter />
  <HelpCenter />
  <!-- Google One Tap - only runs on client -->
  <AuthState v-slot="{ loggedIn }">
    <GoogleOneTap v-if="!loggedIn" />
  </AuthState>
</template>
