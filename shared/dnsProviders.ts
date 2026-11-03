// Where site owners manage their DNS, so the custom domain card can send them
// straight to the right settings page. Detected from the domain's nameservers;
// owners can also pick one by hand.

export type DnsProviderId =
  | 'cloudflare' | 'squarespace' | 'google-cloud' | 'godaddy' | 'namecheap' | 'porkbun'
  | 'hostinger' | 'vercel' | 'route53' | 'digitalocean'
  | 'pavietnam' | 'matbao' | 'inet' | 'nhanhoa' | 'tenten'
  | 'other'

export interface DnsProvider {
  id: DnsProviderId
  name: string
  /** Nameserver hostnames that belong to this provider */
  ns?: RegExp
  /** The provider's DNS settings for `zone` (e.g. kimduc.dev), as close as it links */
  url?: (zone: string) => string
  /** A provider-specific tip, as an i18n key under dashboard.domain.tips */
  tip?: string
}

export const DNS_PROVIDERS: DnsProvider[] = [
  { id: 'cloudflare', name: 'Cloudflare', ns: /\.ns\.cloudflare\.com$/, url: zone => `https://dash.cloudflare.com/?to=/:account/${zone}/dns/records`, tip: 'cloudflare' },
  // Google Domains moved to Squarespace and kept the googledomains.com nameservers,
  // which Google Cloud DNS also uses
  { id: 'squarespace', name: 'Squarespace', ns: /\.googledomains\.com$/, url: zone => `https://account.squarespace.com/domains/managed/${zone}/dns/dns-settings`, tip: 'short' },
  { id: 'google-cloud', name: 'Google Cloud DNS', ns: /\.googledomains\.com$/, url: () => 'https://console.cloud.google.com/net-services/dns/zones', tip: 'short' },
  { id: 'godaddy', name: 'GoDaddy', ns: /\.domaincontrol\.com$/, url: zone => `https://dcc.godaddy.com/control/dnsmanagement?domainName=${zone}`, tip: 'short' },
  { id: 'namecheap', name: 'Namecheap', ns: /\.registrar-servers\.com$/, url: zone => `https://ap.www.namecheap.com/Domains/DomainControlPanel/${zone}/advancedns`, tip: 'short' },
  { id: 'porkbun', name: 'Porkbun', ns: /\.porkbun\.com$/, url: () => 'https://porkbun.com/account/domainsSpeedy', tip: 'short' },
  { id: 'hostinger', name: 'Hostinger', ns: /\.dns-parking\.com$/, url: () => 'https://hpanel.hostinger.com/domains', tip: 'short' },
  { id: 'vercel', name: 'Vercel', ns: /\.vercel-dns\.com$/, url: () => 'https://vercel.com/dashboard/domains', tip: 'short' },
  { id: 'route53', name: 'Amazon Route 53', ns: /\.awsdns-\d+\./, url: () => 'https://console.aws.amazon.com/route53/v2/hostedzones' },
  { id: 'digitalocean', name: 'DigitalOcean', ns: /\.digitalocean\.com$/, url: zone => `https://cloud.digitalocean.com/networking/domains/${zone}`, tip: 'short' },
  { id: 'pavietnam', name: 'P.A Việt Nam', ns: /\.pavietnam\.vn$/, url: () => 'https://www.pavietnam.vn/vn/quan-ly-ten-mien.html', tip: 'short' },
  { id: 'matbao', name: 'Mắt Bão', ns: /\.matbao\.(com|vn|net)$/, url: () => 'https://id.matbao.net', tip: 'short' },
  { id: 'inet', name: 'iNET', ns: /\.inet\.vn$/, url: () => 'https://id.inet.vn', tip: 'short' },
  { id: 'nhanhoa', name: 'Nhân Hòa', ns: /\.nhanhoa\.(com|vn)$/, url: () => 'https://id.nhanhoa.com', tip: 'short' },
  { id: 'tenten', name: 'Tenten', ns: /\.tenten\.vn$/, url: () => 'https://domain.tenten.vn', tip: 'short' },
  { id: 'other', name: 'Other', tip: 'short' },
]

/** Providers whose nameservers match, most likely first (Squarespace and Google Cloud share theirs) */
export function providersForNameservers(nameservers: string[]): DnsProviderId[] {
  const ns = nameservers.map(n => n.toLowerCase().replace(/\.$/, ''))
  return DNS_PROVIDERS.filter(p => p.ns && ns.some(n => p.ns!.test(n))).map(p => p.id)
}

export const dnsProvider = (id: DnsProviderId | string | null | undefined) =>
  DNS_PROVIDERS.find(p => p.id === id) ?? DNS_PROVIDERS[DNS_PROVIDERS.length - 1]!

/** A record's name as DNS panels want it: without the zone ("perlink", or "@" for the zone itself) */
export function shortRecordName(name: string, zone: string | null) {
  if (!zone) return name
  if (name === zone) return '@'
  return name.endsWith(`.${zone}`) ? name.slice(0, -(zone.length + 1)) : name
}
