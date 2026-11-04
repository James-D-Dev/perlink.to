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

/** Mixes a hex colour towards black (amount < 0) or white (amount > 0) */
function shade(hex: string, amount: number) {
  const n = /^#[0-9a-f]{6}$/i.test(hex) ? Number.parseInt(hex.slice(1), 16) : 0x1C1A17
  const mix = (c: number) => Math.round(amount < 0 ? c * (1 + amount) : c + (255 - c) * amount)
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(mix)
  return `rgb(${r}, ${g}, ${b})`
}

const SW = 1024
const SH = 576

/**
 * A promo-screen slide for a product (16:9): its photo on the left, name,
 * price and a "shop now" button on a background in the shop's colour.
 */
export async function drawProductSlide(product: ShopProduct, accent: string, labels: { soldOut: string; shopNow: string }): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  canvas.width = SW
  canvas.height = SH
  const ctx = canvas.getContext('2d')!
  const bg = ctx.createLinearGradient(0, 0, SW, SH)
  bg.addColorStop(0, shade(accent, -0.55))
  bg.addColorStop(1, shade(accent, -0.15))
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, SW, SH)
  // Soft light blobs
  for (const [x, y, r, a] of [[900, 60, 260, 0.14], [620, 560, 200, 0.1], [1000, 520, 120, 0.08]] as const) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(255,255,255,${a})`)
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, SW, SH)
  }

  // Photo in a rounded white frame
  const P = 456
  const px = 52
  const py = (SH - P) / 2
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.35)'
  ctx.shadowBlur = 40
  ctx.shadowOffsetY = 16
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(px - 10, py - 10, P + 20, P + 20, 34)
  ctx.fill()
  ctx.restore()
  ctx.save()
  ctx.beginPath()
  ctx.roundRect(px, py, P, P, 26)
  ctx.clip()
  const img = product.imageUrl ? await loadImage(product.imageUrl) : null
  if (img) {
    const scale = Math.max(P / img.width, P / img.height)
    ctx.drawImage(img, px + (P - img.width * scale) / 2, py + (P - img.height * scale) / 2, img.width * scale, img.height * scale)
  } else {
    ctx.fillStyle = '#f3efe9'
    ctx.fillRect(px, py, P, P)
    ctx.font = '160px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🛍️', px + P / 2, py + P / 2)
  }
  ctx.restore()

  // Words on the right
  const x = px + P + 56
  const maxW = SW - x - 48
  let y = 150
  const discount = product.price && product.comparePrice && product.comparePrice > product.price
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0
  const badge = product.soldOut ? labels.soldOut : discount ? `-${discount}%` : product.tag?.trim()
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  if (badge) {
    ctx.font = '800 34px Inter, system-ui, sans-serif'
    const bw = ctx.measureText(badge).width + 40
    ctx.fillStyle = product.soldOut ? '#52525b' : discount ? '#ef4444' : '#ffffff'
    ctx.beginPath()
    ctx.roundRect(x, y - 32, bw, 64, 32)
    ctx.fill()
    ctx.fillStyle = product.soldOut || discount ? '#ffffff' : shade(accent, -0.3)
    ctx.fillText(badge, x + 20, y + 2)
    y += 80
  }
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 50px Inter, system-ui, sans-serif'
  const lines = wrap(ctx, product.name, maxW, 3)
  lines.forEach((line, i) => ctx.fillText(line, x, y + 40 + i * 60))
  y += 40 + lines.length * 60 + 20
  if (product.price) {
    ctx.font = '900 72px Inter, system-ui, sans-serif'
    const priceText = formatVnd(product.price)
    ctx.fillText(priceText, x, y + 30)
    if (discount) {
      ctx.fillStyle = 'rgba(255,255,255,0.65)'
      ctx.font = '600 32px Inter, system-ui, sans-serif'
      const old = formatVnd(product.comparePrice!)
      ctx.fillText(old, x, y + 78)
      ctx.fillRect(x, y + 66, ctx.measureText(old).width, 3)
    }
  }
  // "Shop now" button at the bottom
  ctx.font = '800 32px Inter, system-ui, sans-serif'
  const cta = `${labels.shopNow} →`
  const cw = ctx.measureText(cta).width + 56
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(x, SH - 132, cw, 76, 38)
  ctx.fill()
  ctx.fillStyle = shade(accent, -0.35)
  ctx.textBaseline = 'middle'
  ctx.fillText(cta, x + 28, SH - 92)
  return canvas
}
