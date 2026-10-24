// Names that are app routes (or may become one), so they can't be a site
// address: perlink.to/<name> would never reach the site.
export const RESERVED_NAMES = new Set([
  // Current pages and assets
  'about', 'admin', 'api', 'confirm', 'contact', 'cookie-notice', 'create', 'dashboard', 'design-system',
  'images', 'login', 'logout', 'models', 'music', 'pricing', 'privacy', 'qr', 'superadmin', 'tasks',
  'terms', 'trends', '404', '_nuxt', 'sitemap', 'robots', 'favicon',
  // Likely future pages
  'blog', 'docs', 'help', 'support', 'settings', 'templates', 'features', 'explore', 'signup', 'register',
  'account', 'billing', 'status', 'perlink', 'www', 'app',
])

export function isReservedName(name: string) {
  return RESERVED_NAMES.has(name.trim().toLowerCase())
}
