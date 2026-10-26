-- When the payer saw the "you're upgraded" screen for this payment, so it
-- shows once (the first time they're in the dashboard after it's approved)
ALTER TABLE payments ADD COLUMN celebrated_at TEXT;
