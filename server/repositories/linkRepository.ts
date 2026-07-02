import type { H3Event } from 'h3'
import { getDB, generateId, parseJsonField, stringifyJsonField, boolToInt, intToBool } from '../utils/db'
import type { Link } from '../../types/link'

export interface CreateLinkInput {
  user_id: string
  short_code: string
  content: any
  type?: string
  title?: string | null
  description?: string | null
  position?: number
  parent_id?: string | null
  theme?: any
  is_custom?: boolean
  is_public?: boolean
  is_active?: boolean
  start_date?: string | null
  end_date?: string | null
  meta?: any
  tags?: string[]
}

export interface UpdateLinkInput {
  content?: any
  type?: string
  title?: string | null
  description?: string | null
  position?: number
  parent_id?: string | null
  theme?: any
  is_custom?: boolean
  is_public?: boolean
  is_active?: boolean
  start_date?: string | null
  end_date?: string | null
  meta?: any
  tags?: string[]
}

export class LinkRepository {
  private db: any
  private event: H3Event

  constructor(event: H3Event) {
    this.event = event
    this.db = getDB(event)
  }

  private mapDbRowToLink(row: any): Link {
    return {
      id: row.id,
      user_id: row.user_id,
      short_code: row.short_code,
      
      // Content
      content: parseJsonField(row.content) || row.content,
      type: row.type || 'url',
      
      // Display & Ordering
      title: row.title,
      description: row.description,
      position: row.position || 0,
      parent_id: row.parent_id,
      
      // Customization
      theme: parseJsonField(row.theme),
      is_custom: intToBool(row.is_custom),
      is_public: intToBool(row.is_public),
      is_active: intToBool(row.is_active),
      
      // Scheduling
      start_date: row.start_date,
      end_date: row.end_date,
      
      // Analytics
      click_count: row.click_count || 0,
      view_count: row.view_count || 0,
      
      // Metadata
      meta: parseJsonField(row.meta),
      tags: parseJsonField(row.tags),
      
      // Timestamps
      created_at: row.created_at,
      updated_at: row.updated_at
    }
  }

  async create(input: CreateLinkInput): Promise<Link> {
    const id = generateId()
    const now = new Date().toISOString()

    const stmt = this.db.prepare(`
      INSERT INTO links (
        id, user_id, short_code, content, type,
        title, description, position, parent_id,
        theme, is_custom, is_public, is_active,
        start_date, end_date,
        click_count, view_count,
        meta, tags,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      input.user_id,
      input.short_code,
      stringifyJsonField(input.content),
      input.type || 'url',
      input.title || null,
      input.description || null,
      input.position || 0,
      input.parent_id || null,
      stringifyJsonField(input.theme),
      boolToInt(input.is_custom || false),
      boolToInt(input.is_public !== undefined ? input.is_public : true),
      boolToInt(input.is_active !== undefined ? input.is_active : true),
      input.start_date || null,
      input.end_date || null,
      0, // click_count
      0, // view_count
      stringifyJsonField(input.meta),
      stringifyJsonField(input.tags),
      now,
      now
    )

    await stmt.run()

    return this.findByShortCode(input.short_code) as Promise<Link>
  }

  async findByShortCode(shortCode: string): Promise<Link | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM links WHERE short_code = ?
    `).bind(shortCode)

    const result = await stmt.first()
    if (!result) return null

    return this.mapDbRowToLink(result)
  }

  async findById(id: string): Promise<Link | null> {
    const stmt = this.db.prepare(`
      SELECT * FROM links WHERE id = ?
    `).bind(id)

    const result = await stmt.first()
    if (!result) return null

    return this.mapDbRowToLink(result)
  }

  async update(shortCode: string, input: UpdateLinkInput): Promise<Link | null> {
    const now = new Date().toISOString()
    const updates: string[] = []
    const values: any[] = []

    if (input.content !== undefined) {
      updates.push('content = ?')
      values.push(stringifyJsonField(input.content))
    }

    if (input.type !== undefined) {
      updates.push('type = ?')
      values.push(input.type)
    }

    if (input.title !== undefined) {
      updates.push('title = ?')
      values.push(input.title)
    }

    if (input.description !== undefined) {
      updates.push('description = ?')
      values.push(input.description)
    }

    if (input.position !== undefined) {
      updates.push('position = ?')
      values.push(input.position)
    }

    if (input.parent_id !== undefined) {
      updates.push('parent_id = ?')
      values.push(input.parent_id)
    }

    if (input.theme !== undefined) {
      updates.push('theme = ?')
      values.push(stringifyJsonField(input.theme))
    }

    if (input.is_custom !== undefined) {
      updates.push('is_custom = ?')
      values.push(boolToInt(input.is_custom))
    }

    if (input.is_public !== undefined) {
      updates.push('is_public = ?')
      values.push(boolToInt(input.is_public))
    }

    if (input.is_active !== undefined) {
      updates.push('is_active = ?')
      values.push(boolToInt(input.is_active))
    }

    if (input.start_date !== undefined) {
      updates.push('start_date = ?')
      values.push(input.start_date)
    }

    if (input.end_date !== undefined) {
      updates.push('end_date = ?')
      values.push(input.end_date)
    }

    if (input.meta !== undefined) {
      updates.push('meta = ?')
      values.push(stringifyJsonField(input.meta))
    }

    if (input.tags !== undefined) {
      updates.push('tags = ?')
      values.push(stringifyJsonField(input.tags))
    }

    if (updates.length === 0) {
      return this.findByShortCode(shortCode)
    }

    updates.push('updated_at = ?')
    values.push(now)
    values.push(shortCode)

    const stmt = this.db.prepare(`
      UPDATE links SET ${updates.join(', ')} WHERE short_code = ?
    `).bind(...values)

    await stmt.run()

    return this.findByShortCode(shortCode)
  }

  async delete(shortCode: string): Promise<boolean> {
    const stmt = this.db.prepare(`
      DELETE FROM links WHERE short_code = ?
    `).bind(shortCode)

    const result = await stmt.run()
    return result.success
  }

  async checkShortCodeExists(shortCode: string): Promise<boolean> {
    const stmt = this.db.prepare(`
      SELECT 1 FROM links WHERE short_code = ? LIMIT 1
    `).bind(shortCode)

    const result = await stmt.first()
    return result !== null
  }

  async findByUserId(
    userId: string,
    options: {
      page?: number
      perPage?: number
      search?: string
      startDate?: string
      endDate?: string
      linkType?: 'all' | 'custom' | 'random'
      isPublic?: boolean
      tags?: string[]
    } = {}
  ): Promise<{ links: Link[], total: number }> {
    const {
      page = 0,
      perPage = 10,
      search,
      startDate,
      endDate,
      linkType = 'all',
      isPublic,
      tags
    } = options

    const offset = page * perPage
    const conditions: string[] = ['user_id = ?']
    const values: any[] = [userId]

    // Search condition
    if (search) {
      conditions.push(`(
        short_code LIKE ? OR 
        content LIKE ? OR 
        json_extract(meta, '$.title') LIKE ?
      )`)
      const searchPattern = `%${search}%`
      values.push(searchPattern, searchPattern, searchPattern)
    }

    // Date range
    if (startDate) {
      conditions.push('created_at >= ?')
      values.push(startDate + 'T00:00:00.000Z')
    }
    if (endDate) {
      conditions.push('created_at <= ?')
      values.push(endDate + 'T23:59:59.999Z')
    }

    // Link type
    if (linkType === 'custom') {
      conditions.push('is_custom = 1')
    } else if (linkType === 'random') {
      conditions.push('is_custom = 0')
    }

    // Public filter
    if (isPublic !== undefined) {
      conditions.push('is_public = ?')
      values.push(boolToInt(isPublic))
    }

    // Tags filter
    if (tags && tags.length > 0) {
      tags.forEach(tag => {
        conditions.push(`json_extract(tags, '$') LIKE ?`)
        values.push(`%"${tag}"%`)
      })
    }

    const whereClause = conditions.join(' AND ')

    // Get total count
    const countStmt = this.db.prepare(`
      SELECT COUNT(*) as count FROM links WHERE ${whereClause}
    `).bind(...values)

    const countResult = await countStmt.first()
    const total = countResult?.count || 0

    // Get paginated data
    const dataStmt = this.db.prepare(`
      SELECT * FROM links 
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...values, perPage, offset)

    const result = await dataStmt.all()
    const links = (result.results || []).map((row: any) => this.mapDbRowToLink(row))

    return { links, total }
  }

  async updateTags(shortCode: string, tags: string[]): Promise<boolean> {
    const now = new Date().toISOString()
    const stmt = this.db.prepare(`
      UPDATE links SET tags = ?, updated_at = ? WHERE short_code = ?
    `).bind(stringifyJsonField(tags), now, shortCode)

    const result = await stmt.run()
    return result.success
  }

  async addTag(shortCode: string, tag: string): Promise<boolean> {
    const link = await this.findByShortCode(shortCode)
    if (!link) return false

    const currentTags = link.tags || []
    if (currentTags.includes(tag)) return true

    const newTags = [...currentTags, tag]
    return this.updateTags(shortCode, newTags)
  }

  async removeTag(shortCode: string, tag: string): Promise<boolean> {
    const link = await this.findByShortCode(shortCode)
    if (!link) return false

    const currentTags = link.tags || []
    const newTags = currentTags.filter(t => t !== tag)
    
    return this.updateTags(shortCode, newTags)
  }

  // Analytics methods
  async incrementClickCount(linkId: string): Promise<boolean> {
    const stmt = this.db.prepare(`
      UPDATE links SET click_count = click_count + 1 WHERE id = ?
    `).bind(linkId)

    const result = await stmt.run()
    return result.success
  }

  async incrementViewCount(linkId: string): Promise<boolean> {
    const stmt = this.db.prepare(`
      UPDATE links SET view_count = view_count + 1 WHERE id = ?
    `).bind(linkId)

    const result = await stmt.run()
    return result.success
  }

  // Get child links (links that belong to a profile/parent)
  async findChildLinks(parentId: string, options: { includeInactive?: boolean } = {}): Promise<Link[]> {
    const { includeInactive = false } = options
    
    let query = 'SELECT * FROM links WHERE parent_id = ?'
    if (!includeInactive) {
      query += ' AND is_active = 1'
    }
    query += ' ORDER BY position ASC, created_at DESC'

    const stmt = this.db.prepare(query).bind(parentId)
    const result = await stmt.all()
    
    return (result.results || []).map((row: any) => this.mapDbRowToLink(row))
  }

  // Get profile links (links with type='profile' for a user)
  async findProfilesByUserId(userId: string): Promise<Link[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM links 
      WHERE user_id = ? AND type = 'profile'
      ORDER BY created_at DESC
    `).bind(userId)

    const result = await stmt.all()
    return (result.results || []).map((row: any) => this.mapDbRowToLink(row))
  }

  // Reorder links (update positions)
  async reorderLinks(linkIds: string[]): Promise<boolean> {
    const statements = linkIds.map((linkId, index) => {
      return this.db.prepare(`
        UPDATE links SET position = ? WHERE id = ?
      `).bind(index, linkId)
    })

    const results = await this.db.batch(statements)
    return results.every((r: any) => r.success)
  }
}
