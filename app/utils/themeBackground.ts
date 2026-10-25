import type { CSSProperties } from 'vue'
import type { ThemeBackground } from '~/types/bio'

type Pattern = NonNullable<ThemeBackground['pattern']>['id']

/** Pattern tiles: an image layer and its repeat size, in a given ink colour */
export const PATTERNS: Record<Pattern, (ink: string) => { image: string; size: string }> = {
  dots: ink => ({ image: `radial-gradient(${ink} 1.2px, transparent 1.6px)`, size: '18px 18px' }),
  grid: ink => ({ image: `linear-gradient(${ink} 1px, transparent 1px), linear-gradient(90deg, ${ink} 1px, transparent 1px)`, size: '24px 24px' }),
  lines: ink => ({ image: `repeating-linear-gradient(0deg, ${ink} 0 1px, transparent 1px 22px)`, size: 'auto' }),
  checker: ink => ({ image: `conic-gradient(${ink} 25%, transparent 0 50%, ${ink} 0 75%, transparent 0)`, size: '32px 32px' }),
  diagonal: ink => ({ image: `repeating-linear-gradient(45deg, ${ink} 0 1.5px, transparent 1.5px 14px)`, size: 'auto' }),
  waves: ink => ({ image: `radial-gradient(circle at 50% 0, transparent 9px, ${ink} 9.5px 10.5px, transparent 11px)`, size: '22px 12px' }),
}

/** Faint version of a colour for pattern lines */
function ink(color: string) {
  return `color-mix(in srgb, ${color} 12%, transparent)`
}

/** The colour layers of a mesh gradient: three soft blobs over a base */
function meshLayers(from = '#ffd6e8', via = '#c9b8ff', to = '#a8e6ff') {
  return [
    `radial-gradient(at 12% 18%, ${from} 0, transparent 55%)`,
    `radial-gradient(at 88% 12%, ${via} 0, transparent 52%)`,
    `radial-gradient(at 72% 88%, ${to} 0, transparent 55%)`,
    `radial-gradient(at 20% 92%, ${via} 0, transparent 45%)`,
  ]
}

/**
 * CSS for a page background: colour, linear or mesh gradient, image, and an
 * optional pattern on top. Shared by the site and every preview of it.
 */
/** The background properties of an inline style */
export type ThemeBackgroundStyle = Pick<CSSProperties, 'backgroundColor' | 'backgroundImage' | 'backgroundSize' | 'backgroundPosition' | 'backgroundAttachment'>

export function backgroundCss(bg: ThemeBackground | undefined, fallbackColor: string, textColor = '#111111'): ThemeBackgroundStyle {
  if (!bg) return { backgroundColor: fallbackColor }
  if (bg.type === 'image' && bg.imageUrl) {
    return {
      backgroundImage: bg.imageOverlay
        ? `linear-gradient(${bg.imageOverlay}, ${bg.imageOverlay}), url(${bg.imageUrl})`
        : `url(${bg.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
    }
  }

  const images: string[] = []
  const sizes: string[] = []
  if (bg.pattern && PATTERNS[bg.pattern.id]) {
    const tile = PATTERNS[bg.pattern.id](bg.pattern.color ? `color-mix(in srgb, ${bg.pattern.color} 20%, transparent)` : ink(textColor))
    images.push(tile.image)
    // Two-layer patterns repeat their size for each layer
    const layers = tile.image.split(/\),\s*(?=[a-z-]+-gradient\()/).length
    for (let i = 0; i < layers; i++) sizes.push(tile.size)
  }

  let base = bg.color || fallbackColor
  if (bg.type === 'gradient' && bg.gradient) {
    const { angle = 160, from, via, to } = bg.gradient
    if (bg.gradient.style === 'mesh') {
      const layers = meshLayers(from, via, to)
      images.push(...layers)
      sizes.push(...layers.map(() => 'auto'))
      base = bg.color || '#ffffff'
    } else {
      images.push(`linear-gradient(${angle}deg, ${via ? `${from}, ${via}, ${to}` : `${from}, ${to}`})`)
      sizes.push('auto')
    }
  }

  if (!images.length) return { backgroundColor: base }
  return { backgroundColor: base, backgroundImage: images.join(', '), backgroundSize: sizes.join(', ') }
}
