// Snapshots of a site, taken in the owner's browser and stored as the site's
// thumbnail, so lists show a light image instead of rendering the page.

/** Phone screen size the page preview renders at (see BioPreview) */
export const SNAPSHOT_WIDTH = 375
/** 4:5, the shape of the site cards */
export const SNAPSHOT_HEIGHT = 469

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// Uploaded images live on the media domain, which doesn't allow reading them
// from the browser; fetch those through the app's own /api/media instead
async function sameOriginImage(url: string): Promise<string | false> {
  try {
    const parsed = new URL(url, location.href)
    if (parsed.origin === location.origin || !/^media\./.test(parsed.hostname)) return false
    const res = await fetch(`/api/media${parsed.pathname}`)
    if (!res.ok) return false
    return await blobToDataUrl(await res.blob())
  } catch {
    return false
  }
}

/** Stores a picture as the site's page or room thumbnail */
export async function uploadSnapshot(username: string, kind: 'page' | 'room', blob: Blob) {
  const form = new FormData()
  form.append('file', new File([blob], `${kind}.webp`, { type: blob.type || 'image/webp' }))
  form.append('kind', kind)
  return await $fetch<{ url: string; saved: boolean }>(`/api/admin/bio/${username}/thumbnail`, { method: 'POST', body: form })
}

/** Picture of the top of a page preview (a BioPageView element), as it looks on a phone */
export async function snapshotPage(username: string, element: HTMLElement) {
  const { domToBlob } = await import('modern-screenshot')
  // Editor-only marks (selected outline, empty-block placeholders) stay out of the picture
  element.classList.add('pv-capturing')
  try {
    const blob = await domToBlob(element, {
      width: SNAPSHOT_WIDTH,
      height: SNAPSHOT_HEIGHT,
      scale: 1.5,
      type: 'image/webp',
      quality: 0.82,
      // The preview is scaled down and scrolled inside its phone frame
      style: { transform: 'none', overflow: 'hidden', width: `${SNAPSHOT_WIDTH}px`, height: `${SNAPSHOT_HEIGHT}px` },
      fetchFn: sameOriginImage,
      timeout: 15000,
    })
    return await uploadSnapshot(username, 'page', blob)
  } finally {
    element.classList.remove('pv-capturing')
  }
}
