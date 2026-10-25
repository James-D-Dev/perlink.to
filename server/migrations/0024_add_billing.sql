-- Paid plans: when a plan ends (NULL = no end, e.g. set by an admin) and
-- whether the free trial was used
ALTER TABLE profiles ADD COLUMN plan_expires_at TEXT;
ALTER TABLE profiles ADD COLUMN trial_used INTEGER NOT NULL DEFAULT 0;

-- Plan purchases paid by bank transfer (VietQR). The transfer note carries
-- the payment code; the bank webhook (SePay) matches it and marks it paid.
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  -- monthly | annual
  period TEXT NOT NULL,
  -- VND
  amount INTEGER NOT NULL,
  code TEXT NOT NULL UNIQUE,
  -- pending | paid | expired
  status TEXT NOT NULL DEFAULT 'pending',
  -- The bank transaction that paid it (SePay id), so a resent webhook is ignored
  provider_ref TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  paid_at TEXT,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id, created_at);
