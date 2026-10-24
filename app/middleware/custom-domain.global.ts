// On a site's own domain the home page is that site: no Perlink header/footer
export default defineNuxtRouteMiddleware((to) => {
  const domain = useState<{ hostname: string; username: string } | null>('custom-domain', () => null)
  if (domain.value && to.path === '/') setPageLayout('blank')
})
