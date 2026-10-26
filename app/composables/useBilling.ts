import type { PlanFeature, PlanId, PlanLimits } from '#shared/plans'

export interface BillingInfo {
  plan: PlanId
  expiresAt: string | null
  limits: PlanLimits
  sites: number
  canTrial: boolean
  checkoutEnabled: boolean
  /** Ways to pay that are set up */
  paymentMethods?: { bank: boolean; crypto: boolean }
  payments: { id: string; plan: string; period: string; amount: number; code: string; status: string; createdAt: string; paidAt: string | null }[]
}

export interface UpgradeReason {
  feature: PlanFeature
  /** Cheapest plan that has it */
  plan: PlanId
}

/** The signed-in user's plan, shared across the dashboard */
export function useBilling() {
  const info = useState<BillingInfo | null>('billing-info', () => null)
  const loading = useState('billing-loading', () => false)

  async function refresh() {
    loading.value = true
    try {
      info.value = await $fetch<BillingInfo>('/api/billing')
    } catch {
      // Signed out or offline: plan-dependent UI stays hidden
    } finally {
      loading.value = false
    }
    return info.value
  }

  async function ensure() {
    return info.value ?? refresh()
  }

  return { info, loading, refresh, ensure }
}

/**
 * The upgrade prompt (BillingUpgradeDialog in the dashboard layout). Calls
 * that the plan doesn't cover come back as 402 PLAN_REQUIRED; pass the error
 * to `fromError` and it opens the prompt and returns true.
 */
export function useUpgradePrompt() {
  const reason = useState<UpgradeReason | null>('upgrade-reason', () => null)

  function open(feature: PlanFeature, plan: PlanId = 'plus') {
    reason.value = { feature, plan }
  }

  function fromError(error: any) {
    const data = error?.data?.data ?? error?.data
    if (error?.statusCode !== 402 && error?.status !== 402) return false
    if (data?.code !== 'PLAN_REQUIRED') return false
    reason.value = { feature: data.feature, plan: data.plan }
    return true
  }

  return { reason, open, fromError, close: () => { reason.value = null } }
}
