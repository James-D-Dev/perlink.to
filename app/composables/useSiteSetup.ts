import type { ComputedRef } from 'vue'

export type SetupStepKey = 'photo' | 'bio' | 'contact' | 'publish' | 'share'

export interface SiteSetupState {
  username: string
  steps: ComputedRef<{ key: SetupStepKey; done: boolean }[]>
  done: ComputedRef<number>
  /** Still worth showing: steps left and not hidden by the owner */
  visible: ComputedRef<boolean>
}

// The site editor registers its checklist here; the sidebar shows a progress
// card from it and opens the checklist popup. Client-only (the editor is SPA).
const current = shallowRef<SiteSetupState | null>(null)

export function useSiteSetup() {
  const open = useState('site-setup-open', () => false)
  return { current, open }
}
