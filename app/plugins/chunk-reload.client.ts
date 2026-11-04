// After a deploy, a page opened from a cached copy can ask for script files
// the new version no longer has ("Failed to fetch dynamically imported
// module"). Reload once to pick up the new version instead of showing an
// error; never more than once in a short while, so a real outage can't loop.
export default defineNuxtPlugin((nuxtApp) => {
  const KEY = 'perlink:chunk-reload'
  const reload = () => {
    try {
      const last = Number(sessionStorage.getItem(KEY) || 0)
      if (Date.now() - last < 15000) return
      sessionStorage.setItem(KEY, String(Date.now()))
    } catch {
      // No storage: still reload, the browser's own cache makes a loop unlikely
    }
    window.location.reload()
  }
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault()
    reload()
  })
  nuxtApp.hook('app:chunkError', reload)
  nuxtApp.hook('app:error', (error) => {
    if (/dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(String((error as Error)?.message ?? error))) reload()
  })
})
