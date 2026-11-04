-- Premium 3D item packs an account owns (bought once on Lemon Squeezy, or
-- given by an admin). Max includes every pack without a row here.
CREATE TABLE IF NOT EXISTS room_packs (
  user_id TEXT NOT NULL,
  pack_id TEXT NOT NULL,
  -- lemon | gift
  source TEXT NOT NULL DEFAULT 'lemon',
  -- lemon:order:<id> for a purchase, so a refund can take it back
  order_ref TEXT,
  amount_usd REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (user_id, pack_id)
);
CREATE INDEX IF NOT EXISTS idx_room_packs_order ON room_packs(order_ref);
