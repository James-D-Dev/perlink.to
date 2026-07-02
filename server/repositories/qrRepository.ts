import type { D1Database } from '@cloudflare/workers-types'
import type { QRCode, QRStyleConfig, CreateQRCodeInput, UpdateQRCodeInput } from '../types/qr'

function generateShortCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 7; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const defaultStyleConfig: QRStyleConfig = {
  dotsType: 'rounded',
  cornersSquareType: 'square',
  cornersDotType: 'square',
  foregroundColor: '#000000',
  backgroundColor: '#ffffff',
  useGradient: false,
  frameStyle: 'none',
  showBranding: true,
}

export class QRRepository {
  private db: D1Database

  constructor(db: D1Database) {
    this.db = db
  }

  private parseStyleConfig(json: string | null): QRStyleConfig {
    try {
      if (!json) return { ...defaultStyleConfig }
      const parsed = JSON.parse(json)
      return { ...defaultStyleConfig, ...parsed }
    } catch {
      return { ...defaultStyleConfig }
    }
  }

  private mapDbRowToQRCode(row: any): QRCode {
    return {
      id: row.id,
      userId: row.user_id,
      shortCode: row.short_code,
      name: row.name,
      destinationUrl: row.destination_url,
      title: row.title,
      styleConfig: this.parseStyleConfig(row.style_config),
      logoUrl: row.logo_url,
      scanCount: row.scan_count || 0,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      expiresAt: row.expires_at,
      isActive: row.is_active === 1,
    }
  }

  async create(userId: string, input: CreateQRCodeInput): Promise<QRCode> {
    const id = crypto.randomUUID()
    const shortCode = generateShortCode()
    const now = new Date().toISOString()

    // Check for unique short code
    let unique = false
    let attempts = 0
    let finalShortCode = shortCode
    
    while (!unique && attempts < 10) {
      const existing = await this.findByShortCode(finalShortCode)
      if (!existing) {
        unique = true
      } else {
        finalShortCode = generateShortCode()
        attempts++
      }
    }

    // Merge style config
    const styleConfig = JSON.stringify({
      ...defaultStyleConfig,
      ...input.styleConfig,
    })

    const stmt = this.db.prepare(`
      INSERT INTO qr_codes (
        id, user_id, short_code, name, destination_url, title,
        style_config, logo_url,
        created_at, updated_at, expires_at, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      userId,
      finalShortCode,
      input.name || null,
      input.destinationUrl,
      input.title || null,
      styleConfig,
      input.logoUrl || null,
      now,
      now,
      input.expiresAt || null,
      1
    )

    await stmt.run()
    return this.findById(id) as Promise<QRCode>
  }

  async findById(id: string): Promise<QRCode | null> {
    const result = await this.db.prepare(
      'SELECT * FROM qr_codes WHERE id = ?'
    ).bind(id).first()

    if (!result) return null
    return this.mapDbRowToQRCode(result)
  }

  async findByShortCode(shortCode: string): Promise<QRCode | null> {
    const result = await this.db.prepare(
      'SELECT * FROM qr_codes WHERE short_code = ?'
    ).bind(shortCode).first()

    if (!result) return null
    return this.mapDbRowToQRCode(result)
  }

  async findAllByUserId(userId: string, options?: { limit?: number; offset?: number }): Promise<{ codes: QRCode[]; total: number }> {
    const limit = options?.limit || 50
    const offset = options?.offset || 0

    // Get total count
    const countResult = await this.db.prepare(
      'SELECT COUNT(*) as count FROM qr_codes WHERE user_id = ?'
    ).bind(userId).first()
    const total = (countResult as any)?.count || 0

    // Get paginated results
    const result = await this.db.prepare(
      'SELECT * FROM qr_codes WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).bind(userId, limit, offset).all()

    const codes = (result.results || []).map((row: any) => this.mapDbRowToQRCode(row))
    return { codes, total }
  }

  async update(id: string, input: UpdateQRCodeInput): Promise<QRCode> {
    const now = new Date().toISOString()
    const updates: string[] = []
    const values: any[] = []

    if (input.name !== undefined) {
      updates.push('name = ?')
      values.push(input.name || null)
    }
    if (input.destinationUrl !== undefined) {
      updates.push('destination_url = ?')
      values.push(input.destinationUrl)
    }
    if (input.title !== undefined) {
      updates.push('title = ?')
      values.push(input.title || null)
    }
    if (input.styleConfig !== undefined) {
      updates.push('style_config = ?')
      values.push(JSON.stringify(input.styleConfig))
    }
    if (input.logoUrl !== undefined) {
      updates.push('logo_url = ?')
      values.push(input.logoUrl || null)
    }
    if (input.expiresAt !== undefined) {
      updates.push('expires_at = ?')
      values.push(input.expiresAt || null)
    }
    if (input.isActive !== undefined) {
      updates.push('is_active = ?')
      values.push(input.isActive ? 1 : 0)
    }

    updates.push('updated_at = ?')
    values.push(now)
    values.push(id)

    const stmt = this.db.prepare(
      `UPDATE qr_codes SET ${updates.join(', ')} WHERE id = ?`
    ).bind(...values)

    await stmt.run()
    return this.findById(id) as Promise<QRCode>
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM qr_codes WHERE id = ?').bind(id).run()
  }

  async updateByShortCode(shortCode: string, input: UpdateQRCodeInput): Promise<QRCode> {
    const existing = await this.findByShortCode(shortCode)
    if (!existing) throw new Error('QR code not found')
    return this.update(existing.id, input)
  }

  async deleteByShortCode(shortCode: string): Promise<void> {
    await this.db.prepare('DELETE FROM qr_codes WHERE short_code = ?').bind(shortCode).run()
  }

  async incrementScanCount(id: string): Promise<void> {
    await this.db.prepare(
      'UPDATE qr_codes SET scan_count = scan_count + 1 WHERE id = ?'
    ).bind(id).run()
  }

  // Analytics: Record a scan
  async recordScan(qrCodeId: string, scanData: {
    ip?: string
    userAgent?: string
    country?: string
    city?: string
    deviceType?: string
    referer?: string
  }): Promise<void> {
    const now = new Date().toISOString()
    
    const stmt = this.db.prepare(`
      INSERT INTO qr_scans (qr_code_id, scanned_at, ip, user_agent, country, city, device_type, referer)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      qrCodeId,
      now,
      scanData.ip || null,
      scanData.userAgent || null,
      scanData.country || null,
      scanData.city || null,
      scanData.deviceType || null,
      scanData.referer || null
    )

    await stmt.run()
    await this.incrementScanCount(qrCodeId)
  }

  // Get scan analytics
  async getScanStats(qrCodeId: string, days: number = 30): Promise<any> {
    const since = new Date()
    since.setDate(since.getDate() - days)
    const sinceStr = since.toISOString()

    // Total scans
    const totalResult = await this.db.prepare(
      'SELECT COUNT(*) as total FROM qr_scans WHERE qr_code_id = ? AND scanned_at > ?'
    ).bind(qrCodeId, sinceStr).first()

    // Daily breakdown
    const dailyResult = await this.db.prepare(`
      SELECT 
        date(scanned_at) as date,
        COUNT(*) as count
      FROM qr_scans 
      WHERE qr_code_id = ? AND scanned_at > ?
      GROUP BY date(scanned_at)
      ORDER BY date DESC
    `).bind(qrCodeId, sinceStr).all()

    // Device breakdown
    const deviceResult = await this.db.prepare(`
      SELECT 
        COALESCE(device_type, 'unknown') as device,
        COUNT(*) as count
      FROM qr_scans 
      WHERE qr_code_id = ? AND scanned_at > ?
      GROUP BY device_type
    `).bind(qrCodeId, sinceStr).all()

    // Country breakdown
    const countryResult = await this.db.prepare(`
      SELECT 
        COALESCE(country, 'unknown') as country,
        COUNT(*) as count
      FROM qr_scans 
      WHERE qr_code_id = ? AND scanned_at > ?
      GROUP BY country
    `).bind(qrCodeId, sinceStr).all()

    return {
      total: (totalResult as any)?.total || 0,
      daily: dailyResult.results || [],
      devices: deviceResult.results || [],
      countries: countryResult.results || [],
    }
  }
}
