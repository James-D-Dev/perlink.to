import type { H3Event } from 'h3'
import { getDB, generateId } from '../utils/db'

export interface ClickEventInput {
  link_id: string
  link_type: 'shortlink' | 'bio'
  timestamp: string
  country: string | null
  city: string | null
  device: string
  os: string
  browser: string
  referrer: string
  referrer_full: string | null
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  ip_hash: string
  user_agent: string | null
  is_bot: boolean
  is_unique: boolean
  source_type: string
}

export interface AnalyticsOverview {
  total_clicks: number
  unique_clicks: number
  today_clicks: number
  bot_clicks: number
  last_click_at: string | null
}

export interface TimeseriesPoint {
  date: string
  clicks: number
  unique: number
}

export interface BreakdownItem {
  name: string
  clicks: number
  percentage: number
}

export class AnalyticsRepository {
  private db: any
  private event: H3Event

  constructor(event: H3Event) {
    this.event = event
    this.db = getDB(event)
  }

  async createClickEvent(input: ClickEventInput): Promise<void> {
    const id = generateId()
    const stmt = this.db.prepare(`
      INSERT INTO click_events (
        id, link_id, link_type, timestamp,
        country, city, device, os, browser,
        referrer, referrer_full,
        utm_source, utm_medium, utm_campaign,
        ip_hash, user_agent, is_bot, is_unique, source_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      input.link_id,
      input.link_type,
      input.timestamp,
      input.country,
      input.city,
      input.device,
      input.os,
      input.browser,
      input.referrer,
      input.referrer_full,
      input.utm_source,
      input.utm_medium,
      input.utm_campaign,
      input.ip_hash,
      input.user_agent,
      input.is_bot ? 1 : 0,
      input.is_unique ? 1 : 0,
      input.source_type
    )
    await stmt.run()
  }

  async isUniqueClick(linkId: string, ipHash: string): Promise<boolean> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM click_events
      WHERE link_id = ? AND ip_hash = ? AND timestamp > ?
    `).bind(linkId, ipHash, twentyFourHoursAgo)
    const result = await stmt.first()
    return (result?.count || 0) === 0
  }

  // --- Analytics Queries ---

  async getOverview(linkId: string, period: string = '7d'): Promise<AnalyticsOverview> {
    const startDate = this.getStartDate(period)
    const today = new Date().toISOString().split('T')[0]

    // Total clicks (non-bot)
    const totalStmt = this.db.prepare(`
      SELECT COUNT(*) as total FROM click_events
      WHERE link_id = ? AND is_bot = 0 AND timestamp >= ?
    `).bind(linkId, startDate)
    const totalResult = await totalStmt.first()

    // Unique clicks
    const uniqueStmt = this.db.prepare(`
      SELECT COUNT(*) as total FROM click_events
      WHERE link_id = ? AND is_bot = 0 AND is_unique = 1 AND timestamp >= ?
    `).bind(linkId, startDate)
    const uniqueResult = await uniqueStmt.first()

    // Today clicks
    const todayStmt = this.db.prepare(`
      SELECT COUNT(*) as total FROM click_events
      WHERE link_id = ? AND is_bot = 0 AND DATE(timestamp) = ?
    `).bind(linkId, today)
    const todayResult = await todayStmt.first()

    // Bot clicks
    const botStmt = this.db.prepare(`
      SELECT COUNT(*) as total FROM click_events
      WHERE link_id = ? AND is_bot = 1 AND timestamp >= ?
    `).bind(linkId, startDate)
    const botResult = await botStmt.first()

    // Last click timestamp
    const lastClickStmt = this.db.prepare(`
      SELECT timestamp FROM click_events
      WHERE link_id = ? AND is_bot = 0
      ORDER BY timestamp DESC LIMIT 1
    `).bind(linkId)
    const lastClickResult = await lastClickStmt.first()

    return {
      total_clicks: totalResult?.total || 0,
      unique_clicks: uniqueResult?.total || 0,
      today_clicks: todayResult?.total || 0,
      bot_clicks: botResult?.total || 0,
      last_click_at: lastClickResult?.timestamp || null,
    }
  }

  async getTimeseries(linkId: string, period: string = '7d'): Promise<TimeseriesPoint[]> {
    const startDate = this.getStartDate(period)

    const stmt = this.db.prepare(`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as clicks,
        SUM(CASE WHEN is_unique = 1 THEN 1 ELSE 0 END) as unique_clicks
      FROM click_events
      WHERE link_id = ? AND is_bot = 0 AND timestamp >= ?
      GROUP BY DATE(timestamp)
      ORDER BY date ASC
    `).bind(linkId, startDate)

    const result = await stmt.all()
    return (result.results || []).map((row: any) => ({
      date: row.date,
      clicks: row.clicks,
      unique: row.unique_clicks,
    }))
  }

  async getReferrers(linkId: string, period: string = '7d'): Promise<BreakdownItem[]> {
    const startDate = this.getStartDate(period)

    const stmt = this.db.prepare(`
      SELECT 
        referrer as name,
        COUNT(*) as clicks
      FROM click_events
      WHERE link_id = ? AND is_bot = 0 AND timestamp >= ?
      GROUP BY referrer
      ORDER BY clicks DESC
      LIMIT 10
    `).bind(linkId, startDate)

    const result = await stmt.all()
    const items = result.results || []
    const total = items.reduce((sum: number, r: any) => sum + r.clicks, 0)

    return items.map((row: any) => ({
      name: row.name || 'direct',
      clicks: row.clicks,
      percentage: total > 0 ? Math.round((row.clicks / total) * 100) : 0,
    }))
  }

  async getDevices(linkId: string, period: string = '7d'): Promise<{
    devices: BreakdownItem[]
    os: BreakdownItem[]
    browsers: BreakdownItem[]
  }> {
    const startDate = this.getStartDate(period)

    // Devices
    const deviceStmt = this.db.prepare(`
      SELECT device as name, COUNT(*) as clicks
      FROM click_events
      WHERE link_id = ? AND is_bot = 0 AND timestamp >= ?
      GROUP BY device ORDER BY clicks DESC
    `).bind(linkId, startDate)

    // OS
    const osStmt = this.db.prepare(`
      SELECT os as name, COUNT(*) as clicks
      FROM click_events
      WHERE link_id = ? AND is_bot = 0 AND timestamp >= ?
      GROUP BY os ORDER BY clicks DESC
    `).bind(linkId, startDate)

    // Browsers
    const browserStmt = this.db.prepare(`
      SELECT browser as name, COUNT(*) as clicks
      FROM click_events
      WHERE link_id = ? AND is_bot = 0 AND timestamp >= ?
      GROUP BY browser ORDER BY clicks DESC
    `).bind(linkId, startDate)

    const [deviceResult, osResult, browserResult] = await Promise.all([
      deviceStmt.all(),
      osStmt.all(),
      browserStmt.all(),
    ])

    return {
      devices: this.toBreakdown(deviceResult.results || []),
      os: this.toBreakdown(osResult.results || []),
      browsers: this.toBreakdown(browserResult.results || []),
    }
  }

  async getGeo(linkId: string, period: string = '7d'): Promise<{
    countries: BreakdownItem[]
    cities: BreakdownItem[]
  }> {
    const startDate = this.getStartDate(period)

    const countryStmt = this.db.prepare(`
      SELECT country as name, COUNT(*) as clicks
      FROM click_events
      WHERE link_id = ? AND is_bot = 0 AND timestamp >= ? AND country IS NOT NULL
      GROUP BY country ORDER BY clicks DESC
      LIMIT 10
    `).bind(linkId, startDate)

    const cityStmt = this.db.prepare(`
      SELECT city as name, COUNT(*) as clicks
      FROM click_events
      WHERE link_id = ? AND is_bot = 0 AND timestamp >= ? AND city IS NOT NULL
      GROUP BY city ORDER BY clicks DESC
      LIMIT 10
    `).bind(linkId, startDate)

    const [countryResult, cityResult] = await Promise.all([
      countryStmt.all(),
      cityStmt.all(),
    ])

    return {
      countries: this.toBreakdown(countryResult.results || []),
      cities: this.toBreakdown(cityResult.results || []),
    }
  }

  // --- Helpers ---

  private toBreakdown(rows: any[]): BreakdownItem[] {
    const total = rows.reduce((sum, r) => sum + r.clicks, 0)
    return rows.map(row => ({
      name: row.name || 'Unknown',
      clicks: row.clicks,
      percentage: total > 0 ? Math.round((row.clicks / total) * 100) : 0,
    }))
  }

  private getStartDate(period: string): string {
    const now = new Date()
    switch (period) {
      case '24h':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString()
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString()
      case 'all':
        return '1970-01-01T00:00:00.000Z'
      default:
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
    }
  }
}
