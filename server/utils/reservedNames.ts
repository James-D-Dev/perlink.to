// Names that are app routes (or may become one), so they can't be a site
// address: perlink.to/<name> would never reach the site. Keep in step with
// app/pages, server/routes and the folders in public.
export const RESERVED_NAMES = new Set([
  // Current pages and assets
  'about', 'admin', 'api', 'confirm', 'contact', 'cookie-notice', 'create', 'dashboard', 'design-system',
  'images', 'login', 'logout', 'models', 'music', 'pricing', 'privacy', 'qr', 'superadmin', 'tasks',
  'terms', 'trends', '404', '_nuxt', 'sitemap', 'robots', 'favicon', 'media', 'refund', 'report', 's',
  // Likely future pages
  'blog', 'docs', 'help', 'support', 'settings', 'templates', 'features', 'explore', 'signup', 'register',
  'account', 'billing', 'status', 'perlink', 'www', 'app',
  // Marketing pages
  'vi', 'linktree-alternative', '3d-portfolio', 'portfolio-3d', 'vs', 'compare', 'alternatives',
  'birthday-website', 'valentine-website', 'qr-menu', 'free-link-in-bio', 'wedding-website', 'personal-website', 'homestay-website',
])

export function isReservedName(name: string) {
  return RESERVED_NAMES.has(name.trim().toLowerCase())
}
