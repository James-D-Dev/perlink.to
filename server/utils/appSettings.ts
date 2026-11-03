import type { H3Event } from 'h3'
import { getDB } from './db'

// Runtime switches from Superadmin → Settings (table app_settings)

export type AppSettingKey = 'bank_payments'

const DEFAULTS: Record<AppSettingKey, string> = {
  // VietQR bank transfers for plans; off, plans sell through Lemon Squeezy
  bank_payments: '0',
}

export async function getSetting(event: H3Event, key: AppSettingKey): Promise<string> {
  try {
    const row = await getDB(event).prepare('SELECT value FROM app_settings WHERE key = ?').bind(key).first<{ value: string }>()
    return row?.value ?? DEFAULTS[key]
  } catch {
    // Table missing before migration 0036
    return DEFAULTS[key]
  }
}

export const getFlag = async (event: H3Event, key: AppSettingKey) => (await getSetting(event, key)) === '1'

export async function setSetting(event: H3Event, key: AppSettingKey, value: string) {
  await getDB(event)
    .prepare(`INSERT INTO app_settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`)
    .bind(key, value)
    .run()
}
