import { generateVietQR, getAllBanks, getBankByBIN, searchBanks, type VietQRParams } from '../../utils/vietqr'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    bankBIN: string
    accountNumber: string
    amount?: number
    note?: string
    oneTime?: boolean
    serviceType?: 'QRIBFTTC' | 'QRIBFTTA'
    currency?: string
  }>(event)

  // Validate required fields
  if (!body.bankBIN || !body.accountNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields: bankBIN and accountNumber'
    })
  }

  // Validate bank BIN
  const bank = getBankByBIN(body.bankBIN)
  if (!bank) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid bank BIN'
    })
  }

  try {
    const params: VietQRParams = {
      bankBIN: body.bankBIN,
      accountNumber: body.accountNumber,
      amount: body.amount,
      note: body.note,
      oneTime: body.oneTime ?? true,
      serviceType: body.serviceType || 'QRIBFTTA',
      currency: body.currency || 'VND'
    }

    const qrString = generateVietQR(params)

    return {
      success: true,
      qrString,
      bank: {
        name: bank.Name,
        shortName: bank.ShortName,
        bin: bank.BIN,
        code: bank.Code
      },
      accountNumber: body.accountNumber,
      amount: body.amount || 0
    }
  } catch (error: any) {
    console.error('[POST /api/vietqr/generate]', error)
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Failed to generate VietQR'
    })
  }
})
