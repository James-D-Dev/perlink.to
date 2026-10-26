# Billing (plan payments)

Plans and their limits live in `shared/plans.ts` (used by the app and the
server). Paid plans are bought by bank transfer: the checkout shows a VietQR
whose note is a payment code (`PL` + 8 characters). SePay watches the bank
account and calls our webhook for every incoming transfer; a transfer whose
note has a pending payment's code and at least its amount marks it paid and
puts the plan on the account (`profiles.plan`, `profiles.plan_expires_at`).

Without the settings below, the pricing page shows "Contact us to upgrade"
and the plan limits still apply (admins can set plans in Superadmin; those
have no end date).

## Setup

1. Run the migration: `pnpm run db:migrate:remote` (0024_add_billing).
2. Create an account at https://my.sepay.vn and link the bank account that
   receives payments.
3. In SePay → Webhooks, add:
   - URL: `https://perlink.to/api/billing/sepay-webhook`
   - Event: money in
   - Authentication: **API Key**; choose a long random key
4. Add Cloudflare Pages secrets (Settings → Variables and Secrets):
   - `NUXT_BILLING_BANK_BIN`: the bank's BIN, e.g. `970422` (MB), `970436` (Vietcombank), `970407` (Techcombank)
   - `NUXT_BILLING_ACCOUNT_NUMBER`: the account number
   - `NUXT_BILLING_ACCOUNT_NAME`: the account holder's name (shown in the checkout)
   - `NUXT_BILLING_SEPAY_API_KEY`: the key from step 3
5. Redeploy.

## Rules

- Buying the plan you already have adds the time to what is left; another
  plan starts from the payment date.
- A plan past its end date counts as Free (sites stay published, but new
  sites, custom domains and Pro-theme publishing need a plan again).
- Each account can try Plus free for 7 days once (`profiles.trial_used`).
- A transfer below the price is not applied (logged as `[billing]`); set the
  plan by hand in Superadmin if needed.
- **For now every site shows the "Made with Perlink" badge** (and room videos
  the watermark), whatever the plan: `BRANDING_FOR_ALL` in `shared/plans.ts`.
  Set it to `false` once buying plans works end to end, and Plus and Pro
  (`removeBranding`) hide it again. While it's on, the video studio doesn't
  offer to remove the watermark.
