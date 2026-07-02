import type { H3Event } from 'h3'
import { getDB, generateId, parseJsonField, stringifyJsonField } from '../utils/db'

export interface Profile {
  id: string
  email: string | null
  username: string | null
  name: string | null
  ip: string | null
  country: string | null
  avatar: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

export interface CreateProfileInput {
  id: string
  email?: string | null
  username?: string | null
  name?: string | null
  ip?: string | null
  country?: string | null
  avatar?: string | null
}

export class ProfileRepository {
  private db: any
  private event: H3Event

  constructor(event: H3Event) {
    this.event = event
    this.db = getDB(event)
  }

  private mapDbRowToProfile(row: any): Profile {
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      name: row.name,
      ip: row.ip,
      country: row.country,
      avatar: row.avatar,
      tags: parseJsonField(row.tags),
      created_at: row.created_at,
      updated_at: row.updated_at
    }
  }

  async upsert(input: CreateProfileInput): Promise<Profile> {
    const now = new Date().toISOString()

    const stmt = this.db.prepare(`
      INSERT INTO profiles (id, email, username, name, ip, country, avatar, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        email = excluded.email,
        username = excluded.username,
        name = excluded.name,
        ip = excluded.ip,
        country = excluded.country,
        avatar = excluded.avatar,
        updated_at = excluded.updated_at
    `).bind(
      input.id,
      input.email || null,
      input.username || null,
      input.name || null,
      input.ip || null,
      input.country || null,
      input.avatar || null,
      now,
      now
    )

    await stmt.run()

    return this.findById(input.id) as Promise<Profile>
  }

  async findById(id: string): Promise<Profile | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM profiles WHERE id = ?
    `).bind(id)

    const result = await stmt.first()
    if (!result) return null

    return this.mapDbRowToProfile(result)
  }

  async findByUsername(username: string): Promise<Profile | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM profiles WHERE username = ?
    `).bind(username)

    const result = await stmt.first()
    if (!result) return null

    return this.mapDbRowToProfile(result)
  }

  async findByEmail(email: string): Promise<Profile | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM profiles WHERE email = ?
    `).bind(email)

    const result = await stmt.first()
    if (!result) return null

    return this.mapDbRowToProfile(result)
  }

  async updateTags(userId: string, tags: string[]): Promise<boolean> {
    const now = new Date().toISOString()
    const stmt = this.db.prepare(`
      UPDATE profiles SET tags = ?, updated_at = ? WHERE id = ?
    `).bind(stringifyJsonField(tags), now, userId)

    const result = await stmt.run()
    return result.success
  }

  async addTag(userId: string, tag: string): Promise<string[]> {
    const profile = await this.findById(userId)
    if (!profile) throw new Error('Profile not found')

    const currentTags = profile.tags || []
    const updatedTags = Array.from(new Set([...currentTags, tag]))

    await this.updateTags(userId, updatedTags)
    return updatedTags
  }

  async removeTag(userId: string, tag: string): Promise<string[]> {
    const profile = await this.findById(userId)
    if (!profile) throw new Error('Profile not found')

    const currentTags = profile.tags || []
    const updatedTags = currentTags.filter(t => t !== tag)

    await this.updateTags(userId, updatedTags)
    return updatedTags
  }

  async checkUsernameExists(username: string, excludeUserId?: string): Promise<boolean> {
    let query = 'SELECT 1 FROM profiles WHERE username = ?'
    const params: any[] = [username]

    if (excludeUserId) {
      query += ' AND id != ?'
      params.push(excludeUserId)
    }

    const stmt = this.db.prepare(query + ' LIMIT 1').bind(...params)
    const result = await stmt.first()
    return result !== null
  }
}
