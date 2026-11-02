// Template sample photos come in four widths: -xs (240), -sm (480), -md (800)
// and the full one (up to 1000). These give the browser the choice, so a
// phone doesn't download a desktop banner. Other pictures (owners' uploads)
// get nothing extra.

const TEMPLATE_PHOTO = /^(\/images\/templates\/photos\/[a-z0-9-]+?)(-(?:xs|sm|md))?\.(?:webp|jpg)$/

/** srcset for a template photo shown as a banner or as an avatar */
export function templatePhotoSrcset(url: string | undefined | null, use: 'banner' | 'avatar'): string | undefined {
  const base = url?.match(TEMPLATE_PHOTO)?.[1]
  if (!base) return undefined
  return use === 'avatar'
    ? `${base}-xs.webp 240w, ${base}-sm.webp 480w`
    : `${base}-sm.webp 480w, ${base}-md.webp 800w, ${base}.webp 1000w`
}
