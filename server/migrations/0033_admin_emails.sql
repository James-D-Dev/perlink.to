-- Emails the superadmin wrote to people from Superadmin → Emails (sent from
-- support@perlink.to), kept so support has a record of what was said
CREATE TABLE IF NOT EXISTS admin_emails (
  id TEXT PRIMARY KEY,
  to_email TEXT NOT NULL,
  -- The account it went to, when the address belongs to one
  user_id TEXT,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  -- sent | failed
  status TEXT NOT NULL,
  error TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_admin_emails_created ON admin_emails(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_emails_user ON admin_emails(user_id, created_at);
