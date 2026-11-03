-- Affiliates: the Lemon Squeezy affiliate code an account earns with (its
-- sites' "Made with Perlink" badge carries it), and the code that brought
-- the account in
ALTER TABLE profiles ADD COLUMN affiliate_code TEXT;
ALTER TABLE profiles ADD COLUMN referred_by TEXT;
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by);
