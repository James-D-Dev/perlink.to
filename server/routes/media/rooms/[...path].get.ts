// Serves room photos from R2 on the site's own origin, so the 3D scene can
// load them as textures without CORS. Only keys under rooms/ are exposed.
export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, 'path') || ''
  if (!/^[\w-]+\/[\w-]+\.(jpg|png|webp)$/.test(path)) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  const env = event.context.cloudflare?.env as unknown as { AVATARS_BUCKET?: R2Bucket } | undefined
  if (!env?.AVATARS_BUCKET) {
    throw createError({ statusCode: 503, statusMessage: 'Storage not configured' })
  }

  const object = await env.AVATARS_BUCKET.get(`rooms/${path}`)
  if (!object) {
    throw createError({ statusCode: 404, statusMessage: 'Not found' })
  }

  setResponseHeaders(event, {
    'Content-Type': object.httpMetadata?.contentType || 'image/jpeg',
    'Cache-Control': 'public, max-age=31536000, immutable',
    'ETag': object.httpEtag,
  })
  return object.body
})
