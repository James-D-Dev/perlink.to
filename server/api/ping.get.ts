// Ultra simple ping - no imports, no env
export default defineEventHandler(() => {
  return { 
    status: 'ok', 
    time: Date.now(),
    platform: 'cloudflare'
  }
})
