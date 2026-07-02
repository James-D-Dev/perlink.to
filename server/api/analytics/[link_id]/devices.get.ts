import { AnalyticsRepository } from '../../../repositories/analyticsRepository'

export default defineEventHandler(async (event) => {
  const linkId = getRouterParam(event, 'link_id')
  const query = getQuery(event)
  const period = (query.period as string) || '7d'

  if (!linkId) {
    return { success: false, message: 'Link ID is required' }
  }

  try {
    const analyticsRepo = new AnalyticsRepository(event)
    const data = await analyticsRepo.getDevices(linkId, period)

    return { success: true, data }
  } catch (error: any) {
    return { success: false, message: error.message || 'Failed to fetch device analytics' }
  }
})
