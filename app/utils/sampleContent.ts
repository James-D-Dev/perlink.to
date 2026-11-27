import type { BioBlock } from '~/types/bio'
import { PAGE_TEMPLATES } from '~/data/pageTemplates'
import { localizeTemplateContent } from '~/data/templateCopyVi'

// Is a block still the template's sample, untouched? Sites start from a
// template full of made-up words, photos and example.com links; most owners
// published them as they were (Nov 2026: 7 of 10 live sites were 90%+ sample).
// The editor marks such blocks and publishing offers to hide them.
//
// A block is sample when every word, number, photo and link in it is one a
// template has (in English or Vietnamese, the languages templates come in),
// or an example.com link or a template photo. One change of the owner's own
// and it's theirs.

// Not content: ids, order, layout choices
const SKIP = new Set(['id', 'index', 'order', 'layout', 'kind', 'provider', 'icon', 'align', 'style', 'payment', 'size', 'variant', 'shape', 'type', 'theme', 'mode', 'animation', 'currency'])
// Dates are made fresh each time a template is built ("in 30 days")
const DATE = /^\d{4}-\d{2}-\d{2}/

let known: Set<string> | null = null
function templateWords() {
  if (known) return known
  known = new Set()
  for (const template of PAGE_TEMPLATES) {
    const content = template.build()
    for (const lang of ['en', 'vi']) {
      for (const block of localizeTemplateContent(content, lang).blocks) {
        for (const value of leaves(block.data)) known.add(value)
      }
    }
  }
  return known
}

function* leaves(value: unknown, key?: string): Generator<string> {
  if (key && SKIP.has(key)) return
  if (typeof value === 'string') {
    const text = value.trim()
    if (text && !DATE.test(text)) yield text
  } else if (typeof value === 'number') {
    yield String(value)
  } else if (Array.isArray(value)) {
    for (const item of value) yield* leaves(item, key)
  } else if (value && typeof value === 'object') {
    for (const [inner, item] of Object.entries(value)) yield* leaves(item, inner)
  }
}

const isSampleValue = (value: string, words: Set<string>) =>
  value.includes('example.com') || value.includes('/images/templates/') || words.has(value)

export function isSampleBlock(block: Pick<BioBlock, 'data'>): boolean {
  const words = templateWords()
  let any = false
  for (const value of leaves(block.data)) {
    if (!isSampleValue(value, words)) return false
    any = true
  }
  return any
}

/** The blocks visitors would see that are still sample */
export function sampleBlocks<T extends Pick<BioBlock, 'data' | 'hidden'>>(blocks: T[]): T[] {
  return blocks.filter(block => !block.hidden && isSampleBlock(block))
}
