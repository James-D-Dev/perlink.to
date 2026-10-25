// Legal pages are written as data so each exists in English and Vietnamese
// and renders through one layout (LegalShell + LegalDoc).
//
// Inline text supports [label](/path), **bold** and {email}.

export type LegalLang = 'en' | 'vi'

export type LegalBlock =
  | string
  | { list: string[] }
  /** Highlighted box */
  | { note: string }
  /** Two-column table, first row is the header */
  | { table: string[][] }

export interface LegalSection {
  id: string
  title: string
  blocks: LegalBlock[]
}

export interface LegalDoc {
  title: string
  description: string
  intro: string
  /** "In short" cards at the top */
  summary: { icon: string; title: string; text: string }[]
  sections: LegalSection[]
}

export type LegalDocs = Record<LegalLang, LegalDoc>
