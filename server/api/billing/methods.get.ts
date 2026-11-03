import { paymentMethods } from '../../utils/billing'

// Which ways to pay are on, for pages anyone can see (pricing): card through
// Lemon Squeezy, and VietQR bank transfers when the superadmin has them on
export default defineEventHandler(async (event) => {
  const { card, bank } = await paymentMethods(event)
  return { card, bank }
})
