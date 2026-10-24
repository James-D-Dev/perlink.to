-- A site's own domain (e.g. www.myshop.com), registered as a Cloudflare for
-- SaaS custom hostname. One domain per site.
CREATE TABLE IF NOT EXISTS custom_domains (
  id TEXT PRIMARY KEY,
  bio_page_id TEXT NOT NULL UNIQUE,
  hostname TEXT NOT NULL UNIQUE,
  cf_hostname_id TEXT,
  -- pending | active | error (from Cloudflare's hostname + certificate status)
  status TEXT NOT NULL DEFAULT 'pending',
  -- JSON: DNS records the owner must add, as returned by Cloudflare
  verification TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (bio_page_id) REFERENCES bio_pages(id) ON DELETE CASCADE
);
