-- Create bio_pages table for bio link builder
CREATE TABLE IF NOT EXISTS bio_pages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  template_id TEXT NOT NULL DEFAULT 'modern',
  theme_config TEXT, -- JSON: { primaryColor, backgroundColor, fontFamily }
  blocks TEXT, -- JSON array: [{ name, index, hidden, data }]
  is_published INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bio_pages_user_id ON bio_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_bio_pages_username ON bio_pages(username);
CREATE INDEX IF NOT EXISTS idx_bio_pages_published ON bio_pages(is_published);
