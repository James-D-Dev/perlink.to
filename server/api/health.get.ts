// Simple health check - no imports, no nuxt-auth-utils
export default defineEventHandler(() => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: typeof globalThis.process !== 'undefined' ? 'nodejs' : 'workerd'
  }
})
