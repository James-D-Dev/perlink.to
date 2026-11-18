// Perlink's own Google Analytics (GA4), on Perlink's pages only: never on
// people's sites (perlink.to/<name>, custom domains), short links or QR
// redirects, and not in Superadmin.

/** Where analytics cookies need the visitor's yes first (EEA, UK, Switzerland) */
export const CONSENT_COUNTRIES = new Set([
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT',
  'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
])

/** The visitor's choice, kept in local storage */
export const CONSENT_KEY = 'pl_analytics_consent'

/** Set by the server when an account is created, read once by the browser for the sign_up event */
export const SIGNUP_COOKIE = 'pl_signup'

/** Where a brand-new account lands: the create flow, with a hello (the dashboard would be empty) */
export const FIRST_SITE_PATH = '/dashboard/new?welcome=1'
