-- Fix foreign key constraint for qr_codes table
-- Drop and recreate with correct reference to profiles(id)

DROP TABLE IF EXISTS qr_codes;
DROP TABLE IF EXISTS qr_scans;

-- Recreate qr_codes with correct foreign key
CREATE TABLE IF NOT EXISTS qr_codes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  short_code TEXT UNIQUE NOT NULL,
  name TEXT,
  destination_url TEXT NOT NULL,
  title TEXT,
  -- QR Styling & Options (JSON)
  style_config TEXT DEFAULT '{"dotsType":"rounded","cornersSquareType":"square","cornersDotType":"square","foregroundColor":"#000000","backgroundColor":"#ffffff","useGradient":false,"frameStyle":"none","showBranding":true}',
  logo_url TEXT,
  -- Metadata
  scan_count INTEGER DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  expires_at TEXT,
  is_active INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Recreate indexes
CREATE INDEX IF NOT EXISTS idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_codes_short_code ON qr_codes(short_code);

-- Recreate qr_scans table
CREATE TABLE IF NOT EXISTS qr_scans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  qr_code_id TEXT NOT NULL,
  scanned_at TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT,
  country TEXT,
  city TEXT,
  device_type TEXT,
  referer TEXT,
  FOREIGN KEY (qr_code_id) REFERENCES qr_codes(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_qr_scans_qr_code_id ON qr_scans(qr_code_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at ON qr_scans(scanned_at);
