-- Add status column to profiles table for user status tracking
ALTER TABLE profiles ADD COLUMN status TEXT DEFAULT 'active';

-- Create index for status queries
CREATE INDEX idx_profiles_status ON profiles(status);

-- Set existing users to active status
UPDATE profiles SET status = 'active' WHERE status IS NULL;
