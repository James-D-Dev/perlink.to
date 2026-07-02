# Perlink

[![Nuxt](https://img.shields.io/badge/Nuxt-4.x-00DC82?logo=nuxt&labelColor=020420)](https://nuxt.com)
[![Nuxt UI](https://img.shields.io/badge/Nuxt%20UI-4.x-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)
[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020?logo=cloudflare&labelColor=1d1d1d)](https://pages.cloudflare.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)

**Perlink** is an all-in-one platform to create bio link pages, shorten URLs, and generate QR codes (including VietQR). Built on Cloudflare's global edge network for lightning-fast performance.

## Features

- **Bio Link Pages** — Build customizable profile pages with multiple links, blocks, and themes
- **URL Shortener** — Create short, trackable links with custom slugs
- **QR Code Generator** — Generate QR codes including VietQR payment codes
- **Analytics** — Track clicks, views, devices, countries, and referrers in real time
- **Google OAuth** — One-click sign-in via Google
- **Pricing Plans** — Free, Starter, Plus, and Pro tiers
- **Admin Dashboard** — Full management UI for links, bio pages, and analytics
- **Super Admin** — Platform-level user and content moderation tools
- **Edge-first** — Deployed on Cloudflare Pages with D1 (SQLite) and R2 (object storage)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 4](https://nuxt.com) + [Vue 3](https://vuejs.org) |
| UI | [Nuxt UI v4](https://ui.nuxt.com) + [Tailwind CSS v4](https://tailwindcss.com) |
| Auth | [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) + Google OAuth |
| Database | [Cloudflare D1](https://developers.cloudflare.com/d1/) (SQLite) |
| Storage | [Cloudflare R2](https://developers.cloudflare.com/r2/) (avatars) |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) |
| Package Manager | [pnpm](https://pnpm.io) |

## Prerequisites

- [Node.js](https://nodejs.org) >= 18
- [pnpm](https://pnpm.io) >= 10
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`npm i -g wrangler`)
- A Cloudflare account with Pages, D1, and R2 enabled

## Setup

1. **Install dependencies**

```bash
pnpm install
```

2. **Configure environment variables**

Copy `.env.example` to `.env` and fill in the required values:

```bash
cp .env.example .env
```

```env
NUXT_SESSION_PASSWORD=       # Random secret (min 32 chars) for session encryption
NUXT_OAUTH_GOOGLE_CLIENT_ID=
NUXT_OAUTH_GOOGLE_CLIENT_SECRET=
AVATARS_PUBLIC_URL=https://media.perlink.to
```

3. **Apply database migrations (local)**

```bash
pnpm db:migrate
```

## Development

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

To develop against Wrangler's local runtime (closer to production):

```bash
pnpm dev:wrangler
```

## Database Migrations

| Command | Description |
|---|---|
| `pnpm db:migrate` | Apply migrations to the local D1 database |
| `pnpm db:migrate:remote` | Apply migrations to the remote (production) D1 database |

Migration files are located in `server/migrations/`.

## Production

Build the application:

```bash
pnpm build
```

Preview the production build locally via Wrangler:

```bash
pnpm preview
```

Deploy to Cloudflare Pages:

```bash
pnpm deploy
```

## Code Quality

```bash
pnpm lint        # Run ESLint
pnpm typecheck   # Run TypeScript type checking
```

## Project Structure

```
perlink-app/
├── app/
│   ├── components/     # Vue components
│   ├── composables/    # Shared composables
│   ├── layouts/        # Nuxt layouts
│   ├── pages/          # File-based routing
│   └── plugins/        # Nuxt plugins
├── server/
│   ├── api/            # API route handlers
│   ├── migrations/     # D1 SQL migrations
│   ├── repositories/   # Database access layer
│   └── services/       # Business logic
├── public/             # Static assets
├── nuxt.config.ts
└── wrangler.jsonc      # Cloudflare deployment config
```

## License

[MIT](./LICENSE)