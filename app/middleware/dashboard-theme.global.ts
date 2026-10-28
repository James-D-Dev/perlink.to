// Dashboard pages follow the dashboard's light/dark switch (their page meta
// says light; this has the last word). The 3D room editor stays dark.
export default defineNuxtRouteMiddleware((to) => {
  if (!to.path.startsWith('/dashboard') || to.path.startsWith('/dashboard/room')) return
  to.meta.colorMode = useDashboardTheme().value === 'dark' ? 'dark' : 'light'
})
