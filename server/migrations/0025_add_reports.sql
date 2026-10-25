-- Visitors can report a site that breaks the rules; an admin reviews it
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  bio_page_id TEXT NOT NULL,
  -- The address when reported (it may change later)
  username TEXT NOT NULL,
  -- scam | phishing | adult | violence | illegal | copyright | impersonation | spam | other
  reason TEXT NOT NULL,
  details TEXT,
  reporter_email TEXT,
  -- Daily-salted IP hash, to limit how many reports one visitor sends
  reporter_hash TEXT,
  -- open | dismissed | removed
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT,
  FOREIGN KEY (bio_page_id) REFERENCES bio_pages(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status, created_at);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports(reporter_hash, created_at);

-- A site taken down by an admin: unpublished, and its owner can't publish it again
ALTER TABLE bio_pages ADD COLUMN removed_at TEXT;
ALTER TABLE bio_pages ADD COLUMN removed_reason TEXT;
