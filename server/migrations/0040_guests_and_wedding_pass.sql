-- The guests of an invitation: names the owner added (each gets their own
-- link, ?to=Name) and anyone who opened such a link. Opening is counted so
-- the owner sees who has seen the invitation and who hasn't yet.
CREATE TABLE IF NOT EXISTS site_guests (
  id TEXT PRIMARY KEY,
  bio_page_id TEXT NOT NULL,
  name TEXT NOT NULL,
  -- lower-cased, spaces collapsed: one row per guest name
  name_key TEXT NOT NULL,
  -- groom | bride, on a page with a tab per family
  side TEXT,
  -- 1: on the owner's list; 0: only seen through a link
  listed INTEGER NOT NULL DEFAULT 1,
  opens INTEGER NOT NULL DEFAULT 0,
  first_open_at TEXT,
  last_open_at TEXT,
  letter_opened_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (bio_page_id, name_key),
  FOREIGN KEY (bio_page_id) REFERENCES bio_pages(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_site_guests_page ON site_guests(bio_page_id, created_at);

-- What a payment bought besides the plan: 'wedding' for the Wedding pass
-- (a year of Starter and the Wedding room pack, paid once). A table of its
-- own, so payments keep working on a database without it
CREATE TABLE IF NOT EXISTS payment_products (
  payment_id TEXT PRIMARY KEY,
  product TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
