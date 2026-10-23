import { SuperadminConfirmModal } from '#components'

interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  color?: 'error' | 'warning' | 'primary'
}

// Open a confirmation dialog and resolve to true when the user confirms
export function useConfirm() {
  const overlay = useOverlay()
  const modal = overlay.create(SuperadminConfirmModal)

  return async (options: ConfirmOptions): Promise<boolean> => {
    const result = await modal.open(options).result
    return result === true
  }
}
