import type { PortfolioTopic } from './types'
import { PORTFOLIO_BASE, PORTFOLIO_SLUGS, type PortfolioTopicId } from './paths'
import { DESIGNER_TOPIC } from './designer'
import { DEVELOPER_TOPIC } from './developer'
import { PHOTOGRAPHER_TOPIC } from './photographer'
import { ARCHITECT_TOPIC } from './architect'
import { STUDENT_TOPIC } from './student'
import { COMPARE_TOPIC } from './compare'
import { EFFECTS_TOPIC } from './effects'
import { EXAMPLES_TOPIC, PORTFOLIO_EXAMPLES } from './examples'
import { FREE_TOPIC } from './free'

export type { DemoRoom, PortfolioExample, PortfolioTopic, TopicText } from './types'
export { PORTFOLIO_EXAMPLES }

export { PORTFOLIO_BASE, PORTFOLIO_PAIRS, PORTFOLIO_SLUGS } from './paths'

// Addresses come from paths.ts, the one list the sitemap and language switch read
const at = (topic: PortfolioTopic): PortfolioTopic => ({ ...topic, path: PORTFOLIO_SLUGS[topic.id as PortfolioTopicId] ?? topic.path })

/** Pages by kind of work, then the other questions */
export const PROFESSION_TOPICS: PortfolioTopic[] = [DESIGNER_TOPIC, DEVELOPER_TOPIC, PHOTOGRAPHER_TOPIC, ARCHITECT_TOPIC, STUDENT_TOPIC].map(at)
export const QUESTION_TOPICS: PortfolioTopic[] = [EXAMPLES_TOPIC, COMPARE_TOPIC, EFFECTS_TOPIC, FREE_TOPIC].map(at)
export const PORTFOLIO_TOPICS: PortfolioTopic[] = [...PROFESSION_TOPICS, ...QUESTION_TOPICS]

/** A topic page's address in a language */
export const topicPath = (topic: PortfolioTopic, lang: 'en' | 'vi') => `${PORTFOLIO_BASE[lang]}/${topic.path[lang]}`

export function findTopic(lang: 'en' | 'vi', slug: string) {
  return PORTFOLIO_TOPICS.find(topic => topic.path[lang] === slug)
}
