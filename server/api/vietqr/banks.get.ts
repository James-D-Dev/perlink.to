import { getAllBanks, searchBanks } from '../../utils/vietqr'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  try {
    let banks

    if (query.search && typeof query.search === 'string') {
      banks = searchBanks(query.search)
    } else {
      banks = getAllBanks()
    }

    return {
      success: true,
      banks: banks.map(bank => ({
        bin: bank.BIN,
        name: bank.Name,
        shortName: bank.ShortName,
        code: bank.Code,
        swiftCode: bank.SWIFTCode
      }))
    }
  } catch (error: any) {
    console.error('[GET /api/vietqr/banks]', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to fetch banks'
    })
  }
})
