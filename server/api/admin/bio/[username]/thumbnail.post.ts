import { BioRepository } from '../../../../repositories/bioRepository'

// Stores a snapshot of the owner's page or 3D room, captured in their browser
export default defineEventHandler(async (event) => {
  const user = event.context.user
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const username = getRouterParam(event, 'username')
  const bioRepo = new BioRepository(event)
  const bioPage = username ? await bioRepo.findByUsername(username) : null
  if (!bioPage) throw createError({ statusCode: 404, statusMessage: 'Bio page not found' })
  if (bioPage.userId !== user.id) throw createError({ statusCode: 403, statusMessage: 'Forbidden' })

  const env = event.context.cloudflare?.env as unknown as (Cloudflare.Env & { AVATARS_BUCKET: R2Bucket; AVATARS_PUBLIC_URL?: string }) | undefined
  if (!env?.AVATARS_BUCKET) throw createError({ statusCode: 503, statusMessage: 'Storage not configured' })

  const formData = await readFormData(event)
  const file = formData.get('file')
  const kind = formData.get('kind') === 'room' ? 'room' : 'page'
  if (!(file instanceof File)) throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  if (!['image/webp', 'image/jpeg', 'image/png'].includes(file.type)) throw createError({ statusCode: 400, statusMessage: 'Invalid file type' })
  // A phone-sized snapshot is well under this
  if (file.size > 2 * 1024 * 1024) throw createError({ statusCode: 400, statusMessage: 'File too large' })

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/jpeg' ? 'jpg' : 'webp'
  const prefix = `${user.id}/${bioPage.id}/thumb_${kind}_`
  const key = `${prefix}${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}.${ext}`

  await env.AVATARS_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000' },
  })
  // Keep only the newest snapshot of each kind
  const listed = await env.AVATARS_BUCKET.list({ prefix })
  await Promise.all(listed.objects.map(o => o.key).filter(k => k !== key).map(k => env.AVATARS_BUCKET.delete(k)))

  const url = `${env.AVATARS_PUBLIC_URL?.replace(/\/$/, '') ?? ''}/${key}`
  try {
    await bioRepo.setThumbnail(bioPage.id, kind, url)
  } catch (error) {
    // Before migration 0023: the image is stored but not linked yet
    console.error('[POST thumbnail] not saved to the page', error)
    return { url, saved: false }
  }
  return { url, saved: true }
})
