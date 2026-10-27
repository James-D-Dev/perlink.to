// Superadmin has its own light/dark switch (dark unless changed), kept in a
// cookie so the server draws the right one and there's no flash
export type AdminTheme = 'dark' | 'light'

export const useAdminTheme = () =>
  useCookie<AdminTheme>('perlink_admin_theme', { default: () => 'dark', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
