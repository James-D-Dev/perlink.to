export type DayPart = 'morning' | 'afternoon' | 'evening' | 'night'

/** The owner's time of day: sets the greeting and the scene behind it */
export function dayPart(hour = new Date().getHours()): DayPart {
  if (hour >= 5 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  return 'night'
}

/** "Good afternoon, Minh" by the owner's local time */
export function useGreeting() {
  const { t } = useI18n()
  const { user } = useUserSession()
  return computed(() => {
    const part = dayPart()
    // Late at night still reads "Good evening"
    const key = part === 'night' ? 'evening' : part
    const name = ((user.value as any)?.name || (user.value as any)?.username || '').trim()
    return name ? t(`dashboard.sites.greeting.${key}`, { name }) : t(`dashboard.sites.greeting.${key}Plain`)
  })
}
