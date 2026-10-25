import type { ComputedRef } from 'vue'
import type { SetupStepKey } from '~/utils/siteSetup'

export type { SetupStepKey }

export interface SiteSetupState {
  username: string
  steps: ComputedRef<{ key: SetupStepKey; done: boolean }[]>
  done: ComputedRef<number>
  /** Still worth showing: steps left and not hidden by the owner */
  visible: ComputedRef<boolean>
  /** Away from the editor, the card's button goes there instead of opening the popup */
  openChecklist?: () => void
}

// The site editor (or the sites list) registers a checklist here; the sidebar
// shows a progress card from it. Client-only (the dashboard is SPA).
const current = shallowRef<SiteSetupState | null>(null)

export function useSiteSetup() {
  const open = useState('site-setup-open', () => false)
  return { current, open }
}
