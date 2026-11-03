import { getDB } from '../../../utils/db'

// The affiliate code of a site's owner, for visitors who came from its
// "Made with Perlink" badge (a public referral code, nothing more)
export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  if (!username) return { code: null }
  try {
    const row = await getDB(event)
      .prepare('SELECT p.affiliate_code AS code FROM bio_pages b JOIN profiles p ON p.id = b.user_id WHERE b.username = ? AND b.is_published = 1')
      .bind(username)
      .first<{ code: string | null }>()
    setResponseHeader(event, 'Cache-Control', 'public, max-age=300')
    return { code: row?.code ?? null }
  } catch {
    // Before migration 0038
    return { code: null }
  }
})
