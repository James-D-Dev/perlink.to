import type { H3Event } from 'h3'
import { getDB } from '../utils/db'

export interface Click {
  id: number
  link_id: string
  ip: string | null
  user_agent: string | null
  referer: string | null
  country: string | null
  city: string | null
  device_type: string | null
  clicked_at: string
}

export interface CreateClickInput {
  link_id: string
  ip?: string | null
  user_agent?: string | null
  referer?: string | null
  country?: string | null
  city?: string | null
  device_type?: string | null
}

export interface ClickAnalytics {
  total_clicks: number
  unique_ips: number
  by_country: { country: string; count: number }[]
  by_device: { device_type: string; count: number }[]
  by_date: { date: string; count: number }[]
}

export class ClickRepository {
  private db: any
  private event: H3Event

  constructor(event: H3Event) {
    this.event = event
    this.db = getDB(event)
  }

  private mapDbRowToClick(row: any): Click {
    return {
      id: row.id,
      link_id: row.link_id,
      ip: row.ip,
      user_agent: row.user_agent,
      referer: row.referer,
      country: row.country,
      city: row.city,
      device_type: row.device_type,
      clicked_at: row.clicked_at
    }
  }

  async create(input: CreateClickInput): Promise<Click> {
    const now = new Date().toISOString()

    const stmt = this.db.prepare(`
      INSERT INTO clicks (link_id, ip, user_agent, referer, country, city, device_type, clicked_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      input.link_id,
      input.ip || null,
      input.user_agent || null,
      input.referer || null,
      input.country || null,
      input.city || null,
      input.device_type || null,
      now
    )

    const result = await stmt.run()
    
    // Get the last inserted row
    const lastStmt = this.db.prepare(`
      SELECT * FROM clicks WHERE link_id = ? ORDER BY id DESC LIMIT 1
    `).bind(input.link_id)
    
    const lastClick = await lastStmt.first()
    return this.mapDbRowToClick(lastClick)
  }

  async findByLinkId(
    linkId: string,
    options: {
      page?: number
      perPage?: number
      startDate?: string
      endDate?: string
    } = {}
  ): Promise<{ clicks: Click[], total: number }> {
    const {
      page = 0,
      perPage = 50,
      startDate,
      endDate
    } = options

    const offset = page * perPage
    const conditions: string[] = ['link_id = ?']
    const values: any[] = [linkId]

    if (startDate) {
      conditions.push('clicked_at >= ?')
      values.push(startDate + 'T00:00:00.000Z')
    }
    if (endDate) {
      conditions.push('clicked_at <= ?')
      values.push(endDate + 'T23:59:59.999Z')
    }

    const whereClause = conditions.join(' AND ')

    // Get total count
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM clicks WHERE ${whereClause}
    `).bind(...values)

    const countResult = await countStmt.first()
    const total = countResult?.count || 0

    // Get paginated data
    const dataStmt = this.db.prepare(`
      SELECT * FROM clicks 
      WHERE ${whereClause}
      ORDER BY clicked_at DESC
      LIMIT ? OFFSET ?
    `).bind(...values, perPage, offset)

    const result = await dataStmt.all()
    const clicks = (result.results || []).map((row: any) => this.mapDbRowToClick(row))

    return { clicks, total }
  }

  async getAnalytics(linkId: string, startDate?: string, endDate?: string): Promise<ClickAnalytics> {
    const conditions: string[] = ['link_id = ?']
    const values: any[] = [linkId]

    if (startDate) {
      conditions.push('clicked_at >= ?')
      values.push(startDate + 'T00:00:00.000Z')
    }
    if (endDate) {
      conditions.push('clicked_at <= ?')
      values.push(endDate + 'T23:59:59.999Z')
    }

    const whereClause = conditions.join(' AND ')

    // Total clicks
    const totalStmt = this.db.prepare(`
      SELECT COUNT(*) as total FROM clicks WHERE ${whereClause}
    `).bind(...values)
    const totalResult = await totalStmt.first()
    const total_clicks = totalResult?.total || 0

    // Unique IPs
    const uniqueStmt = this.db.prepare(`
      SELECT COUNT(DISTINCT ip) as unique_count FROM clicks WHERE ${whereClause}
    `).bind(...values)
    const uniqueResult = await uniqueStmt.first()
    const unique_ips = uniqueResult?.unique_count || 0

    // By country
    const countryStmt = this.db.prepare(`
      SELECT country, COUNT(*) as count 
      FROM clicks 
      WHERE ${whereClause} AND country IS NOT NULL
      GROUP BY country
      ORDER BY count DESC
      LIMIT 10
    `).bind(...values)
    const countryResult = await countryStmt.all()
    const by_country = (countryResult.results || []).map((row: any) => ({
      country: row.country,
      count: row.count
    }))

    // By device
    const deviceStmt = this.db.prepare(`
      SELECT device_type, COUNT(*) as count 
      FROM clicks 
      WHERE ${whereClause} AND device_type IS NOT NULL
      GROUP BY device_type
      ORDER BY count DESC
    `).bind(...values)
    const deviceResult = await deviceStmt.all()
    const by_device = (deviceResult.results || []).map((row: any) => ({
      device_type: row.device_type,
      count: row.count
    }))

    // By date (last 30 days)
    const dateStmt = this.db.prepare(`
      SELECT DATE(clicked_at) as date, COUNT(*) as count 
      FROM clicks 
      WHERE ${whereClause}
      GROUP BY DATE(clicked_at)
      ORDER BY date DESC
      LIMIT 30
    `).bind(...values)
    const dateResult = await dateStmt.all()
    const by_date = (dateResult.results || []).map((row: any) => ({
      date: row.date,
      count: row.count
    }))

    return {
      total_clicks,
      unique_ips,
      by_country,
      by_device,
      by_date
    }
  }

  async deleteByLinkId(linkId: string): Promise<boolean> {
    const stmt = this.db.prepare(`
      DELETE FROM clicks WHERE link_id = ?
    `).bind(linkId)

    const result = await stmt.run()
    return result.success
  }
}
