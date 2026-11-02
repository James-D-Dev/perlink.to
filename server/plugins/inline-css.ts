import type { H3Event } from 'h3'

// Public pages (the landing, templates, people's own sites) carry their
// stylesheets in the page itself. Most visits there are a first visit (a link
// opened from a social app), and waiting for a separate stylesheet held the
// first paint back by a round trip on mobile networks. The dashboard, used
// again and again, keeps the cached files.

const STYLESHEET = /<link rel="stylesheet" href="(\/_nuxt\/[^"]+\.css)"[^>]*>/g
// A site's theme fonts: Google's small stylesheet goes in too (the font files
// still come from Google, after the page has painted)
const GOOGLE_FONTS = /<link rel="stylesheet" href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)"[^>]*>/g
const cache = new Map<string, string>()
// Google answers with the formats the browser asks for: a current browser's
const MODERN_BROWSER = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'

async function googleFonts(href: string) {
  if (cache.has(href)) return cache.get(href)!
  const response = await fetch(href.replace(/&amp;/g, '&'), { headers: { 'User-Agent': MODERN_BROWSER } })
  if (!response.ok) return null
  const css = (await response.text()).replace(/<\/style/gi, '<\\/style')
  cache.set(href, css)
  return css
}

async function stylesheet(event: H3Event, href: string) {
  if (cache.has(href)) return cache.get(href)!
  const assets = (event.context.cloudflare?.env as { ASSETS?: { fetch: (request: Request) => Promise<Response> } } | undefined)?.ASSETS
  if (!assets) return null
  const response = await assets.fetch(new Request(new URL(href, 'https://perlink.to')))
  if (!response.ok) return null
  // A stylesheet can't end the style element early, but make sure
  const css = (await response.text()).replace(/<\/style/gi, '<\\/style')
  cache.set(href, css)
  return css
}

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:html', async (html, { event }) => {
    const path = event.path || '/'
    if (path.startsWith('/dashboard') || path.startsWith('/superadmin')) return
    for (const [index, chunk] of html.head.entries()) {
      let fonted = chunk
      for (const match of [...chunk.matchAll(GOOGLE_FONTS)]) {
        const css = await googleFonts(match[1]!).catch(() => null)
        if (css) fonted = fonted.replace(match[0], `<style data-href="google-fonts">${css}</style>`)
      }
      if (fonted !== chunk) html.head[index] = fonted
      const hrefs = [...fonted.matchAll(STYLESHEET)].map(match => match[1]!)
      if (!hrefs.length) continue
      const sheets = await Promise.all(hrefs.map(href => stylesheet(event, href).catch(() => null)))
      let next = fonted
      hrefs.forEach((href, i) => {
        const css = sheets[i]
        if (css) next = next.replace(new RegExp(`<link rel="stylesheet" href="${href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`), `<style data-href="${href}">${css}</style>`)
      })
      html.head[index] = next
    }
  })
})
