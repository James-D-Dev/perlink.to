import type { H3Event } from 'h3'
import { getDB } from './db'

// Cloudflare for SaaS custom hostnames for sites' own domains

interface CfHostname {
  id: string
  hostname: string
  status: string
  ssl?: { status?: string; validation_records?: { txt_name?: string; txt_value?: string; http_url?: string; http_body?: string }[] }
  ownership_verification?: { type?: string; name?: string; value?: string }
  verification_errors?: string[]
}

export interface DomainRecord {
  type: 'CNAME' | 'TXT'
  name: string
  value: string
}

export function customDomainsEnabled(event: H3Event) {
  const config = useRuntimeConfig(event)
  return !!(config.cfSaasApiToken && config.cfSaasZoneId)
}

async function cf<T>(event: H3Event, method: string, path: string, body?: unknown): Promise<T> {
  const config = useRuntimeConfig(event)
  const response = await fetch(`https://api.cloudflare.com/client/v4/zones/${config.cfSaasZoneId}/custom_hostnames${path}`, {
    method,
    headers: { 'Authorization': `Bearer ${config.cfSaasApiToken}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await response.json() as { success: boolean; result: T; errors?: { message: string }[] }
  if (!json.success) {
    throw createError({ statusCode: 502, statusMessage: json.errors?.[0]?.message || 'Cloudflare request failed' })
  }
  return json.result
}

export const cfCreateHostname = (event: H3Event, hostname: string) =>
  cf<CfHostname>(event, 'POST', '', { hostname, ssl: { method: 'txt', type: 'dv', settings: { min_tls_version: '1.2' } } })

export const cfGetHostname = (event: H3Event, id: string) => cf<CfHostname>(event, 'GET', `/${id}`)

export async function cfDeleteHostname(event: H3Event, id: string) {
  try {
    await cf(event, 'DELETE', `/${id}`)
  } catch (error) {
    console.error('[customDomains] delete failed', error)
  }
}

/** DNS records the owner adds: the CNAME, plus any TXT checks Cloudflare asks for */
export function domainRecords(event: H3Event, hostname: string, cfHostname?: CfHostname | null): DomainRecord[] {
  const records: DomainRecord[] = [{ type: 'CNAME', name: hostname, value: useRuntimeConfig(event).domainCnameTarget }]
  const own = cfHostname?.ownership_verification
  if (own?.name && own.value) records.push({ type: 'TXT', name: own.name, value: own.value })
  for (const record of cfHostname?.ssl?.validation_records ?? []) {
    if (record.txt_name && record.txt_value) records.push({ type: 'TXT', name: record.txt_name, value: record.txt_value })
  }
  return records
}

export function domainStatus(cfHostname: CfHostname): 'pending' | 'active' | 'error' {
  if (cfHostname.status === 'active' && cfHostname.ssl?.status === 'active') return 'active'
  if (cfHostname.verification_errors?.length && cfHostname.status !== 'pending') return 'error'
  return 'pending'
}

/** Normalise what an owner typed into a bare hostname, or null if it isn't one */
export function normalizeHostname(input: string): string | null {
  const host = input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/\.$/, '')
  if (!/^(?=.{4,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/.test(host)) return null
  // Our own domains can't be claimed
  if (host === 'perlink.to' || host.endsWith('.perlink.to') || host.endsWith('.pages.dev')) return null
  return host
}

/** The site an active custom domain points at */
export async function siteForDomain(event: H3Event, hostname: string) {
  try {
    return await getDB(event)
      .prepare(`SELECT b.username AS username FROM custom_domains d JOIN bio_pages b ON b.id = d.bio_page_id WHERE d.hostname = ? AND d.status = 'active' AND b.is_published = 1`)
      .bind(hostname)
      .first<{ username: string }>()
  } catch {
    // Table missing before migration 0022
    return null
  }
}
