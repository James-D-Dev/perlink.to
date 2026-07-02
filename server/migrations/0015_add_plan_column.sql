-- Add plan column to profiles table for pricing tier tracking
ALTER TABLE profiles ADD COLUMN plan TEXT DEFAULT 'free';

-- Create index for plan queries
CREATE INDEX idx_profiles_plan ON profiles(plan);

-- Set existing users to free plan
UPDATE profiles SET plan = 'free' WHERE plan IS NULL;
