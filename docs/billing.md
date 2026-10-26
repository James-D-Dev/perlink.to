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
- **Fair limits** (so one large account can't cost more than it pays):
  Pro is 100 sites; custom domains are counted per account across all its
  sites (`PLAN_LIMITS[plan].domains`: Plus 3, Pro 20), since each one is a
  Cloudflare for SaaS hostname (100 included, then about $0.10 a month each).
  Pro promises 3 years of analytics (`analyticsDays`, pricing text only;
  nothing deletes older data yet).
- **Pro isn't on sale yet** (`PRO_ON_SALE` in `shared/plans.ts`): its card
  says "Coming soon" and checkout refuses it. Turn it on once custom domains
  are connected and `BRANDING_FOR_ALL` is off. Plus promises the same two
  things (custom domain, no badge) and is still on sale.

## Paying by bank transfer or crypto, reviewed by the superadmin

The checkout offers what is set up (`paymentMethods` in `/api/billing`):

- **Bank transfer** (VietQR, VND): `NUXT_BILLING_BANK_BIN` (Techcombank is
  `970407`), `NUXT_BILLING_ACCOUNT_NUMBER`, `NUXT_BILLING_ACCOUNT_NAME`. The
  transfer message is `PERLINK <code>` (e.g. `PERLINK PL7K2M9QXA`); with SePay
  set up, a matching transfer still turns the plan on by itself.
- **Crypto** (USDT / USDC at the USD price, `PLAN_PRICES_USD`):
  `NUXT_BILLING_CRYPTO_ADDRESS` = the EVM wallet that receives it. Networks and
  token contracts are in `shared/crypto.ts` (BNB Chain, Polygon, Arbitrum,
  Base, Ethereum; checked on chain: symbol and decimals).

Flow:

1. The payer pays and presses **Done** (crypto: with the transaction hash).
   The payment becomes `submitted`. A crypto transaction is read from the
   chain (`server/utils/cryptoPayments.ts`): succeeded, USDT/USDC to our
   wallet, how much, confirmations. One transaction can pay only one plan.
2. The superadmin gets a Telegram message (their account must be connected:
   Settings → Notifications) with the details, the check and **Approve /
   Reject** buttons, plus links to the explorer and the review page.
   Superadmin → Settings → Telegram → set up the webhook again once, so
   Telegram sends button presses (`callback_query`). Only the superadmin's
   own chat can decide.
3. **Approve** (Telegram or Superadmin → Payments) puts the plan on the
   account (`grantPlan`: time adds to what is left). **Reject** marks it
   rejected; it can still be approved later from the page.
4. **Refresh** in the checkout asks again; a waiting crypto payment is read
   from the chain again (every 20 s at most), and the reviewer is told once
   it shows as paid in full.
