-- Add link_analytics field to bio_pages to track individual link and social click counts
-- Format: { "links": { "[linkId]": count }, "social": { "[platform]": count } }
ALTER TABLE bio_pages ADD COLUMN link_analytics TEXT NOT NULL DEFAULT '{"links":{},"social":{}}';
