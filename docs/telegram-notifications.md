# Telegram notifications

Site owners get new **orders** (products block) and **form requests** (form
block) as Telegram messages from the Perlink bot, with a button to the
site's inbox. One Telegram chat per account; it covers all the account's sites.

## How it works

```
Owner: Settings → Notifications → "Connect Telegram"
  → POST /api/account/telegram            makes a one-time code (30 min),
                                          returns t.me/<bot>?start=<code>
  → owner presses Start in Telegram
  → Telegram → POST /api/telegram/webhook "/start <code>"
                                          saves the chat id on the profile
  → the settings card polls GET /api/account/telegram until connected

Visitor sends a form / places an order
  → form.post.ts / order.post.ts          after saving, in the background:
  → notifyOwnerTelegram()                 server/utils/telegram.ts
```

- Data: `profiles.telegram_chat_id`, `telegram_link_token`, `telegram_link_expires` (migration 0026).
- Messages are in Vietnamese when the site's language is Vietnamese, English otherwise.
- `/stop` in the bot chat turns messages off; "Disconnect" in Settings does the same.
- The webhook only accepts requests carrying the secret header
  `X-Telegram-Bot-Api-Secret-Token`, and only private chats.
- Without `NUXT_TELEGRAM_BOT_TOKEN` everything is hidden and nothing is sent.

| File | Role |
|---|---|
| `server/utils/telegram.ts` | Bot API calls, message formatting, `notifyOwnerTelegram` |
| `server/api/account/telegram.{get,post,delete}.ts` | Status, start linking, disconnect |
| `server/api/account/telegram/test.post.ts` | "Send test" |
| `server/api/telegram/webhook.post.ts` | `/start <code>`, `/stop`, help |
| `server/api/superadmin/telegram*.ts` | Bot status and webhook registration |
| `app/components/TelegramConnect.vue` | Card in Settings, hint in each site's Inbox |

## Setup (once)

1. In Telegram, talk to **@BotFather** → `/newbot` → name it (e.g. "Perlink")
   and pick a username ending in `bot` (e.g. `PerlinkNotifyBot`). Copy the token.
2. Optional: `/setuserpic`, `/setdescription` ("Nhận đơn hàng và yêu cầu từ trang Perlink của bạn").
3. Cloudflare Pages → perlink-app → Settings → Variables and Secrets, add:
   - `NUXT_TELEGRAM_BOT_TOKEN` – the token from BotFather
   - `NUXT_TELEGRAM_BOT_USERNAME` – the bot username without `@`
   - `NUXT_TELEGRAM_WEBHOOK_SECRET` – any long random string (A–Z, a–z, 0–9, `_`, `-`)
4. Redeploy.
5. Superadmin → Settings → **Register webhook for this site**. The card shows
   the bot, the webhook URL and Telegram's last delivery error, if any.
6. Test: Settings → Notifications → Connect Telegram → Start → Send test.

## Local development

Telegram can't reach localhost. Run with fake values and post updates by hand:

```sh
NUXT_TELEGRAM_BOT_TOKEN=dev NUXT_TELEGRAM_BOT_USERNAME=DevBot NUXT_TELEGRAM_WEBHOOK_SECRET=devsecret pnpm dev
curl -X POST localhost:3000/api/telegram/webhook \
  -H 'x-telegram-bot-api-secret-token: devsecret' -H 'content-type: application/json' \
  -d '{"message":{"text":"/start <code>","chat":{"id":123,"type":"private"}}}'
```

Sending fails with the fake token (logged as `[telegram]`), but linking and
everything around it can be checked.

## Language

English is Perlink's main language. Everything Perlink sends someone (bot
replies, order and request alerts, emails, payment review and payment
results) uses the language of *their account* (`profiles.language`, set in
Settings → Dashboard language, or the site header's EN/VI switch while
signed in); no choice means English. A chat that isn't linked to an account
yet gets English. Strings: `server/utils/botCopy.ts`, `COPY` in
`server/utils/telegram.ts` and `formNotification.ts`, `REVIEW_COPY` in
`server/utils/paymentReview.ts`.

The dashboard itself starts in English too (the browser's language isn't
used); the choice is kept in the `perlink_lang` cookie (`plugins/language.ts`)
and signing in on another device restores the account's language.
