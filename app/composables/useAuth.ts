export const useAuth = () => {
  // Use nuxt-auth-utils composables - these are auto-imported
  const { loggedIn, user, session, fetch: fetchSession, clear } = useUserSession()
  const loading = useState<boolean>('auth-loading', () => false)

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const response = await $fetch<{ success: boolean; user: User }>('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (response.success) {
        // Refresh session after login
        await fetchSession()
        return response
      }

      throw new Error('Login failed')
    } finally {
      loading.value = false
    }
  }

  const register = async (email: string, password: string, username?: string) => {
    loading.value = true
    try {
      const response = await $fetch<{ success: boolean; user: User }>('/api/auth/register', {
        method: 'POST',
        body: { email, password, username }
      })

      if (response.success) {
        // Refresh session after registration
        await fetchSession()
        return response
      }

      throw new Error('Registration failed')
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      await clear()
      
      // Redirect to login page
      await navigateTo('/login')
    } finally {
      loading.value = false
    }
  }

  return {
    // From useUserSession
    user,
    loggedIn,
    session,
    // Custom methods
    loading,
    fetch: fetchSession,
    login,
    register,
    logout,
    clear
  }
}
