-- Snapshots of each site's page and 3D room, taken in the owner's browser,
-- so lists can show an image instead of rendering the whole page
ALTER TABLE bio_pages ADD COLUMN thumbnail_url TEXT;
ALTER TABLE bio_pages ADD COLUMN room_thumbnail_url TEXT;
