// The app's own light/dark switches, kept in cookies so the server draws the
// right one and there's no flash: superadmin (dark unless changed) and the
// dashboard (light unless changed)
export type AdminTheme = 'dark' | 'light'

const YEAR = 60 * 60 * 24 * 365

export const useAdminTheme = () =>
  useCookie<AdminTheme>('perlink_admin_theme', { default: () => 'dark', maxAge: YEAR, sameSite: 'lax' })

export const useDashboardTheme = () =>
  useCookie<AdminTheme>('perlink_dashboard_theme', { default: () => 'light', maxAge: YEAR, sameSite: 'lax' })
