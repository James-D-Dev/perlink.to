// Extend nuxt-auth-utils User type
declare module '#auth-utils' {
  interface User {
    id: string
    email: string
    username?: string | null
    name?: string | null
    avatar?: string | null
  }
    interface UserSession {
    user: User
  }

  interface SecureSessionData {
    // Add secure fields if needed
  }
}

export {}
