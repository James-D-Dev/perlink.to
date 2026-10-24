// After Google sign-in returns the user, continue to where they were going
export default defineNuxtPlugin(() => {
  const { loggedIn } = useUserSession()
  const router = useRouter()
  router.isReady().then(() => {
    if (!loggedIn.value) return
    const path = takePostLoginRedirect()
    if (path && path !== router.currentRoute.value.fullPath) navigateTo(path)
  })
})
