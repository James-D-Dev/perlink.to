-- Unpublished edits of a live site. "Save draft" writes here; publishing
-- copies the draft into the live columns and clears it.
-- draft is JSON: { title, bio, avatarUrl, templateId, themeConfig, blocks }
ALTER TABLE bio_pages ADD COLUMN draft TEXT;
ALTER TABLE bio_pages ADD COLUMN draft_updated_at TEXT;
