# Custom domains for sites

Site owners can show their site on their own domain (e.g. `www.myshop.com`)
from **Site settings → Custom domain**. Under the hood each domain is a
Cloudflare for SaaS custom hostname on the `perlink.to` zone.

Until the steps below are done, the settings card says custom domains aren't
available yet. Nothing else is affected.

## One-time setup

1. **Enable Cloudflare for SaaS** on the `perlink.to` zone:
   Cloudflare dashboard → perlink.to → SSL/TLS → Custom Hostnames → Enable.
   (Pay-as-you-go; the first 100 hostnames are included.)

2. **Fallback origin.** Add a DNS record `sites` → `A 192.0.2.1`, **Proxied**.
   The IP is never contacted (the Worker answers first). On the Custom
   Hostnames page, set the fallback origin to `sites.perlink.to` and wait
   until it shows Active. Owners point their domain at `sites.perlink.to`.

3. **Domain router Worker.** Pick a long random secret, then:

   ```sh
   npx wrangler deploy --config workers/domain-router/wrangler.toml
   npx wrangler secret put DOMAIN_PROXY_SECRET --config workers/domain-router/wrangler.toml
   ```

   The Worker's `*/*` route only acts on customer domains; perlink.to traffic
   passes straight through to Pages.

4. **API token.** Cloudflare dashboard → My Profile → API Tokens → Create
   Token with **Zone · SSL and Certificates · Edit** for `perlink.to`.

5. **Pages secrets** (perlink-app → Settings → Environment variables →
   Production, as *Secret*):

   | Name | Value |
   |---|---|
   | `NUXT_CF_SAAS_ZONE_ID` | perlink.to's Zone ID (zone Overview page) |
   | `NUXT_CF_SAAS_API_TOKEN` | the token from step 4 |
   | `NUXT_DOMAIN_PROXY_SECRET` | the same secret as the Worker |
   | `NUXT_DOMAIN_CNAME_TARGET` | optional, default `sites.perlink.to` |

   Redeploy the site afterwards.

6. **Migration** `0022_add_custom_domains.sql`:
   `CLOUDFLARE_ACCOUNT_ID=... pnpm run db:migrate:remote`

## How a request flows

`www.myshop.com/` → Cloudflare (custom hostname) → domain-router Worker →
`https://perlink.to/` with `x-perlink-domain: www.myshop.com` and the secret →
`server/middleware/01-custom-domain.ts` finds the active domain → the home
page renders that site (`app/pages/index.vue` → `SitePage`). Assets and API
calls (`/_nuxt`, `/api`, `/images`) pass through; any other path redirects to
perlink.to.

## Test with one domain first

Connect a domain you own, add the DNS records shown in the settings card and
wait until it says Active (usually a few minutes, up to a day for DNS).
Check that the home page, images, the booking form and the 3D room work on
that domain before announcing the feature.

Apex domains (`myshop.com` without `www`) need a DNS provider that supports
CNAME flattening (Cloudflare does); otherwise use `www`.
