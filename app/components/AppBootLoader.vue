<template>
  <!-- While the app starts (dashboard, editor, superadmin): the animated mark
       on a plain screen, like Figma's. It's in the server-rendered HTML, so
       it shows at once, and fades out when the page has hydrated. -->
  <div
    v-if="shown"
    class="fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300"
    :class="[leaving ? 'pointer-events-none opacity-0' : 'opacity-100', dark ? 'bg-[#0a0a0a]' : 'bg-[#fdfcfb]']"
  >
    <!-- On the way in from a public page it plays from the start (its own clock) -->
    <AppLoader :key="startedAt" :size="76" :sync="!startedAt" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()

// Only the app's own screens; visitors' sites and the marketing pages show
// their content straight away
const isApp = (path: string) => /^\/(dashboard|superadmin)(\/|$)/.test(path)
// Dark where the screen behind is dark: the room editor, superadmin unless
// switched to light, the dashboard when switched to dark
const adminTheme = useAdminTheme()
const dashboardTheme = useDashboardTheme()
const darkFor = (path: string) => path.startsWith('/dashboard/room')
  || (path.startsWith('/superadmin') && adminTheme.value !== 'light')
  || (path.startsWith('/dashboard') && dashboardTheme.value === 'dark')

const shown = ref(isApp(route.path))
const dark = ref(darkFor(route.path))
const leaving = ref(false)
// When it was shown on the way into the app (0: since the page loaded)
const startedAt = ref(0)
let safety: ReturnType<typeof setTimeout> | null = null

// Goes once the intro has played (the room built, the pearl landed), and
// only as the pearl touches the floor, so it never cuts off mid-bounce
function finish() {
  if (!shown.value || leaving.value) return
  if (safety) clearTimeout(safety)
  let wait = loaderWaitMs()
  if (startedAt.value) {
    const t = performance.now() - startedAt.value
    wait = t < LOADER_INTRO_MS ? LOADER_INTRO_MS - t : (LOADER_BOUNCE_MS - ((t - LOADER_INTRO_MS) % LOADER_BOUNCE_MS)) % LOADER_BOUNCE_MS
  }
  setTimeout(() => {
    leaving.value = true
    setTimeout(() => (shown.value = false), 320)
  }, wait)
}

if (import.meta.client) {
  if (shown.value) {
    // When the first page (and its data) has rendered on the client
    nuxtApp.hook('app:suspense:resolve', finish)
    onMounted(() => setTimeout(finish, 50))
  }
  // Coming into the app from the site's public pages (the home page's
  // "Dashboard", signing in): the app's code loads first, so cover the wait
  // the same way, until the app's page has rendered
  router.beforeEach((to, from) => {
    if (!isApp(to.path) || isApp(from.path) || !from.matched.length) return
    dark.value = darkFor(to.path)
    leaving.value = false
    startedAt.value = performance.now()
    shown.value = true
    // Never stuck: a failed load still lets the page through
    if (safety) clearTimeout(safety)
    safety = setTimeout(finish, 8000)
  })
  nuxtApp.hook('page:finish', () => {
    if (shown.value) finish()
  })
  router.afterEach((_to, _from, failure) => {
    if (failure && shown.value) finish()
  })
}
</script>
