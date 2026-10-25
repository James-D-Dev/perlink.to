interface LinkMetadata {
  title: string
  description: string
  image: string
  favicon: string
}

/** Most a page is read for its title and preview image */
const MAX_BYTES = 1_000_000
const MAX_REDIRECTS = 3
const TIMEOUT_MS = 8000

// Fetches a link's title, description and image for the editor. Signed-in
// users only, and only public web addresses: no internal hosts or IPs, on
// every redirect too, so it can't be used to reach private services.
export default defineEventHandler(async (event): Promise<LinkMetadata> => {
  if (!event.context.user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const { url } = await readBody<{ url?: string }>(event)
  let target = typeof url === 'string' ? publicUrl(url) : null
  if (!target) throw createError({ statusCode: 400, statusMessage: 'Enter a public web address' })

  const headers: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
  }
  // TikTok needs a browser-like request
  if (target.hostname.includes('tiktok.com')) {
    Object.assign(headers, {
      'Referer': 'https://www.tiktok.com/',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
      'Sec-Fetch-User': '?1',
      'Upgrade-Insecure-Requests': '1',
    })
  }

  let html: string
  try {
    // Follow redirects by hand so each hop is checked
    let response: Response | null = null
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      response = await fetch(target.toString(), { headers, redirect: 'manual', signal: AbortSignal.timeout(TIMEOUT_MS) })
      const location = response.status >= 300 && response.status < 400 ? response.headers.get('location') : null
      if (!location) break
      const next = publicUrl(new URL(location, target).toString())
      if (!next) throw new Error('Redirect to a non-public address')
      target = next
      response = null
    }
    if (!response?.ok) throw new Error(`Status ${response?.status ?? 'redirect loop'}`)
    html = await readLimited(response, MAX_BYTES)
  } catch (error) {
    console.warn('[crawl-link]', target.hostname, error instanceof Error ? error.message : error)
    throw createError({ statusCode: 502, statusMessage: 'Could not read this link' })
  }

  if (target.hostname.includes('tiktok.com')) return extractTikTokMeta(html)
  return {
    title: extractMeta(html, 'og:title', 'title') ?? target.hostname,
    description: extractMeta(html, 'og:description', 'description') ?? '',
    image: extractMeta(html, 'og:image', 'image') ?? '',
    favicon: extractFavicon(html, target) ?? '',
  }
})

/** The address if it's a public http(s) web address, otherwise null */
function publicUrl(raw: string): URL | null {
  let url: URL
  try {
    url = new URL(raw.trim())
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null
  if (url.username || url.password) return null
  if (url.port && url.port !== '80' && url.port !== '443') return null
  const host = url.hostname.toLowerCase().replace(/\.$/, '')
  // No bare IPs (v4 or v6) and no local or internal names
  if (/^\d+(\.\d+){0,3}$/.test(host) || /^0x[0-9a-f]+$/i.test(host) || host.startsWith('[') || host.includes(':')) return null
  if (!host.includes('.') || /(^|\.)(localhost|local|internal|intranet|lan|home|corp|localdomain)$/.test(host)) return null
  return url
}

/** Reads the start of a response body, up to a size */
async function readLimited(response: Response, maxBytes: number) {
  const reader = response.body?.getReader()
  if (!reader) return ''
  const chunks: Uint8Array[] = []
  let size = 0
  while (size < maxBytes) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    size += value.byteLength
  }
  await reader.cancel().catch(() => {})
  const all = new Uint8Array(Math.min(size, maxBytes))
  let offset = 0
  for (const chunk of chunks) {
    const part = chunk.subarray(0, all.length - offset)
    all.set(part, offset)
    offset += part.length
    if (offset >= all.length) break
  }
  return new TextDecoder().decode(all)
}

function extractMeta(html: string, ogProperty: string, tagName: string): string | null {
  // Try Open Graph first
  const ogRegex = new RegExp(`<meta[^>]*property=["']${ogProperty}["'][^>]*content=["']([^"']*)["']`, 'i')
  const ogMatch = html.match(ogRegex)
  if (ogMatch?.[1]) return ogMatch[1]

  // Try meta name
  const nameRegex = new RegExp(`<meta[^>]*name=["']${tagName}["'][^>]*content=["']([^"']*)["']`, 'i')
  const nameMatch = html.match(nameRegex)
  if (nameMatch?.[1]) return nameMatch[1]

  // Try title tag
  if (tagName === 'title') {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i)
    if (titleMatch?.[1]) return titleMatch[1].trim()
  }

  return null
}

function extractFavicon(html: string, baseUrl: URL): string | null {
  // Try to find favicon link
  const faviconRegex = /<link[^>]*rel=["'](?:icon|shortcut icon)["'][^>]*href=["']([^"']*)["']/i
  const match = html.match(faviconRegex)
  
  if (match?.[1]) {
    const faviconUrl = match[1]
    // Resolve relative URL
    if (faviconUrl.startsWith('http')) {
      return faviconUrl
    } else if (faviconUrl.startsWith('//')) {
      return `${baseUrl.protocol}${faviconUrl}`
    } else if (faviconUrl.startsWith('/')) {
      return `${baseUrl.origin}${faviconUrl}`
    } else {
      return `${baseUrl.origin}/${faviconUrl}`
    }
  }

  // Default favicon
  return `${baseUrl.origin}/favicon.ico`
}

function extractTikTokMeta(html: string): LinkMetadata {
  // Profile data embedded in the page
  const match = html.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/)
  if (match?.[1]) {
    try {
      const user = JSON.parse(match[1].trim())?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo?.user
      if (user) {
        const avatarUrl = user.avatarLarger || user.avatarMedium || user.avatarThumb || ''
        return {
          title: user.nickname || user.uniqueId || 'TikTok',
          description: user.signature || '',
          image: avatarUrl ? avatarUrl.replace(/\\u002F/g, '/') : '',
          favicon: 'https://www.tiktok.com/favicon.ico',
        }
      }
    } catch {
      // Fall back to the meta tags
    }
  }

  const ogTitle = extractMeta(html, 'og:title', 'title')
  if (ogTitle && ogTitle !== 'TikTok') {
    return {
      title: ogTitle,
      description: extractMeta(html, 'og:description', 'description') || '',
      image: extractMeta(html, 'og:image', 'image') || '',
      favicon: 'https://www.tiktok.com/favicon.ico',
    }
  }
  return { title: 'TikTok', description: '', image: '', favicon: 'https://www.tiktok.com/favicon.ico' }
}
