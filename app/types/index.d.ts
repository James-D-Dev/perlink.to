// Extend nuxt-auth-utils User type
declare module '#auth-utils' {
  interface User {
    id: string
    email: string | null
    username?: string | null
    name?: string | null
    avatar?: string | null
    plan?: string | null
  }
    interface UserSession {
    user: User
  }

  interface SecureSessionData {
    // Add secure fields if needed
  }
}


export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}