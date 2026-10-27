// Shared styling and formatting for superadmin list pages

// Same surfaces as the dashboard: paper cards (rounded-3xl on a hairline
// ring, from app.config), sand table heads and hovers

export const superadminTableUi = {
  root: 'border-t border-line',
  thead: 'bg-sand/50',
  th: 'px-5 py-3 text-xs font-medium uppercase tracking-wide text-ink-muted',
  td: 'px-5 py-3.5 text-sm text-ink',
  tr: 'hover:bg-sand/40 transition-colors',
  separator: 'bg-line',
  empty: 'py-12 text-sm text-ink-muted',
}

/** A card holding a table or list that runs edge to edge */
export const superadminCardUi = {
  header: 'px-5 py-4 sm:px-5',
  body: 'p-0 sm:p-0',
  footer: 'px-5 py-3.5 sm:px-5',
}

/** A card with padded content */
export const superadminPanelUi = {
  header: 'px-5 py-4 sm:px-5',
  body: 'p-5 sm:p-5',
  footer: 'px-5 py-3.5 sm:px-5',
}

export function formatAdminDate(date: string | Date | null | undefined): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function toTime(date: string | null | undefined): number {
  return date ? new Date(date).getTime() : 0
}
