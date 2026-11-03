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

  const confirm = useConfirm()
  const { refresh } = useBilling()

  async function payByCard(plan: PaidPlanId, period: BillingPeriod, confirmed = false): Promise<void> {
    opening.value = true
    try {
      const res = await $fetch<{ url?: string; portalUrl?: string; needsSwitch?: boolean; from?: { plan: string; period: string }; switched?: boolean }>('/api/billing/lemon-checkout', {
        method: 'POST',
        body: { plan, period, ...(confirmed ? { switch: true } : {}) },
      })
      // Already subscribed: change that subscription (after they say so) instead of a second one
      if (res.needsSwitch) {
        opening.value = false
        const name = (id: string) => t(`dashboard.billing.plans.${id}.name`)
        const when = (p: string) => t(p === 'annual' ? 'dashboard.billing.checkout.periodAnnual' : 'dashboard.billing.checkout.periodMonthly')
        const ok = await confirm({
          title: t('dashboard.billing.switch.title', { plan: name(plan) }),
          description: t('dashboard.billing.switch.text', { from: `${name(res.from!.plan)} · ${when(res.from!.period)}`, to: `${name(plan)} · ${when(period)}` }),
          confirmLabel: t('dashboard.billing.switch.confirm'),
        })
        if (ok) return payByCard(plan, period, true)
        return
      }
      if (res.switched) {
        toast.add({ title: t('dashboard.billing.switch.done', { plan: t(`dashboard.billing.plans.${plan}.name`) }), color: 'success' })
        opening.value = false
        // The plan follows Lemon Squeezy's webhook, a few seconds later
        setTimeout(() => refresh(), 4000)
        return
      }
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
