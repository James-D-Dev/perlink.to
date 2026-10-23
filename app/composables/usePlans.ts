import type { SelectItem } from '@nuxt/ui'

export interface Plan {
  id: string
  name: string
  price: number
  priceAnnual: number
  description: string
  features: string[]
  popular?: boolean
}

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceAnnual: 0,
    description: 'With ads',
    features: [
      '1 page',
      'Portfolio templates',
      '1 custom theme',
      'QR code sharing',
      '30-day analytics',
      '10 short links',
    ],
  },
  starter: {
    id: 'starter',
    name: 'Starter',
    price: 5,
    priceAnnual: 60,
    description: 'For individuals',
    features: [
      '2 pages',
      '5 custom themes',
      'Custom QR codes',
      '90-day analytics',
      '100 short links',
    ],
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    price: 9,
    priceAnnual: 108,
    description: 'Recommended',
    features: [
      '10 pages',
      'Premium themes',
      'Custom domain',
      'Remove branding',
      'Customizable QR codes',
      'Full analytics history',
      '500 short links',
    ],
    popular: true,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 29,
    priceAnnual: 348,
    description: 'For professionals',
    features: [
      'Unlimited pages',
      'Custom CSS themes',
      'Team (5 members)',
      'Advanced analytics',
      'Advanced QR & API access',
      'Priority support',
      'Unlimited short links',
    ],
  },
} as const

export const PLAN_OPTIONS: SelectItem[] = [
  { label: PLANS.free.name, value: PLANS.free.id },
  { label: PLANS.starter.name, value: PLANS.starter.id },
  { label: PLANS.plus.name, value: PLANS.plus.id },
  { label: PLANS.pro.name, value: PLANS.pro.id },
]

export const PLAN_OPTIONS_WITH_ALL: SelectItem[] = [
  { label: 'All', value: null as unknown as string },
  ...PLAN_OPTIONS,
]

export type PlanId = 'free' | 'starter' | 'plus' | 'pro'

export function usePlans() {
  return {
    plans: PLANS,
    planOptions: PLAN_OPTIONS,
    planOptionsWithAll: PLAN_OPTIONS_WITH_ALL,
    getPlan: (id: string) => PLANS[id as PlanId] || PLANS.free,
    getPlanColor: (planId: string | null): 'neutral' | 'primary' | 'secondary' | 'warning' => {
      const colors: Record<PlanId, 'neutral' | 'primary' | 'secondary' | 'warning'> = {
        free: 'neutral',
        starter: 'primary',
        plus: 'secondary',
        pro: 'warning',
      }
      return colors[(planId || 'free') as PlanId] || 'neutral'
    },
  }
}
