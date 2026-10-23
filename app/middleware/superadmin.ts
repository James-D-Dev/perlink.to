export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn, user } = useUserSession()
  
  // Check if logged in
  if (!loggedIn.value) {
    return navigateTo('/login')
  }
  
  // Check if user is superadmin (only kimduc10a@gmail.com)
  const SUPERADMIN_EMAIL = 'kimduc10a@gmail.com'
  if (user.value?.email !== SUPERADMIN_EMAIL) {
    // Redirect to user dashboard if not superadmin
    return navigateTo('/dashboard')
  }
})
