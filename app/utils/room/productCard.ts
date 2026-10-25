import type { ProductItem } from '~/types/bio'
import { formatVnd } from '#shared/plans'

// The card on a product stand in the 3D room: photo, name and price drawn on
// a canvas, used as the stand's texture.

export type ShopProduct = Pick<ProductItem, 'id' | 'name' | 'price' | 'comparePrice' | 'imageUrl' | 'soldOut' | 'tag'>

const W = 512
const H = 704
const PHOTO = 470

/** Uploaded images live on the media domain without CORS: read them through /api/media */
function readableUrl(url: string) {
  try {
    const parsed = new URL(url, location.href)
    if (parsed.origin !== location.origin && /^media\./.test(parsed.hostname)) return `/api/media${parsed.pathname}`
    return parsed.href
  } catch {
    return url
  }
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = readableUrl(url)
  })
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number) {
  const words = text.split(/\s+/)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width <= maxWidth) {
      line = next
      continue
    }
    if (line) lines.push(line)
    line = word
    if (lines.length === maxLines) break
  }
  if (lines.length < maxLines && line) lines.push(line)
  if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
    let last = lines[maxLines - 1]!
    while (last.length > 1 && ctx.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1)
    lines[maxLines - 1] = `${last}…`
  }
  return lines
}

/** Draws a product card; resolves once its photo has loaded (or failed) */
export async function drawProductCard(product: ShopProduct, accent: string, soldOutLabel: string): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, H)

  // Photo, cropped to cover the top
  const img = product.imageUrl ? await loadImage(product.imageUrl) : null
  if (img) {
    const scale = Math.max(W / img.width, PHOTO / img.height)
    const w = img.width * scale
    const h = img.height * scale
    ctx.drawImage(img, (W - w) / 2, (PHOTO - h) / 2, w, h)
  } else {
    ctx.fillStyle = '#f3efe9'
    ctx.fillRect(0, 0, W, PHOTO)
    ctx.font = '140px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🛍️', W / 2, PHOTO / 2)
  }

  // Discount or label badge
  const discount = product.price && product.comparePrice && product.comparePrice > product.price
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0
  const badge = discount ? `-${discount}%` : product.tag?.trim()
  if (badge) {
    ctx.font = '700 34px Inter, system-ui, sans-serif'
    const bw = ctx.measureText(badge).width + 36
    ctx.fillStyle = discount ? '#ef4444' : accent
    ctx.beginPath()
    ctx.roundRect(22, 22, bw, 58, 29)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(badge, 40, 52)
  }

  // Name and price
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#1c1a17'
  ctx.font = '700 36px Inter, system-ui, sans-serif'
  const lines = wrap(ctx, product.name, W - 56, 2)
  lines.forEach((line, i) => ctx.fillText(line, 28, PHOTO + 56 + i * 44))
  if (product.price) {
    ctx.fillStyle = accent
    ctx.font = '800 44px Inter, system-ui, sans-serif'
    const priceText = formatVnd(product.price)
    ctx.fillText(priceText, 28, H - 34)
    if (discount) {
      const x = 28 + ctx.measureText(priceText).width + 16
      ctx.fillStyle = '#9b948c'
      ctx.font = '500 28px Inter, system-ui, sans-serif'
      const old = formatVnd(product.comparePrice!)
      ctx.fillText(old, x, H - 36)
      const ow = ctx.measureText(old).width
      ctx.fillRect(x, H - 46, ow, 3)
    }
  }

  if (product.soldOut) {
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fillRect(0, 0, W, H)
    ctx.fillStyle = '#1c1a17'
    ctx.font = '800 54px Inter, system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(soldOutLabel, W / 2, PHOTO / 2 + 20)
  }
  return canvas
}

/** Changes when anything drawn on the card changes */
export const productSignature = (p: ShopProduct | undefined) =>
  p ? [p.name, p.price ?? '', p.comparePrice ?? '', p.imageUrl ?? '', p.soldOut ? 1 : 0, p.tag ?? ''].join('|') : ''
