-- Blog posts of a site: perlink.to/<site>/blog and /blog/<slug>
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  bio_page_id TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  -- Short summary for lists, search engines and link previews
  excerpt TEXT,
  cover_url TEXT,
  -- Tiptap document (JSON); turned into HTML by server/utils/posts.ts
  content TEXT NOT NULL DEFAULT '{"type":"doc","content":[]}',
  -- draft | published
  status TEXT NOT NULL DEFAULT 'draft',
  reading_minutes INTEGER NOT NULL DEFAULT 1,
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (bio_page_id) REFERENCES bio_pages(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_posts_slug ON posts(bio_page_id, slug);
CREATE INDEX IF NOT EXISTS idx_posts_list ON posts(bio_page_id, status, published_at);
