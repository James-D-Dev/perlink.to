-- Paying by bank transfer or crypto (USDT / USDC on an EVM chain), reviewed by
-- the superadmin: the payer presses "Done", the payment waits for review
-- (status 'submitted'), and approving it puts the plan on the account.

-- bank | crypto
ALTER TABLE payments ADD COLUMN method TEXT NOT NULL DEFAULT 'bank';
-- Crypto price in USD (amount stays the VND price)
ALTER TABLE payments ADD COLUMN amount_usd REAL;
-- Crypto: chain and token the payer chose, and their transaction
ALTER TABLE payments ADD COLUMN network TEXT;
ALTER TABLE payments ADD COLUMN token TEXT;
ALTER TABLE payments ADD COLUMN tx_hash TEXT;
-- Last on-chain check of tx_hash (JSON), shown to the reviewer
ALTER TABLE payments ADD COLUMN check_result TEXT;
ALTER TABLE payments ADD COLUMN submitted_at TEXT;
ALTER TABLE payments ADD COLUMN reviewed_at TEXT;

-- One transaction pays one plan
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_tx ON payments(tx_hash) WHERE tx_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status, created_at);
