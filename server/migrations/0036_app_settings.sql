-- Switches the superadmin flips at runtime (Superadmin → Settings), as key/value
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Paying for plans by VietQR bank transfer starts off: plans are sold through Lemon Squeezy
INSERT OR IGNORE INTO app_settings (key, value) VALUES ('bank_payments', '0');
