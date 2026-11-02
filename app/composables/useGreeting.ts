/** "Good afternoon, Minh" by the owner's local time */
export function useGreeting() {
  const { t } = useI18n()
  const { user } = useUserSession()
  return computed(() => {
    const hour = new Date().getHours()
    const part = hour < 11 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
    const name = ((user.value as any)?.name || (user.value as any)?.username || '').trim()
    return name ? t(`dashboard.sites.greeting.${part}`, { name }) : t(`dashboard.sites.greeting.${part}Plain`)
  })
}
