// Photos for 3D room picture frames. Returned as a same-origin /media path so
// WebGL can use them as textures (the public R2 domain sends no CORS headers).
export default defineEventHandler(async (event) => {
  const user = event.context.user

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const env = event.context.cloudflare?.env as unknown as { AVATARS_BUCKET?: R2Bucket } | undefined

  if (!env?.AVATARS_BUCKET) {
    throw createError({ statusCode: 503, statusMessage: 'Storage not configured' })
  }

  const formData = await readFormData(event)
  const file = formData.get('file') as File | null

  if (!file || !(file instanceof File)) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file type. Allowed: JPEG, PNG, WebP' })
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw createError({ statusCode: 400, statusMessage: 'File too large. Max 5MB' })
  }

  const ext = file.type === 'image/webp' ? 'webp' : file.type === 'image/png' ? 'png' : 'jpg'
  const hash = crypto.randomUUID().replace(/-/g, '').slice(0, 16)
  const key = `rooms/${user.id}/${hash}.${ext}`

  await env.AVATARS_BUCKET.put(key, await file.arrayBuffer(), {
    httpMetadata: {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000, immutable',
    },
    customMetadata: {
      uploadedBy: String(user.id),
      originalName: file.name,
    },
  })

  return { url: `/media/${key}`, key }
})
