import { defineEventHandler, readBody, createError } from 'h3'

interface LinkMetadata {
  title: string
  description: string
  image: string
  favicon: string
}

export default defineEventHandler(async (event): Promise<LinkMetadata> => {
  const body = await readBody(event)
  const { url } = body

  if (!url) {
    throw createError({
      statusCode: 400,
      statusMessage: 'URL is required'
    })
  }

  try {
    // Validate URL
    const validatedUrl = new URL(url)
    
    // Fetch webpage with proper headers
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
    }

    // TikTok needs special handling
    if (validatedUrl.hostname.includes('tiktok.com')) {
      headers['Referer'] = 'https://www.tiktok.com/'
      headers['Sec-Fetch-Dest'] = 'document'
      headers['Sec-Fetch-Mode'] = 'navigate'
      headers['Sec-Fetch-Site'] = 'none'
      headers['Sec-Fetch-User'] = '?1'
      headers['Upgrade-Insecure-Requests'] = '1'
    }

    console.log(`[crawl-link] Fetching: ${validatedUrl.toString()}`)

    const response = await fetch(validatedUrl.toString(), { headers })

    console.log(`[crawl-link] Response status: ${response.status}`)

    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        statusMessage: `Failed to fetch: ${response.statusText}`
      })
    }

    const html = await response.text()
    console.log(`[crawl-link] HTML length: ${html}`)

    // Parse metadata
    let metadata: LinkMetadata

    // Special handling for TikTok
    if (validatedUrl.hostname.includes('tiktok.com')) {
      metadata = extractTikTokMeta(html, validatedUrl)
    } else {
      metadata = {
        title: extractMeta(html, 'og:title', 'title') ?? validatedUrl.hostname,
        description: extractMeta(html, 'og:description', 'description') ?? '',
        image: extractMeta(html, 'og:image', 'image') ?? '',
        favicon: extractFavicon(html, validatedUrl) ?? ''
      }
    }

    return metadata
  } catch (error) {
    console.error('Crawl error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to crawl link'
    })
  }
})

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

function extractTikTokMeta(html: string, baseUrl: URL): LinkMetadata {
  console.log(`[crawl-link] TikTok HTML length: ${html.length}`)

  // Try to parse TikTok's embedded JSON data
  const tiktokDataRegex = /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__"[^>]*>([\s\S]*?)<\/script>/
  const match = html.match(tiktokDataRegex)

  console.log(`[crawl-link] Found __UNIVERSAL_DATA_FOR_REHYDRATION__: ${!!match}`)

  if (match?.[1]) {
    try {
      const jsonStr = match[1].trim()
      console.log(`[crawl-link] JSON length: ${jsonStr.length}`)
      const data = JSON.parse(jsonStr)

      // Log keys to debug structure
      console.log(`[crawl-link] Data keys: ${Object.keys(data).join(', ')}`)

      // Log __DEFAULT_SCOPE__ keys
      const defaultScope = data?.__DEFAULT_SCOPE__
      if (defaultScope) {
        console.log(`[crawl-link] __DEFAULT_SCOPE__ keys: ${Object.keys(defaultScope).join(', ')}`)

        // Try webapp.app-context
        const appContext = defaultScope['webapp.app-context']
        if (appContext) {
          console.log(`[crawl-link] webapp.app-context keys: ${Object.keys(appContext).join(', ')}`)
          if (appContext.user) {
            console.log(`[crawl-link] webapp.app-context.user:`, JSON.stringify(appContext.user).slice(0, 200))
          } else {
            console.log(`[crawl-link] webapp.app-context.user: undefined`)
          }
        }

        // Try webapp.user-detail
        const userDetail = defaultScope['webapp.user-detail']
        if (userDetail) {
          console.log(`[crawl-link] webapp.user-detail keys: ${Object.keys(userDetail).join(', ')}`)
          if (userDetail.userInfo?.user) {
            console.log(`[crawl-link] webapp.user-detail.userInfo.user:`, JSON.stringify(userDetail.userInfo.user).slice(0, 200))
          } else if (userDetail.user) {
            console.log(`[crawl-link] webapp.user-detail.user:`, JSON.stringify(userDetail.user).slice(0, 200))
          }
        }
      }

      // Try different paths for user data
      // webapp.user-detail has userInfo.user for this profile
      let user = data?.__DEFAULT_SCOPE__?.['webapp.user-detail']?.userInfo?.user

      if (user) {
        console.log(`[crawl-link] Found user: ${user.nickname || user.uniqueId}`)
        const avatarUrl = user.avatarLarger || user.avatarMedium || user.avatarThumb || ''
        return {
          title: user.nickname || user.uniqueId || 'TikTok',
          description: user.signature || '',
          image: avatarUrl ? avatarUrl.replace(/\\u002F/g, '/') : '',
          favicon: 'https://www.tiktok.com/favicon.ico'
        }
      } else {
        console.log(`[crawl-link] No user found in data structure`)
      }
    } catch (e) {
      console.log(`[crawl-link] JSON parse error: ${e}`)
    }
  }

  // Try og:meta tags as fallback
  const ogTitle = extractMeta(html, 'og:title', 'title')
  const ogDesc = extractMeta(html, 'og:description', 'description')
  const ogImage = extractMeta(html, 'og:image', 'image')

  if (ogTitle && ogTitle !== 'TikTok') {
    console.log(`[crawl-link] Using OG meta: ${ogTitle}`)
    return {
      title: ogTitle,
      description: ogDesc || '',
      image: ogImage || '',
      favicon: 'https://www.tiktok.com/favicon.ico'
    }
  }

  console.log(`[crawl-link] Fallback to default`)
  // Fallback to default TikTok info
  return {
    title: 'TikTok',
    description: '',
    image: '',
    favicon: 'https://www.tiktok.com/favicon.ico'
  }
}
