-- A site's password (PBKDF2 hash, server/utils/siteAccess.ts); never sent to visitors
ALTER TABLE bio_pages ADD COLUMN access_hash TEXT;

-- Orders: where each one is (new, confirmed, shipped, done, cancelled) and
-- what it took from stock, so a cancelled order can put it back
ALTER TABLE form_submissions ADD COLUMN status TEXT;
ALTER TABLE form_submissions ADD COLUMN meta TEXT;
