// The site's uploaded images, from the same origin as the app. Used when the
// editor snapshots a page in the browser: images on the media domain can't be
// read there without CORS.
export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, 'key')
  const env = event.context.cloudflare?.env as unknown as (Cloudflare.Env & { AVATARS_BUCKET: R2Bucket }) | undefined
  if (!key || !env?.AVATARS_BUCKET || key.includes('..')) throw createError({ statusCode: 404 })

  const object = await env.AVATARS_BUCKET.get(key)
  if (!object) throw createError({ statusCode: 404 })

  setHeader(event, 'Content-Type', object.httpMetadata?.contentType || 'application/octet-stream')
  setHeader(event, 'Cache-Control', 'public, max-age=86400')
  return object.body
})
