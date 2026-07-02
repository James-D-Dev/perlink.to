/**
 * Analytics tracking service for Perlink
 * Handles device parsing, bot detection, IP hashing, and referrer extraction
 */
import { UAParser } from 'ua-parser-js'

// Bot User-Agent patterns
const BOT_USER_AGENTS = [
  'facebookexternalhit', 'facebot', 'twitterbot',
  'linkedinbot', 'slackbot', 'telegrambot',
  'whatsapp', 'discordbot', 'googlebot',
  'bingbot', 'pinterestbot', 'tiktok',
  'bytespider', 'ahrefsbot', 'semrushbot',
  'dotbot', 'petalbot', 'yandexbot',
  'applebot', 'mj12bot', 'seznambot',
]

export function isBot(userAgent: string | null | undefined): boolean {
  if (!userAgent) return false
  const ua = userAgent.toLowerCase()
  return BOT_USER_AGENTS.some(bot => ua.includes(bot))
}

export function parseDevice(ua: string): { device: string; os: string; browser: string } {
  const result = (UAParser as any)(ua)

  // Device type
  const deviceType = result.device?.type || ''
  const device = deviceType === 'mobile' ? 'Mobile'
    : deviceType === 'tablet' ? 'Tablet'
    : 'Desktop'

  // OS
  const os = result.os?.name || 'Other'

  // Browser
  const browser = result.browser?.name || 'Other'

  return { device, os, browser }
}

export async function hashIP(ip: string, date: string): Promise<string> {
  const data = new TextEncoder().encode(ip + ':' + date)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer))
    .slice(0, 8)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Normalize referrer subdomains to main domain
const REFERRER_NORMALIZE_MAP: Record<string, string> = {
  'l.facebook.com': 'facebook.com',
  'm.facebook.com': 'facebook.com',
  'lm.facebook.com': 'facebook.com',
  'web.facebook.com': 'facebook.com',
  't.co': 'twitter.com',
  'x.com': 'twitter.com',
  'mobile.twitter.com': 'twitter.com',
  'l.instagram.com': 'instagram.com',
  'm.instagram.com': 'instagram.com',
  'l.messenger.com': 'messenger.com',
  'out.reddit.com': 'reddit.com',
  'away.vk.com': 'vk.com',
  'l.workplace.com': 'workplace.com',
  'link.medium.com': 'medium.com',
  'm.youtube.com': 'youtube.com',
  'vm.tiktok.com': 'tiktok.com',
  'vt.tiktok.com': 'tiktok.com',
}

export function parseReferrer(referer: string | null | undefined): string {
  if (!referer) return 'direct'
  try {
    const url = new URL(referer)
    const hostname = url.hostname.replace(/^www\./, '')
    return REFERRER_NORMALIZE_MAP[hostname] || hostname
  } catch {
    return 'direct'
  }
}

export function parseUTMParams(url: string): {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
} {
  try {
    const parsed = new URL(url)
    return {
      utm_source: parsed.searchParams.get('utm_source'),
      utm_medium: parsed.searchParams.get('utm_medium'),
      utm_campaign: parsed.searchParams.get('utm_campaign'),
    }
  } catch {
    return { utm_source: null, utm_medium: null, utm_campaign: null }
  }
}

export function detectSourceType(url: string, referer: string | null | undefined): string {
  try {
    const parsed = new URL(url)
    if (parsed.searchParams.get('ref') === 'qr') return 'qr'
    if (parsed.searchParams.get('ref') === 'bio') return 'bio'
  } catch {}

  if (!referer) return 'direct'
  const ref = referer.toLowerCase()
  if (ref.includes('tiktok') || ref.includes('facebook') || ref.includes('instagram') || ref.includes('twitter') || ref.includes('x.com')) {
    return 'social'
  }
  return 'direct'
}
