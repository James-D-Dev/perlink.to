// Google sign-in leaves the site, so where the user was heading (e.g.
// /create?input=theirname) is kept in sessionStorage and picked up on return.

const KEY = 'perlink:post-login-redirect'

export function rememberPostLoginRedirect(path: string) {
  try {
    sessionStorage.setItem(KEY, path)
  } catch {
    // Storage blocked: the user lands on the dashboard instead
  }
}

export function takePostLoginRedirect(): string | null {
  try {
    const path = sessionStorage.getItem(KEY)
    sessionStorage.removeItem(KEY)
    return path && path.startsWith('/') && !path.startsWith('//') ? path : null
  } catch {
    return null
  }
}
