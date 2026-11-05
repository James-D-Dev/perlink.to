/**
 * www.perlink.to → perlink.to, same path and query, permanently: one address
 * for search engines, and www links people type still work. Runs before the
 * custom-domain middleware, which would otherwise look www up as a user's
 * domain.
 */
export default defineEventHandler((event) => {
  const host = (getRequestHeader(event, 'host') || '').toLowerCase()
  if (host !== 'www.perlink.to') return
  const url = getRequestURL(event)
  return sendRedirect(event, `https://perlink.to${url.pathname}${url.search}`, 301)
})
