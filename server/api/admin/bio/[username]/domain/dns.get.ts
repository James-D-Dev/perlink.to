import { getDB } from '../../../../../utils/db'
import { requireOwnedSite } from '../../../../../utils/ownedSite'
import { providersForNameservers, shortRecordName } from '#shared/dnsProviders'
import type { DomainRecord } from '../../../../../utils/customDomains'

// What public DNS says about the records an owner was asked to add: where the
// domain's DNS is managed, and for each record whether it is there, missing,
// or added with the domain twice (panels that append it themselves).

type RecordCheck = 'ok' | 'missing' | 'doubled' | 'other'

interface DohAnswer { name: string; type: number; data: string }
const TYPE = { A: 1, NS: 2, CNAME: 5, TXT: 16 } as const

async function doh(name: string, type: keyof typeof TYPE): Promise<DohAnswer[]> {
  try {
    const response = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${type}`, {
      headers: { accept: 'application/dns-json' },
    })
    const json = await response.json() as { Answer?: DohAnswer[] }
    return (json.Answer ?? []).filter(a => a.type === TYPE[type])
  } catch {
    return []
  }
}

const clean = (value: string) => value.toLowerCase().replace(/^"|"$/g, '').replace(/\.$/, '')

/** The zone that holds `hostname` (kimduc.dev for perlink.kimduc.dev) and its nameservers */
async function findZone(hostname: string) {
  const labels = hostname.split('.')
  const candidates = labels.slice(0, -1).map((_, i) => labels.slice(i).join('.'))
  const answers = await Promise.all(candidates.map(name => doh(name, 'NS')))
  // Longest name that has its own NS records
  for (let i = 0; i < candidates.length; i++) {
    const ns = answers[i]!.filter(a => clean(a.name) === candidates[i])
    if (ns.length) return { zone: candidates[i]!, nameservers: ns.map(a => clean(a.data)) }
  }
  return { zone: null, nameservers: [] as string[] }
}

async function check(record: DomainRecord, zone: string | null): Promise<RecordCheck> {
  const want = clean(record.value)
  const has = async (name: string) => (await doh(name, record.type)).some(a => clean(a.data) === want)
  if (await has(record.name)) return 'ok'
  if (zone && await has(`${record.name}.${zone}`)) return 'doubled'
  // A CNAME name that answers with something else: another record is in the way,
  // or the record is proxied (Cloudflare's orange cloud)
  if (record.type === 'CNAME' && ((await doh(record.name, 'CNAME')).length || (await doh(record.name, 'A')).length)) return 'other'
  return 'missing'
}

export default defineEventHandler(async (event) => {
  const site = await requireOwnedSite(event)
  const row = await getDB(event)
    .prepare('SELECT hostname, verification FROM custom_domains WHERE bio_page_id = ?')
    .bind(site.id)
    .first<{ hostname: string; verification: string | null }>()
  if (!row) throw createError({ statusCode: 404, statusMessage: 'No domain connected' })

  const records: DomainRecord[] = row.verification ? JSON.parse(row.verification) : []
  const { zone, nameservers } = await findZone(row.hostname)
  const checks = await Promise.all(records.map(r => check(r, zone)))
  return {
    success: true,
    zone,
    providers: providersForNameservers(nameservers),
    records: records.map((r, i) => ({ ...r, short: shortRecordName(r.name, zone), check: checks[i] })),
  }
})
