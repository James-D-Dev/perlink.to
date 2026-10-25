import type { H3Event } from 'h3'
import type { BioBlock } from '~/types/bio'

// Types
export interface BioLink {
  id: string
  title: string
  subtitle?: string
  url: string
  icon?: string
  imageUrl?: string
  order: number
  isActive: boolean
}

export interface SocialLink {
  id: string
  url: string
  index: number
  provider: string
  clicks?: number
}

// Legacy type for backward compatibility
export interface SocialLinks {
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  tiktok?: string
}

export interface ThemeConfig {
  colors?: { primary?: string; secondary?: string; third?: string }
  background?: {
    type?: 'solid' | 'gradient' | 'image' | 'video' | 'effect'
    color?: string
    gradient?: { angle?: number; from?: string; to?: string; via?: string }
    imageUrl?: string
    imageOverlay?: string
    videoUrl?: string
    effectId?: string
  }
  card?: { cornerRadius?: number; transparency?: number; shadow?: string; outline?: boolean; outlineColor?: string }
  button?: { style?: string; cornerRadius?: number; shadow?: string }
  header?: { alignment?: string; spacing?: string }
  avatar?: { shape?: string; size?: string; border?: boolean; borderColor?: string }
  typography?: { nameFont?: string; headingFont?: string; paragraphFont?: string; nameSize?: string; paragraphSize?: string }
}

export interface LinkAnalytics {
  links: Record<string, number>
  social: Record<string, number>
  /** Calls, directions, chats, bookings and form requests from visitors */
  actions?: Record<string, number>
}

/** Visitor actions that are counted (see /api/bio/[username]/count) */
export const VISITOR_ACTIONS = ['call', 'map', 'zalo', 'whatsapp', 'telegram', 'book', 'email', 'form'] as const

export interface BioPage {
  id: string
  userId: string
  username: string
  title: string | null
  bio: string | null
  avatarUrl: string | null
  templateId: string
  themeConfig: ThemeConfig
  blocks: BioBlock[]
  isPublished: boolean
  viewCount: number
  linkAnalytics: LinkAnalytics
  /** Unpublished edits of a live site, if any */
  draft: BioDraft | null
  draftUpdatedAt: string | null
  /** Snapshot of the page as last edited (may show draft edits: owner only) */
  thumbnailUrl: string | null
  /** Snapshot of the 3D room */
  roomThumbnailUrl: string | null
  createdAt: string
  updatedAt: string
}

/** The editable content of a site; a draft holds the same fields */
export interface BioDraft {
  title?: string | null
  bio?: string | null
  avatarUrl?: string | null
  templateId?: string
  themeConfig?: ThemeConfig
  blocks?: BioBlock[]
}

export const DRAFT_FIELDS = ['title', 'bio', 'avatarUrl', 'templateId', 'themeConfig', 'blocks'] as const

export interface CreateBioPageInput {
  userId: string
  username: string
  title?: string
  bio?: string
  avatarUrl?: string
  templateId?: string
  themeConfig?: ThemeConfig
  blocks?: BioBlock[]
  isPublished?: boolean
}

function parseDraft(value: unknown): BioDraft | null {
  if (typeof value !== 'string' || !value) return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

/** What visitors may see: never the unpublished draft */
export function publicBioPage(page: BioPage) {
  // Snapshots can show unpublished edits, so they stay with the owner too
  const { draft: _draft, draftUpdatedAt: _draftUpdatedAt, thumbnailUrl: _thumb, roomThumbnailUrl: _roomThumb, ...live } = page
  return live
}

/** What the editor works on: the live content with any draft on top */
export function editableBioPage(page: BioPage) {
  const { draft, ...live } = page
  return { ...live, ...(draft ?? {}), hasDraft: !!draft }
}

export class BioRepository {
  private event: H3Event

  constructor(event: H3Event) {
    this.event = event
  }

  private get db() {
    return this.event.context.cloudflare.env.DB
  }

  private mapDbRowToBioPage(row: any): BioPage {
    // Parse blocks, fallback to empty array
    let blocks: BioBlock[] = []
    if (row.blocks) {
      try {
        blocks = JSON.parse(row.blocks)
      } catch {
        blocks = []
      }
    }

    return {
      id: row.id,
      userId: row.user_id,
      username: row.username,
      title: row.title,
      bio: row.bio,
      avatarUrl: row.avatar_url,
      templateId: row.template_id,
      themeConfig: row.theme_config ? JSON.parse(row.theme_config) : {},
      blocks,
      isPublished: Boolean(row.is_published),
      viewCount: row.view_count || 0,
      linkAnalytics: row.link_analytics ? JSON.parse(row.link_analytics) : {},
      draft: parseDraft(row.draft),
      draftUpdatedAt: row.draft_updated_at ?? null,
      thumbnailUrl: row.thumbnail_url ?? null,
      roomThumbnailUrl: row.room_thumbnail_url ?? null,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }
  }

  async findById(id: string): Promise<BioPage | null> {
    const result = await this.db.prepare(
      'SELECT * FROM bio_pages WHERE id = ?'
    ).bind(id).first()
    
    return result ? this.mapDbRowToBioPage(result) : null
  }

  async findByUsername(username: string): Promise<BioPage | null> {
    const result = await this.db.prepare(
      'SELECT * FROM bio_pages WHERE username = ?'
    ).bind(username).first()
    
    return result ? this.mapDbRowToBioPage(result) : null
  }

  async findByUserId(userId: string): Promise<BioPage | null> {
    const result = await this.db.prepare(
      'SELECT * FROM bio_pages WHERE user_id = ? LIMIT 1'
    ).bind(userId).first()
    
    return result ? this.mapDbRowToBioPage(result) : null
  }

  async findAllByUserId(userId: string): Promise<BioPage[]> {
    const results = await this.db.prepare(
      'SELECT * FROM bio_pages WHERE user_id = ? ORDER BY created_at DESC'
    ).bind(userId).all()
    
    return results.results ? results.results.map((r: any) => this.mapDbRowToBioPage(r)) : []
  }

  async create(input: CreateBioPageInput): Promise<BioPage> {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    await this.db.prepare(`
      INSERT INTO bio_pages (
        id, user_id, username, title, bio, avatar_url,
        template_id, theme_config, blocks,
        is_published, view_count, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      input.userId,
      input.username,
      input.title || null,
      input.bio || null,
      input.avatarUrl || null,
      input.templateId || 'modern',
      input.themeConfig ? JSON.stringify(input.themeConfig) : '{}',
      input.blocks ? JSON.stringify(input.blocks) : '[]',
      0,
      0,
      now,
      now
    ).run()

    return this.findById(id) as Promise<BioPage>
  }

  async update(id: string, input: Partial<CreateBioPageInput>): Promise<BioPage> {
    const now = new Date().toISOString()
    const current = await this.findById(id)
    
    if (!current) {
      throw new Error('Bio page not found')
    }

    await this.db.prepare(`
      UPDATE bio_pages SET
        title = ?,
        bio = ?,
        avatar_url = ?,
        template_id = ?,
        theme_config = ?,
        blocks = ?,
        is_published = ?,
        updated_at = ?
      WHERE id = ?
    `).bind(
      input.title !== undefined ? input.title : current.title,
      input.bio !== undefined ? input.bio : current.bio,
      input.avatarUrl !== undefined ? input.avatarUrl : current.avatarUrl,
      input.templateId || current.templateId,
      input.themeConfig ? JSON.stringify(input.themeConfig) : JSON.stringify(current.themeConfig),
      input.blocks !== undefined ? JSON.stringify(input.blocks) : JSON.stringify(current.blocks),
      input.isPublished !== undefined ? (input.isPublished ? 1 : 0) : (current.isPublished ? 1 : 0),
      now,
      id
    ).run()

    return this.findById(id) as Promise<BioPage>
  }

  /** Store unpublished edits (needs migration 0021) */
  async saveDraft(id: string, draft: BioDraft): Promise<void> {
    await this.db.prepare('UPDATE bio_pages SET draft = ?, draft_updated_at = ? WHERE id = ?')
      .bind(JSON.stringify(draft), new Date().toISOString(), id)
      .run()
  }

  /** Drop unpublished edits; harmless before migration 0021 */
  /** Before migration 0023 the columns don't exist; callers treat that as "not saved" */
  async setThumbnail(id: string, kind: 'page' | 'room', url: string): Promise<void> {
    const column = kind === 'room' ? 'room_thumbnail_url' : 'thumbnail_url'
    await this.db.prepare(`UPDATE bio_pages SET ${column} = ? WHERE id = ?`).bind(url, id).run()
  }

  async clearDraft(id: string): Promise<void> {
    try {
      await this.db.prepare('UPDATE bio_pages SET draft = NULL, draft_updated_at = NULL WHERE id = ?').bind(id).run()
    } catch (error) {
      console.error('[bioRepository.clearDraft]', error)
    }
  }

  async publish(id: string): Promise<BioPage> {
    await this.db.prepare(
      'UPDATE bio_pages SET is_published = 1, updated_at = ? WHERE id = ?'
    ).bind(new Date().toISOString(), id).run()

    return this.findById(id) as Promise<BioPage>
  }

  async unpublish(id: string): Promise<BioPage> {
    await this.db.prepare(
      'UPDATE bio_pages SET is_published = 0, updated_at = ? WHERE id = ?'
    ).bind(new Date().toISOString(), id).run()

    return this.findById(id) as Promise<BioPage>
  }

  async incrementViewCount(id: string): Promise<void> {
    await this.db.prepare(
      'UPDATE bio_pages SET view_count = view_count + 1 WHERE id = ?'
    ).bind(id).run()
  }

  async incrementLinkClick(id: string, linkId: string): Promise<void> {
    const page = await this.findById(id)
    if (!page) return
    const analytics = page.linkAnalytics
    analytics.links[linkId] = (analytics.links[linkId] || 0) + 1
    await this.db.prepare(
      'UPDATE bio_pages SET link_analytics = ? WHERE id = ?'
    ).bind(JSON.stringify(analytics), id).run()
  }

  async incrementSocialClick(id: string, platform: string): Promise<void> {
    const page = await this.findById(id)
    if (!page) return
    const analytics = page.linkAnalytics
    analytics.social[platform] = (analytics.social[platform] || 0) + 1
    await this.db.prepare(
      'UPDATE bio_pages SET link_analytics = ? WHERE id = ?'
    ).bind(JSON.stringify(analytics), id).run()
  }

  async incrementAction(id: string, action: string): Promise<void> {
    const page = await this.findById(id)
    if (!page) return
    const analytics = page.linkAnalytics
    analytics.actions = analytics.actions ?? {}
    analytics.actions[action] = (analytics.actions[action] || 0) + 1
    await this.db.prepare(
      'UPDATE bio_pages SET link_analytics = ? WHERE id = ?'
    ).bind(JSON.stringify(analytics), id).run()
  }

  async delete(id: string): Promise<void> {
    await this.db.prepare('DELETE FROM bio_pages WHERE id = ?').bind(id).run()
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const result = await this.db.prepare(
      'SELECT id FROM bio_pages WHERE username = ?'
    ).bind(username).first()
    
    return !result
  }
}
