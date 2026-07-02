<template>
  <AppHeader />
  <slot />
  <AppFooter />
  <!-- Google One Tap - only runs on client -->
  <AuthState v-slot="{ loggedIn }">
    <GoogleOneTap v-if="!loggedIn" />
  </AuthState>
</template>
