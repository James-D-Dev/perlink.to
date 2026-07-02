import type { H3Event } from 'h3'
import { getDB } from '../utils/db'

export interface GeoLocation {
  id: number
  ip: string
  city: string | null
  country_code: string | null
  created_at: string
}

export interface CreateGeoInput {
  ip: string
  city?: string | null
  country_code?: string | null
}

export class GeoRepository {
  private db: any
  private event: H3Event

  constructor(event: H3Event) {
    this.event = event
    this.db = getDB(event)
  }

  private mapDbRowToGeo(row: any): GeoLocation {
    return {
      id: row.id,
      ip: row.ip,
      city: row.city,
      country_code: row.country_code,
      created_at: row.created_at
    }
  }

  async findByIp(ip: string): Promise<GeoLocation | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM geo WHERE ip = ?
    `).bind(ip)

    const result = await stmt.first()
    if (!result) return null

    return this.mapDbRowToGeo(result)
  }

  async create(input: CreateGeoInput): Promise<GeoLocation> {
    const now = new Date().toISOString()

    const stmt = this.db.prepare(`
      INSERT INTO geo (ip, city, country_code, created_at)
      VALUES (?, ?, ?, ?)
    `).bind(
      input.ip,
      input.city || null,
      input.country_code || null,
      now
    )

    await stmt.run()

    return this.findByIp(input.ip) as Promise<GeoLocation>
  }
}
