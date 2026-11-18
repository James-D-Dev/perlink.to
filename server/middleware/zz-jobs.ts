import { getDB } from '../utils/db'
import { runNudges } from '../utils/nudges'

// Background jobs without a cron: Pages has no scheduled triggers, so any
// request may start the hourly jobs after its response. Each worker instance
// looks at most every 10 minutes; one run per hour is claimed in app_settings
// ("jobs:hourly_at") so instances don't both run them.

const LOOK_EVERY_MS = 10 * 60 * 1000
let lookedAt = 0

export default defineEventHandler((event) => {
  if (Date.now() - lookedAt < LOOK_EVERY_MS) return
  const ctx = event.context.cloudflare?.context as { waitUntil?: (p: Promise<unknown>) => void } | undefined
  if (!ctx?.waitUntil || !event.context.cloudflare?.env) return
  lookedAt = Date.now()
  ctx.waitUntil(runHourly(event).catch(error => console.error('[jobs] failed', error)))
})

async function runHourly(event: Parameters<typeof runNudges>[0]) {
  const db = getDB(event)
  // Claim this hour's run: only one request gets a change back
  const claim = await db.prepare(`
    INSERT INTO app_settings (key, value, updated_at) VALUES ('jobs:hourly_at', datetime('now'), datetime('now'))
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at
    WHERE app_settings.value <= datetime('now', '-1 hour')
  `).run()
  if (!(claim.meta as { changes?: number }).changes) return
  await runNudges(event)
}
