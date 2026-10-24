-- Requests visitors send through a site's form block (bookings, contact).
-- data is JSON: { name, phone?, email?, date?, time?, guests?, message? }
CREATE TABLE IF NOT EXISTS form_submissions (
  id TEXT PRIMARY KEY,
  bio_page_id TEXT NOT NULL,
  block_id TEXT,
  data TEXT NOT NULL,
  ip_hash TEXT,
  read_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (bio_page_id) REFERENCES bio_pages(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_page ON form_submissions(bio_page_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_rate ON form_submissions(bio_page_id, ip_hash, created_at);
