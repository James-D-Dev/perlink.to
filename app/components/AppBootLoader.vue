<template>
  <!-- While the app starts (dashboard, editor, superadmin): the animated mark
       on a plain screen, like Figma's. It's in the server-rendered HTML, so
       it shows at once, and fades out when the page has hydrated. -->
  <div
    v-if="shown"
    class="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300"
    :class="[leaving ? 'pointer-events-none opacity-0' : 'opacity-100', dark ? 'bg-[#0a0a0a]' : 'bg-[#fdfcfb]']"
  >
    <AppLoader :size="76" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const nuxtApp = useNuxtApp()

// Only the app's own screens; visitors' sites and the marketing pages show
// their content straight away
const isApp = /^\/(dashboard|superadmin)(\/|$)/.test(route.path)
const dark = route.path.startsWith('/superadmin') && useAdminTheme().value !== 'light'

const shown = ref(isApp)
const leaving = ref(false)

// Long enough for the room to build (about 0.9 s from the first paint), then fade
const MIN_MS = 900
function finish() {
  if (!shown.value || leaving.value) return
  const wait = Math.max(0, MIN_MS - performance.now())
  setTimeout(() => {
    leaving.value = true
    setTimeout(() => (shown.value = false), 320)
  }, wait)
}

if (import.meta.client && isApp) {
  // When the first page (and its data) has rendered on the client
  nuxtApp.hook('app:suspense:resolve', finish)
  onMounted(() => setTimeout(finish, 50))
}
</script>
