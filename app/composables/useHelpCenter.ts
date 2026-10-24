/** Whether the floating help panel is open (shared across the app) */
export function useHelpCenter() {
  return useState('help-center-open', () => false)
}
