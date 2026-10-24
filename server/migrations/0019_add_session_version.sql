-- Bumping a user's session_version signs them out on every device
-- (log out everywhere, bans); login cookies carry the version they were issued with
ALTER TABLE profiles ADD COLUMN session_version INTEGER NOT NULL DEFAULT 1;
