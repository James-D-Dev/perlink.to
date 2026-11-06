import type { WeddingTopic } from './types'
import { WEDDING_BASE, WEDDING_SLUGS, type WeddingTopicId } from './paths'
import { WORDING_TOPIC } from './wording'
import { ADDRESSING_TOPIC } from './addressing'
import { MUSIC_TOPIC } from './music'
import { PAPER_TOPIC } from './paper'
import { BILINGUAL_TOPIC } from './bilingual'
import { ROOM_TOPIC } from './room'

export type { WeddingSection, WeddingText, WeddingTopic } from './types'
export { WEDDING_BASE, WEDDING_PAIRS, WEDDING_SLUGS } from './paths'

// Addresses come from paths.ts, the one list the sitemap and language switch read
const at = (topic: WeddingTopic): WeddingTopic => ({ ...topic, path: WEDDING_SLUGS[topic.id as WeddingTopicId] ?? topic.path })

export const WEDDING_TOPICS: WeddingTopic[] = [WORDING_TOPIC, ADDRESSING_TOPIC, MUSIC_TOPIC, PAPER_TOPIC, BILINGUAL_TOPIC, ROOM_TOPIC].map(at)

/** A guide page's address in a language */
export const weddingTopicPath = (topic: WeddingTopic, lang: 'en' | 'vi') => `${WEDDING_BASE[lang]}/${topic.path[lang]}`

export function findWeddingTopic(lang: 'en' | 'vi', slug: string) {
  return WEDDING_TOPICS.find(topic => topic.path[lang] === slug)
}
