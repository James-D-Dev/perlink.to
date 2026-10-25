-- Guestbook of a site's 3D room: visitors leave a message and a gift that
-- appears in front of the room. Owners can hide or delete entries.
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id TEXT PRIMARY KEY,
  bio_page_id TEXT NOT NULL,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  -- flower | gift | cake | balloon | bear | star (shared/guestbook.ts)
  gift TEXT NOT NULL,
  hidden INTEGER NOT NULL DEFAULT 0,
  -- Hashed per site, only to limit how often one visitor posts
  ip_hash TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (bio_page_id) REFERENCES bio_pages(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_guestbook_page ON guestbook_entries(bio_page_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_guestbook_rate ON guestbook_entries(bio_page_id, ip_hash, created_at);
