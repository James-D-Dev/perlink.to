// The dashboard's light/dark switch has the last word after every navigation.
// Color-mode forces each page's own meta (light) after navigating, and on a
// navigation to the page already open ("Create a site" while on /dashboard)
// the route middleware that sets the switch's choice doesn't run, so the
// dashboard turned light. Registered after color-mode's hook, this runs after it.
export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()
  const theme = useDashboardTheme()
  useRouter().afterEach((to) => {
    if (!to.path.startsWith('/dashboard') || to.path.startsWith('/dashboard/room')) return
    const wanted = theme.value === 'dark' ? 'dark' : 'light'
    if (colorMode.value !== wanted) colorMode.value = wanted
  })
})
