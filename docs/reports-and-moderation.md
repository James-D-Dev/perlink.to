# Reports and takedowns

Every live site has a small "Report" link at the bottom (all 11 site
languages) to `perlink.to/report?site=<name>`. Admins review reports in
**Superadmin → Reports** and can take a site down.

```
/report (app/pages/report.vue)
  → POST /api/report            reason (shared/reports.ts), details, optional email
      5 reports per visitor per day (daily-salted IP hash)
      emails the admin when Resend is set up
Superadmin → Reports (app/pages/superadmin/reports/index.vue)
  → POST /api/superadmin/reports/<id>  { action: 'remove' | 'dismiss' | 'restore' }
      remove:  unpublish, set bio_pages.removed_at/removed_reason, close all open reports of the site
      restore: clear removed_at (the owner can publish again)
```

- A removed site can't be published by its owner: `requireNotRemoved()`
  (`server/utils/moderation.ts`) in both publish endpoints returns 403.
- Migration 0025: `reports` table, `bio_pages.removed_at`, `removed_reason`.

## Legal pages

Terms, Privacy, Cookies, Refunds and Report share one layout:
`app/components/legal/LegalShell.vue` (title band, language switch, page
pills) and `LegalDoc.vue` (summary cards, contents, numbered sections). The
texts live in `app/data/legal/*.ts` in English and Vietnamese; inline
`[label](/path)`, `**bold**` and `{email}` are supported (`LegalText.vue`).
Contact email and "last updated" date: `app/utils/legal.ts`.
