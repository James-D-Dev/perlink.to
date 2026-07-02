-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    email TEXT,
    username TEXT UNIQUE,
    ip TEXT,
    country TEXT,
    tags TEXT, -- JSON array stored as TEXT
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create links table (serves both as profile pages and individual links)
CREATE TABLE IF NOT EXISTS links (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL,
    
    -- Link/Page content
    content TEXT NOT NULL, -- JSON: { url, title, description, icon, thumbnail, etc. }
    type TEXT DEFAULT 'url', -- 'profile', 'url', 'email', 'phone', 'social', 'file', etc.
    
    -- Display & Ordering
    title TEXT,
    description TEXT,
    position INTEGER DEFAULT 0, -- For ordering links within a profile
    parent_id TEXT, -- Reference to parent link (for profile pages containing links)
    
    -- Customization
    theme TEXT, -- JSON: { colors, fonts, layout, background, etc. }
    is_custom INTEGER DEFAULT 0, -- Custom short_code
    is_public INTEGER DEFAULT 1, -- Public visibility
    is_active INTEGER DEFAULT 1, -- Enable/disable link
    
    -- Scheduling
    start_date DATETIME,
    end_date DATETIME,
    
    -- Analytics
    click_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    -- Metadata
    meta TEXT, -- JSON: additional settings, integrations, SEO, etc.
    tags TEXT, -- JSON array stored as TEXT
    
    -- Timestamps
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES links(id) ON DELETE CASCADE
);

-- Create geo table for IP geolocation cache
CREATE TABLE IF NOT EXISTS geo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip TEXT UNIQUE NOT NULL,
    city TEXT,
    country_code TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create clicks/analytics table
CREATE TABLE IF NOT EXISTS clicks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link_id TEXT NOT NULL,
    ip TEXT,
    user_agent TEXT,
    referer TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT, -- 'mobile', 'desktop', 'tablet'
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);
CREATE INDEX IF NOT EXISTS idx_links_short_code ON links(short_code);
CREATE INDEX IF NOT EXISTS idx_links_parent_id ON links(parent_id);
CREATE INDEX IF NOT EXISTS idx_links_type ON links(type);
CREATE INDEX IF NOT EXISTS idx_links_position ON links(position);
CREATE INDEX IF NOT EXISTS idx_links_is_active ON links(is_active);
CREATE INDEX IF NOT EXISTS idx_links_is_public ON links(is_public);
CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_geo_ip ON geo(ip);
CREATE INDEX IF NOT EXISTS idx_clicks_link_id ON clicks(link_id);
CREATE INDEX IF NOT EXISTS idx_clicks_clicked_at ON clicks(clicked_at);
