import { nanoid } from 'nanoid'
import type { BioBlock, BlockName } from '~/types/bio'

/** Block types a page may hold more than once; the rest are one per page */
export const REPEATABLE_BLOCKS: BlockName[] = ['links', 'text', 'image-album', 'menu']

export function isRepeatableBlock(name: string) {
  return (REPEATABLE_BLOCKS as string[]).includes(name)
}

/** Give every block an id (pages saved before blocks had ids) */
export function withBlockIds(blocks: BioBlock[]): BioBlock[] {
  return blocks.map(block => (block.id ? block : { ...block, id: nanoid(8) }))
}

/** Starting data for a freshly added block */
export function emptyBlockData(name: BlockName): BioBlock['data'] {
  switch (name) {
    case 'links': return { items: [] }
    case 'social': return { links: [] }
    case 'image-album': return { images: [], layout: 'grid' }
    case 'text': return { content: '', align: 'left', style: 'plain' }
    default: return {} as BioBlock['data']
  }
}
