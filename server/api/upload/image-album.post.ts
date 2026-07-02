export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const env = event.context.cloudflare?.env as (Cloudflare.Env & { AVATARS_BUCKET: R2Bucket; AVATARS_PUBLIC_URL?: string }) | undefined

  if (!env?.AVATARS_BUCKET) {
    throw createError({ statusCode: 503, statusMessage: 'Storage not configured' })
  }

  const formData = await readFormData(event)
  const file = formData.get('file') as File | null
  const bioPageId = formData.get('bioPageId') as string | null

  if (!file || !(file instanceof File)) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  if (!bioPageId) {
    throw createError({ statusCode: 400, statusMessage: 'bioPageId is required' })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' })
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw createError({ statusCode: 400, statusMessage: 'File too large. Max 5MB' })
  }

  const ext = file.type === 'image/webp' ? 'webp'
    : file.type === 'image/gif' ? 'gif'
    : file.type === 'image/png' ? 'png'
    : 'jpg'

  const hash = crypto.randomUUID().replace(/-/g, '').slice(0, 16)
  const key = `${user.id}/${bioPageId}/album/${hash}.${ext}`

  const arrayBuffer = await file.arrayBuffer()

  await env.AVATARS_BUCKET.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000',
    },
    customMetadata: {
      uploadedBy: String(user.id),
      originalName: file.name,
    },
  })

  const publicBaseUrl = env.AVATARS_PUBLIC_URL?.replace(/\/$/, '') ?? ''
  const url = `${publicBaseUrl}/${key}`

  return { url, key }
})
