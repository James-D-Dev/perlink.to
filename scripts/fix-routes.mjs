/**
 * Post-build script: Fix _routes.json for Cloudflare Pages
 * Removes "/" from exclude list so the Worker handles root requests
 * (needed for s.perlink.to → perlink.to redirect)
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const routesPath = resolve('dist/_routes.json')

try {
  const routes = JSON.parse(readFileSync(routesPath, 'utf-8'))

  // Remove "/" from exclude to ensure Worker handles root path
  routes.exclude = (routes.exclude || []).filter(r => r !== '/')

  writeFileSync(routesPath, JSON.stringify(routes, null, 2))
  console.log('[fix-routes] Removed "/" from _routes.json exclude list')
} catch (e) {
  console.warn('[fix-routes] Could not fix _routes.json:', e.message)
}
