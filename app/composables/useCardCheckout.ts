import type { BillingPeriod, PaidPlanId } from '#shared/plans'

/**
 * Card / PayPal checkout through Lemon Squeezy: opens its checkout page, which
 * brings the buyer back to the plans page. Someone already subscribed is sent
 * to their subscription page to change plan instead.
 */
export function useCardCheckout() {
  const { t } = useI18n()
  const toast = useToast()
  const opening = ref(false)

  async function payByCard(plan: PaidPlanId, period: BillingPeriod) {
    opening.value = true
    try {
      const res = await $fetch<{ url?: string; portalUrl?: string }>('/api/billing/lemon-checkout', {
        method: 'POST',
        body: { plan, period },
      })
      if (res.portalUrl) {
        toast.add({ title: t('dashboard.billing.checkout.cardPortal') })
        window.open(res.portalUrl, '_blank', 'noopener')
        opening.value = false
      } else if (res.url) {
        // Stays "opening" while the browser leaves for the checkout
        window.location.href = res.url
      } else {
        opening.value = false
      }
    } catch (error: any) {
      toast.add({ title: t('dashboard.billing.checkout.failed'), description: error?.data?.statusMessage, color: 'error' })
      opening.value = false
    }
  }

  return { opening, payByCard }
}
