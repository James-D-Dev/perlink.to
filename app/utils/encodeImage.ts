/**
 * A canvas as WebP, a third lighter than JPEG at the same look. Browsers that
 * can't write WebP (they hand back a PNG instead) get JPEG, as before.
 */
export function encodeImage(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  const toBlob = (type: string) => new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality))
  return toBlob('image/webp').then(async (blob) => {
    if (blob?.type === 'image/webp') return blob
    const jpeg = await toBlob('image/jpeg')
    if (!jpeg) throw new Error('Canvas toBlob failed')
    return jpeg
  })
}

/** The uploaded file's name and type, matching what encodeImage made */
export function encodedFile(blob: Blob, name: string) {
  const ext = blob.type === 'image/webp' ? 'webp' : 'jpg'
  return new File([blob], name.replace(/\.\w+$/, `.${ext}`), { type: blob.type })
}
