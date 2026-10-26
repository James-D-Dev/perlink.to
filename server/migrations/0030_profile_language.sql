-- The language the account chose for the dashboard (Settings), used for
-- everything Perlink sends them: Telegram, email. NULL means English.
ALTER TABLE profiles ADD COLUMN language TEXT;
