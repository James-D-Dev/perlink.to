-- Sign-in accounts from other providers (Facebook, TikTok), linked to a profile.
-- Google accounts are still matched by email; TikTok gives no email at all,
-- so these are matched by the provider's own user id.
CREATE TABLE IF NOT EXISTS auth_accounts (
    provider TEXT NOT NULL,
    provider_user_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    email TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_auth_accounts_user ON auth_accounts(user_id);
