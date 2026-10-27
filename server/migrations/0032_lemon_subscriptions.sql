-- Plans bought through Lemon Squeezy (card / PayPal) are subscriptions that
-- renew on their own. One row per Lemon Squeezy subscription, kept up to date
-- by its webhooks; the account's plan follows the latest one.
CREATE TABLE IF NOT EXISTS subscriptions (
  -- Lemon Squeezy subscription id
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  -- monthly | annual
  period TEXT NOT NULL,
  -- on_trial | active | paused | past_due | unpaid | cancelled | expired
  status TEXT NOT NULL,
  renews_at TEXT,
  ends_at TEXT,
  -- Where the customer changes card, switches plan or cancels
  portal_url TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id, updated_at);
