# Email

Perlink sends transactional email (form requests and orders to site owners,
site reports to the admin) through **Cloudflare Email Sending**.

Cloudflare Pages can't have a `send_email` binding, so the app hands each
email to a small Worker, **perlink-email** (`workers/email-sender`), through
the `EMAIL_WORKER` service binding in `wrangler.jsonc`. The Worker has no
public URL (no workers.dev, no routes); only the app can reach it.
`server/utils/email.ts` uses the Worker, and falls back to the Email Sending
REST API when `NUXT_CF_EMAIL_API_TOKEN` is set and the binding isn't there.

## Setup

1. Cloudflare → Email → **Email Sending**: enable it for `perlink.to` and let
   it add its DNS records (DKIM, bounce MX on `cf-bounce`, DMARC).
2. Sending to any recipient needs the **Workers Paid** plan (3,000 emails a
   month included). On Workers Free only verified addresses receive mail.
3. Deploy the Worker (once, and after changing it):
   `npx wrangler deploy --config workers/email-sender/wrangler.toml`
4. Deploy the app (`pnpm run deploy`); the service binding connects them.
5. Superadmin → Settings → **Email sending → Send test email** sends one to
   the superadmin and shows the error if it fails.

The sender is `NUXT_EMAIL_FROM` (default `Perlink <notification@perlink.to>`;
the Worker sends from the address part). It must be on the onboarded domain.
