// security.txt (RFC 9116): where to report abuse (a site used for phishing or
// spam) or a security problem. Scanners and researchers look for it here.
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=86400',
  })
  return [
    'Contact: mailto:support@perlink.to',
    'Contact: https://perlink.to/report',
    'Expires: 2027-11-01T00:00:00.000Z',
    'Preferred-Languages: en, vi',
    'Canonical: https://perlink.to/.well-known/security.txt',
    'Policy: https://perlink.to/terms',
    '',
  ].join('\n')
})
