// Pass the site's own domain (resolved by server/middleware/01-custom-domain)
// to the app, so the home page renders that site on server and client alike
export default defineNuxtPlugin(() => {
  const event = useRequestEvent()
  useState<{ hostname: string; username: string } | null>('custom-domain', () => event?.context.customDomain ?? null)
})
