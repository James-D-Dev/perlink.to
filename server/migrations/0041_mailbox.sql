-- Superadmin → Emails: one mailbox for support@perlink.to.
-- direction 'in': mail to support@ (stored by the perlink-email Worker, which
-- still forwards it to Gmail); 'out': everything Perlink sends.
-- kind: 'inbound', 'admin' (written in Superadmin), 'system' (automatic)
CREATE TABLE IF NOT EXISTS mail_messages (
  id TEXT PRIMARY KEY,
  direction TEXT NOT NULL CHECK (direction IN ('in', 'out')),
  kind TEXT NOT NULL DEFAULT 'system',
  from_email TEXT NOT NULL,
  from_name TEXT,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL DEFAULT '',
  text TEXT,
  html TEXT,
  message_id TEXT,
  in_reply_to TEXT,
  refs TEXT,
  user_id TEXT,
  status TEXT NOT NULL DEFAULT 'received',
  error TEXT,
  -- JSON: [{ "key": "<R2 key>", "filename": "...", "mimeType": "...", "size": 123 }]
  attachments TEXT,
  read_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS mail_messages_direction_created ON mail_messages (direction, created_at DESC);
CREATE INDEX IF NOT EXISTS mail_messages_message_id ON mail_messages (message_id);
CREATE INDEX IF NOT EXISTS mail_messages_user ON mail_messages (user_id);

-- What Superadmin sent before, so Sent starts complete
INSERT OR IGNORE INTO mail_messages (id, direction, kind, from_email, from_name, to_email, subject, text, user_id, status, error, created_at)
  SELECT id, 'out', 'admin', 'support@perlink.to', 'Perlink Support', to_email, subject, body, user_id, status, error, created_at FROM admin_emails;
