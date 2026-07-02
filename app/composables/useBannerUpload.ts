const MAX_WIDTH = 1200
const QUALITY = 0.88

function resizeBanner(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      const TARGET_HEIGHT = Math.round(MAX_WIDTH / 3)

      // Scale so width fits MAX_WIDTH, then crop height top-center
      const scale = MAX_WIDTH / img.width
      const scaledWidth = MAX_WIDTH
      const scaledHeight = Math.round(img.height * scale)

      // sx/sy in source image for top-center crop
      const cropHeight = Math.min(img.height, Math.round(TARGET_HEIGHT / scale))
      const sx = 0
      const sy = 0

      const canvas = document.createElement('canvas')
      canvas.width = scaledWidth
      canvas.height = Math.min(scaledHeight, TARGET_HEIGHT)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, sx, sy, img.width, cropHeight, 0, 0, scaledWidth, canvas.height)

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob)
          else reject(new Error('Canvas toBlob failed'))
        },
        'image/jpeg',
        QUALITY,
      )
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

export function useBannerUpload() {
  const uploading = ref(false)
  const error = ref<string | null>(null)

  async function upload(file: File, bioPageId: string): Promise<string> {
    uploading.value = true
    error.value = null

    try {
      const resized = await resizeBanner(file)
      const resizedFile = new File([resized], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })

      const formData = new FormData()
      formData.append('file', resizedFile)
      formData.append('bioPageId', bioPageId)

      const res = await $fetch<{ url: string }>('/api/upload/banner', {
        method: 'POST',
        body: formData,
      })

      return res.url
    } catch (e: any) {
      error.value = e?.data?.statusMessage ?? e?.message ?? 'Upload failed'
      throw e
    } finally {
      uploading.value = false
    }
  }

  return { upload, uploading, error }
}
