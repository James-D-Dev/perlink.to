-- Owners can get new orders and requests on Telegram: the chat the Perlink
-- bot talks to, and a one-time code that links the account to that chat
ALTER TABLE profiles ADD COLUMN telegram_chat_id TEXT;
ALTER TABLE profiles ADD COLUMN telegram_link_token TEXT;
ALTER TABLE profiles ADD COLUMN telegram_link_expires TEXT;
CREATE INDEX IF NOT EXISTS idx_profiles_telegram_token ON profiles(telegram_link_token);
