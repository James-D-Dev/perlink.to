// Shared styling and formatting for superadmin list pages

export const superadminTableUi = {
  root: 'border-t border-default',
  thead: 'bg-elevated/50',
  th: 'px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted',
  td: 'px-4 py-3 text-sm text-default',
  tr: 'hover:bg-elevated/40 transition-colors',
  empty: 'py-12 text-sm text-muted',
}

export const superadminCardUi = {
  root: 'bg-elevated/40 ring-default',
  header: 'px-4 py-3 sm:px-4',
  body: 'p-0 sm:p-0',
  footer: 'px-4 py-3 sm:px-4',
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
