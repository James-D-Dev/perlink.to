-- Enhanced click events table for analytics
CREATE TABLE IF NOT EXISTS click_events (
  id TEXT PRIMARY KEY,
  link_id TEXT NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'shortlink', -- 'shortlink' | 'bio'
  timestamp TEXT NOT NULL,

  -- Geo
  country TEXT,
  city TEXT,

  -- Device
  device TEXT, -- 'Mobile' | 'Desktop' | 'Tablet'
  os TEXT, -- 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux'
  browser TEXT, -- 'Chrome' | 'Safari' | 'Edge' | 'Samsung' | 'Firefox' | 'Other'

  -- Source
  referrer TEXT, -- domain only
  referrer_full TEXT,

  -- UTM
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Identity
  ip_hash TEXT,
  user_agent TEXT,

  -- Classification
  is_bot INTEGER NOT NULL DEFAULT 0,
  is_unique INTEGER NOT NULL DEFAULT 0,

  -- Source type
  source_type TEXT DEFAULT 'direct', -- 'direct' | 'qr' | 'bio' | 'social'

  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_click_events_link_id ON click_events(link_id);
CREATE INDEX IF NOT EXISTS idx_click_events_timestamp ON click_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_click_events_link_timestamp ON click_events(link_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_click_events_ip_hash ON click_events(link_id, ip_hash);

-- Aggregated daily stats
CREATE TABLE IF NOT EXISTS link_daily_stats (
  id TEXT PRIMARY KEY,
  link_id TEXT NOT NULL,
  link_type TEXT NOT NULL DEFAULT 'shortlink',
  date TEXT NOT NULL, -- 'YYYY-MM-DD'

  -- Counts
  total_clicks INTEGER NOT NULL DEFAULT 0,
  unique_clicks INTEGER NOT NULL DEFAULT 0,
  bot_clicks INTEGER NOT NULL DEFAULT 0,

  -- Device breakdown
  mobile_clicks INTEGER NOT NULL DEFAULT 0,
  desktop_clicks INTEGER NOT NULL DEFAULT 0,
  tablet_clicks INTEGER NOT NULL DEFAULT 0,

  -- JSON breakdowns
  os_breakdown TEXT, -- JSON
  browser_breakdown TEXT, -- JSON
  country_breakdown TEXT, -- JSON
  city_breakdown TEXT, -- JSON
  referrer_breakdown TEXT, -- JSON
  utm_source_breakdown TEXT, -- JSON
  source_type_breakdown TEXT, -- JSON

  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_link_daily_stats_link_date ON link_daily_stats(link_id, date);
