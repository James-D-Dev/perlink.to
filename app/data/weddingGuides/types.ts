// The wedding invitation topic cluster: the pillar page (/wedding-website,
// /vi/thiep-cuoi-online) and guide pages under it, each answering one search
// (wording, addressing guests, music, online vs paper, bilingual, the 3D
// room). Each page has its own words in each language, written for its
// readers: never one page with another title.

export interface WeddingSection {
  /** H2 of the section */
  title: string
  paragraphs: string[]
  bullets?: string[]
  /** Ready-to-copy wording (invitation lines, a guest list…), shown as quotes */
  samples?: { label: string; text: string }[]
}

export interface WeddingText {
  /** <title>, under 60 characters, keyword first */
  seoTitle: string
  /** Meta description, 140-160 characters */
  description: string
  /** Short label above the H1, also the breadcrumb name and the link text from other pages */
  eyebrow: string
  /** H1 */
  title: string
  /** First paragraph: answers the search in 2-3 sentences */
  intro: string
  sections: WeddingSection[]
  /** An optional comparison table: three columns (row label + two values) */
  table?: {
    title: string
    columns: [string, string, string]
    rows: [string, string, string][]
  }
  stepsTitle: string
  steps: { title: string; text: string }[]
  faq: { q: string; a: string }[]
  ctaTitle: string
  ctaText: string
}

export interface WeddingTopic {
  id: string
  /** Address per language: /wedding-website/<en>, /vi/thiep-cuoi-online/<vi> (set from paths.ts) */
  path: { en: string; vi: string }
  /** Template ids (data/pageTemplates) shown as starting points, best first; missing ones are skipped */
  templates: string[]
  /** Last real content change, YYYY-MM-DD */
  updated: string
  /** Minutes to read */
  readMinutes: number
  en: WeddingText
  vi: WeddingText
}
