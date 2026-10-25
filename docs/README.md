# Perlink docs

Short notes on how each part works and what has to be set up. Start here.

| Doc | What it covers | Needs setup |
|---|---|---|
| [billing.md](billing.md) | Plans and limits (`shared/plans.ts`), VND prices, VietQR checkout, SePay webhook, 7-day trial | SePay + 4 `NUXT_BILLING_*` secrets |
| [telegram-notifications.md](telegram-notifications.md) | New orders and requests sent to owners on Telegram | Bot from @BotFather + 3 `NUXT_TELEGRAM_*` secrets, then Superadmin → Settings → Register webhook |
| [products-and-orders.md](products-and-orders.md) | Products block: store links, ordering on the page, COD / transfer, Inbox | — (transfer needs a VietQR block on the site) |
| [guestbook.md](guestbook.md) | Visitors leave messages and 3D gifts in front of the room; owner hides or deletes | — |
| [room-tour-video.md](room-tour-video.md) | Vertical 3D room video for TikTok, made in the browser | — |
| [reports-and-moderation.md](reports-and-moderation.md) | Report a site, Superadmin takedowns, legal pages layout | — |
| [custom-domains.md](custom-domains.md) | Owners' own domains through Cloudflare for SaaS | Cloudflare for SaaS + domain-router Worker |
| [analytics-spec.md](analytics-spec.md) | Click and view analytics design | — |

## Everyday commands

```sh
pnpm dev --port 3138                                   # local, with local D1
pnpm run db:migrate                                    # local migrations
CLOUDFLARE_ACCOUNT_ID=e12f511fe723c064e1b971cc094a95fd pnpm run db:migrate:remote   # production migrations (run before deploying code that needs them)
CLOUDFLARE_ACCOUNT_ID=e12f511fe723c064e1b971cc094a95fd pnpm run deploy              # build and deploy to Cloudflare Pages
npx vue-tsc --noEmit -p .nuxt/tsconfig.app.json         # typecheck (some older files have known errors)
```

## Secrets (Cloudflare Pages → Settings → Variables and Secrets)

| Variable | Used for |
|---|---|
| `NUXT_RESEND_API_KEY`, `NUXT_EMAIL_FROM` | Emails (form requests, orders, reports) |
| `NUXT_BILLING_BANK_BIN`, `NUXT_BILLING_ACCOUNT_NUMBER`, `NUXT_BILLING_ACCOUNT_NAME`, `NUXT_BILLING_SEPAY_API_KEY` | Plan payments |
| `NUXT_TELEGRAM_BOT_TOKEN`, `NUXT_TELEGRAM_BOT_USERNAME`, `NUXT_TELEGRAM_WEBHOOK_SECRET` | Telegram notifications |
| `NUXT_CF_SAAS_ZONE_ID`, `NUXT_CF_SAAS_API_TOKEN`, `NUXT_DOMAIN_PROXY_SECRET` | Custom domains |

Each feature stays hidden or falls back gracefully until its secrets are set.

## Design: dialogs

Every dialog uses the same "liquid glass" look (iOS 26 style): a frosted,
translucent panel with a bright top edge and a long soft shadow over a dimmed,
blurred page, 28–30px corners, a centred title and a round close button.

- `UModal` and `USlideover` get it from `app/app.config.ts` (`liquidGlass`,
  `glassBackdrop`), so any new modal looks right without extra classes.
- Hand-built overlays use `.glass-backdrop`, `.glass-sheet` and `.glass-cell`
  from `app/assets/css/main.css` (order sheet, 3D room product, guestbook and
  message popups). Both have light and dark versions.

## Design: controls, toasts and motion (iOS 26 style)

All set once in `app/app.config.ts`, so every screen matches:

- **Buttons** are capsules that press in slightly (`active:scale-[0.97]`).
  Neutral outline/subtle buttons are frosted glass; neutral soft buttons a
  light translucent fill; solid buttons get a faint top highlight.
- **Fields** (input, textarea, select, select menu, input menu, number) use a
  soft translucent fill instead of a border, 12px corners, turn white while
  typing with a gentle accent ring; errors tint red.
- **Toasts** are glass capsules at the top centre (`UApp :toaster` in
  `app/app.vue`) that drop in with a small bounce and lift out.
- **Alerts** are rounder, frosted when neutral, and fade up into place.
- **Dialogs** spring open (`ios-sheet-in`). Keyframes `ios-*` live in
  `app/assets/css/main.css`; reduced-motion users get no animation.
