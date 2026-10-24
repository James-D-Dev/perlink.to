import qrcode from 'qrcode-generator'

// Printable QR card (A6 proportions) drawn as SVG, so it stays sharp in print

export interface QrCardOptions {
  url: string
  title: string
  cta: string
  caption: string
  background: string
  foreground: string
  muted: string
}

export const QR_CARD_WIDTH = 600
export const QR_CARD_HEIGHT = 846

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]!)

/** QR modules as one SVG path, scaled to `size` px */
function qrPath(url: string, size: number) {
  const qr = qrcode(0, 'M')
  qr.addData(url)
  qr.make()
  const count = qr.getModuleCount()
  const cell = size / count
  let d = ''
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) d += `M${(col * cell).toFixed(2)} ${(row * cell).toFixed(2)}h${cell.toFixed(2)}v${cell.toFixed(2)}h-${cell.toFixed(2)}z`
    }
  }
  return d
}

export function qrCardSvg(o: QrCardOptions) {
  const W = QR_CARD_WIDTH
  const H = QR_CARD_HEIGHT
  const qrSize = 360
  const pad = 26
  const qrX = (W - qrSize) / 2
  const qrY = 250
  // Shrink long names so they fit on one line
  const titleSize = Math.max(24, Math.min(46, Math.floor(980 / Math.max(o.title.length, 1))))
  const font = 'Inter, Helvetica, Arial, sans-serif'
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${o.background}"/>
<text x="${W / 2}" y="132" text-anchor="middle" font-family="${font}" font-size="${titleSize}" font-weight="600" letter-spacing="-0.5" fill="${o.foreground}">${escapeXml(o.title)}</text>
<text x="${W / 2}" y="196" text-anchor="middle" font-family="${font}" font-size="27" fill="${o.muted}">${escapeXml(o.cta)}</text>
<rect x="${qrX - pad}" y="${qrY - pad}" width="${qrSize + pad * 2}" height="${qrSize + pad * 2}" rx="28" fill="#ffffff"/>
<g transform="translate(${qrX} ${qrY})"><path d="${qrPath(o.url, qrSize)}" fill="#0c0b0a"/></g>
<text x="${W / 2}" y="${qrY + qrSize + pad + 78}" text-anchor="middle" font-family="${font}" font-size="26" font-weight="500" fill="${o.foreground}">${escapeXml(o.caption)}</text>
<text x="${W / 2}" y="${H - 52}" text-anchor="middle" font-family="${font}" font-size="18" fill="${o.muted}">Made with Perlink</text>
</svg>`
}

/** Render the SVG to a PNG blob at print resolution */
export async function qrCardPng(svg: string, scale = 3): Promise<Blob> {
  const img = new Image()
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  await img.decode()
  const canvas = document.createElement('canvas')
  canvas.width = QR_CARD_WIDTH * scale
  canvas.height = QR_CARD_HEIGHT * scale
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
  return await new Promise((resolve, reject) => canvas.toBlob(b => (b ? resolve(b) : reject(new Error('PNG export failed'))), 'image/png'))
}
