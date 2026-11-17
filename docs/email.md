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

The sender is `NUXT_EMAIL_FROM` (default `Perlink <notifications@perlink.to>`;
the Worker sends from the address part). It must be on the onboarded domain.

## Receiving: support@perlink.to (Superadmin → Emails)

Email Routing sends mail for `support@perlink.to` to the **perlink-email**
Worker (rule action "worker", not "forward"). The Worker forwards each mail to
`FORWARD_TO` (Gmail, a verified destination) first, then keeps a copy in D1
`mail_messages` (direction `in`) with attachments in the private R2 bucket
`perlink-mail`. If keeping the copy fails, the mail still reaches Gmail.

Everything the app sends through `sendEmail()` is kept in the same table
(direction `out`, kind `admin` or `system`). Superadmin → Emails shows Inbox
and Sent, and answers from support@ with In-Reply-To/References so the reply
stays in the sender's thread.

To go back to plain forwarding: Cloudflare → Email Routing → the support@
rule → action "Send to an email" → Gmail.
