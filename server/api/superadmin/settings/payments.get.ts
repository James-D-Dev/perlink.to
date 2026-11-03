import { requireSuperadmin } from '../../../utils/superadmin'
import { getFlag } from '../../../utils/appSettings'
import { billingAccount } from '../../../utils/billing'
import { lemonEnabled } from '../../../utils/lemon'

// Payment switches for Superadmin → Settings
export default defineEventHandler(async (event) => {
  requireSuperadmin(event)
  return {
    bank: await getFlag(event, 'bank_payments'),
    // Whether a bank account is set up at all (the switch does nothing without one)
    bankConfigured: !!billingAccount(event),
    card: lemonEnabled(event),
  }
})
