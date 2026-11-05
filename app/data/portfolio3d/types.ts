// The 3D portfolio topic cluster: one pillar page (/3d-portfolio,
// /vi/portfolio-3d) and pages under it, each answering one search
// (a profession, a comparison, examples, free). Each page has its own words
// in each language: never the same page with another title.

/** A live demo room on the page, dressed for this kind of work (utils/portfolioRooms) */
export type DemoRoom = 'designer' | 'developer' | 'photographer' | 'architect' | 'student'

export interface TopicSection {
  /** H2 of the section */
  title: string
  paragraphs: string[]
  bullets?: string[]
}

export interface TopicText {
  /** <title>, under 60 characters, keyword first */
  seoTitle: string
  /** Meta description, 140-160 characters */
  description: string
  /** Short label above the H1, also the breadcrumb name */
  eyebrow: string
  /** H1 */
  title: string
  /** First paragraph: answers the search in 2-3 sentences */
  intro: string
  /** Heading and line above the live room */
  demoTitle: string
  demoText: string
  /** The body: 4-7 sections of real, specific advice */
  sections: TopicSection[]
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

export interface PortfolioTopic {
  id: string
  /** Address per language: /3d-portfolio/<en>, /vi/portfolio-3d/<vi> */
  path: { en: string; vi: string }
  /** The live room shown on the page */
  demo: DemoRoom
  /** Template ids (data/pageTemplates) shown as starting points, best first */
  templates: string[]
  /** Last real content change, YYYY-MM-DD */
  updated: string
  /** Minutes to read, per language */
  readMinutes: number
  en: TopicText
  vi: TopicText
}

/** One portfolio on the examples page */
export interface PortfolioExample {
  id: string
  /**
   * 'perlink': made from a Perlink template, shown with its live room;
   * 'web': a well-known 3D portfolio elsewhere, linked (never copied or screenshotted)
   */
  kind: 'perlink' | 'web'
  /** perlink: the live room shown */
  demo?: DemoRoom
  /** perlink: the template to start from */
  template?: string
  /** web: the portfolio's address, checked to be live */
  url?: string
  /** web: who made it, as they sign it */
  author?: string
  en: ExampleText
  vi: ExampleText
}

export interface ExampleText {
  name: string
  /** Who it suits, or what kind of portfolio it is */
  who: string
  /** What makes it work, 2-4 specific points */
  highlights: string[]
  /** One idea a reader can take for their own portfolio */
  takeaway: string
}
