// The loader animation's clock (AppLoader.vue): it starts when the page first
// paints, which is when the server-rendered or template loader began to play.
export const LOADER_INTRO_MS = 1260
export const LOADER_BOUNCE_MS = 900

export function loaderClockStart() {
  if (typeof performance === 'undefined') return 0
  return performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? 0
}

/** How long until the loader may go: the intro played out, the pearl on the floor */
export function loaderWaitMs() {
  const t = performance.now() - loaderClockStart()
  if (t < LOADER_INTRO_MS) return LOADER_INTRO_MS - t
  return (LOADER_BOUNCE_MS - ((t - LOADER_INTRO_MS) % LOADER_BOUNCE_MS)) % LOADER_BOUNCE_MS
}
