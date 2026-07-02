const MAX_WIDTH = 600
const QUALITY = 0.88

function resizeAlbumImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)

      // Calculate dimensions to fit within MAX_WIDTH while maintaining aspect ratio
      let width = img.width
      let height = img.height

      if (width > MAX_WIDTH) {
        const scale = MAX_WIDTH / width
        width = MAX_WIDTH
        height = Math.round(img.height * scale)
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)

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

export function useImageAlbumUpload() {
  const uploading = ref(false)
  const error = ref<string | null>(null)
  const progress = ref(0)

  async function uploadImage(file: File, bioPageId: string): Promise<string> {
    const resized = await resizeAlbumImage(file)
    const resizedFile = new File([resized], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })

    const formData = new FormData()
    formData.append('file', resizedFile)
    formData.append('bioPageId', bioPageId)

    const res = await $fetch<{ url: string }>('/api/upload/image-album', {
      method: 'POST',
      body: formData,
    })

    return res.url
  }

  async function uploadMultiple(
    files: File[],
    bioPageId: string,
    existingImages: string[] = [],
    maxImages: number = 6,
  ): Promise<string[]> {
    uploading.value = true
    error.value = null
    progress.value = 0

    try {
      const remainingSlots = maxImages - existingImages.length
      const filesToUpload = files.slice(0, remainingSlots)

      const uploadedUrls: string[] = []
      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i]!
        const url = await uploadImage(file, bioPageId)
        uploadedUrls.push(url)
        progress.value = Math.round(((i + 1) / filesToUpload.length) * 100)
      }

      return [...existingImages, ...uploadedUrls].slice(0, maxImages)
    } catch (e: any) {
      error.value = e?.data?.statusMessage ?? e?.message ?? 'Upload failed'
      throw e
    } finally {
      uploading.value = false
      progress.value = 0
    }
  }

  return { uploadMultiple, uploading, error, progress }
}
