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
      'A 3D world for your page',
      '30-day analytics',
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
      'All lands and room styles',
      '90-day analytics',
    ],
  },
  plus: {
    id: 'plus',
    name: 'Plus',
    price: 9,
    priceAnnual: 108,
    description: 'For small businesses',
    features: [
      '10 pages',
      'Premium themes',
      'Custom domain',
      'Remove branding',
      'Photo frames and music in 3D',
      'Full analytics history',
    ],
    popular: true,
  },
  max: {
    id: 'max',
    name: 'Max',
    price: 100,
    priceAnnual: 1000,
    description: 'For agencies and growing businesses',
    features: [
      'Everything in Plus',
      '50 live sites and 20 custom domains',
      'Every 3D room pack included',
      'Priority online support',
    ],
  },
} as const

export const PLAN_OPTIONS: SelectItem[] = [
  { label: PLANS.free.name, value: PLANS.free.id },
  { label: PLANS.starter.name, value: PLANS.starter.id },
  { label: PLANS.plus.name, value: PLANS.plus.id },
  { label: PLANS.max.name, value: PLANS.max.id },
]

export const PLAN_OPTIONS_WITH_ALL: SelectItem[] = [
  { label: 'All', value: null as unknown as string },
  ...PLAN_OPTIONS,
]

export type PlanId = 'free' | 'starter' | 'plus' | 'max'

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
        max: 'warning',
      }
      return colors[(planId || 'free') as PlanId] || 'neutral'
    },
  }
}
