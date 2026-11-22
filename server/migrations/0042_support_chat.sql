-- Chat with support: a signed-in user writes from the dashboard, the admin
-- answers from Superadmin → Support (or by replying in Telegram)
CREATE TABLE IF NOT EXISTS support_messages (
  id TEXT PRIMARY KEY,
  -- The user the conversation belongs to
  user_id TEXT NOT NULL,
  -- user | admin
  sender TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  -- When the other side read it (null: unread)
  read_at TEXT,
  -- The Telegram message that announced it to the admin (a reply there answers it)
  telegram_message_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_support_user ON support_messages(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_support_unread ON support_messages(sender, read_at);
CREATE INDEX IF NOT EXISTS idx_support_telegram ON support_messages(telegram_message_id);
