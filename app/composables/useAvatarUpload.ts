const MAX_SIZE = 600
const QUALITY = 0.85

function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // Calculate crop dimensions for top-center square
      const minDim = Math.min(img.width, img.height)
      const sx = (img.width - minDim) / 2
      const sy = 0

      const canvas = document.createElement('canvas')
      canvas.width = MAX_SIZE
      canvas.height = MAX_SIZE
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, MAX_SIZE, MAX_SIZE)

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

export function useAvatarUpload() {
  const uploading = ref(false)
  const error = ref<string | null>(null)

  async function upload(file: File, bioPageId: string): Promise<string> {
    uploading.value = true
    error.value = null

    try {
      const resized = await resizeImage(file)
      const resizedFile = new File([resized], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })

      const formData = new FormData()
      formData.append('file', resizedFile)
      formData.append('bioPageId', bioPageId)

      const res = await $fetch<{ url: string }>('/api/upload/avatar', {
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
