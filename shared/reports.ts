// Why a visitor can report a site (the report form and the server share it)
export const REPORT_REASONS = [
  'scam',
  'phishing',
  'adult',
  'violence',
  'illegal',
  'copyright',
  'impersonation',
  'spam',
  'other',
] as const

export type ReportReason = (typeof REPORT_REASONS)[number]
